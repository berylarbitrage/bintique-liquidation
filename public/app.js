// Bintique Liquidation — frontend
// 一拖弃货 = 一条 lot: 成本 (货款+运费+人工+其他) / 卖给谁 / 卖了多少 / 收了多少
'use strict';

// ---------- i18n ----------
const I18N = {
  zh: {
    login_sub: '弃货管理系统', username: '用户名', password: '密码', sign_in: '登录', sign_out: '退出登录',
    dashboard: '总览', lots: '弃货库存', sales: '销售记录', receivables: '待收款', suppliers: '货源', customers: '买家', users: '用户',
    monthly_pl: '每月 销售额 / 成本 / 毛利', lot_status: '货物状态', top_customers: '买家排行 (销售额)', top_suppliers: '货源排行 (毛利)',
    recent_sales: '最近成交', search: '搜索...', export_csv: '导出 CSV', new_lot: '+ 新增一拖', add_supplier: '+ 新增货源', add_customer: '+ 新增买家', add_user: '+ 新增用户',
    th_lot: '批次号', th_desc: '货物描述', th_customer: '卖给', th_supplier: '货源', th_sale: '成交价', th_cost: '总成本', th_profit: '毛利', th_margin: '毛利率',
    th_sold_date: '成交日期', th_acq_date: '进货日期', th_qty: '数量', th_status: '状态', th_asking: '标价', th_received: '已收', th_balance: '未收', th_payment: '收款', th_category: '品类', th_location: '仓位', th_days: '库龄(天)',
    display_name: '名称', role: '角色', created: '创建时间', contact: '联系人', phone: '电话', email: '邮箱', address: '地址', notes: '备注', name: '名称',
    loads_bought: '进货拖数', loads_sold: '已售拖数', total_spent: '进货总额', total_revenue: '销售总额',
    backup_title: '下载完整备份', backup_desc: '把所有货源、买家和弃货批次导出成 JSON 文件。', download_backup: '下载备份',
    all_time: '全部年份', all_months: '全部月份', all_status: '全部状态', all_suppliers: '全部货源', all_customers: '全部买家',
    st_in_stock: '在库', st_listed: '已挂售', st_sold: '已售', st_cancelled: '作废',
    pay_paid: '已收清', pay_partial: '部分收款', pay_unpaid: '未收款',
    lt_pallet: '板 (Pallet)', lt_truckload: '车 (Truckload)', lt_box: '箱 (Box)', lt_gaylord: 'Gaylord',
    s_inventory: '在库拖数', s_inv_cost: '库存成本', s_sold: '售出拖数', s_revenue: '销售额', s_cogs: '售出成本', s_profit: '毛利', s_margin: '毛利率', s_ar: '待收款', s_avg_profit: '平均每拖毛利',
    sec_basic: '基本信息', sec_cost: '进货 / 成本 (我们的成本)', sec_sale: '销售 (卖给谁 / 卖多少钱)', sec_history: '修改记录',
    f_lot_no: '批次号 (留空自动生成)', f_title: '货物描述', f_category: '品类', f_load_type: '单位', f_qty: '数量', f_location: '仓位',
    f_supplier: '货源', f_acq_date: '进货日期', f_purchase: '货款', f_freight: '运费', f_labor: '人工/装卸', f_other: '其他成本',
    f_status: '状态', f_asking: '标价 (一拖卖多少)', f_customer: '买家', f_sold_date: '成交日期', f_sale_price: '成交价', f_received: '已收金额', f_pay_method: '收款方式',
    total_cost: '总成本', expected_profit: '预计毛利', profit: '毛利', margin: '毛利率', balance: '未收',
    save: '保存', cancel: '取消', delete: '删除', sell: '卖出', receive: '收款', edit: '编辑', none: '— 无 —', new_party: '+ 新建…',
    confirm_delete: '确定删除？此操作不可恢复。', saved: '已保存', deleted: '已删除', no_data: '暂无数据',
    receive_amount: '本次收款金额', new_password: '新密码 (留空不改)', admin: '管理员', staff: '员工', edit_lot: '编辑弃货', new_lot_title: '新增一拖弃货',
    sec_pay: '付款', f_tb_method: '付款方式',
    trucks: '卡车账单', add_truck_bill: '+ 新增卡车账单', new_truck_bill: '新增卡车账单', edit_truck_bill: '编辑卡车账单',
    th_bill: '账单号', th_truck_co: '卡车公司', th_dates: '用车日期', th_amount: '金额', th_purpose: '用途', th_lots: '关联弃货', th_paid_by: '付款人', th_invoice: '对方 Invoice', th_receipt: '收据',
    tp_pickup: '进货提货', tp_delivery: '送货', tp_other: '其他', tb_unpaid: '未付', tb_paid: '已付', all_companies: '全部卡车公司', all_purposes: '全部用途',
    f_truck_co: '卡车公司', f_state: '州', f_date_start: '开始日期', f_date_end: '结束日期', f_amount: '金额', f_purpose: '用途', f_invoice: '对方 Invoice #', f_paid_by: '付款人', f_paid_date: '付款日期', f_tb_status: '付款状态',
    f_link_lots: '关联哪几拖货 (金额平摊进这几拖的成本)', per_lot: '每拖分摊', receipts: '收据 / 发票', upload: '上传', unallocated: '未关联弃货, 不计入任何一拖成本',
    f_truck_cost: '卡车费 (来自卡车账单)', s_truck: '卡车费用', s_truck_unpaid: '未付卡车费', truck_unalloc: '未分摊卡车费', save_first: '先保存账单再上传收据',
    sec_address: '地址', ship_addr: '收货地址 (Shipping)', bill_addr: '账单地址 (Billing)', pickup_addr: '提货地址 (Pickup)', bill_same: '账单地址与收货地址相同', bill_same_sup: '账单地址与提货地址相同',
    addr1: '地址 1', addr2: '地址 2 (可选)', city: '城市', zip: '邮编', verify: '验证', verified: '已验证', unverified: '未验证', verifying: '验证中...', addr_not_found: '找不到这个地址', select_match: '个匹配, 请选择:', net_err: '网络错误',
    need_verify: '请先验证所有地址 / Please verify all addresses', need_ship: '送货的买家必须填收货地址',
    delivery_method: '送货方式', dm_delivery: '送货', dm_pickup: '自提', f_fulfillment: '送货 / 自提', f_delivery_date: '送货日期', f_delivery_addr: '送货地址', th_fulfillment: '送货/自提', th_location_city: '城市 / 州',
  },
  en: {
    login_sub: 'Liquidation Management System', username: 'Username', password: 'Password', sign_in: 'Sign In', sign_out: 'Sign Out',
    dashboard: 'Dashboard', lots: 'Inventory', sales: 'Sales', receivables: 'Receivables', suppliers: 'Suppliers', customers: 'Customers', users: 'Users',
    monthly_pl: 'Monthly Revenue / Cost / Profit', lot_status: 'Load Status', top_customers: 'Top Customers (Revenue)', top_suppliers: 'Top Suppliers (Profit)',
    recent_sales: 'Recent Sales', search: 'Search...', export_csv: 'Export CSV', new_lot: '+ New Load', add_supplier: '+ Add Supplier', add_customer: '+ Add Customer', add_user: '+ Add User',
    th_lot: 'Lot #', th_desc: 'Description', th_customer: 'Sold To', th_supplier: 'Supplier', th_sale: 'Sale Price', th_cost: 'Total Cost', th_profit: 'Profit', th_margin: 'Margin',
    th_sold_date: 'Sold Date', th_acq_date: 'Acquired', th_qty: 'Qty', th_status: 'Status', th_asking: 'Asking', th_received: 'Received', th_balance: 'Balance', th_payment: 'Payment', th_category: 'Category', th_location: 'Location', th_days: 'Days in Stock',
    display_name: 'Name', role: 'Role', created: 'Created', contact: 'Contact', phone: 'Phone', email: 'Email', address: 'Address', notes: 'Notes', name: 'Name',
    loads_bought: 'Loads Bought', loads_sold: 'Loads Sold', total_spent: 'Total Spent', total_revenue: 'Total Revenue',
    backup_title: 'Download a full backup', backup_desc: 'Exports all suppliers, customers and loads as a JSON file.', download_backup: 'Download Backup',
    all_time: 'All Years', all_months: 'All Months', all_status: 'All Status', all_suppliers: 'All Suppliers', all_customers: 'All Customers',
    st_in_stock: 'In Stock', st_listed: 'Listed', st_sold: 'Sold', st_cancelled: 'Cancelled',
    pay_paid: 'Paid', pay_partial: 'Partial', pay_unpaid: 'Unpaid',
    lt_pallet: 'Pallet', lt_truckload: 'Truckload', lt_box: 'Box', lt_gaylord: 'Gaylord',
    s_inventory: 'Loads In Stock', s_inv_cost: 'Inventory Cost', s_sold: 'Loads Sold', s_revenue: 'Revenue', s_cogs: 'Cost of Sold', s_profit: 'Gross Profit', s_margin: 'Margin', s_ar: 'Receivable', s_avg_profit: 'Avg Profit / Load',
    sec_basic: 'Basic Info', sec_cost: 'Purchase / Our Cost', sec_sale: 'Sale (Who bought / How much)', sec_history: 'History',
    f_lot_no: 'Lot # (blank = auto)', f_title: 'Description', f_category: 'Category', f_load_type: 'Unit', f_qty: 'Quantity', f_location: 'Location',
    f_supplier: 'Supplier', f_acq_date: 'Acquired Date', f_purchase: 'Purchase Cost', f_freight: 'Freight', f_labor: 'Labor / Handling', f_other: 'Other Cost',
    f_status: 'Status', f_asking: 'Asking Price (per load)', f_customer: 'Customer', f_sold_date: 'Sold Date', f_sale_price: 'Sale Price', f_received: 'Amount Received', f_pay_method: 'Payment Method',
    total_cost: 'Total Cost', expected_profit: 'Expected Profit', profit: 'Profit', margin: 'Margin', balance: 'Balance',
    save: 'Save', cancel: 'Cancel', delete: 'Delete', sell: 'Sell', receive: 'Receive', edit: 'Edit', none: '— None —', new_party: '+ New…',
    confirm_delete: 'Delete this? This cannot be undone.', saved: 'Saved', deleted: 'Deleted', no_data: 'No data',
    receive_amount: 'Amount received now', new_password: 'New password (blank = keep)', admin: 'Admin', staff: 'Staff', edit_lot: 'Edit Load', new_lot_title: 'New Liquidation Load',
    sec_pay: 'Payment', f_tb_method: 'Payment Method',
    trucks: 'Truck Bills', add_truck_bill: '+ Add Truck Bill', new_truck_bill: 'New Truck Bill', edit_truck_bill: 'Edit Truck Bill',
    th_bill: 'Bill #', th_truck_co: 'Truck Company', th_dates: 'Dates', th_amount: 'Amount', th_purpose: 'Purpose', th_lots: 'Linked Loads', th_paid_by: 'Paid By', th_invoice: 'Their Invoice', th_receipt: 'Receipt',
    tp_pickup: 'Pickup (buying)', tp_delivery: 'Delivery', tp_other: 'Other', tb_unpaid: 'Unpaid', tb_paid: 'Paid', all_companies: 'All Companies', all_purposes: 'All Purposes',
    f_truck_co: 'Truck Company', f_state: 'State', f_date_start: 'Start Date', f_date_end: 'End Date', f_amount: 'Amount', f_purpose: 'Purpose', f_invoice: 'Their Invoice #', f_paid_by: 'Paid By', f_paid_date: 'Paid Date', f_tb_status: 'Payment Status',
    f_link_lots: 'Linked loads (amount is split evenly into their cost)', per_lot: 'Per load', receipts: 'Receipts / Invoices', upload: 'Upload', unallocated: 'Not linked to any load — not in any load cost',
    f_truck_cost: 'Truck cost (from truck bills)', s_truck: 'Truck Cost', s_truck_unpaid: 'Unpaid Truck Bills', truck_unalloc: 'Unallocated Truck Cost', save_first: 'Save the bill first, then upload receipts',
    sec_address: 'Address', ship_addr: 'Shipping Address', bill_addr: 'Billing Address', pickup_addr: 'Pickup Address', bill_same: 'Billing Address same as Shipping Address', bill_same_sup: 'Billing Address same as Pickup Address',
    addr1: 'Address 1', addr2: 'Address 2 (optional)', city: 'City', zip: 'Zipcode', verify: 'Verify', verified: 'Verified', unverified: 'Unverified', verifying: 'Verifying...', addr_not_found: 'Address not found', select_match: 'matches, select:', net_err: 'Network error',
    need_verify: 'Please verify all addresses before saving', need_ship: 'Delivery customers need a shipping address',
    delivery_method: 'Delivery Method', dm_delivery: 'Delivery', dm_pickup: 'Customer Pickup', f_fulfillment: 'Delivery / Pickup', f_delivery_date: 'Delivery Date', f_delivery_addr: 'Delivery Address', th_fulfillment: 'Delivery/Pickup', th_location_city: 'City / State',
  },
};
let LANG = 'zh';
try { LANG = localStorage.getItem('liq_lang') || 'zh'; } catch (e) {}
const t = k => (I18N[LANG] && I18N[LANG][k]) || I18N.en[k] || k;
function setLang(l) {
  LANG = l; try { localStorage.setItem('liq_lang', l); } catch (e) {}
  applyLang();
  if (currentUser) refreshAll();
}
function applyLang() {
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
  document.querySelectorAll('[data-ph]').forEach(el => { el.placeholder = t(el.dataset.ph); });
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('on', b.dataset.lang === LANG));
}

