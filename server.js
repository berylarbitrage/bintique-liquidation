// Bintique Liquidation — 弃货 (liquidation load) sales tracker
// 思路: 每一拖弃货 = 一条 lot。记录 从谁那买的 / 成本多少 / 卖给了谁 / 卖了多少钱 / 收款情况。
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

// ---------- lots ----------
// 卡车费分摊: 每张账单金额 ÷ 关联的拖数
const TRUCK_ALLOC = `(SELECT COALESCE(SUM(b.amount * 1.0 / (SELECT COUNT(*) FROM truck_bill_lots x WHERE x.bill_id = b.id)), 0)
    FROM truck_bill_lots bl JOIN truck_bills b ON b.id = bl.bill_id WHERE bl.lot_id = l.id)`;
const LOT_SELECT = `
  SELECT l.*, s.name AS supplier_name, c.name AS customer_name,
    ${TRUCK_ALLOC} AS truck_cost,
    (l.purchase_cost + l.freight_cost + l.labor_cost + l.other_cost + ${TRUCK_ALLOC}) AS total_cost,
    (SELECT GROUP_CONCAT(b.bill_no, ', ') FROM truck_bill_lots bl JOIN truck_bills b ON b.id = bl.bill_id WHERE bl.lot_id = l.id) AS truck_bill_nos
  FROM lots l
  LEFT JOIN suppliers s ON s.id = l.supplier_id
  LEFT JOIN customers c ON c.id = l.customer_id`;
const LOT_STATUSES = ['in_stock', 'listed', 'sold', 'cancelled'];

function nextLotNo() {
  const ym = new Date().toISOString().slice(2, 7).replace('-', '');
  const prefix = `LQ-${ym}-`;
  const last = db.prepare('SELECT lot_no FROM lots WHERE lot_no LIKE ? ORDER BY lot_no DESC LIMIT 1').get(prefix + '%');
  const n = last ? parseInt(last.lot_no.slice(prefix.length), 10) + 1 : 1;
  return prefix + String(n).padStart(3, '0');
}
function lotValues(b) {
  const status = LOT_STATUSES.includes(b.status) ? b.status : 'in_stock';
  return {
    title: str(b.title), category: str(b.category),
    load_type: ['pallet', 'truckload', 'box', 'gaylord'].includes(b.load_type) ? b.load_type : 'pallet',
    quantity: num(b.quantity) || 1,
    supplier_id: b.supplier_id ? +b.supplier_id : null,
    acquired_date: str(b.acquired_date),
    purchase_cost: num(b.purchase_cost), freight_cost: num(b.freight_cost),
    labor_cost: num(b.labor_cost), other_cost: num(b.other_cost),
    asking_price: num(b.asking_price),
    status,
    customer_id: b.customer_id ? +b.customer_id : null,
    sold_date: str(b.sold_date) || (status === 'sold' ? new Date().toISOString().slice(0, 10) : null),
    sale_price: num(b.sale_price), amount_received: num(b.amount_received),
    payment_method: str(b.payment_method), location: str(b.location), notes: str(b.notes),
    fulfillment: ['pickup', 'delivery'].includes(b.fulfillment) ? b.fulfillment : null,
    delivery_date: str(b.delivery_date), delivery_address: str(b.delivery_address),
  };
}

