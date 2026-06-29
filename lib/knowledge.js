// Knowledge-base text extraction + chunking — dependency-free (the project uses
// no npm packages). Supports plain text and .docx. .docx is a ZIP; we read its
// central directory, inflate word/document.xml with the built-in zlib, and strip
// the XML to text. PDF is intentionally deferred (needs a heavier parser).
const zlib = require("zlib");

function decodeEntities(s) {
  return String(s)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => { try { return String.fromCodePoint(parseInt(h, 16)); } catch (e) { return ""; } })
    .replace(/&#(\d+);/g, (_, d) => { try { return String.fromCodePoint(parseInt(d, 10)); } catch (e) { return ""; } })
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}

// WordprocessingML → text: paragraphs/line-breaks become newlines, tabs survive,
// every other tag is dropped, then entities are decoded and whitespace tidied.
function xmlToText(xml) {
  return decodeEntities(
    xml.replace(/<w:tab\b[^>]*\/>/g, "\t")
       .replace(/<w:br\b[^>]*\/>/g, "\n")
       .replace(/<\/w:p>/g, "\n")
       .replace(/<\/w:tr>/g, "\n")
       .replace(/<[^>]+>/g, "")
  ).replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

// Minimal ZIP reader: locate word/document.xml via the central directory and
// inflate it. Handles stored (0) and deflate (8) entries.
function extractDocx(buf) {
  let eocd = -1;
  const min = Math.max(0, buf.length - 22 - 65536);
  for (let i = buf.length - 22; i >= min; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("ملف docx غير صالح (لا يوجد EOCD)");
  const cdOffset = buf.readUInt32LE(eocd + 16);
  const cdCount = buf.readUInt16LE(eocd + 10);
  let p = cdOffset, target = null;
  for (let n = 0; n < cdCount && p + 46 <= buf.length; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const fnLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOff = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + fnLen);
    if (name === "word/document.xml") { target = { method, compSize, localOff }; break; }
    p = p + 46 + fnLen + extraLen + commentLen;
  }
  if (!target) throw new Error("word/document.xml غير موجود في الملف");
  const lo = target.localOff;
  if (buf.readUInt32LE(lo) !== 0x04034b50) throw new Error("ترويسة محلية تالفة");
  const lfnLen = buf.readUInt16LE(lo + 26);
  const lextraLen = buf.readUInt16LE(lo + 28);
  const dataStart = lo + 30 + lfnLen + lextraLen;
  const data = buf.slice(dataStart, dataStart + target.compSize);
  const xml = target.method === 0 ? data.toString("utf8") : zlib.inflateRawSync(data).toString("utf8");
  return xmlToText(xml);
}

// Pick an extractor by filename/mime. Returns plain text.
function extractText(buf, fileName, mime) {
  const name = String(fileName || "").toLowerCase();
  const m = String(mime || "").toLowerCase();
  if (name.endsWith(".docx") || m.includes("officedocument.wordprocessingml")) return extractDocx(buf);
  if (name.endsWith(".txt") || name.endsWith(".md") || m.startsWith("text/") || !name) return buf.toString("utf8");
  if (name.endsWith(".doc")) throw new Error("صيغة .doc القديمة غير مدعومة — احفظ الملف كـ docx أو txt");
  if (name.endsWith(".pdf")) throw new Error("PDF غير مدعوم بعد — الصق النص أو استخدم txt/docx");
  return buf.toString("utf8");
}

// Split into coherent ~size-word chunks with a small overlap to preserve meaning
// across boundaries (spec: 300–800 words + overlap).
function chunkText(text, { size = 500, overlap = 60, maxChunks = 200 } = {}) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const chunks = [];
  const step = Math.max(1, size - overlap);
  for (let i = 0; i < words.length && chunks.length < maxChunks; i += step) {
    chunks.push(words.slice(i, i + size).join(" "));
    if (i + size >= words.length) break;
  }
  return chunks;
}

module.exports = { extractText, extractDocx, chunkText, xmlToText };
