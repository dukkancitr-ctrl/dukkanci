-- Per-product advance-order requirement for "home kitchen" (مطابخ منزلية)
-- stores — merchant sets how many hours before delivery/pickup an order for
-- this product must be placed (0 = no requirement, or 24 / 48). Enforced at
-- checkout by disabling day/time slots that are too soon.
alter table products add column if not exists advance_hours integer default 0;