app.get('/api/lots', auth, (req, res) => res.json(db.prepare(LOT_SELECT + ' ORDER BY l.id DESC').all()));
app.get('/api/lots/:id', auth, (req, res) => {
  const l = db.prepare(LOT_SELECT + ' WHERE l.id = ?').get(req.params.id);
  if (!l) return res.status(404).json({ error: 'Not found' });
  l.history = db.prepare("SELECT * FROM audit_log WHERE entity = 'lots' AND entity_id = ? ORDER BY id DESC").all(l.id);
  l.truck_bills = db.prepare(`SELECT b.id, b.bill_no, b.truck_company, b.amount, b.purpose,
      (SELECT COUNT(*) FROM truck_bill_lots x WHERE x.bill_id = b.id) AS lot_count
    FROM truck_bill_lots bl JOIN truck_bills b ON b.id = bl.bill_id WHERE bl.lot_id = ? ORDER BY b.id`).all(l.id);
  res.json(l);
});
app.post('/api/lots', auth, (req, res) => {
  const v = lotValues(req.body || {});
  v.lot_no = str(req.body.lot_no) || nextLotNo();
  v.created_by = req.user.username;
  const keys = Object.keys(v);
  try {
    const r = db.prepare(`INSERT INTO lots (${keys.join(',')}) VALUES (${keys.map(k => '@' + k).join(',')})`).run(v);
    audit(req, 'lots', r.lastInsertRowid, 'create', v);
    res.json(db.prepare(LOT_SELECT + ' WHERE l.id = ?').get(r.lastInsertRowid));
  } catch (e) {
    res.status(400).json({ error: /UNIQUE/.test(e.message) ? 'Lot # already exists' : e.message });
  }
});
app.put('/api/lots/:id', auth, (req, res) => {
  const old = db.prepare('SELECT * FROM lots WHERE id = ?').get(req.params.id);
  if (!old) return res.status(404).json({ error: 'Not found' });
  const v = lotValues(req.body || {});
  if (str(req.body.lot_no)) v.lot_no = str(req.body.lot_no);
  const keys = Object.keys(v);
  try {
    db.prepare(`UPDATE lots SET ${keys.map(k => k + ' = @' + k).join(',')}, updated_at = datetime('now') WHERE id = @id`).run({ ...v, id: old.id });
  } catch (e) {
    return res.status(400).json({ error: /UNIQUE/.test(e.message) ? 'Lot # already exists' : e.message });
  }
  const changes = {};
  for (const k of keys) if (String(old[k] ?? '') !== String(v[k] ?? '')) changes[k] = [old[k], v[k]];
  if (Object.keys(changes).length) audit(req, 'lots', old.id, 'update', changes);
  res.json(db.prepare(LOT_SELECT + ' WHERE l.id = ?').get(old.id));
});
// 快速收款
app.post('/api/lots/:id/payment', auth, (req, res) => {
  const l = db.prepare('SELECT * FROM lots WHERE id = ?').get(req.params.id);
  if (!l) return res.status(404).json({ error: 'Not found' });
  const amt = num(req.body.amount);
  if (!amt) return res.status(400).json({ error: 'Amount required' });
  db.prepare("UPDATE lots SET amount_received = amount_received + ?, payment_method = COALESCE(?, payment_method), updated_at = datetime('now') WHERE id = ?")
    .run(amt, str(req.body.method), l.id);
  audit(req, 'lots', l.id, 'payment', { amount: amt, method: str(req.body.method) });
  res.json(db.prepare(LOT_SELECT + ' WHERE l.id = ?').get(l.id));
});
app.delete('/api/lots/:id', auth, adminOnly, (req, res) => {
  db.prepare('DELETE FROM lots WHERE id = ?').run(req.params.id);
  audit(req, 'lots', +req.params.id, 'delete');
  res.json({ ok: true });
});

// ---------- truck bills 卡车账单 ----------
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, f, cb) => cb(null, Date.now() + '-' + crypto.randomBytes(4).toString('hex') + (path.extname(f.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '') || '')),
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, f, cb) => cb(null, /^(image\/|application\/pdf$)/.test(f.mimetype)),
});
function nextBillNo() {
  const ym = new Date().toISOString().slice(2, 7).replace('-', '');
  const prefix = `TR-${ym}-`;
  const last = db.prepare('SELECT bill_no FROM truck_bills WHERE bill_no LIKE ? ORDER BY bill_no DESC LIMIT 1').get(prefix + '%');
  return prefix + String(last ? parseInt(last.bill_no.slice(prefix.length), 10) + 1 : 1).padStart(3, '0');
}
const BILL_SELECT = `SELECT b.*,
  (SELECT json_group_array(json_object('id', l.id, 'lot_no', l.lot_no, 'title', l.title))
     FROM truck_bill_lots bl JOIN lots l ON l.id = bl.lot_id WHERE bl.bill_id = b.id) AS lots_json
  FROM truck_bills b`;
const billOut = b => b && ({ ...b, lots: JSON.parse(b.lots_json || '[]'), receipts: JSON.parse(b.receipts || '[]'), lots_json: undefined });
function billValues(b) {
  const status = b.status === 'paid' ? 'paid' : 'unpaid';
  return {
    truck_company: str(b.truck_company), state: str(b.state) && str(b.state).toUpperCase(),
    purpose: ['pickup', 'delivery', 'other'].includes(b.purpose) ? b.purpose : 'pickup',
    date_start: str(b.date_start), date_end: str(b.date_end), amount: num(b.amount),
    invoice_no: str(b.invoice_no), payment_method: str(b.payment_method), paid_by: str(b.paid_by),
    status, paid_date: status === 'paid' ? (str(b.paid_date) || new Date().toISOString().slice(0, 10)) : null,
    notes: str(b.notes),
  };
}
const setBillLots = db.transaction((billId, lotIds) => {
  db.prepare('DELETE FROM truck_bill_lots WHERE bill_id = ?').run(billId);
  const ins = db.prepare('INSERT OR IGNORE INTO truck_bill_lots (bill_id, lot_id) VALUES (?, ?)');
  for (const id of [...new Set((lotIds || []).map(Number).filter(Boolean))]) ins.run(billId, id);
});