// ---------- utils ----------
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => (n < 0 ? '-$' : '$') + Math.abs(+n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money0 = n => (n < 0 ? '-$' : '$') + Math.abs(Math.round(+n || 0)).toLocaleString('en-US');
const pct = n => isFinite(n) ? (n * 100).toFixed(1) + '%' : '—';
const today = () => new Date().toISOString().slice(0, 10);
const plCls = n => n > 0 ? 'pos' : n < 0 ? 'neg' : '';
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = 'toast toast-' + type;
  el.innerHTML = `<span>${esc(msg)}</span><span class="toast-close" onclick="this.parentNode.remove()">&times;</span>`;
  $('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}
async function api(url, opts = {}) {
  const r = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) }, body: opts.body ? JSON.stringify(opts.body) : undefined });
  if (r.status === 401 && url !== '/api/login') { showLogin(); throw new Error('Not signed in'); }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || ('HTTP ' + r.status));
  return d;
}

// derived fields per lot
function calc(l) {
  const cost = (+l.purchase_cost || 0) + (+l.freight_cost || 0) + (+l.labor_cost || 0) + (+l.other_cost || 0) + (+l.truck_cost || 0);
  const sold = l.status === 'sold';
  const sale = +l.sale_price || 0;
  const profit = sold ? sale - cost : null;
  const margin = sold && sale ? profit / sale : NaN;
  const received = +l.amount_received || 0;
  const balance = sold ? sale - received : 0;
  const pay = !sold ? null : balance <= 0.005 ? 'paid' : received > 0 ? 'partial' : 'unpaid';
  const days = l.acquired_date ? Math.floor(((sold && l.sold_date ? new Date(l.sold_date) : new Date()) - new Date(l.acquired_date)) / 864e5) : null;
  return { cost, sale, profit, margin, received, balance, pay, days };
}
const statusBadge = s => `<span class="badge badge-${s}">${esc(t('st_' + s))}</span>`;
const payBadge = p => p ? `<span class="badge badge-${p}">${esc(t('pay_' + p))}</span>` : '';
const chip = (label, val) => `<span class="chip">${esc(label)} <b>${val}</b></span>`;

// ---------- state ----------
let currentUser = null;
let LOTS = [], SUPPLIERS = [], CUSTOMERS = [], TRUCKS = [];
let CONFIG = {};
const charts = {};

// ---------- auth ----------
async function doLogin() {
  const username = $('login-user').value.trim(), password = $('login-pass').value;
  const btn = $('login-btn'), err = $('login-err');
  if (!username || !password) { err.textContent = t('username') + ' / ' + t('password') + '?'; return; }
  btn.disabled = true; err.textContent = '';
  try {
    currentUser = await api('/api/login', { method: 'POST', body: { username, password } });
    showApp();
  } catch (e) { err.textContent = e.message; }
  btn.disabled = false;
}
async function doLogout() {
  await fetch('/api/logout', { method: 'POST' }).catch(() => {});
  currentUser = null; showLogin();
}
function showLogin() {
  $('app').style.display = 'none';
  $('login-overlay').style.display = 'flex';
  $('login-pass').value = '';
}
function showApp() {
  $('login-overlay').style.display = 'none';
  $('app').style.display = 'flex';
  $('user-display').textContent = currentUser.display_name || currentUser.username;
  $('user-role').textContent = t(currentUser.role);
  document.querySelectorAll('.admin-only').forEach(el => el.style.display = currentUser.role === 'admin' ? '' : 'none');
  const tab = (location.hash || '').slice(1);
  switchTab(document.querySelector(`.sidebar nav a[data-tab="${tab}"]`) ? tab : 'dashboard');
  refreshAll();
}
$('login-pass').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
$('login-user').addEventListener('keydown', e => { if (e.key === 'Enter') $('login-pass').focus(); });

