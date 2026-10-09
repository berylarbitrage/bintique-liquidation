// Bintique Liquidation — 弃货 (liquidation load) sales tracker, 布局照 pallet.bintique.com
// PO = 从货源买进一拖 (成本), SO = 卖给买家 (卖多少钱), SO 关联 PO 算毛利;
// 卡车订单关联 PO/SO, 金额平摊进成本。
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Database = require('better-sqlite3');

const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || (fs.existsSync('/data') ? '/data' : path.join(__dirname, 'data'));
fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new Database(path.join(DATA_DIR, 'liquidation.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'staff',          -- admin / staff
  pass_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT DEFAULT (datetime('now'))
);
-- 货源 (我们从谁那里拿弃货)
CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  contact TEXT, phone TEXT, email TEXT, address TEXT, notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
-- 买家 (我们卖给谁)
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  contact TEXT, phone TEXT, email TEXT, address TEXT, notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
-- 一拖弃货
CREATE TABLE IF NOT EXISTS lots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lot_no TEXT UNIQUE,
  title TEXT,                                   -- 货物描述 e.g. "Amazon returns - mixed general"
  category TEXT,                                -- 品类
  load_type TEXT DEFAULT 'pallet',              -- pallet 一板 / truckload 一车 / box 一箱
  quantity REAL DEFAULT 1,                      -- 几板/几车
  supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
  acquired_date TEXT,                           -- 进货日期
  purchase_cost REAL DEFAULT 0,                 -- 货款成本
  freight_cost REAL DEFAULT 0,                  -- 运费
  labor_cost REAL DEFAULT 0,                    -- 人工/装卸
  other_cost REAL DEFAULT 0,                    -- 其他
  asking_price REAL DEFAULT 0,                  -- 标价 (一拖卖多少钱)
  status TEXT DEFAULT 'in_stock',               -- in_stock / listed / sold / cancelled
  customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  sold_date TEXT,
  sale_price REAL DEFAULT 0,                    -- 实际成交价
  amount_received REAL DEFAULT 0,               -- 已收款
  payment_method TEXT,
  location TEXT,                                -- 仓位
  notes TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity TEXT, entity_id INTEGER, action TEXT, detail TEXT, username TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
`);

// ---------- migrations ----------
// 地址 (照 pallet: 地址卡 + Mapbox 验证) / 送货·自提
const ADDR_COLS = ['addr1', 'addr2', 'city', 'state', 'zip', 'addr_verified',
  'bill_same', 'bill_addr1', 'bill_addr2', 'bill_city', 'bill_state', 'bill_zip', 'bill_verified', 'delivery_method'];
for (const t of ['suppliers', 'customers']) {
  for (const c of ADDR_COLS) { try { db.exec(`ALTER TABLE ${t} ADD COLUMN ${c} TEXT`); } catch (e) {} }
}
for (const c of ['fulfillment TEXT', 'delivery_date TEXT', 'delivery_address TEXT']) {
  try { db.exec(`ALTER TABLE lots ADD COLUMN ${c}`); } catch (e) {}
}
// 卡车账单: 一张账单可以关联多拖货, 金额平摊进每拖的成本
db.exec(`
CREATE TABLE IF NOT EXISTS truck_bills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bill_no TEXT UNIQUE,
  truck_company TEXT,
  state TEXT,
  purpose TEXT DEFAULT 'pickup',               -- pickup 进货提货 / delivery 送货 / other
  date_start TEXT,
  date_end TEXT,
  amount REAL DEFAULT 0,
  invoice_no TEXT,                             -- 对方 Invoice #
  payment_method TEXT,
  paid_by TEXT,
  status TEXT DEFAULT 'unpaid',                -- unpaid / paid
  paid_date TEXT,
  receipts TEXT DEFAULT '[]',                  -- JSON 文件名数组
  notes TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS truck_bill_lots (
  bill_id INTEGER NOT NULL REFERENCES truck_bills(id) ON DELETE CASCADE,
  lot_id INTEGER NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  PRIMARY KEY (bill_id, lot_id)
);
`);
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ---------- auth ----------
function hashPass(pw, salt = crypto.randomBytes(16).toString('hex')) {
  return salt + ':' + crypto.scryptSync(String(pw), salt, 64).toString('hex');
}
function checkPass(pw, stored) {
  const [salt, h] = String(stored).split(':');
  if (!salt || !h) return false;
  const a = Buffer.from(h, 'hex'), b = crypto.scryptSync(String(pw), salt, 64);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
if (!db.prepare('SELECT COUNT(*) c FROM users').get().c) {
  const u = process.env.ADMIN_USER || 'admin';
  const p = process.env.ADMIN_PASS || 'liquidation2026';
  db.prepare('INSERT INTO users (username, display_name, role, pass_hash) VALUES (?,?,?,?)').run(u, 'Admin', 'admin', hashPass(p));
  console.log(`Created default admin user "${u}"` + (process.env.ADMIN_PASS ? '' : ' (default password — set ADMIN_PASS!)'));
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '5mb' }));

function getToken(req) {
  const h = req.headers.authorization || '';
  if (h.startsWith('Bearer ')) return h.slice(7);
  const m = (req.headers.cookie || '').match(/(?:^|;\s*)liq_token=([a-f0-9]+)/);
  return m ? m[1] : null;
}
function auth(req, res, next) {
  const t = getToken(req);
  const u = t && db.prepare('SELECT u.id, u.username, u.display_name, u.role FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?').get(t);
  if (!u) return res.status(401).json({ error: 'Not signed in' });
  req.user = u; next();
}
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
}
function audit(req, entity, id, action, detail) {
  db.prepare('INSERT INTO audit_log (entity, entity_id, action, detail, username) VALUES (?,?,?,?,?)')
    .run(entity, id, action, detail ? JSON.stringify(detail) : null, req.user ? req.user.username : null);
}

const loginFails = new Map();
app.post('/api/login', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const f = loginFails.get(ip) || { n: 0, t: 0 };
  if (f.n >= 8 && Date.now() - f.t < 10 * 60 * 1000) return res.status(429).json({ error: 'Too many attempts, try again in 10 minutes' });
  const { username, password } = req.body || {};
  const u = db.prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE').get(String(username || '').trim());
  if (!u || !checkPass(password, u.pass_hash)) {
    loginFails.set(ip, { n: f.n + 1, t: Date.now() });
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  loginFails.delete(ip);
  const token = crypto.randomBytes(32).toString('hex');
  db.prepare('INSERT INTO sessions (token, user_id) VALUES (?,?)').run(token, u.id);
  const secure = req.secure || req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `liq_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${secure}`);
  res.json({ id: u.id, username: u.username, display_name: u.display_name, role: u.role });
});
app.post('/api/logout', (req, res) => {
  const t = getToken(req);
  if (t) db.prepare('DELETE FROM sessions WHERE token = ?').run(t);
  res.setHeader('Set-Cookie', 'liq_token=; Path=/; Max-Age=0');
  res.json({ ok: true });
});
app.get('/api/me', auth, (req, res) => res.json(req.user));

// ---------- helpers ----------
const num = v => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; };
const str = v => (v === undefined || v === null) ? null : String(v).trim() || null;

function crud(table, fields) {
  app.get(`/api/${table}`, auth, (req, res) => res.json(db.prepare(`SELECT * FROM ${table} ORDER BY name COLLATE NOCASE`).all()));
  app.post(`/api/${table}`, auth, (req, res) => {
    const b = req.body || {};
    if (!str(b.name)) return res.status(400).json({ error: 'Name is required' });
    const r = db.prepare(`INSERT INTO ${table} (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`).run(...fields.map(f => str(b[f])));
    audit(req, table, r.lastInsertRowid, 'create', b);
    res.json(db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(r.lastInsertRowid));
  });
  app.put(`/api/${table}/:id`, auth, (req, res) => {
    const b = req.body || {};
    if (!str(b.name)) return res.status(400).json({ error: 'Name is required' });
    db.prepare(`UPDATE ${table} SET ${fields.map(f => f + ' = ?').join(',')} WHERE id = ?`).run(...fields.map(f => str(b[f])), req.params.id);
    audit(req, table, +req.params.id, 'update', b);
    res.json(db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.params.id));
  });
  app.delete(`/api/${table}/:id`, auth, adminOnly, (req, res) => {
    db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(req.params.id);
    audit(req, table, +req.params.id, 'delete');
    res.json({ ok: true });
  });
}
const partyFields = ['name', 'contact', 'phone', 'email', 'notes', ...ADDR_COLS];
crud('suppliers', partyFields);
crud('customers', partyFields);

const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, f, cb) => cb(null, Date.now() + '-' + crypto.randomBytes(4).toString('hex') + (path.extname(f.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '') || '')),
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, f, cb) => cb(null, /^(image\/|application\/pdf$)/.test(f.mimetype)),
});

// ---------- schema: orders / invoices / checkout / trucks ----------
db.exec(`
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no TEXT UNIQUE,
  order_type TEXT NOT NULL,                     -- purchase (PO) / sales (SO)
  supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
  customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  po_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,   -- SO 卖的是哪一张 PO 的货
  order_date TEXT,
  title TEXT, category TEXT,
  load_type TEXT DEFAULT 'pallet',              -- pallet / truckload / box / gaylord
  quantity REAL DEFAULT 1,
  unit_price REAL DEFAULT 0,
  discount REAL DEFAULT 0,
  total REAL DEFAULT 0,                         -- quantity × unit_price − discount
  extra_expense REAL DEFAULT 0,                 -- 额外支出 (人工/装卸/其他, 算我们的成本)
  extra_expense_notes TEXT,
  fulfillment TEXT,                             -- delivery 送货 / pickup 自提
  sched_date TEXT,                              -- PO 提货日期 / SO 送货日期
  address TEXT, address_verified TEXT,          -- PO 提货地址 / SO 送货地址
  status TEXT DEFAULT 'confirmed',
  invoice_id INTEGER,
  checkout_group_id INTEGER,
  notes TEXT,
  legacy_lot_id INTEGER,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_no TEXT UNIQUE,
  invoice_type TEXT NOT NULL,                   -- sales 销售发票 / purchase 采购发票
  party_id INTEGER,                             -- customer_id / supplier_id
  invoice_date TEXT, due_date TEXT,
  total REAL DEFAULT 0,
  paid_amount REAL DEFAULT 0,
  paid_date TEXT, payment_method TEXT, bank TEXT,
  their_invoice_no TEXT,
  receipts TEXT DEFAULT '[]',
  notes TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS checkout_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_code TEXT UNIQUE,
  group_type TEXT, party_id INTEGER,
  status TEXT DEFAULT 'pending',                -- pending / invoiced
  invoice_id INTEGER,
  notes TEXT, created_by TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS truck_quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_no TEXT UNIQUE,
  company_name TEXT NOT NULL, state TEXT, size TEXT,
  price REAL DEFAULT 0, price_unit TEXT DEFAULT 'day',     -- day / trip / hour
  quote_date TEXT, notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS truck_bill_orders (
  bill_id INTEGER NOT NULL REFERENCES truck_bills(id) ON DELETE CASCADE,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  PRIMARY KEY (bill_id, order_id)
);
`);
try { db.exec('ALTER TABLE truck_bills ADD COLUMN truck_quote_id INTEGER'); } catch (e) {}
try { db.exec('ALTER TABLE truck_bills ADD COLUMN size TEXT'); } catch (e) {}

const today = () => new Date().toISOString().slice(0, 10);
const round2 = n => Math.round(n * 100) / 100;
function nextNo(table, col, prefix) {
  const ym = new Date().toISOString().slice(2, 7).replace('-', '');
  const p = `${prefix}-${ym}-`;
  const last = db.prepare(`SELECT ${col} AS v FROM ${table} WHERE ${col} LIKE ? ORDER BY ${col} DESC LIMIT 1`).get(p + '%');
  return p + String(last ? parseInt(last.v.slice(p.length), 10) + 1 : 1).padStart(3, '0');
}

// ---------- 旧版 (弃货库存 lots) → PO / SO 一次性迁移 ----------
(function migrateLots() {
  const hasLots = db.prepare("SELECT COUNT(*) c FROM sqlite_master WHERE type='table' AND name='lots'").get().c;
  if (!hasLots) return;
  if (db.prepare('SELECT COUNT(*) c FROM orders').get().c) return;
  const lots = db.prepare('SELECT * FROM lots ORDER BY id').all();
  if (!lots.length) return;
  const insOrder = db.prepare(`INSERT INTO orders (order_no, order_type, supplier_id, customer_id, po_id, order_date, title, category, load_type, quantity,
    unit_price, total, extra_expense, extra_expense_notes, fulfillment, sched_date, address, address_verified, status, invoice_id, notes, legacy_lot_id, created_by, created_at)
    VALUES (@order_no, @order_type, @supplier_id, @customer_id, @po_id, @order_date, @title, @category, @load_type, @quantity,
    @unit_price, @total, @extra_expense, @extra_expense_notes, @fulfillment, @sched_date, @address, @address_verified, @status, @invoice_id, @notes, @legacy_lot_id, @created_by, @created_at)`);
  const insInv = db.prepare(`INSERT INTO invoices (invoice_no, invoice_type, party_id, invoice_date, total, paid_amount, paid_date, payment_method, created_by)
    VALUES (?, 'sales', ?, ?, ?, ?, ?, ?, 'migration')`);
  const seq = { PO: 0, SO: 0, INV: 0 };
  const no = (p, d) => `${p}-${(d || today()).slice(2, 7).replace('-', '')}-${String(++seq[p]).padStart(3, '0')}`;
  const poByLot = {};
  db.transaction(() => {
    for (const l of lots) {
      const qty = l.quantity || 1;
      const extra = (l.freight_cost || 0) + (l.labor_cost || 0) + (l.other_cost || 0);
      const notes = [l.notes, l.asking_price ? `标价 asking $${l.asking_price}` : null, l.location ? `仓位 ${l.location}` : null].filter(Boolean).join('\n') || null;
      const po = insOrder.run({
        order_no: no('PO', l.acquired_date), order_type: 'purchase', supplier_id: l.supplier_id, customer_id: null, po_id: null,
        order_date: l.acquired_date, title: l.title, category: l.category, load_type: l.load_type, quantity: qty,
        unit_price: round2((l.purchase_cost || 0) / qty), total: l.purchase_cost || 0, extra_expense: extra,
        extra_expense_notes: extra ? `运费 ${l.freight_cost || 0} / 人工 ${l.labor_cost || 0} / 其他 ${l.other_cost || 0}` : null,
        fulfillment: null, sched_date: l.acquired_date, address: null, address_verified: null,
        status: l.status === 'cancelled' ? 'cancelled' : l.status === 'sold' ? 'completed' : 'confirmed',
        invoice_id: null, notes, legacy_lot_id: l.id, created_by: l.created_by, created_at: l.created_at,
      });
      poByLot[l.id] = po.lastInsertRowid;
      if (l.status === 'sold') {
        let invId = null;
        if (l.amount_received > 0) {
          invId = insInv.run(no('INV', l.sold_date), l.customer_id, l.sold_date, l.sale_price || 0, l.amount_received,
            l.amount_received >= (l.sale_price || 0) ? l.sold_date : null, l.payment_method).lastInsertRowid;
        }
        insOrder.run({
          order_no: no('SO', l.sold_date), order_type: 'sales', supplier_id: null, customer_id: l.customer_id, po_id: po.lastInsertRowid,
          order_date: l.sold_date, title: l.title, category: l.category, load_type: l.load_type, quantity: qty,
          unit_price: round2((l.sale_price || 0) / qty), total: l.sale_price || 0, extra_expense: 0, extra_expense_notes: null,
          fulfillment: l.fulfillment, sched_date: l.delivery_date, address: l.delivery_address, address_verified: l.delivery_address ? '1' : null,
          status: 'completed', invoice_id: invId, notes: null, legacy_lot_id: l.id, created_by: l.created_by, created_at: l.created_at,
        });
      }
    }
    for (const r of db.prepare('SELECT * FROM truck_bill_lots').all()) {
      if (poByLot[r.lot_id]) db.prepare('INSERT OR IGNORE INTO truck_bill_orders (bill_id, order_id) VALUES (?, ?)').run(r.bill_id, poByLot[r.lot_id]);
    }
  })();
  console.log(`Migrated ${lots.length} lots → PO/SO orders`);
})();

// ---------- orders 计算 (成本 / 毛利 / 付款状态) ----------
const ORDER_STATUSES = ['draft', 'confirmed', 'in_transit', 'picked_up', 'delivered', 'completed', 'cancelled'];
function loadOrders(where = '', params = []) {
  const rows = db.prepare(`SELECT o.*, s.name AS supplier_name, c.name AS customer_name,
      i.invoice_no, i.total AS invoice_total, i.paid_amount AS invoice_paid, g.group_code AS checkout_code,
      (SELECT COALESCE(SUM(b.amount * 1.0 / (SELECT COUNT(*) FROM truck_bill_orders x WHERE x.bill_id = b.id)), 0)
         FROM truck_bill_orders bo JOIN truck_bills b ON b.id = bo.bill_id WHERE bo.order_id = o.id) AS truck_cost,
      (SELECT GROUP_CONCAT(b.bill_no, ', ') FROM truck_bill_orders bo JOIN truck_bills b ON b.id = bo.bill_id WHERE bo.order_id = o.id) AS truck_bill_nos
    FROM orders o
    LEFT JOIN suppliers s ON s.id = o.supplier_id
    LEFT JOIN customers c ON c.id = o.customer_id
    LEFT JOIN invoices i ON i.id = o.invoice_id
    LEFT JOIN checkout_groups g ON g.id = o.checkout_group_id ${where} ORDER BY o.id DESC`).all(...params);
  // 关联关系需要全量 PO/SO 才能算
  const all = where ? db.prepare(`SELECT o.id, o.order_type, o.po_id, o.quantity, o.total, o.extra_expense, o.status, o.order_no,
      (SELECT COALESCE(SUM(b.amount * 1.0 / (SELECT COUNT(*) FROM truck_bill_orders x WHERE x.bill_id = b.id)), 0)
         FROM truck_bill_orders bo JOIN truck_bills b ON b.id = bo.bill_id WHERE bo.order_id = o.id) AS truck_cost FROM orders o`).all() : rows;
  const byId = Object.fromEntries(all.map(o => [o.id, o]));
  const sosByPo = {};
  for (const o of all) if (o.order_type === 'sales' && o.po_id && o.status !== 'cancelled') (sosByPo[o.po_id] = sosByPo[o.po_id] || []).push(o);
  const poCost = po => (po.total || 0) + (po.extra_expense || 0) + (po.truck_cost || 0);
  for (const o of rows) {
    o.our_cost_direct = round2((o.extra_expense || 0) + (o.truck_cost || 0) + (o.order_type === 'purchase' ? (o.total || 0) : 0));
    if (o.order_type === 'purchase') {
      const sos = sosByPo[o.id] || [];
      o.so_list = sos.map(s => s.order_no);
      o.sold_qty = sos.reduce((a, s) => a + (s.quantity || 0), 0);
      o.revenue = round2(sos.reduce((a, s) => a + (s.total || 0), 0));
      o.total_cost = round2(poCost(o) + sos.reduce((a, s) => a + (s.extra_expense || 0) + (s.truck_cost || 0), 0));
      o.profit = sos.length ? round2(o.revenue - o.total_cost) : null;
    } else {
      const po = o.po_id ? byId[o.po_id] : null;
      o.po_no = po ? po.order_no : null;
      // PO 成本按数量分摊到这张 SO
      const share = po ? ((po.quantity || 0) > 0 ? Math.min(1, (o.quantity || 0) / po.quantity) : 1) : 0;
      o.po_cost_share = po ? round2(poCost(po) * share) : null;
      o.total_cost = round2((o.po_cost_share || 0) + (o.extra_expense || 0) + (o.truck_cost || 0));
      o.profit = po ? round2((o.total || 0) - o.total_cost) : null;
    }
    o.pay_status = !o.invoice_id ? 'uninvoiced' : (o.invoice_paid || 0) >= (o.invoice_total || 0) - 0.005 ? 'paid' : (o.invoice_paid || 0) > 0 ? 'partial' : 'unpaid';
  }
  return rows;
}
function orderValues(b, type) {
  const qty = num(b.quantity) || 1, unit = num(b.unit_price), discount = num(b.discount);
  return {
    supplier_id: type === 'purchase' && b.supplier_id ? +b.supplier_id : null,
    customer_id: type === 'sales' && b.customer_id ? +b.customer_id : null,
    po_id: type === 'sales' && b.po_id ? +b.po_id : null,
    order_date: str(b.order_date) || today(), title: str(b.title), category: str(b.category),
    load_type: ['pallet', 'truckload', 'box', 'gaylord'].includes(b.load_type) ? b.load_type : 'pallet',
    quantity: qty, unit_price: unit, discount, total: round2(qty * unit - discount),
    extra_expense: num(b.extra_expense), extra_expense_notes: str(b.extra_expense_notes),
    fulfillment: ['pickup', 'delivery'].includes(b.fulfillment) ? b.fulfillment : null,
    sched_date: str(b.sched_date), address: str(b.address), address_verified: str(b.address) ? (b.address_verified ? '1' : '0') : null,
    status: ORDER_STATUSES.includes(b.status) ? b.status : 'confirmed', notes: str(b.notes),
  };
}

app.get('/api/orders', auth, (req, res) => res.json(loadOrders()));
app.get('/api/orders/:id', auth, (req, res) => {
  const o = loadOrders('WHERE o.id = ?', [req.params.id])[0];
  if (!o) return res.status(404).json({ error: 'Not found' });
  o.history = db.prepare("SELECT * FROM audit_log WHERE entity = 'orders' AND entity_id = ? ORDER BY id DESC").all(o.id);
  o.truck_bills = db.prepare(`SELECT b.id, b.bill_no, b.truck_company, b.amount,
      (SELECT COUNT(*) FROM truck_bill_orders x WHERE x.bill_id = b.id) AS order_count
    FROM truck_bill_orders bo JOIN truck_bills b ON b.id = bo.bill_id WHERE bo.order_id = ? ORDER BY b.id`).all(o.id);
  res.json(o);
});
app.post('/api/orders', auth, (req, res) => {
  const b = req.body || {};
  const type = b.order_type === 'sales' ? 'sales' : 'purchase';
  const v = orderValues(b, type);
  if (type === 'purchase' && !v.supplier_id) return res.status(400).json({ error: 'Supplier is required' });
  if (type === 'sales' && !v.customer_id) return res.status(400).json({ error: 'Customer is required' });
  Object.assign(v, { order_type: type, order_no: nextNo('orders', 'order_no', type === 'sales' ? 'SO' : 'PO'), created_by: req.user.username });
  const keys = Object.keys(v);
  const r = db.prepare(`INSERT INTO orders (${keys.join(',')}) VALUES (${keys.map(k => '@' + k).join(',')})`).run(v);
  audit(req, 'orders', r.lastInsertRowid, 'create', v);
  res.json(loadOrders('WHERE o.id = ?', [r.lastInsertRowid])[0]);
});
app.put('/api/orders/:id', auth, (req, res) => {
  const old = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!old) return res.status(404).json({ error: 'Not found' });
  const v = orderValues(req.body || {}, old.order_type);
  if (old.order_type === 'purchase' && !v.supplier_id) return res.status(400).json({ error: 'Supplier is required' });
  if (old.order_type === 'sales' && !v.customer_id) return res.status(400).json({ error: 'Customer is required' });
  if (v.po_id === old.id) v.po_id = null;
  // 已开发票的订单不能改金额/对象, 先删发票
  if (old.invoice_id && (v.total !== old.total || v.supplier_id !== old.supplier_id || v.customer_id !== old.customer_id))
    return res.status(400).json({ error: 'Order is on an invoice — delete the invoice first to change amount or party / 已开发票, 改金额或对象要先删发票' });
  const keys = Object.keys(v);
  db.prepare(`UPDATE orders SET ${keys.map(k => k + ' = @' + k).join(',')}, updated_at = datetime('now') WHERE id = @id`).run({ ...v, id: old.id });
  const changes = {};
  for (const k of keys) if (String(old[k] ?? '') !== String(v[k] ?? '')) changes[k] = [old[k], v[k]];
  if (Object.keys(changes).length) audit(req, 'orders', old.id, 'update', changes);
  res.json(loadOrders('WHERE o.id = ?', [old.id])[0]);
});
app.delete('/api/orders/:id', auth, adminOnly, (req, res) => {
  const o = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!o) return res.status(404).json({ error: 'Not found' });
  if (o.invoice_id) return res.status(400).json({ error: 'Delete its invoice first / 先删除发票' });
  db.prepare('DELETE FROM orders WHERE id = ?').run(o.id);
  audit(req, 'orders', o.id, 'delete', { order_no: o.order_no });
  res.json({ ok: true });
});

// ---------- invoices 销售发票 / 采购发票 ----------
function loadInvoices(where = '', params = []) {
  return db.prepare(`SELECT i.*,
      CASE i.invoice_type WHEN 'sales' THEN (SELECT name FROM customers WHERE id = i.party_id) ELSE (SELECT name FROM suppliers WHERE id = i.party_id) END AS party_name,
      (SELECT json_group_array(json_object('id', o.id, 'order_no', o.order_no, 'title', o.title, 'quantity', o.quantity, 'load_type', o.load_type,
          'unit_price', o.unit_price, 'discount', o.discount, 'total', o.total, 'order_date', o.order_date, 'sched_date', o.sched_date))
         FROM orders o WHERE o.invoice_id = i.id) AS orders_json
    FROM invoices i ${where} ORDER BY i.id DESC`).all(...params).map(i => ({
    ...i, orders: JSON.parse(i.orders_json || '[]'), receipts: JSON.parse(i.receipts || '[]'), orders_json: undefined,
    status: i.paid_amount >= i.total - 0.005 && i.total > 0 ? 'paid' : i.paid_amount > 0 ? 'partial' : 'unpaid',
  }));
}
function createInvoice(req, orderIds, extra = {}) {
  const ids = [...new Set((orderIds || []).map(Number).filter(Boolean))];
  if (!ids.length) throw new Error('No orders selected / 请先选择订单');
  const orders = db.prepare(`SELECT * FROM orders WHERE id IN (${ids.map(() => '?').join(',')})`).all(...ids);
  if (orders.length !== ids.length) throw new Error('Order not found');
  const type = orders[0].order_type;
  const party = type === 'sales' ? orders[0].customer_id : orders[0].supplier_id;
  for (const o of orders) {
    if (o.order_type !== type) throw new Error('PO and SO cannot be on one invoice / PO 和 SO 不能开在同一张发票');
    if ((type === 'sales' ? o.customer_id : o.supplier_id) !== party) throw new Error('All orders must be for the same customer/supplier / 必须是同一个客户或货源');
    if (o.invoice_id) throw new Error(`${o.order_no} already has an invoice / 已开过发票`);
    if (o.status === 'cancelled') throw new Error(`${o.order_no} is cancelled`);
  }
  const total = round2(orders.reduce((a, o) => a + (o.total || 0), 0));
  const r = db.prepare(`INSERT INTO invoices (invoice_no, invoice_type, party_id, invoice_date, due_date, total, their_invoice_no, notes, created_by)
    VALUES (?,?,?,?,?,?,?,?,?)`).run(nextNo('invoices', 'invoice_no', type === 'sales' ? 'INV' : 'BILL'), type, party,
    str(extra.invoice_date) || today(), str(extra.due_date), total, str(extra.their_invoice_no), str(extra.notes), req.user.username);
  db.prepare(`UPDATE orders SET invoice_id = ? WHERE id IN (${ids.map(() => '?').join(',')})`).run(r.lastInsertRowid, ...ids);
  audit(req, 'invoices', r.lastInsertRowid, 'create', { order_ids: ids, total });
  return r.lastInsertRowid;
}
app.get('/api/invoices', auth, (req, res) => res.json(loadInvoices()));
app.post('/api/invoices', auth, (req, res) => {
  try {
    const id = db.transaction(() => createInvoice(req, req.body.order_ids, req.body))();
    res.json(loadInvoices('WHERE i.id = ?', [id])[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.put('/api/invoices/:id', auth, (req, res) => {
  const i = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!i) return res.status(404).json({ error: 'Not found' });
  const b = req.body || {};
  const v = { invoice_date: str(b.invoice_date), due_date: str(b.due_date), paid_amount: num(b.paid_amount), paid_date: str(b.paid_date),
    payment_method: str(b.payment_method), bank: str(b.bank), their_invoice_no: str(b.their_invoice_no), notes: str(b.notes) };
  db.prepare(`UPDATE invoices SET ${Object.keys(v).map(k => k + ' = @' + k).join(',')} WHERE id = @id`).run({ ...v, id: i.id });
  // 付清 → 订单自动变已完成
  if (v.paid_amount >= i.total - 0.005 && i.total > 0)
    db.prepare("UPDATE orders SET status = 'completed', updated_at = datetime('now') WHERE invoice_id = ? AND status NOT IN ('cancelled','completed')").run(i.id);
  audit(req, 'invoices', i.id, 'update', v);
  res.json(loadInvoices('WHERE i.id = ?', [i.id])[0]);
});
app.post('/api/invoices/:id/receipts', auth, upload.array('files', 10), (req, res) => {
  const i = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!i) return res.status(404).json({ error: 'Not found' });
  if (!req.files || !req.files.length) return res.status(400).json({ error: 'Only images or PDF files (max 15MB)' });
  db.prepare('UPDATE invoices SET receipts = ? WHERE id = ?').run(JSON.stringify(JSON.parse(i.receipts || '[]').concat(req.files.map(f => f.filename))), i.id);
  audit(req, 'invoices', i.id, 'receipt', { files: req.files.map(f => f.originalname) });
  res.json(loadInvoices('WHERE i.id = ?', [i.id])[0]);
});
app.delete('/api/invoices/:id', auth, adminOnly, (req, res) => {
  const i = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!i) return res.status(404).json({ error: 'Not found' });
  db.transaction(() => {
    db.prepare('UPDATE orders SET invoice_id = NULL WHERE invoice_id = ?').run(i.id);
    db.prepare("UPDATE checkout_groups SET status = 'pending', invoice_id = NULL WHERE invoice_id = ?").run(i.id);
    db.prepare('DELETE FROM invoices WHERE id = ?').run(i.id);
  })();
  audit(req, 'invoices', i.id, 'delete', { invoice_no: i.invoice_no });
  res.json({ ok: true });
});

// ---------- 待结账 checkout groups ----------
app.get('/api/checkout-groups', auth, (req, res) => res.json(db.prepare(`SELECT g.*,
    CASE g.group_type WHEN 'sales' THEN (SELECT name FROM customers WHERE id = g.party_id) ELSE (SELECT name FROM suppliers WHERE id = g.party_id) END AS party_name
  FROM checkout_groups g ORDER BY g.id DESC`).all()));
app.post('/api/checkout-groups', auth, (req, res) => {
  const ids = [...new Set((req.body.order_ids || []).map(Number).filter(Boolean))];
  if (!ids.length) return res.status(400).json({ error: 'No orders selected / 请先选择订单' });
  const orders = db.prepare(`SELECT * FROM orders WHERE id IN (${ids.map(() => '?').join(',')})`).all(...ids);
  const type = orders[0].order_type, party = type === 'sales' ? orders[0].customer_id : orders[0].supplier_id;
  for (const o of orders) {
    if (o.order_type !== type || (type === 'sales' ? o.customer_id : o.supplier_id) !== party)
      return res.status(400).json({ error: 'Select orders of the same customer/supplier / 请选同一个客户或货源的订单' });
    if (o.invoice_id) return res.status(400).json({ error: `${o.order_no} already invoiced / 已开发票` });
    if (o.checkout_group_id) return res.status(400).json({ error: `${o.order_no} is already in checkout / 已在待结账` });
  }
  const r = db.prepare('INSERT INTO checkout_groups (group_code, group_type, party_id, created_by) VALUES (?,?,?,?)')
    .run(nextNo('checkout_groups', 'group_code', 'CK'), type, party, req.user.username);
  db.prepare(`UPDATE orders SET checkout_group_id = ? WHERE id IN (${ids.map(() => '?').join(',')})`).run(r.lastInsertRowid, ...ids);
  audit(req, 'checkout_groups', r.lastInsertRowid, 'create', { order_ids: ids });
  res.json(db.prepare('SELECT * FROM checkout_groups WHERE id = ?').get(r.lastInsertRowid));
});
app.post('/api/checkout-groups/:id/invoice', auth, (req, res) => {
  const g = db.prepare('SELECT * FROM checkout_groups WHERE id = ?').get(req.params.id);
  if (!g) return res.status(404).json({ error: 'Not found' });
  if (g.status !== 'pending') return res.status(400).json({ error: 'Already invoiced / 已开发票' });
  try {
    const id = db.transaction(() => {
      const ids = db.prepare('SELECT id FROM orders WHERE checkout_group_id = ?').all(g.id).map(r => r.id);
      const invId = createInvoice(req, ids, req.body || {});
      db.prepare("UPDATE checkout_groups SET status = 'invoiced', invoice_id = ? WHERE id = ?").run(invId, g.id);
      return invId;
    })();
    res.json(loadInvoices('WHERE i.id = ?', [id])[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/checkout-groups/:id', auth, (req, res) => {
  db.transaction(() => {
    db.prepare('UPDATE orders SET checkout_group_id = NULL WHERE checkout_group_id = ? AND invoice_id IS NULL').run(req.params.id);
    db.prepare("DELETE FROM checkout_groups WHERE id = ? AND status = 'pending'").run(req.params.id);
  })();
  audit(req, 'checkout_groups', +req.params.id, 'delete');
  res.json({ ok: true });
});
app.delete('/api/checkout-groups/:id/orders/:orderId', auth, (req, res) => {
  db.prepare('UPDATE orders SET checkout_group_id = NULL WHERE id = ? AND checkout_group_id = ? AND invoice_id IS NULL').run(req.params.orderId, req.params.id);
  if (!db.prepare('SELECT COUNT(*) c FROM orders WHERE checkout_group_id = ?').get(req.params.id).c)
    db.prepare("DELETE FROM checkout_groups WHERE id = ? AND status = 'pending'").run(req.params.id);
  res.json({ ok: true });
});

// ---------- 卡车订单 truck orders (表名沿用 truck_bills) ----------
function billValues(b) {
  const status = b.status === 'paid' ? 'paid' : 'unpaid';
  return {
    truck_company: str(b.truck_company), state: str(b.state) && str(b.state).toUpperCase(), size: str(b.size),
    purpose: ['pickup', 'delivery', 'other'].includes(b.purpose) ? b.purpose : 'pickup',
    date_start: str(b.date_start), date_end: str(b.date_end), amount: num(b.amount),
    invoice_no: str(b.invoice_no), payment_method: str(b.payment_method), paid_by: str(b.paid_by),
    status, paid_date: status === 'paid' ? (str(b.paid_date) || today()) : null,
    truck_quote_id: b.truck_quote_id ? +b.truck_quote_id : null, notes: str(b.notes),
  };
}
const BILL_SELECT = `SELECT b.*, q.quote_no,
  (SELECT json_group_array(json_object('id', o.id, 'order_no', o.order_no, 'order_type', o.order_type, 'title', o.title))
     FROM truck_bill_orders bo JOIN orders o ON o.id = bo.order_id WHERE bo.bill_id = b.id) AS orders_json
  FROM truck_bills b LEFT JOIN truck_quotes q ON q.id = b.truck_quote_id`;
const billOut = b => b && ({ ...b, orders: JSON.parse(b.orders_json || '[]'), receipts: JSON.parse(b.receipts || '[]'), orders_json: undefined });
const setBillOrders = db.transaction((billId, ids) => {
  db.prepare('DELETE FROM truck_bill_orders WHERE bill_id = ?').run(billId);
  const ins = db.prepare('INSERT OR IGNORE INTO truck_bill_orders (bill_id, order_id) VALUES (?, ?)');
  for (const id of [...new Set((ids || []).map(Number).filter(Boolean))]) ins.run(billId, id);
});
app.get('/api/truck-bills', auth, (req, res) => res.json(db.prepare(BILL_SELECT + ' ORDER BY b.id DESC').all().map(billOut)));
function saveBill(req, res, old) {
  const b = req.body || {};
  const v = billValues(b);
  if (!v.truck_company) return res.status(400).json({ error: 'Truck company is required' });
  if (v.date_start && v.date_end && v.date_end < v.date_start) return res.status(400).json({ error: 'End date is before start date / 结束日期不能早于开始日期' });
  let id;
  if (old) {
    db.prepare(`UPDATE truck_bills SET ${Object.keys(v).map(k => k + ' = @' + k).join(',')}, updated_at = datetime('now') WHERE id = @id`).run({ ...v, id: old.id });
    id = old.id;
  } else {
    Object.assign(v, { bill_no: nextNo('truck_bills', 'bill_no', 'TR'), created_by: req.user.username });
    id = db.prepare(`INSERT INTO truck_bills (${Object.keys(v).join(',')}) VALUES (${Object.keys(v).map(k => '@' + k).join(',')})`).run(v).lastInsertRowid;
  }
  if (Array.isArray(b.order_ids)) setBillOrders(id, b.order_ids);
  audit(req, 'truck_bills', id, old ? 'update' : 'create', { ...v, order_ids: b.order_ids });
  res.json(billOut(db.prepare(BILL_SELECT + ' WHERE b.id = ?').get(id)));
}
app.post('/api/truck-bills', auth, (req, res) => saveBill(req, res, null));
app.put('/api/truck-bills/:id', auth, (req, res) => {
  const old = db.prepare('SELECT * FROM truck_bills WHERE id = ?').get(req.params.id);
  if (!old) return res.status(404).json({ error: 'Not found' });
  saveBill(req, res, old);
});
app.post('/api/truck-bills/:id/receipts', auth, upload.array('files', 10), (req, res) => {
  const b = db.prepare('SELECT * FROM truck_bills WHERE id = ?').get(req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  if (!req.files || !req.files.length) return res.status(400).json({ error: 'Only images or PDF files (max 15MB)' });
  db.prepare('UPDATE truck_bills SET receipts = ? WHERE id = ?').run(JSON.stringify(JSON.parse(b.receipts || '[]').concat(req.files.map(f => f.filename))), b.id);
  audit(req, 'truck_bills', b.id, 'receipt', { files: req.files.map(f => f.originalname) });
  res.json(billOut(db.prepare(BILL_SELECT + ' WHERE b.id = ?').get(b.id)));
});
app.delete('/api/truck-bills/:id/receipts/:file', auth, (req, res) => {
  const b = db.prepare('SELECT * FROM truck_bills WHERE id = ?').get(req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE truck_bills SET receipts = ? WHERE id = ?').run(JSON.stringify(JSON.parse(b.receipts || '[]').filter(f => f !== req.params.file)), b.id);
  audit(req, 'truck_bills', b.id, 'receipt_delete', { file: req.params.file });
  res.json(billOut(db.prepare(BILL_SELECT + ' WHERE b.id = ?').get(b.id)));
});
app.delete('/api/truck-bills/:id', auth, adminOnly, (req, res) => {
  db.prepare('DELETE FROM truck_bills WHERE id = ?').run(req.params.id);
  audit(req, 'truck_bills', +req.params.id, 'delete');
  res.json({ ok: true });
});

// ---------- 卡车明细 truck quotes ----------
const quoteValues = b => ({ company_name: str(b.company_name), state: str(b.state) && str(b.state).toUpperCase(), size: str(b.size),
  price: num(b.price), price_unit: ['day', 'trip', 'hour'].includes(b.price_unit) ? b.price_unit : 'day', quote_date: str(b.quote_date) || today(), notes: str(b.notes) });
app.get('/api/truck-quotes', auth, (req, res) => res.json(db.prepare(`SELECT q.*, (SELECT COUNT(*) FROM truck_bills b WHERE b.truck_quote_id = q.id) AS use_count
  FROM truck_quotes q ORDER BY q.company_name COLLATE NOCASE, q.id DESC`).all()));
app.post('/api/truck-quotes', auth, (req, res) => {
  const v = quoteValues(req.body || {});
  if (!v.company_name) return res.status(400).json({ error: 'Company is required' });
  v.quote_no = nextNo('truck_quotes', 'quote_no', 'TQ');
  const r = db.prepare(`INSERT INTO truck_quotes (${Object.keys(v).join(',')}) VALUES (${Object.keys(v).map(k => '@' + k).join(',')})`).run(v);
  audit(req, 'truck_quotes', r.lastInsertRowid, 'create', v);
  res.json(db.prepare('SELECT * FROM truck_quotes WHERE id = ?').get(r.lastInsertRowid));
});
app.put('/api/truck-quotes/:id', auth, (req, res) => {
  const v = quoteValues(req.body || {});
  if (!v.company_name) return res.status(400).json({ error: 'Company is required' });
  db.prepare(`UPDATE truck_quotes SET ${Object.keys(v).map(k => k + ' = @' + k).join(',')} WHERE id = @id`).run({ ...v, id: req.params.id });
  audit(req, 'truck_quotes', +req.params.id, 'update', v);
  res.json(db.prepare('SELECT * FROM truck_quotes WHERE id = ?').get(req.params.id));
});
app.delete('/api/truck-quotes/:id', auth, adminOnly, (req, res) => {
  db.prepare('UPDATE truck_bills SET truck_quote_id = NULL WHERE truck_quote_id = ?').run(req.params.id);
  db.prepare('DELETE FROM truck_quotes WHERE id = ?').run(req.params.id);
  audit(req, 'truck_quotes', +req.params.id, 'delete');
  res.json({ ok: true });
});

app.get('/api/files/:name', auth, (req, res) => {
  const name = path.basename(req.params.name);
  const p = path.join(UPLOAD_DIR, name);
  if (!fs.existsSync(p)) return res.status(404).send('Not found');
  res.sendFile(p);
});

// 地址验证: 优先 Google (Railway 环境变量 GOOGLE_MAPS_API_KEY, 需开通 Geocoding API), 否则用 Mapbox (MAPBOX_TOKEN)
app.get('/api/config', auth, (req, res) => res.json({
  geocoder: process.env.GOOGLE_MAPS_API_KEY ? 'google' : (process.env.MAPBOX_TOKEN ? 'mapbox' : ''),
  mapbox_token: process.env.GOOGLE_MAPS_API_KEY ? '' : (process.env.MAPBOX_TOKEN || ''),
  // 打印 PO / SO / 发票 抬头上的公司信息
  company: { name: process.env.COMPANY_NAME || 'Bintique', address: process.env.COMPANY_ADDRESS || '', phone: process.env.COMPANY_PHONE || '', email: process.env.COMPANY_EMAIL || '' },
}));

// Google Geocoding 走后端代理, key 不暴露给浏览器
app.get('/api/geocode', auth, async (req, res) => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const q = str(req.query.q);
  if (!key) return res.status(400).json({ error: 'GOOGLE_MAPS_API_KEY is not set' });
  if (!q) return res.json([]);
  try {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(q) + '&components=country:US&language=en&key=' + encodeURIComponent(key);
    const d = await (await fetch(url)).json();
    if (d.status === 'ZERO_RESULTS') return res.json([]);
    if (d.status !== 'OK') return res.status(502).json({ error: 'Google geocode: ' + d.status + (d.error_message ? ' - ' + d.error_message : '') });
    res.json(d.results.slice(0, 5).map(r => {
      const c = type => r.address_components.find(x => x.types.includes(type));
      const num = c('street_number'), route = c('route');
      const street = [num && num.long_name, route && route.short_name].filter(Boolean).join(' ');
      const cityC = c('locality') || c('sublocality') || c('postal_town') || c('administrative_area_level_3') || c('neighborhood');
      const city = cityC ? cityC.long_name : '';
      const state = (c('administrative_area_level_1') || {}).short_name || '';
      const zip = (c('postal_code') || {}).long_name || '';
      const full = street + (city ? ', ' + city : '') + (state ? ', ' + state : '') + (zip ? ' ' + zip : '');
      return { street, city, state, zip, full: full || r.formatted_address, place_name: r.formatted_address, partial: !!r.partial_match };
    }));
  } catch (e) { res.status(502).json({ error: e.message }); }
});

// ---------- users (admin) ----------
app.get('/api/users', auth, adminOnly, (req, res) => res.json(db.prepare('SELECT id, username, display_name, role, created_at FROM users ORDER BY id').all()));
app.post('/api/users', auth, adminOnly, (req, res) => {
  const { username, display_name, role, password } = req.body || {};
  if (!str(username) || !password) return res.status(400).json({ error: 'Username and password required' });
  try {
    const r = db.prepare('INSERT INTO users (username, display_name, role, pass_hash) VALUES (?,?,?,?)')
      .run(str(username), str(display_name), role === 'admin' ? 'admin' : 'staff', hashPass(password));
    audit(req, 'users', r.lastInsertRowid, 'create', { username, role });
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ error: /UNIQUE/.test(e.message) ? 'Username already exists' : e.message }); }
});
app.put('/api/users/:id', auth, adminOnly, (req, res) => {
  const { display_name, role, password } = req.body || {};
  const u = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!u) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE users SET display_name = ?, role = ? WHERE id = ?').run(str(display_name), role === 'admin' ? 'admin' : 'staff', u.id);
  if (password) {
    db.prepare('UPDATE users SET pass_hash = ? WHERE id = ?').run(hashPass(password), u.id);
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(u.id);
  }
  audit(req, 'users', u.id, 'update', { role, password_changed: !!password });
  res.json({ ok: true });
});
app.delete('/api/users/:id', auth, adminOnly, (req, res) => {
  if (+req.params.id === req.user.id) return res.status(400).json({ error: "You can't delete yourself" });
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  audit(req, 'users', +req.params.id, 'delete');
  res.json({ ok: true });
});

// ---------- backup ----------
app.get('/api/backup', auth, adminOnly, (req, res) => {
  const dump = {
    exported_at: new Date().toISOString(),
    suppliers: db.prepare('SELECT * FROM suppliers').all(),
    customers: db.prepare('SELECT * FROM customers').all(),
    orders: db.prepare('SELECT * FROM orders').all(),
    invoices: db.prepare('SELECT * FROM invoices').all(),
    checkout_groups: db.prepare('SELECT * FROM checkout_groups').all(),
    truck_bills: db.prepare('SELECT * FROM truck_bills').all(),
    truck_bill_orders: db.prepare('SELECT * FROM truck_bill_orders').all(),
    truck_quotes: db.prepare('SELECT * FROM truck_quotes').all(),
    legacy_lots: db.prepare('SELECT * FROM lots').all(),
  };
  res.setHeader('Content-Disposition', `attachment; filename="liquidation-backup-${dump.exported_at.slice(0, 10)}.json"`);
  res.json(dump);
});

app.get('/healthz', (req, res) => res.send('ok'));
app.get('/vendor/chart.umd.js', (req, res) => res.sendFile(path.join(__dirname, 'node_modules/chart.js/dist/chart.umd.js')));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Bintique Liquidation running on http://localhost:${PORT} (data: ${DATA_DIR})`));
