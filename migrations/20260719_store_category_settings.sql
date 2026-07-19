-- 2026-07-19 — تحكّم إداري/تاجر يدوي في محرك تنظيم تصنيفات صفحة المتجر
-- (المرحلة 2 من "تعليمة تنظيم تصنيفات المتاجر" — راجع buildStoreCategoryPlan في app.js
-- للمرحلة 1: منطق العرض التلقائي). إضافة آمنة فقط: عمود جديد بلا حذف أو تعديل على بيانات قائمة.
--
-- الشكل: { "admin": { "<raw category>": {...} }, "merchant": { "<raw category>": {...} } }
-- كل قيمة override: { mergeInto, disableAutoMerge, forceVisible, hidden, sortOrder }.
-- الأولوية عند القراءة (app.js): admin[raw] يفوز كاملاً على merchant[raw] إن وُجد كلاهما،
-- وإلا القيمة الافتراضية التلقائية. الكتابة عبر api/notify-order.js action=save-store-categories
-- (read-modify-write على مستوى الدور، وليس save-store العام — لتفادي تصادم كتابة إداري/تاجر).

alter table public.stores
  add column if not exists category_settings jsonb default '{}'::jsonb;

comment on column public.stores.category_settings is 'تجاوزات يدوية لترتيب/دمج تصنيفات المتجر (إدارة+تاجر) — راجع buildStoreCategoryPlan في app.js وaction=save-store-categories في api/notify-order.js';