// ---------- nav ----------
function switchTab(tab) {
  document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.toggle('active', a.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(el => el.classList.toggle('active', el.id === 'tab-' + tab));
  history.replaceState(null, '', '#' + tab);
  if (tab === 'users') loadUsers();
  closeMobileNav();
}
document.querySelectorAll('.sidebar nav a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); switchTab(a.dataset.tab); }));
function toggleMobileNav() { $('sideNav').classList.toggle('open'); $('navOverlay').classList.toggle('show'); }
function closeMobileNav() { $('sideNav').classList.remove('open'); $('navOverlay').classList.remove('show'); }

// ---------- data ----------
async function refreshAll() {
  try {
    [LOTS, SUPPLIERS, CUSTOMERS, TRUCKS, CONFIG] = await Promise.all([api('/api/lots'), api('/api/suppliers'), api('/api/customers'), api('/api/truck-bills'), api('/api/config')]);
  } catch (e) { if (e.message !== 'Not signed in') toast(e.message, 'error'); return; }
  fillFilters();
  renderDashboard(); renderLots(); renderSales(); renderReceivables(); renderTruckBills();
  renderParties('suppliers'); renderParties('customers');
}
function setOptions(sel, opts, keep = true) {
  const el = $(sel), prev = el.value;
  el.innerHTML = opts.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('');
  if (keep && [...el.options].some(o => o.value === prev)) el.value = prev;
}
function fillFilters() {
  const years = [...new Set(LOTS.map(l => (l.sold_date || l.acquired_date || '').slice(0, 4)).filter(Boolean))].sort().reverse();
  setOptions('dash-year', [['', t('all_time')], ...years.map(y => [y, y])]);
  setOptions('dash-month', [['', t('all_months')], ...Array.from({ length: 12 }, (_, i) => [String(i + 1), `${i + 1}月 / ${new Date(2000, i).toLocaleString('en', { month: 'short' })}`])]);
  setOptions('lot-status', [['', t('all_status')], ['open', t('st_in_stock') + ' + ' + t('st_listed')], ...['in_stock', 'listed', 'sold', 'cancelled'].map(s => [s, t('st_' + s)])]);
  setOptions('lot-supplier', [['', t('all_suppliers')], ...SUPPLIERS.map(s => [s.id, s.name])]);
  setOptions('sale-customer', [['', t('all_customers')], ...CUSTOMERS.map(c => [c.id, c.name])]);
  setOptions('ar-customer', [['', t('all_customers')], ...CUSTOMERS.map(c => [c.id, c.name])]);
  setOptions('tb-status', [['', t('all_status')], ['unpaid', t('tb_unpaid')], ['paid', t('tb_paid')]]);
  setOptions('tb-company', [['', t('all_companies')], ...truckCompanies().map(c => [c, c])]);
  setOptions('tb-purpose', [['', t('all_purposes')], ...['pickup', 'delivery', 'other'].map(k => [k, t('tp_' + k)])]);
}

// ---------- dashboard ----------
function inPeriod(d) {
  const y = $('dash-year').value, m = $('dash-month').value;
  if (!d) return !y && !m;
  if (y && d.slice(0, 4) !== y) return false;
  if (m && +d.slice(5, 7) !== +m) return false;
  return true;
}
function renderDashboard() {
  const active = LOTS.filter(l => l.status !== 'cancelled');
  const stock = active.filter(l => l.status === 'in_stock' || l.status === 'listed');
  const sold = active.filter(l => l.status === 'sold' && inPeriod(l.sold_date));
  const sum = (arr, f) => arr.reduce((a, l) => a + f(calc(l)), 0);
  const rev = sum(sold, c => c.sale), cogs = sum(sold, c => c.cost), profit = rev - cogs;
  const ar = sum(active.filter(l => l.status === 'sold'), c => Math.max(0, c.balance));
  const qty = arr => arr.reduce((a, l) => a + (+l.quantity || 0), 0);
  const cards = [
    [t('s_inventory'), qty(stock).toLocaleString(), ''],
    [t('s_inv_cost'), money0(sum(stock, c => c.cost)), 'orange'],
    [t('s_sold'), qty(sold).toLocaleString(), ''],
    [t('s_revenue'), money0(rev), ''],
    [t('s_cogs'), money0(cogs), 'orange'],
    [t('s_profit'), money0(profit), profit >= 0 ? 'green' : 'red'],
    [t('s_margin'), rev ? pct(profit / rev) : '—', profit >= 0 ? 'green' : 'red'],
    [t('s_avg_profit'), sold.length ? money0(profit / sold.length) : '—', ''],
    [t('s_ar'), money0(ar), ar > 0 ? 'red' : 'green'],
    [t('s_truck'), money0(TRUCKS.filter(b => inPeriod(b.date_start)).reduce((a, b) => a + (+b.amount || 0), 0)), 'orange'],
    [t('s_truck_unpaid'), money0(TRUCKS.filter(b => b.status !== 'paid').reduce((a, b) => a + (+b.amount || 0), 0)), 'red'],
  ];
  const unalloc = TRUCKS.filter(b => !b.lots.length && inPeriod(b.date_start)).reduce((a, b) => a + (+b.amount || 0), 0);
  if (unalloc) cards.push([t('truck_unalloc'), money0(unalloc), 'red']);
  $('stats-grid').innerHTML = cards.map(([l, v, c]) => `<div class="stat-card"><div class="label">${esc(l)}</div><div class="value ${c}">${v}</div></div>`).join('');

  // monthly (last 12 months that have data, or chosen year)
  const byMonth = {};
  for (const l of active.filter(l => l.status === 'sold' && l.sold_date)) {
    const y = $('dash-year').value; if (y && l.sold_date.slice(0, 4) !== y) continue;
    const k = l.sold_date.slice(0, 7), c = calc(l);
    byMonth[k] = byMonth[k] || { rev: 0, cost: 0 };
    byMonth[k].rev += c.sale; byMonth[k].cost += c.cost;
  }
  const months = Object.keys(byMonth).sort().slice(-12);
  drawChart('chart-monthly', {
    type: 'bar',
    data: { labels: months, datasets: [
      { label: t('s_revenue'), data: months.map(m => byMonth[m].rev), backgroundColor: '#8B6914' },
      { label: t('s_cogs'), data: months.map(m => byMonth[m].cost), backgroundColor: '#e67e22' },
      { label: t('s_profit'), data: months.map(m => byMonth[m].rev - byMonth[m].cost), backgroundColor: '#12B76A' },
    ] },
    options: { maintainAspectRatio: false, plugins: { legend: { labels: { boxWidth: 10, font: { size: 10 } } } }, scales: { y: { ticks: { callback: v => money0(v), font: { size: 10 } } }, x: { ticks: { font: { size: 10 } } } } },
  });
  const sts = ['in_stock', 'listed', 'sold', 'cancelled'];
  drawChart('chart-status', {
    type: 'doughnut',
    data: { labels: sts.map(s => t('st_' + s)), datasets: [{ data: sts.map(s => LOTS.filter(l => l.status === s).length), backgroundColor: ['#0ea5e9', '#F79009', '#12B76A', '#98a2b3'] }] },
    options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } },
  });
  const top = (key, nameKey, val) => {
    const m = {};
    for (const l of sold) { if (!l[key]) continue; m[l[nameKey]] = (m[l[nameKey]] || 0) + val(calc(l)); }
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 8);
  };
  const hbar = (id, rows, color) => drawChart(id, {
    type: 'bar', data: { labels: rows.map(r => r[0]), datasets: [{ data: rows.map(r => r[1]), backgroundColor: color }] },
    options: { indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { callback: v => money0(v), font: { size: 10 } } }, y: { ticks: { font: { size: 10 } } } } },
  });
  hbar('chart-customers', top('customer_id', 'customer_name', c => c.sale), '#8B6914');
  hbar('chart-suppliers', top('supplier_id', 'supplier_name', c => c.profit), '#12B76A');

  const recent = sold.slice().sort((a, b) => (b.sold_date || '').localeCompare(a.sold_date || '')).slice(0, 15);
  $('recent-sales').innerHTML = recent.length ? recent.map(l => {
    const c = calc(l);
    return `<tr onclick="openLotModal(${l.id})"><td class="tdn">${esc(l.lot_no)}</td><td>${esc(l.title || '')}</td><td>${esc(l.customer_name || '—')}</td><td class="num">${money(c.sale)}</td><td class="num">${money(c.cost)}</td><td class="num ${plCls(c.profit)}">${money(c.profit)}</td><td>${esc(l.sold_date || '')}</td></tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="7">${t('no_data')}</td></tr>`;
}
function drawChart(id, cfg) {
  if (typeof Chart === 'undefined') return;
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart($(id), cfg);
}

// ---------- sortable tables ----------
const sortState = {};
function thead(id, cols, table, rerender) {
  const s = sortState[table] || {};
  $(id).innerHTML = '<tr>' + cols.map(c => {
    const arrow = s.key === c.key ? (s.dir > 0 ? ' ▲' : ' ▼') : '';
    return c.key ? `<th class="sortable ${c.num ? 'num' : ''}" onclick="sortBy('${table}','${c.key}',${rerender})">${esc(t(c.t) || c.t)}${arrow}</th>` : `<th class="${c.num ? 'num' : ''}">${esc(c.t ? t(c.t) : '')}</th>`;
  }).join('') + '</tr>';
}
function sortBy(table, key, rerender) {
  const s = sortState[table] || {};
  sortState[table] = { key, dir: s.key === key ? -s.dir : 1 };
  rerender();
}
function applySort(table, rows, getters) {
  const s = sortState[table]; if (!s || !getters[s.key]) return rows;
  const g = getters[s.key];
  return rows.slice().sort((a, b) => { const x = g(a), y = g(b); return (x > y ? 1 : x < y ? -1 : 0) * s.dir; });
}
const GET = {
  lot_no: l => l.lot_no || '', title: l => (l.title || '').toLowerCase(), supplier: l => (l.supplier_name || '').toLowerCase(), customer: l => (l.customer_name || '').toLowerCase(),
  acq: l => l.acquired_date || '', sold: l => l.sold_date || '', qty: l => +l.quantity || 0, cost: l => calc(l).cost, asking: l => +l.asking_price || 0,
  sale: l => calc(l).sale, profit: l => calc(l).profit ?? -Infinity, margin: l => { const m = calc(l).margin; return isFinite(m) ? m : -Infinity; },
  received: l => calc(l).received, balance: l => calc(l).balance, status: l => l.status, days: l => calc(l).days ?? -1,
};
function matches(l, q) {
  if (!q) return true;
  q = q.toLowerCase();
  return [l.lot_no, l.title, l.category, l.supplier_name, l.customer_name, l.location, l.notes].some(v => (v || '').toLowerCase().includes(q));
}

// ---------- inventory ----------
function renderLots() {
  const q = $('lot-search').value.trim(), st = $('lot-status').value, sup = $('lot-supplier').value;
  let rows = LOTS.filter(l => matches(l, q) && (!sup || String(l.supplier_id) === sup) &&
    (!st || (st === 'open' ? (l.status === 'in_stock' || l.status === 'listed') : l.status === st)));
  thead('lot-thead', [
    { t: 'th_lot', key: 'lot_no' }, { t: 'th_desc', key: 'title' }, { t: 'th_supplier', key: 'supplier' }, { t: 'th_acq_date', key: 'acq' },
    { t: 'th_qty', key: 'qty', num: 1 }, { t: 'th_cost', key: 'cost', num: 1 }, { t: 'th_asking', key: 'asking', num: 1 },
    { t: 'th_status', key: 'status' }, { t: 'th_customer', key: 'customer' }, { t: 'th_sale', key: 'sale', num: 1 }, { t: 'th_profit', key: 'profit', num: 1 },
    { t: 'th_days', key: 'days', num: 1 }, { t: '' },
  ], 'lots', 'renderLots');
  rows = applySort('lots', rows, GET);
  const open = rows.filter(l => l.status === 'in_stock' || l.status === 'listed');
  $('lot-stats').innerHTML = chip(t('st_in_stock') + '+' + t('st_listed'), open.length) + chip(t('s_inv_cost'), money0(open.reduce((a, l) => a + calc(l).cost, 0))) + chip(t('s_sold'), rows.filter(l => l.status === 'sold').length);
  $('lot-tbody').innerHTML = rows.length ? rows.map(l => {
    const c = calc(l);
    const unit = l.quantity + ' ' + t('lt_' + (l.load_type || 'pallet')).split(' ')[0];
    const act = (l.status === 'in_stock' || l.status === 'listed')
      ? `<button class="btn btn-grn btn-sm" onclick="event.stopPropagation();openLotModal(${l.id},true)">${t('sell')}</button>` : '';
    return `<tr onclick="openLotModal(${l.id})">
      <td class="tdn">${esc(l.lot_no)}</td>
      <td><div class="tdn" style="font-weight:500">${esc(l.title || '')}</div>${l.category ? `<div class="tdct">${esc(l.category)}</div>` : ''}</td>
      <td>${esc(l.supplier_name || '—')}</td><td>${esc(l.acquired_date || '')}</td>
      <td class="num">${esc(unit)}</td><td class="num">${money(c.cost)}</td><td class="num">${l.asking_price ? money(l.asking_price) : '—'}</td>
      <td>${statusBadge(l.status)}</td><td>${esc(l.customer_name || '')}${l.fulfillment ? `<div class="tdct">${esc(t('dm_' + l.fulfillment))}${l.delivery_date ? ' · ' + esc(l.delivery_date) : ''}</div>` : ''}</td>
      <td class="num">${l.status === 'sold' ? money(c.sale) : ''}</td>
      <td class="num ${plCls(c.profit)}">${c.profit !== null ? money(c.profit) : ''}</td>
      <td class="num">${c.days ?? ''}</td><td>${act}</td></tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="13">${t('no_data')}</td></tr>`;
}
function csv(name, header, rows) {
  const q = v => { v = v ?? ''; v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  const blob = new Blob(['﻿' + [header, ...rows].map(r => r.map(q).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${name}-${today()}.csv`; a.click();
}
function exportLots() {
  csv('liquidation-loads', ['Lot #', 'Description', 'Category', 'Unit', 'Qty', 'Supplier', 'Acquired', 'Purchase', 'Freight', 'Labor', 'Other', 'Truck (bills)', 'Total Cost', 'Asking', 'Status', 'Customer', 'Sold Date', 'Sale Price', 'Profit', 'Received', 'Balance', 'Location', 'Notes'],
    LOTS.map(l => { const c = calc(l); return [l.lot_no, l.title, l.category, l.load_type, l.quantity, l.supplier_name, l.acquired_date, l.purchase_cost, l.freight_cost, l.labor_cost, l.other_cost, (+l.truck_cost || 0).toFixed(2), c.cost.toFixed(2), l.asking_price, l.status, l.customer_name, l.sold_date, l.status === 'sold' ? c.sale : '', c.profit !== null ? c.profit.toFixed(2) : '', c.received, c.balance.toFixed(2), l.location, l.notes]; }));
}

// ---------- sales ----------
function salesRows() {
  const q = $('sale-search').value.trim(), cu = $('sale-customer').value, f = $('sale-from').value, to = $('sale-to').value;
  return LOTS.filter(l => l.status === 'sold' && matches(l, q) && (!cu || String(l.customer_id) === cu) &&
    (!f || (l.sold_date || '') >= f) && (!to || (l.sold_date || '') <= to));
}
function renderSales() {
  thead('sale-thead', [
    { t: 'th_sold_date', key: 'sold' }, { t: 'th_lot', key: 'lot_no' }, { t: 'th_desc', key: 'title' }, { t: 'th_customer', key: 'customer' }, { t: 'th_supplier', key: 'supplier' },
    { t: 'th_qty', key: 'qty', num: 1 }, { t: 'th_sale', key: 'sale', num: 1 }, { t: 'th_cost', key: 'cost', num: 1 }, { t: 'th_profit', key: 'profit', num: 1 }, { t: 'th_margin', key: 'margin', num: 1 },
    { t: 'th_received', key: 'received', num: 1 }, { t: 'th_payment' },
  ], 'sales', 'renderSales');
  if (!sortState.sales) sortState.sales = { key: 'sold', dir: -1 };
  const rows = applySort('sales', salesRows(), GET);
  let tr = 0, tc = 0, trc = 0, tq = 0;
  $('sale-tbody').innerHTML = rows.length ? rows.map(l => {
    const c = calc(l); tr += c.sale; tc += c.cost; trc += c.received; tq += +l.quantity || 0;
    return `<tr onclick="openLotModal(${l.id})"><td>${esc(l.sold_date || '')}</td><td class="tdn">${esc(l.lot_no)}</td><td>${esc(l.title || '')}</td>
      <td><div class="tdn" style="font-weight:600">${esc(l.customer_name || '—')}</div>${l.fulfillment ? `<div class="tdct">${esc(t('dm_' + l.fulfillment))}${l.delivery_address ? ' · ' + esc(l.delivery_address) : ''}</div>` : ''}</td><td>${esc(l.supplier_name || '—')}</td><td class="num">${esc(l.quantity)}</td>
      <td class="num">${money(c.sale)}</td><td class="num">${money(c.cost)}</td><td class="num ${plCls(c.profit)}">${money(c.profit)}</td><td class="num">${pct(c.margin)}</td>
      <td class="num">${money(c.received)}</td><td>${payBadge(c.pay)}</td></tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="12">${t('no_data')}</td></tr>`;
  const tp = tr - tc;
  $('sale-tfoot').innerHTML = rows.length ? `<tr><td colspan="5">${rows.length} ${LANG === 'zh' ? '笔' : 'sales'}</td><td class="num">${tq}</td><td class="num">${money(tr)}</td><td class="num">${money(tc)}</td><td class="num ${plCls(tp)}">${money(tp)}</td><td class="num">${tr ? pct(tp / tr) : '—'}</td><td class="num">${money(trc)}</td><td></td></tr>` : '';
  $('sale-stats').innerHTML = chip(t('s_revenue'), money0(tr)) + chip(t('s_profit'), money0(tp)) + chip(t('s_margin'), tr ? pct(tp / tr) : '—');
}
function exportSales() {
  csv('liquidation-sales', ['Sold Date', 'Lot #', 'Description', 'Customer', 'Supplier', 'Qty', 'Sale Price', 'Total Cost', 'Profit', 'Margin', 'Received', 'Balance', 'Payment Method', 'Delivery/Pickup', 'Delivery Address', 'Delivery Date'],
    applySort('sales', salesRows(), GET).map(l => { const c = calc(l); return [l.sold_date, l.lot_no, l.title, l.customer_name, l.supplier_name, l.quantity, c.sale, c.cost.toFixed(2), c.profit.toFixed(2), isFinite(c.margin) ? (c.margin * 100).toFixed(1) + '%' : '', c.received, c.balance.toFixed(2), l.payment_method, l.fulfillment, l.delivery_address, l.delivery_date]; }));
}

// ---------- receivables ----------
function renderReceivables() {
  const cu = $('ar-customer').value;
  const all = LOTS.filter(l => l.status === 'sold' && calc(l).balance > 0.005);
  const rows = all.filter(l => !cu || String(l.customer_id) === cu).sort((a, b) => (a.sold_date || '').localeCompare(b.sold_date || ''));
  const badge = $('ar-badge'); badge.textContent = all.length; badge.style.display = all.length ? '' : 'none';
  thead('ar-thead', [{ t: 'th_sold_date' }, { t: 'th_lot' }, { t: 'th_customer' }, { t: 'th_sale', num: 1 }, { t: 'th_received', num: 1 }, { t: 'th_balance', num: 1 }, { t: 'th_days', num: 1 }, { t: '' }], 'ar', 'renderReceivables');
  const total = rows.reduce((a, l) => a + calc(l).balance, 0);
  $('ar-stats').innerHTML = chip(t('s_ar'), money(total)) + chip('#', rows.length);
  $('ar-tbody').innerHTML = rows.length ? rows.map(l => {
    const c = calc(l), age = l.sold_date ? Math.floor((Date.now() - new Date(l.sold_date)) / 864e5) : '';
    return `<tr onclick="openLotModal(${l.id})"><td>${esc(l.sold_date || '')}</td><td class="tdn">${esc(l.lot_no)}</td><td class="tdn" style="font-weight:600">${esc(l.customer_name || '—')}</td>
      <td class="num">${money(c.sale)}</td><td class="num">${money(c.received)}</td><td class="num neg">${money(c.balance)}</td><td class="num">${age}</td>
      <td><button class="btn btn-grn btn-sm" onclick="event.stopPropagation();openReceive(${l.id})">${t('receive')}</button></td></tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="8">${t('no_data')}</td></tr>`;
}
function openReceive(id) {
  const l = LOTS.find(x => x.id === id), c = calc(l);
  openModal(`${t('receive')} — ${esc(l.lot_no)}`, `
    <div class="modal-row"><div class="modal-field"><span class="modal-label">${t('th_customer')}</span><div>${esc(l.customer_name || '—')}</div></div>
    <div class="modal-field"><span class="modal-label">${t('balance')}</span><div class="neg">${money(c.balance)}</div></div></div>
    <div class="modal-row"><div class="modal-field"><span class="modal-label">${t('receive_amount')}</span><input class="modal-input" id="rcv-amt" type="number" step="0.01" value="${c.balance.toFixed(2)}"/></div>
    <div class="modal-field"><span class="modal-label">${t('f_pay_method')}</span><input class="modal-input" id="rcv-method" list="pay-methods" value="${esc(l.payment_method || '')}"/></div></div>
    ${payMethodsList()}
    <div class="modal-actions"><button class="btn-cancel" onclick="closeModal()">${t('cancel')}</button><button class="btn-save" onclick="saveReceive(${id})">${t('save')}</button></div>`, 460);
}
async function saveReceive(id) {
  try {
    await api(`/api/lots/${id}/payment`, { method: 'POST', body: { amount: $('rcv-amt').value, method: $('rcv-method').value } });
    closeModal(); toast(t('saved')); refreshAll();
  } catch (e) { toast(e.message, 'error'); }
}
const payMethodsList = () => `<datalist id="pay-methods"><option>Cash</option><option>Zelle</option><option>Check</option><option>Wire / ACH</option><option>Venmo</option><option>Credit Card</option></datalist>`;

// ---------- lot modal ----------
function openModal(title, html, width = 720) {
  $('modal-title').innerHTML = title; $('modal-body').innerHTML = html;
  $('modal-box').style.width = width + 'px';
  $('modal').classList.add('open');
}
function closeModal() { $('modal').classList.remove('open'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

const field = (label, inner, full) => `<div class="modal-field${full ? ' full' : ''}"><span class="modal-label">${esc(label)}</span>${inner}</div>`;
const inp = (id, val, type = 'text', extra = '') => `<input class="modal-input" id="${id}" type="${type}" value="${esc(val ?? '')}" ${type === 'number' ? 'step="0.01" min="0"' : ''} ${extra}/>`;
const partySelect = (id, list, val, kind) => `<select class="modal-input" id="${id}" onchange="if(this.value==='__new')quickAddParty('${kind}','${id}')">
  <option value="">${t('none')}</option>${list.map(p => `<option value="${p.id}" ${String(p.id) === String(val) ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}
  <option value="__new">${t('new_party')}</option></select>`;

async function openLotModal(id, sell) {
  let l = { status: 'in_stock', load_type: 'pallet', quantity: 1, acquired_date: today() };
  if (id) { try { l = await api('/api/lots/' + id); } catch (e) { return toast(e.message, 'error'); } }
  if (sell) { l.status = 'sold'; l.sold_date = l.sold_date || today(); if (!l.sale_price) l.sale_price = l.asking_price || ''; }
  const sel = (fid, opts, v) => `<select class="modal-input" id="${fid}" onchange="lotPreview()">${opts.map(([k, lab]) => `<option value="${k}" ${k === v ? 'selected' : ''}>${esc(lab)}</option>`).join('')}</select>`;
  const n = (fid, v) => inp(fid, v === 0 || v ? v : '', 'number', 'oninput="lotPreview()"');
  const hist = (l.history || []).map(h => `<div class="hist"><b>${esc(h.created_at)}</b> · ${esc(h.username || '')} · ${esc(h.action)}${h.detail && h.action !== 'create' ? ' — ' + esc(h.detail).slice(0, 300) : ''}</div>`).join('');
  openModal(id ? `${t('edit_lot')} — ${esc(l.lot_no)}` : t('new_lot_title'), `
    <div class="modal-section">${t('sec_basic')}</div>
    <div class="modal-row">${field(t('f_lot_no'), inp('f-lot_no', l.lot_no))}${field(t('f_category'), inp('f-category', l.category, 'text', 'list="cat-list"'))}</div>
    <datalist id="cat-list">${[...new Set(LOTS.map(x => x.category).filter(Boolean))].map(c => `<option>${esc(c)}</option>`).join('')}</datalist>
    <div class="modal-row">${field(t('f_title'), inp('f-title', l.title, 'text', 'placeholder="e.g. Amazon returns – mixed general merchandise"'), true)}</div>
    <div class="modal-row" style="grid-template-columns:1fr 1fr 1fr">${field(t('f_load_type'), sel('f-load_type', ['pallet', 'truckload', 'box', 'gaylord'].map(k => [k, t('lt_' + k)]), l.load_type))}${field(t('f_qty'), n('f-quantity', l.quantity))}${field(t('f_location'), inp('f-location', l.location))}</div>

    <div class="modal-section">${t('sec_cost')}</div>
    <div class="modal-row">${field(t('f_supplier'), partySelect('f-supplier_id', SUPPLIERS, l.supplier_id, 'suppliers'))}${field(t('f_acq_date'), inp('f-acquired_date', l.acquired_date, 'date'))}</div>
    <div class="modal-row" style="grid-template-columns:repeat(4,1fr)">${field(t('f_purchase'), n('f-purchase_cost', l.purchase_cost))}${field(t('f_freight'), n('f-freight_cost', l.freight_cost))}${field(t('f_labor'), n('f-labor_cost', l.labor_cost))}${field(t('f_other'), n('f-other_cost', l.other_cost))}</div>
    <input type="hidden" id="f-truck_cost" value="${+l.truck_cost || 0}"/>
    ${(l.truck_bills || []).length ? `<div class="modal-row">${field(t('f_truck_cost'), `<div style="font-size:11px;color:var(--g700);display:flex;flex-direction:column;gap:3px">${l.truck_bills.map(b =>
      `<div><b>${esc(b.bill_no)}</b> · ${esc(b.truck_company || '')} · ${money(b.amount)}${b.lot_count > 1 ? ` ÷ ${b.lot_count} = <b>${money(b.amount / b.lot_count)}</b>` : ''}</div>`).join('')}</div>`, true)}</div>` : ''}

    <div class="modal-section">${t('sec_sale')}</div>
    <div class="modal-row" style="grid-template-columns:1fr 1fr 1fr">${field(t('f_status'), sel('f-status', ['in_stock', 'listed', 'sold', 'cancelled'].map(k => [k, t('st_' + k)]), l.status))}${field(t('f_asking'), n('f-asking_price', l.asking_price))}${field(t('f_customer'), partySelect('f-customer_id', CUSTOMERS, l.customer_id, 'customers'))}</div>
    <div class="modal-row" style="grid-template-columns:repeat(4,1fr)" id="sale-fields">${field(t('f_sold_date'), inp('f-sold_date', l.sold_date, 'date'))}${field(t('f_sale_price'), n('f-sale_price', l.sale_price))}${field(t('f_received'), n('f-amount_received', l.amount_received))}${field(t('f_pay_method'), inp('f-payment_method', l.payment_method, 'text', 'list="pay-methods"'))}</div>
    <div class="modal-row" style="grid-template-columns:1fr 1fr 2fr" id="ful-fields">
      ${field(t('f_fulfillment'), `<select class="modal-input" id="f-fulfillment" onchange="lotFulfillmentUI()"><option value="">—</option><option value="delivery" ${l.fulfillment === 'delivery' ? 'selected' : ''}>${t('dm_delivery')}</option><option value="pickup" ${l.fulfillment === 'pickup' ? 'selected' : ''}>${t('dm_pickup')}</option></select>`)}
      ${field(t('f_delivery_date'), inp('f-delivery_date', l.delivery_date, 'date'))}
      ${field(t('f_delivery_addr'), `<div style="display:flex;gap:6px">${inp('f-delivery_address', l.delivery_address, 'text', `oninput="addrResetInline('f-delivery-addr-status')"`)}<button class="btn btn-grn btn-sm" type="button" onclick="addrVerifyInline('f-delivery_address','f-delivery-addr-status')">${t('verify')}</button></div><div id="f-delivery-addr-status" ${l.delivery_address ? 'data-verified="1"' : ''}></div>`)}
    </div>
    ${payMethodsList()}
    <div class="profit-box" id="lot-preview"></div>
    <div class="modal-row">${field(t('notes'), `<textarea class="modal-input" id="f-notes">${esc(l.notes || '')}</textarea>`, true)}</div>
    ${hist ? `<div class="modal-section">${t('sec_history')}</div><div style="max-height:140px;overflow:auto">${hist}</div>` : ''}
    <div class="modal-actions">
      ${id && currentUser.role === 'admin' ? `<button class="btn-del" onclick="deleteLot(${id})">${t('delete')}</button>` : ''}
      <button class="btn-cancel" onclick="closeModal()">${t('cancel')}</button>
      <button class="btn-save" onclick="saveLot(${id || 'null'})">${t('save')}</button>
    </div>`);
  lotPreview(); lotFulfillmentUI();
  $('f-customer_id').addEventListener('change', lotCustomerDefaults);
  if (sell && l.customer_id && !l.fulfillment) lotCustomerDefaults();
}
// 选了买家 → 带出他的 送货/自提 和收货地址
function lotCustomerDefaults() {
  const c = CUSTOMERS.find(x => String(x.id) === $('f-customer_id').value);
  if (!c) return;
  if (c.delivery_method) $('f-fulfillment').value = c.delivery_method;
  if (c.delivery_method === 'delivery' && !$('f-delivery_address').value) {
    const a = fmtAddr(c);
    if (a) { $('f-delivery_address').value = a; setAddrStatus('f-delivery-addr-status', !!c.addr_verified && c.addr_verified !== '0'); }
  }
  lotFulfillmentUI();
}
function lotFulfillmentUI() {
  const d = $('f-fulfillment').value === 'delivery';
  ['f-delivery_date', 'f-delivery_address'].forEach(id => { $(id).disabled = !d; });
  $('f-delivery_address').parentNode.parentNode.style.opacity = d ? 1 : .45;
  $('f-delivery_date').parentNode.style.opacity = d ? 1 : .45;
}
function lotForm() {
  const ids = ['lot_no', 'title', 'category', 'load_type', 'quantity', 'location', 'supplier_id', 'acquired_date', 'purchase_cost', 'freight_cost', 'labor_cost', 'other_cost',
    'status', 'asking_price', 'customer_id', 'sold_date', 'sale_price', 'amount_received', 'payment_method', 'notes',
    'truck_cost', 'fulfillment', 'delivery_date', 'delivery_address'];
  const o = {}; ids.forEach(k => { const el = $('f-' + k); o[k] = el ? el.value : null; });
  if (o.supplier_id === '__new') o.supplier_id = ''; if (o.customer_id === '__new') o.customer_id = '';
  return o;
}
function lotPreview() {
  const f = lotForm(), c = calc(f), sold = f.status === 'sold';
  $('sale-fields').style.opacity = sold ? 1 : .45;
  const exp = (+f.asking_price || 0) - c.cost;
  $('lot-preview').innerHTML = `
    <div><div class="l">${t('total_cost')}</div><div class="v">${money(c.cost)}</div></div>
    ${sold ? `<div><div class="l">${t('f_sale_price')}</div><div class="v">${money(c.sale)}</div></div>
      <div><div class="l">${t('profit')} / ${t('margin')}</div><div class="v ${plCls(c.profit)}">${money(c.profit)} <span style="font-size:11px">${pct(c.margin)}</span></div></div>
      <div><div class="l">${t('balance')}</div><div class="v ${c.balance > 0.005 ? 'neg' : 'pos'}">${money(c.balance)}</div></div>`
    : `<div><div class="l">${t('f_asking')}</div><div class="v">${money(+f.asking_price || 0)}</div></div>
      <div><div class="l">${t('expected_profit')}</div><div class="v ${plCls(exp)}">${f.asking_price ? money(exp) : '—'}</div></div><div></div>`}`;
}
async function saveLot(id) {
  const body = lotForm();
  if (body.fulfillment !== 'delivery') { body.delivery_address = ''; body.delivery_date = ''; }
  else if (body.delivery_address && !$('f-delivery-addr-status').dataset.verified) return toast(t('need_verify'), 'error');
  if (body.status === 'sold' && !body.customer_id && !confirm(LANG === 'zh' ? '还没选买家，确定保存？' : 'No customer selected — save anyway?')) return;
  try {
    await api(id ? '/api/lots/' + id : '/api/lots', { method: id ? 'PUT' : 'POST', body });
    closeModal(); toast(t('saved')); refreshAll();
  } catch (e) { toast(e.message, 'error'); }
}
async function deleteLot(id) {
  if (!confirm(t('confirm_delete'))) return;
  try { await api('/api/lots/' + id, { method: 'DELETE' }); closeModal(); toast(t('deleted')); refreshAll(); } catch (e) { toast(e.message, 'error'); }
}
async function quickAddParty(kind, selId) {
  const name = prompt(kind === 'suppliers' ? t('add_supplier').replace('+ ', '') : t('add_customer').replace('+ ', ''));
  const sel = $(selId);
  if (!name || !name.trim()) { sel.value = ''; return; }
  try {
    const p = await api('/api/' + kind, { method: 'POST', body: { name } });
    (kind === 'suppliers' ? SUPPLIERS : CUSTOMERS).push(p);
    const opt = new Option(p.name, p.id); sel.insertBefore(opt, sel.lastElementChild); sel.value = p.id;
    fillFilters(); renderParties(kind);
  } catch (e) { toast(e.message, 'error'); sel.value = ''; }
}

// ---------- address verification (Mapbox, 同 pallet) ----------
function mbParse(f) {
  const street = (f.address ? f.address + ' ' : '') + f.text;
  let city = '', state = '', zip = '';
  (f.context || []).forEach(c => {
    if (c.id.indexOf('place') === 0) city = c.text;
    else if (c.id.indexOf('locality') === 0 && !city) city = c.text;
    else if (c.id.indexOf('region') === 0) state = c.short_code ? c.short_code.replace('US-', '') : c.text;
    else if (c.id.indexOf('postcode') === 0) zip = c.text;
  });
  const full = street + (city ? ', ' + city : '') + (state ? ', ' + state : '') + (zip ? ' ' + zip : '');
  return { street, city, state, zip, full: full || f.place_name, place_name: f.place_name };
}
async function mbSearch(q) {
  const base = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(q.trim()) + '.json?access_token=' + encodeURIComponent(CONFIG.mapbox_token || '') + '&country=us&limit=5&language=en';
  let d = await (await fetch(base + '&types=address')).json();
  if (!d.features || !d.features.length) d = await (await fetch(base)).json();
  return (d.features || []).map(mbParse);
}
function setAddrStatus(statusId, ok, msg) {
  const st = $(statusId); if (!st) return;
  if (ok) { st.dataset.verified = '1'; st.innerHTML = `<span style="color:var(--grn);font-size:9px;font-weight:600">&#10003; ${t('verified')}</span>`; }
  else { delete st.dataset.verified; st.innerHTML = msg || ''; }
}
function addrResetInline(statusId) { setAddrStatus(statusId, false); }
function showMatches(statusId, results, onPick) {
  const st = $(statusId);
  if (!results.length) return setAddrStatus(statusId, false, `<span style="color:var(--red);font-size:9px">&#10007; ${t('addr_not_found')}</span>`);
  st.innerHTML = `<span style="color:var(--grn);font-size:9px">&#10003; ${results.length} ${t('select_match')}</span>
    <div style="border:1px solid var(--g200);border-radius:6px;background:#fff;margin-top:4px;max-height:160px;overflow-y:auto;box-shadow:0 2px 8px rgba(0,0,0,.1)">
    ${results.map((r, i) => `<div data-i="${i}" style="padding:6px 10px;font-size:10px;cursor:pointer;border-bottom:1px solid var(--g100);line-height:1.4" onmouseover="this.style.background='var(--pri-l)'" onmouseout="this.style.background='#fff'">
      <div style="font-weight:600">${esc(r.full)}</div>${r.place_name !== r.full ? `<div style="font-size:8px;color:var(--g400)">${esc(r.place_name)}</div>` : ''}</div>`).join('')}</div>`;
  st.querySelectorAll('div[data-i]').forEach(d => d.onclick = () => { onPick(results[+d.dataset.i]); setAddrStatus(statusId, true); });
}
async function runVerify(statusId, q, onPick) {
  if (!CONFIG.mapbox_token) return setAddrStatus(statusId, false, `<span style="color:var(--amb);font-size:9px">&#9888; MAPBOX_TOKEN ${LANG === 'zh' ? '未设置 (请在 Railway 环境变量里添加)' : 'is not set (add it in Railway variables)'}</span>`);
  if (!q.trim()) return setAddrStatus(statusId, false, `<span style="color:var(--red);font-size:9px">${t('addr_not_found')}</span>`);
  setAddrStatus(statusId, false, `<span style="color:var(--g400);font-size:9px">${t('verifying')}</span>`);
  try { showMatches(statusId, await mbSearch(q), onPick); }
  catch (e) { setAddrStatus(statusId, false, `<span style="color:var(--amb);font-size:9px">&#9888; ${t('net_err')}</span>`); }
}
// 分栏地址 (addr1 / city / state / zip)
function addrVerifyCard(prefix) {
  const v = k => $(`${prefix}-${k}`).value;
  runVerify(`${prefix}-status`, [v('addr1'), v('city'), v('state'), v('zip')].filter(Boolean).join(', '), r => {
    $(`${prefix}-addr1`).value = r.street || ''; $(`${prefix}-city`).value = r.city || '';
    $(`${prefix}-state`).value = r.state || ''; $(`${prefix}-zip`).value = r.zip || '';
  });
}
// 单行地址
function addrVerifyInline(inputId, statusId) { runVerify(statusId, $(inputId).value, r => { $(inputId).value = r.full; }); }

function fmtAddr(p, bill) {
  const k = x => p[(bill ? 'bill_' : '') + x];
  if (!k('addr1')) return bill ? '' : (p.address || '');
  return [k('addr1'), k('addr2'), k('city'), [k('state'), k('zip')].filter(Boolean).join(' ')].filter(Boolean).join(', ');
}
function addrCard(prefix, title, p, bill) {
  const k = x => p[(bill ? 'bill_' : '') + x] || '';
  const ok = bill ? p.bill_verified : p.addr_verified;
  const reset = `oninput="addrResetInline('${prefix}-status')"`;
  return `<div class="addr-card" id="${prefix}">
    <div class="addr-card-header"><span class="addr-card-title">${esc(title)}</span></div>
    <div style="display:flex;flex-direction:column;gap:6px">
      <input class="modal-input" id="${prefix}-addr1" placeholder="${t('addr1')}" value="${esc(k('addr1') || (!bill && !p.addr1 ? p.address || '' : ''))}" ${reset}/>
      <input class="modal-input" id="${prefix}-addr2" placeholder="${t('addr2')}" value="${esc(k('addr2'))}"/>
      <div style="display:flex;gap:6px;align-items:flex-end">
        <input class="modal-input" id="${prefix}-city" placeholder="${t('city')}" style="flex:2" value="${esc(k('city'))}" ${reset}/>
        <input class="modal-input" id="${prefix}-state" placeholder="${t('f_state')}" style="flex:1;text-transform:uppercase" maxlength="2" value="${esc(k('state'))}" ${reset}/>
        <input class="modal-input" id="${prefix}-zip" placeholder="${t('zip')}" style="flex:1" value="${esc(k('zip'))}" ${reset}/>
        <button class="btn btn-grn btn-sm" type="button" style="flex-shrink:0" onclick="addrVerifyCard('${prefix}')">${t('verify')}</button>
      </div>
      <div id="${prefix}-status" ${ok && ok !== '0' ? 'data-verified="1"' : ''}>${ok && ok !== '0' ? `<span style="color:var(--grn);font-size:9px;font-weight:600">&#10003; ${t('verified')}</span>` : ''}</div>
    </div></div>`;
}
function readAddrCard(prefix) {
  const v = k => $(`${prefix}-${k}`).value.trim();
  return { addr1: v('addr1'), addr2: v('addr2'), city: v('city'), state: v('state').toUpperCase(), zip: v('zip'), verified: !!$(`${prefix}-status`).dataset.verified };
}

// ---------- suppliers / customers ----------
function renderParties(kind) {
  const isSup = kind === 'suppliers';
  const q = $(isSup ? 'sup-search' : 'cust-search').value.trim().toLowerCase();
  const list = isSup ? SUPPLIERS : CUSTOMERS;
  const key = isSup ? 'supplier_id' : 'customer_id';
  const stats = {};
  for (const l of LOTS) {
    if (!l[key] || l.status === 'cancelled') continue;
    const s = stats[l[key]] = stats[l[key]] || { n: 0, sold: 0, spent: 0, rev: 0, profit: 0, bal: 0 };
    const c = calc(l); s.n += +l.quantity || 0; s.spent += c.cost;
    if (l.status === 'sold') { s.sold += +l.quantity || 0; s.rev += c.sale; s.profit += c.profit; s.bal += Math.max(0, c.balance); }
  }
  const rows = list.filter(p => !q || [p.name, p.contact, p.phone, p.email, p.city, p.state, fmtAddr(p)].some(v => (v || '').toLowerCase().includes(q)));
  const cols = isSup
    ? [['name'], ['contact'], ['phone'], ['th_location_city'], ['loads_bought', 1], ['total_spent', 1], ['loads_sold', 1], ['s_profit', 1]]
    : [['name'], ['contact'], ['phone'], ['th_location_city'], ['delivery_method'], ['loads_sold', 1], ['total_revenue', 1], ['s_profit', 1], ['s_ar', 1]];
  $(kind + '-thead').innerHTML = '<tr>' + cols.map(([k, n]) => `<th class="${n ? 'num' : ''}">${t(k)}</th>`).join('') + '</tr>';
  $(kind + '-tbody').innerHTML = rows.length ? rows.map(p => {
    const s = stats[p.id] || { n: 0, sold: 0, spent: 0, rev: 0, profit: 0, bal: 0 };
    const nums = isSup ? [s.n, money(s.spent), s.sold, `<span class="${plCls(s.profit)}">${money(s.profit)}</span>`]
      : [s.sold, money(s.rev), `<span class="${plCls(s.profit)}">${money(s.profit)}</span>`, s.bal ? `<span class="neg">${money(s.bal)}</span>` : money(0)];
    const initials = esc((p.name || '?').trim().slice(0, 2).toUpperCase());
    const loc = [p.city, p.state].filter(Boolean).join(', ');
    const ver = p.addr1 ? (p.addr_verified && p.addr_verified !== '0' ? ' <span style="color:var(--grn)" title="Verified">&#10003;</span>' : ' <span style="color:var(--amb)" title="Unverified">&#9888;</span>') : '';
    const dm = !isSup ? `<td>${p.delivery_method ? `<span class="badge ${p.delivery_method === 'delivery' ? 'ba' : 'bb'}">${esc(t('dm_' + p.delivery_method))}</span>` : ''}</td>` : '';
    return `<tr onclick="openPartyModal('${kind}',${p.id})"><td><div class="tdv"><div class="tda" style="background:${isSup ? '#8B6914' : '#0891b2'}">${initials}</div><div class="tdn">${esc(p.name)}</div></div></td>
      <td>${esc(p.contact || '')}</td><td>${esc(p.phone || '')}</td><td>${esc(loc)}${ver}</td>${dm}${nums.map(v => `<td class="num">${v}</td>`).join('')}</tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="${cols.length}">${t('no_data')}</td></tr>`;
}
function openPartyModal(kind, id) {
  const isSup = kind === 'suppliers';
  const p = id ? (isSup ? SUPPLIERS : CUSTOMERS).find(x => x.id === id) : { bill_same: '1', delivery_method: isSup ? '' : 'delivery' };
  const title = id ? `${t('edit')} — ${esc(p.name)}` : t(isSup ? 'add_supplier' : 'add_customer').replace('+ ', '');
  const same = p.bill_same === '1' || p.bill_same === 1;
  const dm = v => `<label style="display:flex;align-items:center;gap:6px;padding:8px 12px;border:1px solid var(--g200);border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;flex:1">
      <input type="radio" name="p-dm" value="${v}" ${p.delivery_method === v ? 'checked' : ''} style="accent-color:var(--pri)"/>${v === 'delivery' ? '&#128666; ' : '&#127970; '}${t('dm_' + v)}</label>`;
  openModal(title, `
    <div class="modal-row">${field(t('name') + ' *', inp('p-name', p.name), true)}</div>
    <div class="modal-row">${field(t('contact'), inp('p-contact', p.contact))}${field(t('phone'), inp('p-phone', p.phone))}</div>
    <div class="modal-row">${field(t('email'), inp('p-email', p.email), true)}</div>
    ${!isSup ? `<div class="modal-section">${t('delivery_method')}</div><div style="display:flex;gap:8px;margin-bottom:6px">${dm('delivery')}${dm('pickup')}</div>` : ''}
    <div class="modal-section">${t('sec_address')}</div>
    ${addrCard('p-ship', isSup ? t('pickup_addr') : t('ship_addr'), p, false)}
    <div style="display:flex;align-items:center;gap:6px;margin:2px 2px 8px">
      <input type="checkbox" id="p-bill-same" ${same ? 'checked' : ''} onchange="$('p-bill').style.display=this.checked?'none':''" style="margin:0;cursor:pointer"/>
      <label for="p-bill-same" style="font-size:11px;cursor:pointer;color:var(--g600);font-weight:600">${isSup ? t('bill_same_sup') : t('bill_same')}</label>
    </div>
    ${addrCard('p-bill', t('bill_addr'), p, true)}
    <div class="modal-row">${field(t('notes'), `<textarea class="modal-input" id="p-notes">${esc(p.notes || '')}</textarea>`, true)}</div>
    <div class="modal-actions">
      ${id && currentUser.role === 'admin' ? `<button class="btn-del" onclick="deleteParty('${kind}',${id})">${t('delete')}</button>` : ''}
      <button class="btn-cancel" onclick="closeModal()">${t('cancel')}</button><button class="btn-save" onclick="saveParty('${kind}',${id || 'null'})">${t('save')}</button>
    </div>`, 600);
  if (same) $('p-bill').style.display = 'none';
}
async function saveParty(kind, id) {
  const body = {}; ['name', 'contact', 'phone', 'email', 'notes'].forEach(k => body[k] = $('p-' + k).value);
  const dmEl = document.querySelector('input[name="p-dm"]:checked');
  body.delivery_method = dmEl ? dmEl.value : '';
  const ship = readAddrCard('p-ship'), same = $('p-bill-same').checked;
  const bill = same ? ship : readAddrCard('p-bill');
  const filled = a => a.addr1 || a.city || a.zip;
  if (body.delivery_method === 'delivery' && !filled(ship)) return toast(t('need_ship'), 'error');
  if ((filled(ship) && !ship.verified) || (!same && filled(bill) && !bill.verified)) return toast(t('need_verify'), 'error');
  Object.assign(body, { addr1: ship.addr1, addr2: ship.addr2, city: ship.city, state: ship.state, zip: ship.zip, addr_verified: ship.verified ? '1' : '0',
    bill_same: same ? '1' : '0', bill_addr1: bill.addr1, bill_addr2: bill.addr2, bill_city: bill.city, bill_state: bill.state, bill_zip: bill.zip, bill_verified: bill.verified ? '1' : '0' });
  try { await api(`/api/${kind}` + (id ? '/' + id : ''), { method: id ? 'PUT' : 'POST', body }); closeModal(); toast(t('saved')); refreshAll(); }
  catch (e) { toast(e.message, 'error'); }
}
async function deleteParty(kind, id) {
  if (!confirm(t('confirm_delete'))) return;
  try { await api(`/api/${kind}/${id}`, { method: 'DELETE' }); closeModal(); toast(t('deleted')); refreshAll(); } catch (e) { toast(e.message, 'error'); }
}

// ---------- truck bills 卡车账单 ----------
const truckCompanies = () => [...new Set(TRUCKS.map(b => b.truck_company).filter(Boolean))].sort((a, b) => a.localeCompare(b));
const tbBadge = s => `<span class="badge ${s === 'paid' ? 'badge-paid' : 'badge-unpaid'}">${esc(t('tb_' + s))}</span>`;
function tbRows() {
  const q = $('tb-search').value.trim().toLowerCase(), st = $('tb-status').value, co = $('tb-company').value, pu = $('tb-purpose').value;
  const f = $('tb-from').value, to = $('tb-to').value;
  return TRUCKS.filter(b => (!st || b.status === st) && (!co || b.truck_company === co) && (!pu || b.purpose === pu) &&
    (!f || (b.date_start || '') >= f) && (!to || (b.date_start || '') <= to) &&
    (!q || [b.bill_no, b.truck_company, b.state, b.invoice_no, b.paid_by, b.payment_method, b.notes, ...b.lots.map(l => l.lot_no + ' ' + (l.title || ''))].some(v => (v || '').toLowerCase().includes(q))));
}
function renderTruckBills() {
  const unpaid = TRUCKS.filter(b => b.status !== 'paid');
  const badge = $('tb-badge'); badge.textContent = unpaid.length; badge.style.display = unpaid.length ? '' : 'none';
  thead('tb-thead', [
    { t: 'th_bill', key: 'bill_no' }, { t: 'th_truck_co', key: 'truck_company' }, { t: 'th_dates', key: 'date_start' }, { t: 'th_purpose', key: 'purpose' },
    { t: 'th_amount', key: 'amount', num: 1 }, { t: 'th_lots' }, { t: 'th_invoice' }, { t: 'f_tb_method' }, { t: 'th_paid_by' }, { t: 'th_receipt' }, { t: 'th_status', key: 'status' },
  ], 'tb', 'renderTruckBills');
  if (!sortState.tb) sortState.tb = { key: 'date_start', dir: -1 };
  const rows = applySort('tb', tbRows(), { bill_no: b => b.bill_no || '', truck_company: b => (b.truck_company || '').toLowerCase(), date_start: b => b.date_start || '', purpose: b => b.purpose || '', amount: b => +b.amount || 0, status: b => b.status });
  const total = rows.reduce((a, b) => a + (+b.amount || 0), 0), totUnpaid = rows.filter(b => b.status !== 'paid').reduce((a, b) => a + (+b.amount || 0), 0);
  $('tb-stats').innerHTML = chip(t('th_amount'), money0(total)) + chip(t('tb_unpaid'), money0(totUnpaid)) + chip('#', rows.length);
  $('tb-tbody').innerHTML = rows.length ? rows.map(b => {
    const dates = esc(b.date_start || '') + (b.date_end && b.date_end !== b.date_start ? ' ~ ' + esc(b.date_end) : '');
    const lots = b.lots.length ? b.lots.map(l => `<span class="chip" style="margin:1px">${esc(l.lot_no)}</span>`).join('') + (b.lots.length > 1 ? `<div class="tdct">${t('per_lot')} ${money(b.amount / b.lots.length)}</div>` : '')
      : `<span style="color:var(--amb);font-size:10px">&#9888; ${t('unallocated')}</span>`;
    const rc = b.receipts.length ? b.receipts.map((f, i) => `<a href="/api/files/${encodeURIComponent(f)}" target="_blank" onclick="event.stopPropagation()" class="chip">&#128206; ${i + 1}</a>`).join(' ') : '<span style="color:var(--g400)">—</span>';
    return `<tr onclick="openTruckBillModal(${b.id})">
      <td class="tdn">${esc(b.bill_no)}</td><td><div class="tdn" style="font-weight:600">${esc(b.truck_company || '')}</div>${b.state ? `<div class="tdct">${esc(b.state)}</div>` : ''}</td>
      <td>${dates}</td><td>${esc(t('tp_' + b.purpose))}</td><td class="num" style="font-weight:700">${money(b.amount)}</td>
      <td style="white-space:normal;max-width:260px">${lots}</td><td>${esc(b.invoice_no || '')}</td><td>${esc(b.payment_method || '')}</td><td>${esc(b.paid_by || '')}</td>
      <td>${rc}</td><td>${tbBadge(b.status)}${b.paid_date ? `<div class="tdct">${esc(b.paid_date)}</div>` : ''}</td></tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="11">${t('no_data')}</td></tr>`;
  $('tb-tfoot').innerHTML = rows.length ? `<tr><td colspan="4">${rows.length}</td><td class="num">${money(total)}</td><td colspan="6"></td></tr>` : '';
}
function openTruckBillModal(id) {
  const b = id ? TRUCKS.find(x => x.id === id) : { purpose: 'pickup', status: 'unpaid', date_start: today(), lots: [], receipts: [] };
  const linked = new Set(b.lots.map(l => l.id));
  const sel = (fid, opts, v, extra = '') => `<select class="modal-input" id="${fid}" ${extra}>${opts.map(([k, lab]) => `<option value="${k}" ${k === v ? 'selected' : ''}>${esc(lab)}</option>`).join('')}</select>`;
  // 已关联的排前面, 其次未售/近期
  const lotList = LOTS.filter(l => l.status !== 'cancelled' || linked.has(l.id))
    .sort((x, y) => (linked.has(y.id) - linked.has(x.id)) || (y.id - x.id));
  openModal(id ? `${t('edit_truck_bill')} — ${esc(b.bill_no)}` : t('new_truck_bill'), `
    <datalist id="tb-co-list">${truckCompanies().map(c => `<option>${esc(c)}</option>`).join('')}</datalist>
    <datalist id="tb-paidby-list">${[...new Set(TRUCKS.map(x => x.paid_by).filter(Boolean))].map(c => `<option>${esc(c)}</option>`).join('')}</datalist>
    ${payMethodsList()}
    <div class="modal-row" style="grid-template-columns:2fr 1fr 1fr">${field(t('f_truck_co') + ' *', inp('tb-f-truck_company', b.truck_company, 'text', 'list="tb-co-list"'))}${field(t('f_state'), inp('tb-f-state', b.state, 'text', 'maxlength="2" style="text-transform:uppercase"'))}
      ${field(t('f_purpose'), sel('tb-f-purpose', ['pickup', 'delivery', 'other'].map(k => [k, t('tp_' + k)]), b.purpose))}</div>
    <div class="modal-row" style="grid-template-columns:1fr 1fr 1fr">${field(t('f_date_start'), inp('tb-f-date_start', b.date_start, 'date'))}${field(t('f_date_end'), inp('tb-f-date_end', b.date_end, 'date'))}
      ${field(t('f_amount') + ' *', inp('tb-f-amount', b.amount, 'number', 'oninput="tbPerLot()"'))}</div>
    <div class="modal-section">${t('sec_pay')}</div>
    <div class="modal-row" style="grid-template-columns:repeat(4,1fr)">
      ${field(t('f_tb_status'), sel('tb-f-status', [['unpaid', t('tb_unpaid')], ['paid', t('tb_paid')]], b.status))}${field(t('f_paid_date'), inp('tb-f-paid_date', b.paid_date, 'date'))}
      ${field(t('f_tb_method'), inp('tb-f-payment_method', b.payment_method, 'text', 'list="pay-methods"'))}${field(t('f_paid_by'), inp('tb-f-paid_by', b.paid_by, 'text', 'list="tb-paidby-list"'))}</div>
    <div class="modal-row">${field(t('f_invoice'), inp('tb-f-invoice_no', b.invoice_no))}<div></div></div>
    <div class="modal-section">${t('f_link_lots')} <span id="tb-perlot" style="float:right;color:var(--g600);font-weight:600"></span></div>
    <input class="modal-input" placeholder="${t('search')}" oninput="tbFilterLots(this.value)" style="margin-bottom:6px"/>
    <div id="tb-lot-list" style="max-height:200px;overflow:auto;border:1px solid var(--g200);border-radius:7px">
      ${lotList.length ? lotList.map(l => `<label data-s="${esc((l.lot_no + ' ' + (l.title || '') + ' ' + (l.supplier_name || '') + ' ' + (l.customer_name || '')).toLowerCase())}" style="display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--g100);font-size:11px;cursor:pointer">
        <input type="checkbox" class="tb-lot" value="${l.id}" ${linked.has(l.id) ? 'checked' : ''} onchange="tbPerLot()" style="accent-color:var(--pri)"/>
        <b>${esc(l.lot_no)}</b><span style="flex:1;color:var(--g600);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(l.title || '')}${l.supplier_name ? ' · ' + esc(l.supplier_name) : ''}${l.customer_name ? ' → ' + esc(l.customer_name) : ''}</span>${statusBadge(l.status)}</label>`).join('')
        : `<div style="padding:12px;color:var(--g400);font-size:11px">${t('no_data')}</div>`}
    </div>
    <div class="modal-section">${t('receipts')}</div>
    <div id="tb-receipts" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">${tbReceiptChips(b)}</div>
    <input type="file" id="tb-files" multiple accept="image/*,application/pdf" style="font-size:11px"/>
    <div class="modal-row" style="margin-top:10px">${field(t('notes'), `<textarea class="modal-input" id="tb-f-notes">${esc(b.notes || '')}</textarea>`, true)}</div>
    <div class="modal-actions">
      ${id && currentUser.role === 'admin' ? `<button class="btn-del" onclick="deleteTruckBill(${id})">${t('delete')}</button>` : ''}
      <button class="btn-cancel" onclick="closeModal()">${t('cancel')}</button><button class="btn-save" id="tb-save" onclick="saveTruckBill(${id || 'null'})">${t('save')}</button>
    </div>`, 720);
  tbPerLot();
}
const tbReceiptChips = b => (b.receipts || []).map((f, i) => `<span class="chip"><a href="/api/files/${encodeURIComponent(f)}" target="_blank">&#128206; ${t('th_receipt')} ${i + 1}</a>
  <a href="#" onclick="event.preventDefault();delTruckReceipt(${b.id},'${esc(f)}')" style="color:var(--red);margin-left:4px">&times;</a></span>`).join('');
function tbFilterLots(q) { q = q.toLowerCase(); document.querySelectorAll('#tb-lot-list label').forEach(l => { l.style.display = !q || l.dataset.s.includes(q) ? 'flex' : 'none'; }); }
function tbPerLot() {
  const n = document.querySelectorAll('.tb-lot:checked').length, amt = +$('tb-f-amount').value || 0;
  $('tb-perlot').innerHTML = n ? `${n} × ${money(amt / n)}` : `<span style="color:var(--amb)">${t('unallocated')}</span>`;
}
async function saveTruckBill(id) {
  const body = {};
  ['truck_company', 'state', 'purpose', 'date_start', 'date_end', 'amount', 'status', 'paid_date', 'payment_method', 'paid_by', 'invoice_no', 'notes'].forEach(k => body[k] = $('tb-f-' + k).value);
  body.lot_ids = [...document.querySelectorAll('.tb-lot:checked')].map(c => +c.value);
  if (!body.truck_company.trim()) return toast(t('f_truck_co') + '?', 'error');
  if (body.amount === '') return toast(t('f_amount') + '?', 'error');
  const btn = $('tb-save'); btn.disabled = true;
  try {
    const saved = await api('/api/truck-bills' + (id ? '/' + id : ''), { method: id ? 'PUT' : 'POST', body });
    const files = $('tb-files').files;
    if (files.length) {
      const fd = new FormData(); [...files].forEach(f => fd.append('files', f));
      const r = await fetch(`/api/truck-bills/${saved.id}/receipts`, { method: 'POST', body: fd });
      if (!r.ok) toast((await r.json().catch(() => ({}))).error || 'Upload failed', 'error');
    }
    closeModal(); toast(t('saved')); refreshAll();
  } catch (e) { toast(e.message, 'error'); }
  btn.disabled = false;
}
async function delTruckReceipt(id, file) {
  if (!confirm(t('confirm_delete'))) return;
  try {
    const b = await api(`/api/truck-bills/${id}/receipts/${encodeURIComponent(file)}`, { method: 'DELETE' });
    const i = TRUCKS.findIndex(x => x.id === id); if (i >= 0) TRUCKS[i] = b;
    $('tb-receipts').innerHTML = tbReceiptChips(b); renderTruckBills();
  } catch (e) { toast(e.message, 'error'); }
}
async function deleteTruckBill(id) {
  if (!confirm(t('confirm_delete'))) return;
  try { await api('/api/truck-bills/' + id, { method: 'DELETE' }); closeModal(); toast(t('deleted')); refreshAll(); } catch (e) { toast(e.message, 'error'); }
}
function exportTruckBills() {
  csv('truck-bills', ['Bill #', 'Truck Company', 'State', 'Purpose', 'Start', 'End', 'Amount', 'Linked Loads', 'Per Load', 'Their Invoice', 'Payment Method', 'Paid By', 'Status', 'Paid Date', 'Notes'],
    applySort('tb', tbRows(), {}).map(b => [b.bill_no, b.truck_company, b.state, b.purpose, b.date_start, b.date_end, b.amount, b.lots.map(l => l.lot_no).join(' '), b.lots.length ? (b.amount / b.lots.length).toFixed(2) : '', b.invoice_no, b.payment_method, b.paid_by, b.status, b.paid_date, b.notes]));
}

// ---------- users ----------
let USERS = [];
async function loadUsers() {
  if (!currentUser || currentUser.role !== 'admin') return;
  try { USERS = await api('/api/users'); } catch (e) { return toast(e.message, 'error'); }
  $('users-tbody').innerHTML = USERS.map(u => `<tr onclick="openUserModal(${u.id})"><td class="tdn">${esc(u.username)}</td><td>${esc(u.display_name || '')}</td><td><span class="badge ${u.role === 'admin' ? 'bb' : 'bg'}">${t(u.role)}</span></td><td>${esc(u.created_at)}</td></tr>`).join('');
}
function openUserModal(id) {
  const u = id ? USERS.find(x => x.id === id) : { role: 'staff' };
  openModal(id ? `${t('edit')} — ${esc(u.username)}` : t('add_user').replace('+ ', ''), `
    <div class="modal-row">${field(t('username'), inp('u-username', u.username, 'text', id ? 'disabled' : ''))}${field(t('display_name'), inp('u-display_name', u.display_name))}</div>
    <div class="modal-row">${field(t('role'), `<select class="modal-input" id="u-role"><option value="staff" ${u.role === 'staff' ? 'selected' : ''}>${t('staff')}</option><option value="admin" ${u.role === 'admin' ? 'selected' : ''}>${t('admin')}</option></select>`)}
      ${field(id ? t('new_password') : t('password'), inp('u-password', '', 'password', 'autocomplete="new-password"'))}</div>
    <div class="modal-actions">
      ${id && id !== currentUser.id ? `<button class="btn-del" onclick="deleteUser(${id})">${t('delete')}</button>` : ''}
      <button class="btn-cancel" onclick="closeModal()">${t('cancel')}</button><button class="btn-save" onclick="saveUser(${id || 'null'})">${t('save')}</button>
    </div>`, 520);
}
async function saveUser(id) {
  const body = { username: $('u-username').value, display_name: $('u-display_name').value, role: $('u-role').value, password: $('u-password').value };
  try { await api('/api/users' + (id ? '/' + id : ''), { method: id ? 'PUT' : 'POST', body }); closeModal(); toast(t('saved')); loadUsers(); }
  catch (e) { toast(e.message, 'error'); }
}
async function deleteUser(id) {
  if (!confirm(t('confirm_delete'))) return;
  try { await api('/api/users/' + id, { method: 'DELETE' }); closeModal(); toast(t('deleted')); loadUsers(); } catch (e) { toast(e.message, 'error'); }
}

// ---------- boot ----------
applyLang();
fetch('/api/me').then(r => r.ok ? r.json() : null).then(u => { if (u) { currentUser = u; showApp(); } else showLogin(); }).catch(showLogin);