app.get('/api/truck-bills', auth, (req, res) => res.json(db.prepare(BILL_SELECT + ' ORDER BY b.id DESC').all().map(billOut)));
app.post('/api/truck-bills', auth, (req, res) => {
  const b = req.body || {};
  const v = billValues(b);
  if (!v.truck_company) return res.status(400).json({ error: 'Truck company is required' });
  if (v.date_start && v.date_end && v.date_end < v.date_start) return res.status(400).json({ error: 'End date is before start date' });
  v.bill_no = nextBillNo(); v.created_by = req.user.username;
  const keys = Object.keys(v);
  const r = db.prepare(`INSERT INTO truck_bills (${keys.join(',')}) VALUES (${keys.map(k => '@' + k).join(',')})`).run(v);
  setBillLots(r.lastInsertRowid, b.lot_ids);
  audit(req, 'truck_bills', r.lastInsertRowid, 'create', { ...v, lot_ids: b.lot_ids });
  res.json(billOut(db.prepare(BILL_SELECT + ' WHERE b.id = ?').get(r.lastInsertRowid)));
});
app.put('/api/truck-bills/:id', auth, (req, res) => {
  const old = db.prepare('SELECT * FROM truck_bills WHERE id = ?').get(req.params.id);
  if (!old) return res.status(404).json({ error: 'Not found' });
  const b = req.body || {};
  const v = billValues(b);
  if (!v.truck_company) return res.status(400).json({ error: 'Truck company is required' });
  if (v.date_start && v.date_end && v.date_end < v.date_start) return res.status(400).json({ error: 'End date is before start date' });
  const keys = Object.keys(v);
  db.prepare(`UPDATE truck_bills SET ${keys.map(k => k + ' = @' + k).join(',')}, updated_at = datetime('now') WHERE id = @id`).run({ ...v, id: old.id });
  if (Array.isArray(b.lot_ids)) setBillLots(old.id, b.lot_ids);
  const changes = {};
  for (const k of keys) if (String(old[k] ?? '') !== String(v[k] ?? '')) changes[k] = [old[k], v[k]];
  if (Array.isArray(b.lot_ids)) changes.lot_ids = b.lot_ids;
  audit(req, 'truck_bills', old.id, 'update', changes);
  res.json(billOut(db.prepare(BILL_SELECT + ' WHERE b.id = ?').get(old.id)));
});
app.post('/api/truck-bills/:id/receipts', auth, upload.array('files', 10), (req, res) => {
  const b = db.prepare('SELECT * FROM truck_bills WHERE id = ?').get(req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  if (!req.files || !req.files.length) return res.status(400).json({ error: 'Only images or PDF files (max 15MB)' });
  const list = JSON.parse(b.receipts || '[]').concat(req.files.map(f => f.filename));
  db.prepare('UPDATE truck_bills SET receipts = ? WHERE id = ?').run(JSON.stringify(list), b.id);
  audit(req, 'truck_bills', b.id, 'receipt', { files: req.files.map(f => f.originalname) });
  res.json(billOut(db.prepare(BILL_SELECT + ' WHERE b.id = ?').get(b.id)));
});
app.delete('/api/truck-bills/:id/receipts/:file', auth, (req, res) => {
  const b = db.prepare('SELECT * FROM truck_bills WHERE id = ?').get(req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  const list = JSON.parse(b.receipts || '[]').filter(f => f !== req.params.file);
  db.prepare('UPDATE truck_bills SET receipts = ? WHERE id = ?').run(JSON.stringify(list), b.id);
  audit(req, 'truck_bills', b.id, 'receipt_delete', { file: req.params.file });
  res.json(billOut(db.prepare(BILL_SELECT + ' WHERE b.id = ?').get(b.id)));
});
app.delete('/api/truck-bills/:id', auth, adminOnly, (req, res) => {
  db.prepare('DELETE FROM truck_bills WHERE id = ?').run(req.params.id);
  audit(req, 'truck_bills', +req.params.id, 'delete');
  res.json({ ok: true });
});
app.get('/api/files/:name', auth, (req, res) => {
  const name = path.basename(req.params.name);
  const p = path.join(UPLOAD_DIR, name);
  if (!fs.existsSync(p)) return res.status(404).send('Not found');
  res.sendFile(p);
});

// 地址验证用的 Mapbox token (在 Railway 设环境变量 MAPBOX_TOKEN, 用 pallet 同一个 pk.* token 即可)
app.get('/api/config', auth, (req, res) => res.json({ mapbox_token: process.env.MAPBOX_TOKEN || '' }));

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
    lots: db.prepare('SELECT * FROM lots').all(),
    truck_bills: db.prepare('SELECT * FROM truck_bills').all(),
    truck_bill_lots: db.prepare('SELECT * FROM truck_bill_lots').all(),
  };
  res.setHeader('Content-Disposition', `attachment; filename="liquidation-backup-${dump.exported_at.slice(0, 10)}.json"`);
  res.json(dump);
});

app.get('/healthz', (req, res) => res.send('ok'));
app.get('/vendor/chart.umd.js', (req, res) => res.sendFile(path.join(__dirname, 'node_modules/chart.js/dist/chart.umd.js')));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Bintique Liquidation running on http://localhost:${PORT} (data: ${DATA_DIR})`));
