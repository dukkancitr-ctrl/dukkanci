-- AI section Phase 2: RAG knowledge base (spec: "قسم تدريب الإدارة الذكية").
-- pgvector + documents/chunks + a similarity-search RPC. Same security posture as
-- the rest of the AI tables: RLS enabled, no public policy → service-role only
-- (api/ai.js + lib/ai-gateway via the service key). The anon client never reads it.

create extension if not exists vector;

-- Uploaded/added knowledge files (or direct-text entries).
create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  file_name text,
  storage_path text,                    -- original in Supabase Storage (when a file)
  source_type text not null default 'file',  -- file | text
  scope text not null default 'platform',     -- platform | store
  store_id bigint,                      -- set when scope = store
  status text not null default 'processing',  -- processing | ready | failed
  error text,
  chunk_count integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists knowledge_documents_scope_idx on public.knowledge_documents (scope, store_id);

-- Chunked text + embeddings. Dimension 1536 = OpenAI text-embedding-3-small.
create table if not exists public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.knowledge_documents(id) on delete cascade,
  content text not null,
  embedding vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists knowledge_chunks_doc_idx on public.knowledge_chunks (document_id);
create index if not exists knowledge_chunks_embedding_idx on public.knowledge_chunks
  using hnsw (embedding vector_cosine_ops);

alter table public.knowledge_documents enable row level security;
alter table public.knowledge_chunks    enable row level security;

-- Similarity search. query_embedding is passed as text (a "[..]" vector literal)
-- and cast inside, which is the reliable way to send a vector through PostgREST
-- RPC. Returns the most relevant READY chunks, respecting scope: always platform
-- knowledge, plus the given store's knowledge when p_store_id is provided.
create or replace function public.match_knowledge(
  query_embedding text,
  match_count int default 5,
  p_store_id bigint default null
)
returns table (id uuid, document_id uuid, content text, similarity float)
language sql stable as $$
  select kc.id, kc.document_id, kc.content,
         1 - (kc.embedding <=> query_embedding::vector) as similarity
  from public.knowledge_chunks kc
  join public.knowledge_documents kd on kd.id = kc.document_id
  where kd.status = 'ready'
    and kc.embedding is not null
    and (kd.scope = 'platform' or (p_store_id is not null and kd.store_id = p_store_id))
  order by kc.embedding <=> query_embedding::vector
  limit match_count;
$$;

-- Private bucket for original uploaded files.
insert into storage.buckets (id, name, public)
values ('knowledge', 'knowledge', false)
on conflict (id) do nothing;
