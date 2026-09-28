-- Migration number: 0001 	 2026-09-28T14:58:46.662Z

CREATE TABLE orders (
  id             TEXT PRIMARY KEY,
  status         TEXT NOT NULL,          -- pending|paid|rejected
  subtotal       INTEGER NOT NULL,       -- CLP entero
  shipping_cost  INTEGER NOT NULL,
  total          INTEGER NOT NULL,
  items_json     TEXT NOT NULL,
  customer_json  TEXT NOT NULL,
  shipping_json  TEXT NOT NULL,
  provider_ref   TEXT,                   -- Flow flowOrder
  provider_token TEXT,                   -- Flow token (lookup key on confirm)
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL,
  paid_at        TEXT,
  emails_sent_at TEXT                    -- idempotency guard, Phase 4
);
CREATE INDEX idx_orders_provider_token ON orders (provider_token);
CREATE INDEX idx_orders_created_at     ON orders (created_at);
