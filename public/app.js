// Bintique Liquidation — frontend (菜单/布局照 pallet.bintique.com)
// PO = 从货源买进一拖 (成本) · SO = 卖给买家 (卖多少钱) · SO 关联 PO 算毛利 · 卡车订单金额平摊进关联订单的成本
'use strict';

// ---------- i18n ----------
const I18N = {
  zh: {
    login_sub: '弃货管理系统', username: '用户名', password: '密码', sign_in: '登录', sign_out: '退出登录',
    dashboard: '总览', suppliers: 'Suppliers', customers: 'Customers', po_orders: 'PO Orders', so_orders: 'SO Orders',
    so_invoices: '销售发票', po_invoices: '采购发票', order_history: '历史订单', checkout: '待结账',
    truck_orders: '卡车订单', truck_quotes: '卡车明细', truck_history: '租车历史', users: '用户',
    monthly_pl: '每月 销售额 / 成本 / 毛利', so_status: 'SO 状态', top_customers: '买家排行 (销售额)', top_suppliers: '货源排行 (毛利)', recent_orders: '最近订单',
    search: '搜索...', export_csv: '导出 CSV', new_order: '+ New Order', add_supplier: '+ Add Supplier', add_customer: '+ Add Customer', add_user: '+ 新增用户',
    move_checkout: 'Move to Checkout', make_invoice: '生成发票', print_sel: '打印', print_so: '打印 SO', print_po: '打印 PO', print_inv: '打印发票', inv_settings: '⚙ 发票设置', select_first: '请先选择订单', refresh: '刷新',
    th_order: '订单号', th_supplier: '货源', th_customer: '买家', th_desc: '货物描述', th_qty: '数量', th_total: '金额', th_extra: '额外支出', th_truck: '卡车费', th_cost: '总成本',
    th_pickup_date: '提货日期', th_delivery_date: '送货日期', th_status: '状态', th_sold_to: '卖出 (SO)', th_profit: '毛利', th_margin: '毛利率', th_payment: '付款',
    th_po: '关联 PO', th_cost_share: '成本 (分摊)', th_fulfillment: '送货/自提', th_date: '日期', th_type: '类型',
    th_invoice: '发票号', th_party_c: '客户', th_party_s: '货源', th_orders: '订单', th_inv_date: '发票日期', th_due: '到期日', th_paid: '已付', th_balance: '未付', th_pay_date: '付款日期', th_pay_method: '付款方式', th_receipt: '回执', th_actions: '操作',
    display_name: '名称', role: '角色', created: '创建时间', contact: '联系人', phone: '电话', email: '邮箱', notes: '备注', name: '名称',
    loads_bought: '买进拖数', loads_sold: '卖出拖数', total_spent: '采购总额', total_revenue: '销售总额',
    backup_title: '下载完整备份', backup_desc: '把所有资料 (货源、买家、PO/SO、发票、卡车) 导出成 JSON 文件。', download_backup: '下载备份',
    all_time: '全部年份', all_months: '全部月份', all_status: '全部状态', all_suppliers: '全部货源', all_customers: '全部买家',
    st_draft: '草稿', st_confirmed: '已确认', st_in_transit: '运输中', st_picked_up: '已提货', st_delivered: '已送达', st_completed: '已完成', st_cancelled: '已取消',
    pay_paid: '已付清', pay_partial: '部分付款', pay_unpaid: '未付', pay_uninvoiced: '未开票', in_checkout: '待结账',
    lt_pallet: '板 (Pallet)', lt_truckload: '车 (Truckload)', lt_box: '箱 (Box)', lt_gaylord: 'Gaylord',
    s_revenue: '销售额', s_cogs: '销售成本', s_profit: '毛利', s_margin: '毛利率', s_purchases: '采购额', s_unsold: '未卖出 PO', s_ar: '待收款', s_ap: '待付款', s_truck: '卡车费用', s_truck_unpaid: '未付卡车费',
    sec_basic: '基本信息', sec_goods: '货物 / 价格', sec_cost_po: '额外支出 (算成本)', sec_logistics_po: '提货', sec_logistics_so: '送货 / 自提', sec_history: '修改记录', sec_link: '卖的是哪一拖 (关联 PO)',
    f_supplier: '货源', f_customer: '买家', f_order_date: '订单日期', f_status: '状态', f_title: '货物描述', f_category: '品类', f_load_type: '单位', f_qty: '数量', f_unit_price: '单价', f_discount: '折扣 ($)', f_total: '金额',
    f_extra: '额外支出 ($)', f_extra_notes: '额外支出说明 (人工/装卸…)', f_po: '关联 PO', f_fulfillment: '送货 / 自提', f_pickup_date: '提货日期', f_delivery_date: '送货日期', f_pickup_addr: '提货地址', f_delivery_addr: '送货地址',
    f_truck_cost: '卡车费 (来自卡车订单)', none: '— 无 —', new_party: '+ 新建…', po_remaining: '剩', create_so: '+ 卖出 (建 SO)',
    total_cost: '总成本', revenue: '销售额', profit: '毛利', margin: '毛利率', cost_share: 'PO 成本分摊', not_sold: '还没卖出', no_po: '没关联 PO, 算不了毛利',
    save: '保存', cancel: '取消', delete: '删除', edit: '编辑', print: '打印', receive: '记录付款', upload: '上传', remove: '移除',
    confirm_delete: '确定删除？此操作不可恢复。', saved: '已保存', deleted: '已删除', no_data: '暂无数据',
    new_password: '新密码 (留空不改)', admin: '管理员', staff: '员工', new_po: '新建 PO (采购)', new_so: '新建 SO (销售)', edit_order: '编辑订单',
    inv_title: '发票', inv_sales: 'INVOICE', inv_purchase: 'BILL', bill_to: 'Bill To', vendor: 'Vendor', their_inv: '对方 Invoice #', bank_s: '收款银行', bank_p: '付款银行', paid_amount: '实付金额', inv_paid_hint: '付清后关联订单自动变「已完成」',
    checkout_empty: '暂无待结账', checkout_hint: '在 PO / SO Orders 勾选同一个客户 (或货源) 的订单 → Move to Checkout', orders_n: '个订单', group_total: '合计',
    history_empty: '还没有已完成的 SO', truck_company: '卡车公司',
    trucks_add: '+ Add Rental', new_truck: '新建卡车订单', edit_truck: '编辑卡车订单', th_bill: '单号', th_dates: '用车日期', th_purpose: '用途', th_linked: '关联订单', th_paid_by: '付款人', th_their_inv: '对方 Invoice',
    tp_pickup: '提货', tp_delivery: '送货', tp_other: '其他', tb_unpaid: '待处理', tb_paid: '已完成', all_companies: '全部卡车公司', all_purposes: '全部用途',
    f_truck_co: '卡车公司', f_state: '州', f_size: '尺寸', f_date_start: '开始日期', f_date_end: '结束日期', f_amount: '金额', f_purpose: '用途', f_tb_status: '状态', f_paid_date: '付款日期', f_tb_method: '付款方式', f_paid_by: '付款人', f_their_inv: '对方 Invoice #',
    f_quote: '选卡车 (卡车明细)', f_link_orders: '关联哪些订单 (金额平摊进这些订单的成本)', per_order: '每单分摊', receipts: '收据 / 发票', unallocated: '没关联订单, 不计入任何订单成本', sec_pay: '付款',
    tq_add: '+ 添加车辆', new_quote: '添加车辆报价', edit_quote: '编辑报价', th_quote: '报价号', th_company: '公司', th_size: '尺寸', th_price: '价格', th_unit: '单位', th_uses: '用过次数',
    pu_day: '/ 天', pu_trip: '/ 趟', pu_hour: '/ 小时', all_states: '全部州', all_sizes: '全部尺寸', days: '天',
    sec_address: '地址', ship_addr: '收货地址 (Shipping)', bill_addr: '账单地址 (Billing)', pickup_addr: '提货地址 (Pickup)', bill_same: '账单地址与收货地址相同', bill_same_sup: '账单地址与提货地址相同',
    addr1: '地址 1', addr2: '地址 2 (可选)', city: '城市', zip: '邮编', verify: '验证', verified: '已验证', unverified: '未验证', verifying: '验证中...', addr_not_found: '找不到这个地址', select_match: '个匹配, 请选择:', net_err: '网络错误',
    need_verify: '请先验证所有地址 / Please verify all addresses', need_ship: '送货的买家必须填收货地址',
    delivery_method: '送货方式', dm_delivery: '送货', dm_pickup: '自提', th_location_city: '城市 / 州',
  },
  en: {
    login_sub: 'Liquidation Management System', username: 'Username', password: 'Password', sign_in: 'Sign In', sign_out: 'Sign Out',
    dashboard: 'Dashboard', suppliers: 'Suppliers', customers: 'Customers', po_orders: 'PO Orders', so_orders: 'SO Orders',
    so_invoices: 'Sales Invoices', po_invoices: 'Purchase Invoices', order_history: 'Order History', checkout: 'Pending Checkout',
    truck_orders: 'Truck Orders', truck_quotes: 'Truck Details', truck_history: 'Rental History', users: 'Users',
    monthly_pl: 'Monthly Revenue / Cost / Profit', so_status: 'SO Status', top_customers: 'Top Customers (Revenue)', top_suppliers: 'Top Suppliers (Profit)', recent_orders: 'Recent Orders',
    search: 'Search...', export_csv: 'Export CSV', new_order: '+ New Order', add_supplier: '+ Add Supplier', add_customer: '+ Add Customer', add_user: '+ Add User',
    move_checkout: 'Move to Checkout', make_invoice: 'Create Invoice', print_sel: 'Print', print_so: 'Print SO', print_po: 'Print PO', print_inv: 'Print Invoice', inv_settings: '⚙ Invoice Settings', select_first: 'Please select orders first', refresh: 'Refresh',
    th_order: 'Order #', th_supplier: 'Supplier', th_customer: 'Customer', th_desc: 'Description', th_qty: 'Qty', th_total: 'Amount', th_extra: 'Extra Expense', th_truck: 'Truck', th_cost: 'Total Cost',
    th_pickup_date: 'Pickup Date', th_delivery_date: 'Delivery Date', th_status: 'Status', th_sold_to: 'Sold (SO)', th_profit: 'Profit', th_margin: 'Margin', th_payment: 'Payment',
    th_po: 'Linked PO', th_cost_share: 'Cost (share)', th_fulfillment: 'Delivery/Pickup', th_date: 'Date', th_type: 'Type',
    th_invoice: 'Invoice #', th_party_c: 'Customer', th_party_s: 'Supplier', th_orders: 'Orders', th_inv_date: 'Invoice Date', th_due: 'Due', th_paid: 'Paid', th_balance: 'Balance', th_pay_date: 'Paid Date', th_pay_method: 'Method', th_receipt: 'Receipt', th_actions: 'Actions',
    display_name: 'Name', role: 'Role', created: 'Created', contact: 'Contact', phone: 'Phone', email: 'Email', notes: 'Notes', name: 'Name',
    loads_bought: 'Loads Bought', loads_sold: 'Loads Sold', total_spent: 'Total Spent', total_revenue: 'Total Revenue',
    backup_title: 'Download a full backup', backup_desc: 'Exports everything (suppliers, customers, PO/SO, invoices, trucks) as JSON.', download_backup: 'Download Backup',
    all_time: 'All Years', all_months: 'All Months', all_status: 'All Status', all_suppliers: 'All Suppliers', all_customers: 'All Customers',
    st_draft: 'Draft', st_confirmed: 'Confirmed', st_in_transit: 'In Transit', st_picked_up: 'Picked Up', st_delivered: 'Delivered', st_completed: 'Completed', st_cancelled: 'Cancelled',
    pay_paid: 'Paid', pay_partial: 'Partial', pay_unpaid: 'Unpaid', pay_uninvoiced: 'Not Invoiced', in_checkout: 'In Checkout',
    lt_pallet: 'Pallet', lt_truckload: 'Truckload', lt_box: 'Box', lt_gaylord: 'Gaylord',
    s_revenue: 'Revenue', s_cogs: 'Cost of Sales', s_profit: 'Gross Profit', s_margin: 'Margin', s_purchases: 'Purchases', s_unsold: 'Unsold POs', s_ar: 'Receivable', s_ap: 'Payable', s_truck: 'Truck Cost', s_truck_unpaid: 'Open Truck Orders',
    sec_basic: 'Basic Info', sec_goods: 'Goods / Price', sec_cost_po: 'Extra Expense (our cost)', sec_logistics_po: 'Pickup', sec_logistics_so: 'Delivery / Pickup', sec_history: 'History', sec_link: 'Which load is this (Linked PO)',
    f_supplier: 'Supplier', f_customer: 'Customer', f_order_date: 'Order Date', f_status: 'Status', f_title: 'Description', f_category: 'Category', f_load_type: 'Unit', f_qty: 'Quantity', f_unit_price: 'Unit Price', f_discount: 'Discount ($)', f_total: 'Amount',
    f_extra: 'Extra Expense ($)', f_extra_notes: 'Extra expense notes (labor, handling…)', f_po: 'Linked PO', f_fulfillment: 'Delivery / Pickup', f_pickup_date: 'Pickup Date', f_delivery_date: 'Delivery Date', f_pickup_addr: 'Pickup Address', f_delivery_addr: 'Delivery Address',
    f_truck_cost: 'Truck cost (from truck orders)', none: '— None —', new_party: '+ New…', po_remaining: 'left', create_so: '+ Sell (create SO)',
    total_cost: 'Total Cost', revenue: 'Revenue', profit: 'Profit', margin: 'Margin', cost_share: 'PO cost share', not_sold: 'Not sold yet', no_po: 'No linked PO — profit unknown',
    save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', print: 'Print', receive: 'Record Payment', upload: 'Upload', remove: 'Remove',
    confirm_delete: 'Delete this? This cannot be undone.', saved: 'Saved', deleted: 'Deleted', no_data: 'No data',
    new_password: 'New password (blank = keep)', admin: 'Admin', staff: 'Staff', new_po: 'New PO (Purchase)', new_so: 'New SO (Sale)', edit_order: 'Edit Order',
    inv_title: 'Invoice', inv_sales: 'INVOICE', inv_purchase: 'BILL', bill_to: 'Bill To', vendor: 'Vendor', their_inv: 'Their Invoice #', bank_s: 'Receiving Bank', bank_p: 'Paying Bank', paid_amount: 'Amount Paid', inv_paid_hint: 'When fully paid, its orders become Completed',
    checkout_empty: 'No pending checkout', checkout_hint: 'In PO / SO Orders, tick orders of the same customer (or supplier) → Move to Checkout', orders_n: 'orders', group_total: 'Total',
    history_empty: 'No completed SOs yet', truck_company: 'Truck Company',
    trucks_add: '+ Add Rental', new_truck: 'New Truck Order', edit_truck: 'Edit Truck Order', th_bill: 'Rental #', th_dates: 'Dates', th_purpose: 'Purpose', th_linked: 'Linked Orders', th_paid_by: 'Paid By', th_their_inv: 'Their Invoice',
    tp_pickup: 'Pickup', tp_delivery: 'Delivery', tp_other: 'Other', tb_unpaid: 'Pending', tb_paid: 'Completed', all_companies: 'All Companies', all_purposes: 'All Purposes',
    f_truck_co: 'Truck Company', f_state: 'State', f_size: 'Size', f_date_start: 'Start Date', f_date_end: 'End Date', f_amount: 'Amount', f_purpose: 'Purpose', f_tb_status: 'Status', f_paid_date: 'Paid Date', f_tb_method: 'Payment Method', f_paid_by: 'Paid By', f_their_inv: 'Their Invoice #',
    f_quote: 'Truck (from Truck Details)', f_link_orders: 'Linked orders (amount split evenly into their cost)', per_order: 'Per order', receipts: 'Receipts / Invoices', unallocated: 'Not linked — not in any order cost', sec_pay: 'Payment',
    tq_add: '+ Add Truck', new_quote: 'New Truck Quote', edit_quote: 'Edit Quote', th_quote: 'Quote #', th_company: 'Company', th_size: 'Size', th_price: 'Price', th_unit: 'Unit', th_uses: 'Times Used',
    pu_day: '/ day', pu_trip: '/ trip', pu_hour: '/ hour', all_states: 'All States', all_sizes: 'All Sizes', days: 'days',
    sec_address: 'Address', ship_addr: 'Shipping Address', bill_addr: 'Billing Address', pickup_addr: 'Pickup Address', bill_same: 'Billing Address same as Shipping Address', bill_same_sup: 'Billing Address same as Pickup Address',
    addr1: 'Address 1', addr2: 'Address 2 (optional)', city: 'City', zip: 'Zipcode', verify: 'Verify', verified: 'Verified', unverified: 'Unverified', verifying: 'Verifying...', addr_not_found: 'Address not found', select_match: 'matches, select:', net_err: 'Network error',
    need_verify: 'Please verify all addresses before saving', need_ship: 'Delivery customers need a shipping address',
    delivery_method: 'Delivery Method', dm_delivery: 'Delivery', dm_pickup: 'Customer Pickup', th_location_city: 'City / State',
  },
};
let LANG = 'zh';
try { LANG = localStorage.getItem('liq_lang') || 'zh'; } catch (e) {}

const t = k => (I18N[LANG] && I18N[LANG][k]) || I18N.en[k] || k;
function setLang(l) {
  LANG = l; try { localStorage.setItem('liq_lang', l); } catch (e) {}
  applyLang();
  if (currentUser) { $('user-role').textContent = t(currentUser.role); refreshAll(); }
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

const statusBadge = s => `<span class="badge badge-${s}">${esc(t('st_' + s))}</span>`;
const payBadge = p => p ? `<span class="badge badge-pay-${p}">${esc(t('pay_' + p))}</span>` : '';
const chip = (label, val) => `<span class="chip">${esc(label)} <b>${val}</b></span>`;
const ORDER_STATUSES = { purchase: ['draft', 'confirmed', 'in_transit', 'picked_up', 'completed', 'cancelled'], sales: ['draft', 'confirmed', 'in_transit', 'delivered', 'completed', 'cancelled'] };
const unitLabel = lt => t('lt_' + (lt || 'pallet')).split(' ')[0];
const filterInput = 'style="padding:4px 8px;font-size:10px;border:1px solid var(--g200);border-radius:5px;outline:none;background:#fff"';

// ---------- state ----------
let currentUser = null;
let ORDERS = [], INVOICES = [], GROUPS = [], SUPPLIERS = [], CUSTOMERS = [], TRUCKS = [], QUOTES = [];
let CONFIG = {};
const charts = {};
const orderById = id => ORDERS.find(o => o.id === id);

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
    [ORDERS, INVOICES, GROUPS, SUPPLIERS, CUSTOMERS, TRUCKS, QUOTES, CONFIG] = await Promise.all(['/api/orders', '/api/invoices', '/api/checkout-groups',
      '/api/suppliers', '/api/customers', '/api/truck-bills', '/api/truck-quotes', '/api/config'].map(u => api(u)));
  } catch (e) { if (e.message !== 'Not signed in') toast(e.message, 'error'); return; }
  fillFilters();
  renderDashboard(); renderOrders('purchase'); renderOrders('sales'); renderInvoices('sales'); renderInvoices('purchase');
  renderHistory(); renderCheckout(); renderTruckBills(); renderTruckQuotes(); renderTruckHistory();
  renderParties('suppliers'); renderParties('customers');
}
function setOptions(sel, opts, keep = true) {
  const el = $(sel); if (!el) return;
  const prev = el.value;
  el.innerHTML = opts.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('');
  if (keep && [...el.options].some(o => o.value === prev)) el.value = prev;
}
const truckCompanies = () => [...new Set(TRUCKS.map(b => b.truck_company).concat(QUOTES.map(q => q.company_name)).filter(Boolean))].sort((a, b) => a.localeCompare(b));
function fillFilters() {
  const years = [...new Set(ORDERS.map(o => (o.order_date || '').slice(0, 4)).filter(Boolean))].sort().reverse();
  setOptions('dash-year', [['', t('all_time')], ...years.map(y => [y, y])]);
  setOptions('dash-month', [['', t('all_months')], ...Array.from({ length: 12 }, (_, i) => [String(i + 1), `${i + 1}月 / ${new Date(2000, i).toLocaleString('en', { month: 'short' })}`])]);
  for (const type of ['purchase', 'sales']) {
    const p = type === 'sales' ? 'so' : 'po';
    setOptions(p + '-status', [['', t('all_status')], ...ORDER_STATUSES[type].map(s => [s, t('st_' + s)])]);
    setOptions(p + '-party', type === 'sales' ? [['', t('all_customers')], ...CUSTOMERS.map(c => [c.id, c.name])] : [['', t('all_suppliers')], ...SUPPLIERS.map(s => [s.id, s.name])]);
    setOptions(p + '-pay', [['', t('th_payment')], ...['uninvoiced', 'unpaid', 'partial', 'paid'].map(k => [k, t('pay_' + k)])]);
  }
  setOptions('tb-status', [['', t('all_status')], ['unpaid', t('tb_unpaid')], ['paid', t('tb_paid')]]);
  setOptions('tb-company', [['', t('all_companies')], ...truckCompanies().map(c => [c, c])]);
  setOptions('tb-purpose', [['', t('all_purposes')], ...['pickup', 'delivery', 'other'].map(k => [k, t('tp_' + k)])]);
  setOptions('tq-company', [['', t('all_companies')], ...[...new Set(QUOTES.map(q => q.company_name))].sort().map(c => [c, c])]);
  setOptions('tq-state', [['', t('all_states')], ...[...new Set(QUOTES.map(q => q.state).filter(Boolean))].sort().map(c => [c, c])]);
  setOptions('tq-size', [['', t('all_sizes')], ...[...new Set(QUOTES.map(q => q.size).filter(Boolean))].sort().map(c => [c, c])]);
}

// ---------- dashboard ----------
function inPeriod(d) {
  const y = $('dash-year').value, m = $('dash-month').value;
  if (!d) return !y && !m;
  if (y && d.slice(0, 4) !== y) return false;
  if (m && +d.slice(5, 7) !== +m) return false;
  return true;
}
const invBalance = i => Math.max(0, (+i.total || 0) - (+i.paid_amount || 0));
function renderDashboard() {
  const live = ORDERS.filter(o => o.status !== 'cancelled');
  const sos = live.filter(o => o.order_type === 'sales'), pos = live.filter(o => o.order_type === 'purchase');
  const soP = sos.filter(o => inPeriod(o.order_date)), poP = pos.filter(o => inPeriod(o.order_date));
  const sum = (a, f) => a.reduce((s, o) => s + (+f(o) || 0), 0);
  const rev = sum(soP, o => o.total), cogs = sum(soP.filter(o => o.po_id), o => o.total_cost), revLinked = sum(soP.filter(o => o.po_id), o => o.total);
  const profit = revLinked - cogs;
  const ar = sum(INVOICES.filter(i => i.invoice_type === 'sales'), invBalance) + sum(sos.filter(o => !o.invoice_id), o => o.total);
  const ap = sum(INVOICES.filter(i => i.invoice_type === 'purchase'), invBalance) + sum(pos.filter(o => !o.invoice_id), o => o.total);
  const unsold = pos.filter(o => !(o.so_list || []).length);
  const cards = [
    [t('s_revenue'), money0(rev), ''],
    [t('s_cogs'), money0(cogs), 'orange'],
    [t('s_profit'), money0(profit), profit >= 0 ? 'green' : 'red'],
    [t('s_margin'), revLinked ? pct(profit / revLinked) : '—', profit >= 0 ? 'green' : 'red'],
    [t('s_purchases'), money0(sum(poP, o => o.total)), 'orange'],
    [t('s_unsold'), `${unsold.length} <span style="font-size:11px;color:var(--g500)">${money0(sum(unsold, o => o.total_cost))}</span>`, ''],
    [t('s_ar'), money0(ar), ar > 0 ? 'red' : 'green'],
    [t('s_ap'), money0(ap), ap > 0 ? 'red' : 'green'],
    [t('s_truck'), money0(TRUCKS.filter(b => inPeriod(b.date_start)).reduce((a, b) => a + (+b.amount || 0), 0)), 'orange'],
    [t('s_truck_unpaid'), money0(TRUCKS.filter(b => b.status !== 'paid').reduce((a, b) => a + (+b.amount || 0), 0)), 'red'],
  ];
  $('stats-grid').innerHTML = cards.map(([l, v, c]) => `<div class="stat-card"><div class="label">${esc(l)}</div><div class="value ${c}">${v}</div></div>`).join('');

  const byMonth = {};
  for (const o of sos) {
    if (!o.order_date) continue;
    const y = $('dash-year').value; if (y && o.order_date.slice(0, 4) !== y) continue;
    const k = o.order_date.slice(0, 7);
    byMonth[k] = byMonth[k] || { rev: 0, cost: 0 };
    byMonth[k].rev += +o.total || 0; byMonth[k].cost += +o.total_cost || 0;
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
  const sts = ORDER_STATUSES.sales;
  drawChart('chart-status', {
    type: 'doughnut',
    data: { labels: sts.map(s => t('st_' + s)), datasets: [{ data: sts.map(s => ORDERS.filter(o => o.order_type === 'sales' && o.status === s).length), backgroundColor: ['#98a2b3', '#3b82f6', '#F79009', '#0ea5e9', '#12B76A', '#F04438'] }] },
    options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } },
  });
  const top = (rows, nameKey, val) => {
    const m = {};
    for (const o of rows) { if (!o[nameKey]) continue; m[o[nameKey]] = (m[o[nameKey]] || 0) + (+val(o) || 0); }
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 8);
  };
  const hbar = (id, rows, color) => drawChart(id, {
    type: 'bar', data: { labels: rows.map(r => r[0]), datasets: [{ data: rows.map(r => r[1]), backgroundColor: color }] },
    options: { indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { callback: v => money0(v), font: { size: 10 } } }, y: { ticks: { font: { size: 10 } } } } },
  });
  hbar('chart-customers', top(soP, 'customer_name', o => o.total), '#8B6914');
  hbar('chart-suppliers', top(poP, 'supplier_name', o => o.profit), '#12B76A');

  const recent = live.slice().sort((a, b) => (b.order_date || '').localeCompare(a.order_date || '') || b.id - a.id).slice(0, 15);
  $('recent-orders').innerHTML = recent.length ? recent.map(o => `<tr onclick="openOrderModal(${o.id})">
    <td class="tdn">${esc(o.order_no)}</td><td><span class="badge ${o.order_type === 'sales' ? 'bg' : 'bb'}">${o.order_type === 'sales' ? 'SO' : 'PO'}</span></td>
    <td>${esc(o.customer_name || o.supplier_name || '—')}</td><td>${esc(o.title || '')}</td><td class="num">${money(o.total)}</td>
    <td class="num ${plCls(o.profit)}">${o.profit !== null ? money(o.profit) : ''}</td><td>${statusBadge(o.status)}</td><td>${esc(o.order_date || '')}</td></tr>`).join('')
    : `<tr class="empty-row"><td colspan="8">${t('no_data')}</td></tr>`;
}

// ---------- PO / SO Orders ----------
const SEL = { purchase: new Set(), sales: new Set() };
function orderRows(type) {
  const p = type === 'sales' ? 'so' : 'po';
  const q = $(p + '-search').value.trim().toLowerCase(), st = $(p + '-status').value, party = $(p + '-party').value, pay = $(p + '-pay').value;
  const f = $(p + '-from').value, to = $(p + '-to').value;
  return ORDERS.filter(o => o.order_type === type && (!st || o.status === st) && (!pay || o.pay_status === pay) &&
    (!party || String(type === 'sales' ? o.customer_id : o.supplier_id) === party) &&
    (!f || (o.order_date || '') >= f) && (!to || (o.order_date || '') <= to) &&
    (!q || [o.order_no, o.title, o.category, o.supplier_name, o.customer_name, o.po_no, o.invoice_no, o.address, o.notes, ...(o.so_list || [])].some(v => (v || '').toLowerCase().includes(q))));
}
const ORDER_GET = {
  order_no: o => o.order_no || '', party: o => (o.customer_name || o.supplier_name || '').toLowerCase(), title: o => (o.title || '').toLowerCase(),
  qty: o => +o.quantity || 0, total: o => +o.total || 0, cost: o => +o.total_cost || 0, profit: o => o.profit ?? -Infinity,
  margin: o => o.profit !== null && o.total ? o.profit / (o.order_type === 'sales' ? o.total : o.revenue || 1) : -Infinity,
  sched: o => o.sched_date || '', date: o => o.order_date || '', status: o => o.status, po: o => o.po_no || '',
};
function payCell(o) {
  if (o.invoice_no) return `${payBadge(o.pay_status)}<div class="tdct">${esc(o.invoice_no)}</div>`;
  if (o.checkout_code) return `<span class="badge badge-checkout">${t('in_checkout')}</span><div class="tdct">${esc(o.checkout_code)}</div>`;
  return payBadge('uninvoiced');
}
function renderOrders(type) {
  const p = type === 'sales' ? 'so' : 'po', isSO = type === 'sales';
  const cols = isSO
    ? [{ t: '' }, { t: 'th_order', key: 'order_no' }, { t: 'th_customer', key: 'party' }, { t: 'th_desc', key: 'title' }, { t: 'th_po', key: 'po' }, { t: 'th_qty', key: 'qty', num: 1 },
      { t: 'th_total', key: 'total', num: 1 }, { t: 'th_cost_share', key: 'cost', num: 1 }, { t: 'th_profit', key: 'profit', num: 1 }, { t: 'th_margin', key: 'margin', num: 1 },
      { t: 'th_fulfillment' }, { t: 'th_delivery_date', key: 'sched' }, { t: 'th_status', key: 'status' }, { t: 'th_payment' }]
    : [{ t: '' }, { t: 'th_order', key: 'order_no' }, { t: 'th_supplier', key: 'party' }, { t: 'th_desc', key: 'title' }, { t: 'th_qty', key: 'qty', num: 1 },
      { t: 'th_total', key: 'total', num: 1 }, { t: 'th_extra', num: 1 }, { t: 'th_truck', num: 1 }, { t: 'th_cost', key: 'cost', num: 1 },
      { t: 'th_pickup_date', key: 'sched' }, { t: 'th_status', key: 'status' }, { t: 'th_sold_to' }, { t: 'th_profit', key: 'profit', num: 1 }, { t: 'th_payment' }];
  thead(p + '-thead', cols, p, isSO ? 'renderSO' : 'renderPO');
  // 全选框
  $(p + '-thead').querySelector('th').innerHTML = `<input type="checkbox" onchange="selectAllOrders('${type}',this.checked)"/>`;
  if (!sortState[p]) sortState[p] = { key: 'date', dir: -1 };
  const rows = applySort(p, orderRows(type), ORDER_GET);
  const sel = SEL[type];
  for (const id of [...sel]) if (!rows.some(o => o.id === id)) sel.delete(id);
  const live = rows.filter(o => o.status !== 'cancelled');
  const tot = live.reduce((a, o) => a + (+o.total || 0), 0), prof = live.reduce((a, o) => a + (o.profit || 0), 0);
  $(p + '-stats').innerHTML = chip('#', rows.length) + chip(t('th_total'), money0(tot)) + chip(t('profit'), `<span class="${plCls(prof)}">${money0(prof)}</span>`) +
    (sel.size ? chip(LANG === 'zh' ? '已选' : 'Selected', sel.size) : '');
  const cb = o => `<td onclick="event.stopPropagation()"><input type="checkbox" ${sel.has(o.id) ? 'checked' : ''} onchange="toggleOrderSel('${type}',${o.id},this.checked)"/></td>`;
  const desc = o => `<td><div class="tdn" style="font-weight:500">${esc(o.title || '')}</div><div class="tdct">${esc([o.category, `${o.quantity} ${unitLabel(o.load_type)}`].filter(Boolean).join(' · '))}</div></td>`;
  $(p + '-tbody').innerHTML = rows.length ? rows.map(o => isSO
    ? `<tr onclick="openOrderModal(${o.id})" style="${o.status === 'cancelled' ? 'opacity:.5' : ''}">${cb(o)}<td class="tdn">${esc(o.order_no)}<div class="tdct">${esc(o.order_date || '')}</div></td>
      <td class="tdn" style="font-weight:600">${esc(o.customer_name || '—')}</td>${desc(o)}<td>${o.po_no ? `<span class="chip">${esc(o.po_no)}</span>` : '<span style="color:var(--amb)">—</span>'}</td>
      <td class="num">${esc(o.quantity)}</td><td class="num" style="font-weight:700">${money(o.total)}</td><td class="num">${o.po_id ? money(o.total_cost) : '—'}</td>
      <td class="num ${plCls(o.profit)}">${o.profit !== null ? money(o.profit) : '—'}</td><td class="num">${o.profit !== null && o.total ? pct(o.profit / o.total) : '—'}</td>
      <td>${o.fulfillment ? esc(t('dm_' + o.fulfillment)) : ''}${o.address ? `<div class="tdct" style="max-width:200px;overflow:hidden;text-overflow:ellipsis">${esc(o.address)}</div>` : ''}</td>
      <td>${esc(o.sched_date || '')}</td><td>${statusBadge(o.status)}</td><td>${payCell(o)}</td></tr>`
    : `<tr onclick="openOrderModal(${o.id})" style="${o.status === 'cancelled' ? 'opacity:.5' : ''}">${cb(o)}<td class="tdn">${esc(o.order_no)}<div class="tdct">${esc(o.order_date || '')}</div></td>
      <td class="tdn" style="font-weight:600">${esc(o.supplier_name || '—')}</td>${desc(o)}<td class="num">${esc(o.quantity)}</td>
      <td class="num" style="font-weight:700">${money(o.total)}</td><td class="num">${o.extra_expense ? money(o.extra_expense) : ''}</td><td class="num">${o.truck_cost ? money(o.truck_cost) : ''}</td>
      <td class="num">${money(o.total_cost)}</td><td>${esc(o.sched_date || '')}</td><td>${statusBadge(o.status)}</td>
      <td>${(o.so_list || []).length ? o.so_list.map(s => `<span class="chip" style="margin:1px">${esc(s)}</span>`).join('') +
        ((+o.quantity || 0) > (+o.sold_qty || 0) ? `<div class="tdct">${t('po_remaining')} ${(+o.quantity || 0) - (+o.sold_qty || 0)} ${unitLabel(o.load_type)}</div>` : '') : `<span class="tdct">${t('not_sold')}</span>`}</td>
      <td class="num ${plCls(o.profit)}">${o.profit !== null ? money(o.profit) : ''}</td><td>${payCell(o)}</td></tr>`).join('')
    : `<tr class="empty-row"><td colspan="${cols.length}">${t('no_data')}</td></tr>`;
}
const renderPO = () => renderOrders('purchase'), renderSO = () => renderOrders('sales');
function toggleOrderSel(type, id, on) { on ? SEL[type].add(id) : SEL[type].delete(id); renderOrders(type); }
function selectAllOrders(type, on) { SEL[type].clear(); if (on) orderRows(type).forEach(o => SEL[type].add(o.id)); renderOrders(type); }
async function moveToCheckout(type) {
  const ids = [...SEL[type]];
  if (!ids.length) return toast(t('select_first'), 'error');
  if (!confirm(LANG === 'zh' ? `将 ${ids.length} 个订单移到待结账?` : `Move ${ids.length} orders to pending checkout?`)) return;
  try { const g = await api('/api/checkout-groups', { method: 'POST', body: { order_ids: ids } }); SEL[type].clear(); toast('✓ ' + g.group_code); await refreshAll(); switchTab('checkout'); }
  catch (e) { toast(e.message, 'error'); }
}
async function invoiceSelected(type) {
  const ids = [...SEL[type]];
  if (!ids.length) return toast(t('select_first'), 'error');
  try {
    const inv = await api('/api/invoices', { method: 'POST', body: { order_ids: ids } });
    SEL[type].clear(); toast('✓ ' + inv.invoice_no); await refreshAll();
    switchTab(type === 'sales' ? 'so-invoices' : 'po-invoices'); openInvoiceModal(inv.id);
  } catch (e) { toast(e.message, 'error'); }
}
function exportOrders(type) {
  const p = type === 'sales' ? 'so' : 'po';
  csv(type === 'sales' ? 'so-orders' : 'po-orders',
    ['Order #', 'Date', type === 'sales' ? 'Customer' : 'Supplier', 'Linked PO', 'Description', 'Category', 'Unit', 'Qty', 'Unit Price', 'Discount', 'Amount', 'Extra Expense', 'Truck Cost', 'Total Cost', 'Revenue (SOs)', 'Profit',
      'Delivery/Pickup', 'Sched Date', 'Address', 'Status', 'Invoice #', 'Payment', 'Notes'],
    applySort(p, orderRows(type), ORDER_GET).map(o => [o.order_no, o.order_date, o.customer_name || o.supplier_name, o.po_no, o.title, o.category, o.load_type, o.quantity, o.unit_price, o.discount, o.total,
      o.extra_expense, (+o.truck_cost || 0).toFixed(2), o.total_cost, o.revenue ?? '', o.profit ?? '', o.fulfillment, o.sched_date, o.address, o.status, o.invoice_no, o.pay_status, o.notes]));
}

// ---------- order modal ----------
async function openOrderModal(id, type, preset) {
  let o = { order_type: type, status: 'confirmed', load_type: 'pallet', quantity: 1, order_date: today(), ...(preset || {}) };
  if (id) { try { o = await api('/api/orders/' + id); } catch (e) { return toast(e.message, 'error'); } }
  const isSO = o.order_type === 'sales';
  const sel = (fid, opts, v, extra = '') => `<select class="modal-input" id="${fid}" ${extra}>${opts.map(([k, lab]) => `<option value="${esc(k)}" ${String(k) === String(v ?? '') ? 'selected' : ''}>${esc(lab)}</option>`).join('')}</select>`;
  const n = (fid, v, extra = '') => inp(fid, v === 0 || v ? v : '', 'number', `oninput="orderPreview()" ${extra}`);
  const pos = ORDERS.filter(x => x.order_type === 'purchase' && (x.status !== 'cancelled' || x.id === o.po_id));
  const poOpts = [['', t('none')], ...pos.map(x => {
    const left = (+x.quantity || 0) - (+x.sold_qty || 0) + (o.po_id === x.id ? (+o.quantity || 0) : 0);
    return [x.id, `${x.order_no} · ${x.title || ''} · ${x.supplier_name || ''} · ${t('po_remaining')} ${left} ${unitLabel(x.load_type)}`];
  })];
  const hist = (o.history || []).map(h => `<div class="hist"><b>${esc(h.created_at)}</b> · ${esc(h.username || '')} · ${esc(h.action)}${h.detail && h.action !== 'create' ? ' — ' + esc(h.detail).slice(0, 300) : ''}</div>`).join('');
  const locked = !!o.invoice_id;
  openModal(id ? `${t('edit_order')} — ${esc(o.order_no)}` : (isSO ? t('new_so') : t('new_po')), `
    <input type="hidden" id="o-type" value="${o.order_type}"/>
    <input type="hidden" id="o-truck_cost" value="${+o.truck_cost || 0}"/>
    ${locked ? `<div style="background:#fffbeb;border:1px solid #fde68a;color:#92400e;border-radius:7px;padding:8px 12px;font-size:11px;margin-bottom:10px">${esc(o.invoice_no)} — ${LANG === 'zh' ? '已开发票, 金额和客户/货源不能改 (要改先删发票)' : 'Invoiced — amount and party are locked (delete the invoice to change them)'}</div>` : ''}
    <div class="modal-section">${t('sec_basic')}</div>
    <div class="modal-row" style="grid-template-columns:2fr 1fr 1fr">
      ${isSO ? field(t('f_customer') + ' *', partySelect('o-customer_id', CUSTOMERS, o.customer_id, 'customers')) : field(t('f_supplier') + ' *', partySelect('o-supplier_id', SUPPLIERS, o.supplier_id, 'suppliers'))}
      ${field(t('f_order_date'), inp('o-order_date', o.order_date, 'date'))}
      ${field(t('f_status'), sel('o-status', ORDER_STATUSES[o.order_type].map(s => [s, t('st_' + s)]), o.status))}</div>
    ${isSO ? `<div class="modal-section">${t('sec_link')}</div><div class="modal-row">${field(t('f_po'), sel('o-po_id', poOpts, o.po_id, 'onchange="orderPoPicked()"'), true)}</div>` : ''}
    <div class="modal-section">${t('sec_goods')}</div>
    <div class="modal-row">${field(t('f_title'), inp('o-title', o.title, 'text', 'placeholder="e.g. Amazon returns – mixed general merchandise"'))}${field(t('f_category'), inp('o-category', o.category, 'text', 'list="cat-list"'))}</div>
    <datalist id="cat-list">${[...new Set(ORDERS.map(x => x.category).filter(Boolean))].map(c => `<option>${esc(c)}</option>`).join('')}</datalist>
    <div class="modal-row" style="grid-template-columns:repeat(5,1fr)">
      ${field(t('f_load_type'), sel('o-load_type', ['pallet', 'truckload', 'box', 'gaylord'].map(k => [k, t('lt_' + k)]), o.load_type))}
      ${field(t('f_qty'), n('o-quantity', o.quantity))}${field(t('f_unit_price'), n('o-unit_price', o.unit_price, locked ? 'disabled' : ''))}
      ${field(t('f_discount'), n('o-discount', o.discount, locked ? 'disabled' : ''))}${field(t('f_total'), `<div class="modal-input" id="o-total-view" style="background:var(--g50);font-weight:700"></div>`)}</div>
    <div class="modal-section">${t('sec_cost_po')}</div>
    <div class="modal-row" style="grid-template-columns:1fr 2fr">${field(t('f_extra'), n('o-extra_expense', o.extra_expense))}${field(t('f_extra_notes'), inp('o-extra_expense_notes', o.extra_expense_notes))}</div>
    ${(o.truck_bills || []).length ? `<div class="modal-row">${field(t('f_truck_cost'), `<div style="font-size:11px;color:var(--g700);display:flex;flex-direction:column;gap:3px">${o.truck_bills.map(b =>
      `<div><b>${esc(b.bill_no)}</b> · ${esc(b.truck_company || '')} · ${money(b.amount)}${b.order_count > 1 ? ` ÷ ${b.order_count} = <b>${money(b.amount / b.order_count)}</b>` : ''}</div>`).join('')}</div>`, true)}</div>` : ''}
    <div class="modal-section">${isSO ? t('sec_logistics_so') : t('sec_logistics_po')}</div>
    <div class="modal-row" style="grid-template-columns:${isSO ? '1fr 1fr 2fr' : '1fr 3fr'}">
      ${isSO ? field(t('f_fulfillment'), sel('o-fulfillment', [['', '—'], ['delivery', t('dm_delivery')], ['pickup', t('dm_pickup')]], o.fulfillment, 'onchange="orderFulfillmentUI()"')) : ''}
      ${field(isSO ? t('f_delivery_date') : t('f_pickup_date'), inp('o-sched_date', o.sched_date, 'date'))}
      ${field(isSO ? t('f_delivery_addr') : t('f_pickup_addr'), `<div style="display:flex;gap:6px">${inp('o-address', o.address, 'text', `oninput="addrResetInline('o-addr-status')"`)}<button class="btn btn-grn btn-sm" type="button" onclick="addrVerifyInline('o-address','o-addr-status')">${t('verify')}</button></div><div id="o-addr-status"></div>`)}
    </div>
    <div class="profit-box" id="o-preview"></div>
    <div class="modal-row">${field(t('notes'), `<textarea class="modal-input" id="o-notes">${esc(o.notes || '')}</textarea>`, true)}</div>
    ${hist ? `<div class="modal-section">${t('sec_history')}</div><div style="max-height:140px;overflow:auto">${hist}</div>` : ''}
    <div class="modal-actions">
      ${id && currentUser.role === 'admin' ? `<button class="btn-del" onclick="deleteOrder(${id})">${t('delete')}</button>` : ''}
      ${id && !isSO && o.status !== 'cancelled' ? `<button class="btn btn-grn" onclick="sellFromPO(${id})">${t('create_so')}</button>` : ''}
      ${id ? `<button class="btn btn-out" onclick="printOrders([${id}])">${t(isSO ? 'print_so' : 'print_po')}</button>` : ''}
      ${id ? (o.invoice_id ? `<button class="btn btn-out" onclick="printInvoice(${o.invoice_id})">${t('print_inv')}</button>`
        : o.status !== 'cancelled' ? `<button class="btn btn-out" onclick="invoiceOrder(${id})">${t('make_invoice')}</button>` : '') : ''}
      <button class="btn-cancel" onclick="closeModal()">${t('cancel')}</button>
      <button class="btn-save" id="o-save" onclick="saveOrder(${id || 'null'})">${t('save')}</button>
    </div>`, 820);
  window._editOrder = o;
  if (o.address && o.address_verified === '1') setAddrStatus('o-addr-status', true);
  const partyEl = $(isSO ? 'o-customer_id' : 'o-supplier_id');
  partyEl.addEventListener('change', orderPartyDefaults);
  if (locked) partyEl.disabled = true;
  if (!id) orderPartyDefaults();
  if (isSO) orderFulfillmentUI();
  orderPreview();
}
// 选了客户/货源 → 带出 送货方式 + 地址
function orderPartyDefaults() {
  const isSO = $('o-type').value === 'sales';
  const p = isSO ? CUSTOMERS.find(x => String(x.id) === $('o-customer_id').value) : SUPPLIERS.find(x => String(x.id) === $('o-supplier_id').value);
  if (!p) return;
  if (isSO && p.delivery_method) $('o-fulfillment').value = p.delivery_method;
  if ((!isSO || p.delivery_method === 'delivery') && !$('o-address').value) {
    const a = fmtAddr(p);
    if (a) { $('o-address').value = a; setAddrStatus('o-addr-status', p.addr_verified === '1'); }
  }
  if (isSO) orderFulfillmentUI();
}
function orderFulfillmentUI() {
  const d = $('o-fulfillment').value !== 'pickup';
  $('o-address').disabled = !d; $('o-address').closest('.modal-field').style.opacity = d ? 1 : .45;
}
function orderPoPicked() {
  const po = orderById(+$('o-po_id').value);
  if (!po) return orderPreview();
  if (!$('o-title').value) $('o-title').value = po.title || '';
  if (!$('o-category').value) $('o-category').value = po.category || '';
  $('o-load_type').value = po.load_type || 'pallet';
  const left = (+po.quantity || 0) - (+po.sold_qty || 0);
  if (left > 0 && !window._editOrder.id) $('o-quantity').value = left;
  orderPreview();
}
function sellFromPO(poId) {
  const po = orderById(poId);
  closeModal();
  openOrderModal(null, 'sales', { po_id: poId, title: po.title, category: po.category, load_type: po.load_type,
    quantity: Math.max(0, (+po.quantity || 0) - (+po.sold_qty || 0)) || po.quantity });
}
function orderForm() {
  const o = {}; ['order_date', 'status', 'title', 'category', 'load_type', 'quantity', 'unit_price', 'discount', 'extra_expense', 'extra_expense_notes', 'sched_date', 'address', 'notes']
    .forEach(k => o[k] = $('o-' + k).value);
  o.order_type = $('o-type').value;
  if (o.order_type === 'sales') { o.customer_id = $('o-customer_id').value; o.po_id = $('o-po_id').value; o.fulfillment = $('o-fulfillment').value; }
  else o.supplier_id = $('o-supplier_id').value;
  if (o.customer_id === '__new') o.customer_id = ''; if (o.supplier_id === '__new') o.supplier_id = '';
  o.address_verified = !!$('o-addr-status').dataset.verified;
  return o;
}
function orderPreview() {
  const f = orderForm();
  const total = (+f.quantity || 0) * (+f.unit_price || 0) - (+f.discount || 0);
  $('o-total-view').textContent = money(total);
  const truck = +$('o-truck_cost').value || 0, extra = +f.extra_expense || 0;
  const box = (l, v, cls = '') => `<div><div class="l">${esc(l)}</div><div class="v ${cls}">${v}</div></div>`;
  if (f.order_type === 'purchase') {
    const o = window._editOrder || {};
    const cost = total + extra + truck, rev = +o.revenue || 0;
    const sosCost = (+o.total_cost || 0) - ((+o.total || 0) + (+o.extra_expense || 0) + (+o.truck_cost || 0));
    const profit = (o.so_list || []).length ? rev - cost - sosCost : null;
    $('o-preview').innerHTML = box(t('total_cost'), money(cost)) + box(t('th_truck'), money(truck)) + box(t('revenue'), (o.so_list || []).length ? money(rev) : `<span style="font-size:11px;color:var(--g400)">${t('not_sold')}</span>`) +
      box(t('profit'), profit !== null ? money(profit) : '—', plCls(profit));
  } else {
    const po = orderById(+f.po_id);
    if (!po) { $('o-preview').innerHTML = box(t('f_total'), money(total)) + `<div style="grid-column:span 3;display:flex;align-items:center;color:var(--amb);font-size:11px">&#9888; ${t('no_po')}</div>`; return; }
    const poCost = (+po.total || 0) + (+po.extra_expense || 0) + (+po.truck_cost || 0);
    const share = (+po.quantity || 0) > 0 ? Math.min(1, (+f.quantity || 0) / po.quantity) : 1;
    const cost = poCost * share + extra + truck, profit = total - cost;
    $('o-preview').innerHTML = box(t('f_total'), money(total)) + box(t('cost_share'), money(poCost * share) + (share < 1 ? ` <span style="font-size:10px">${(share * 100).toFixed(0)}%</span>` : '')) +
      box(t('total_cost'), money(cost)) + box(`${t('profit')} / ${t('margin')}`, `${money(profit)} <span style="font-size:11px">${total ? pct(profit / total) : '—'}</span>`, plCls(profit));
  }
}
async function saveOrder(id) {
  const body = orderForm();
  if (body.order_type === 'sales' && !body.customer_id) return toast(t('f_customer') + '?', 'error');
  if (body.order_type === 'purchase' && !body.supplier_id) return toast(t('f_supplier') + '?', 'error');
  if (body.order_type === 'sales' && body.fulfillment === 'pickup') body.address = '';
  if (body.address && !body.address_verified) return toast(t('need_verify'), 'error');
  const btn = $('o-save'); btn.disabled = true;
  try {
    const saved = await api(id ? '/api/orders/' + id : '/api/orders', { method: id ? 'PUT' : 'POST', body });
    closeModal(); toast(t('saved') + ' · ' + saved.order_no); refreshAll();
  } catch (e) { toast(e.message, 'error'); }
  btn.disabled = false;
}
async function deleteOrder(id) {
  if (!confirm(t('confirm_delete'))) return;
  try { await api('/api/orders/' + id, { method: 'DELETE' }); closeModal(); toast(t('deleted')); refreshAll(); } catch (e) { toast(e.message, 'error'); }
}

// ---------- 销售发票 / 采购发票 ----------
function invRows(type) {
  const p = type === 'sales' ? 'si' : 'pi';
  const q = $(p + '-search').value.trim().toLowerCase(), f = $(p + '-from').value, to = $(p + '-to').value;
  return INVOICES.filter(i => i.invoice_type === type && (!f || (i.invoice_date || '') >= f) && (!to || (i.invoice_date || '') <= to) &&
    (!q || [i.invoice_no, i.party_name, i.their_invoice_no, i.notes, ...i.orders.map(o => o.order_no)].some(v => (v || '').toLowerCase().includes(q))));
}
function renderInvoices(type) {
  const p = type === 'sales' ? 'si' : 'pi', isS = type === 'sales';
  thead(p + '-thead', [{ t: 'th_invoice', key: 'no' }, { t: isS ? 'th_party_c' : 'th_party_s', key: 'party' }, { t: 'th_orders' }, { t: 'th_inv_date', key: 'date' }, { t: 'th_due', key: 'due' },
    { t: 'th_total', key: 'total', num: 1 }, { t: 'th_paid', num: 1 }, { t: 'th_balance', key: 'bal', num: 1 }, { t: 'th_status', key: 'status' }, { t: 'th_pay_date' }, { t: isS ? 'bank_s' : 'bank_p' }, { t: 'th_receipt' }, { t: 'th_actions' }],
    p, isS ? 'renderSI' : 'renderPI');
  if (!sortState[p]) sortState[p] = { key: 'date', dir: -1 };
  const rows = applySort(p, invRows(type), { no: i => i.invoice_no, party: i => (i.party_name || '').toLowerCase(), date: i => i.invoice_date || '', due: i => i.due_date || '', total: i => +i.total, bal: invBalance, status: i => i.status });
  const tot = rows.reduce((a, i) => a + (+i.total || 0), 0), bal = rows.reduce((a, i) => a + invBalance(i), 0);
  $(p + '-stats').innerHTML = chip('#', rows.length) + chip(t('th_total'), money0(tot)) + chip(t('th_balance'), `<span class="${bal > 0 ? 'neg' : ''}">${money0(bal)}</span>`);
  const overdue = i => i.status !== 'paid' && i.due_date && i.due_date < today();
  $(p + '-tbody').innerHTML = rows.length ? rows.map(i => `<tr onclick="openInvoiceModal(${i.id})">
    <td class="tdn">${esc(i.invoice_no)}${i.their_invoice_no ? `<div class="tdct">${esc(i.their_invoice_no)}</div>` : ''}</td><td class="tdn" style="font-weight:600">${esc(i.party_name || '—')}</td>
    <td style="white-space:normal;max-width:220px">${i.orders.map(o => `<span class="chip" style="margin:1px">${esc(o.order_no)}</span>`).join('')}</td>
    <td>${esc(i.invoice_date || '')}</td><td style="${overdue(i) ? 'color:var(--red);font-weight:700' : ''}">${esc(i.due_date || '')}</td>
    <td class="num" style="font-weight:700">${money(i.total)}</td><td class="num">${money(i.paid_amount)}</td><td class="num ${invBalance(i) > 0 ? 'neg' : ''}">${money(invBalance(i))}</td>
    <td>${payBadge(i.status)}</td><td>${esc(i.paid_date || '')}</td><td>${esc([i.bank, i.payment_method].filter(Boolean).join(' · '))}</td>
    <td>${i.receipts.length ? i.receipts.map((f, n) => `<a href="/api/files/${encodeURIComponent(f)}" target="_blank" onclick="event.stopPropagation()" class="chip">&#128206; ${n + 1}</a>`).join(' ') : '—'}</td>
    <td onclick="event.stopPropagation()"><button class="btn btn-out btn-sm" onclick="printInvoice(${i.id})">${t('print')}</button></td></tr>`).join('')
    : `<tr class="empty-row"><td colspan="13">${t('no_data')}</td></tr>`;
}
const renderSI = () => renderInvoices('sales'), renderPI = () => renderInvoices('purchase');
function openInvoiceModal(id) {
  const i = INVOICES.find(x => x.id === id); if (!i) return;
  const isS = i.invoice_type === 'sales';
  openModal(`${isS ? t('so_invoices') : t('po_invoices')} — ${esc(i.invoice_no)}`, `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><div class="tdn" style="font-size:14px">${esc(i.party_name || '')}</div><div>${payBadge(i.status)}</div></div>
    <table style="margin-bottom:10px;border:1px solid var(--g200);border-radius:8px"><thead><tr><th>${t('th_order')}</th><th>${t('th_desc')}</th><th class="num">${t('th_qty')}</th><th class="num">${t('f_unit_price')}</th><th class="num">${t('th_total')}</th></tr></thead>
      <tbody>${i.orders.map(o => `<tr onclick="closeModal();openOrderModal(${o.id})"><td class="tdn">${esc(o.order_no)}</td><td>${esc(o.title || '')}</td><td class="num">${esc(o.quantity)}</td><td class="num">${money(o.unit_price)}</td><td class="num">${money(o.total)}</td></tr>`).join('')}
      <tr><td colspan="4" style="font-weight:700">${t('group_total')}</td><td class="num" style="font-weight:800">${money(i.total)}</td></tr></tbody></table>
    <div class="modal-row" style="grid-template-columns:repeat(3,1fr)">${field(t('th_inv_date'), inp('i-invoice_date', i.invoice_date, 'date'))}${field(t('th_due'), inp('i-due_date', i.due_date, 'date'))}${field(t('their_inv'), inp('i-their_invoice_no', i.their_invoice_no))}</div>
    <div class="modal-section">${t('sec_pay')} <span style="float:right;font-weight:500;color:var(--g500)">${t('inv_paid_hint')}</span></div>
    ${payMethodsList()}
    <div class="modal-row" style="grid-template-columns:repeat(4,1fr)">${field(t('paid_amount'), `<div style="display:flex;gap:4px">${inp('i-paid_amount', i.paid_amount, 'number')}<button class="btn btn-out btn-sm" type="button" style="white-space:nowrap" onclick="$('i-paid_amount').value=${+i.total};if(!$('i-paid_date').value)$('i-paid_date').value=today()">${LANG === 'zh' ? '全额' : 'Full'}</button></div>`)}
      ${field(t('th_pay_date'), inp('i-paid_date', i.paid_date, 'date'))}${field(t('th_pay_method'), inp('i-payment_method', i.payment_method, 'text', 'list="pay-methods"'))}${field(isS ? t('bank_s') : t('bank_p'), inp('i-bank', i.bank))}</div>
    <div class="modal-section">${t('receipts')}</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">${i.receipts.map((f, n) => `<a class="chip" href="/api/files/${encodeURIComponent(f)}" target="_blank">&#128206; ${t('th_receipt')} ${n + 1}</a>`).join('')}</div>
    <input type="file" id="i-files" multiple accept="image/*,application/pdf" style="font-size:11px"/>
    <div class="modal-row" style="margin-top:10px">${field(t('notes'), `<textarea class="modal-input" id="i-notes">${esc(i.notes || '')}</textarea>`, true)}</div>
    <div class="modal-actions">
      ${currentUser.role === 'admin' ? `<button class="btn-del" onclick="deleteInvoice(${i.id})">${t('delete')}</button>` : ''}
      <button class="btn btn-out" onclick="printInvoice(${i.id})">${t('print')}</button>
      <button class="btn-cancel" onclick="closeModal()">${t('cancel')}</button><button class="btn-save" id="i-save" onclick="saveInvoice(${i.id})">${t('save')}</button>
    </div>`, 760);
}
async function saveInvoice(id) {
  const body = {}; ['invoice_date', 'due_date', 'their_invoice_no', 'paid_amount', 'paid_date', 'payment_method', 'bank', 'notes'].forEach(k => body[k] = $('i-' + k).value);
  const btn = $('i-save'); btn.disabled = true;
  try {
    await api('/api/invoices/' + id, { method: 'PUT', body });
    const files = $('i-files').files;
    if (files.length) {
      const fd = new FormData(); [...files].forEach(f => fd.append('files', f));
      const r = await fetch(`/api/invoices/${id}/receipts`, { method: 'POST', body: fd });
      if (!r.ok) toast((await r.json().catch(() => ({}))).error || 'Upload failed', 'error');
    }
    closeModal(); toast(t('saved')); refreshAll();
  } catch (e) { toast(e.message, 'error'); }
  btn.disabled = false;
}
async function deleteInvoice(id) {
  if (!confirm(t('confirm_delete'))) return;
  try { await api('/api/invoices/' + id, { method: 'DELETE' }); closeModal(); toast(t('deleted')); refreshAll(); } catch (e) { toast(e.message, 'error'); }
}
// ---------- 打印单据: PO / SO / Invoice (同一套版式) ----------
const LT_EN = { pallet: 'Pallet', truckload: 'Truckload', box: 'Box', gaylord: 'Gaylord' };
function docWindow(title, pages) {
  const w = window.open('', '_blank'); if (!w) { toast('Popup blocked', 'error'); return; }
  const co = CONFIG.company || {};
  const coLines = [co.address, [co.phone, co.email].filter(Boolean).join(' · ')].filter(Boolean).map(esc).join('<br>');
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>
    body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1d2939;margin:0;padding:40px}
    .page{max-width:820px;margin:auto}.page+.page{page-break-before:always;margin-top:60px}
    .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #8B6914;padding-bottom:16px}
    .brand{display:flex;gap:12px;align-items:center}.brand img{width:64px;height:64px;border-radius:8px;border:2px solid #8B6914}
    h1{margin:0;font-size:26px;color:#8B6914;letter-spacing:2px}.muted{color:#667085;font-size:12px}.lbl{color:#667085;font-size:11px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px}
    .meta{margin-top:6px;font-size:12px;border-collapse:collapse;margin-left:auto}.meta td{padding:1px 0 1px 12px;border:0}
    .grid{display:flex;gap:24px;margin-top:24px;font-size:13px;line-height:1.5}.grid>div{flex:1}
    table.items{width:100%;border-collapse:collapse;margin-top:24px;font-size:13px}.items th{background:#FDF8ED;text-align:left;padding:8px;border-bottom:1px solid #e4e7ec}
    .items td{padding:8px;border-bottom:1px solid #f2f4f7;vertical-align:top}.r,.items th.r{text-align:right}.tot td{font-weight:800;font-size:15px;border-top:2px solid #8B6914}
    .sign{display:flex;gap:40px;margin-top:60px;font-size:12px}.sign div{flex:1;border-top:1px solid #98a2b3;padding-top:6px;color:#667085}
    .sub{width:300px;margin:14px 0 0 auto;font-size:13px}.sub div{display:flex;justify-content:space-between;padding:3px 8px}.sub .t{font-weight:800;font-size:15px;border-top:2px solid #8B6914;margin-top:4px;padding-top:7px}
    .due{display:flex;justify-content:space-between;align-items:center;background:#FDF8ED;border:1px solid #e9d8a6;border-radius:8px;padding:12px 16px;margin-top:18px}
    .due .lbl{font-weight:800;color:#6B4F0E;font-size:13px;text-transform:none;letter-spacing:0;margin:0}.due .amt{font-size:22px;font-weight:800;color:#6B4F0E}
    .pay{margin-top:20px}.pay-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#667085;margin-bottom:8px}
    .pay-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.pay-m{border:1px solid #e4e7ec;border-radius:8px;padding:10px 12px;font-size:12px}
    .pay-m h4{margin:0 0 4px;font-size:13px;color:#8B6914}.pay-m p{margin:1px 0}
    .terms{margin-top:18px;font-size:11px;color:#475467;line-height:1.6}.footer{margin-top:24px;padding-top:10px;border-top:1px solid #e4e7ec;text-align:center;font-size:11px;color:#98a2b3}
    @media print{.np{display:none}body{padding:0}}</style></head><body>
    ${pages.map(pg => `<div class="page">
      <div class="top"><div class="brand"><img src="${location.origin}/logo.jpg"/><div><b style="font-size:18px">${esc(co.name || 'Bintique Inc')}</b><div class="muted">${coLines}</div></div></div>
        <div style="text-align:right"><h1>${esc(pg.heading)}</h1><div><b>${esc(pg.no)}</b></div>
        <table class="meta">${pg.meta.filter(m => m[1]).map(([k, v]) => `<tr><td class="muted">${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table></div></div>
      <div class="grid">${pg.blocks.map(b => `<div><div class="lbl">${esc(b.label)}</div>${b.lines.filter(Boolean).map((l, n) => n ? esc(l) : `<b>${esc(l)}</b>`).join('<br>')}</div>`).join('')}</div>
      <table class="items"><thead><tr>${pg.withOrderNo ? '<th>Order #</th>' : ''}<th>Description</th><th class="r">Qty</th><th class="r">Unit Price</th><th class="r">Discount</th><th class="r">Amount</th></tr></thead><tbody>
        ${pg.lines.map(o => `<tr>${pg.withOrderNo ? `<td>${esc(o.order_no)}</td>` : ''}<td>${esc(o.title || '')}${o.category ? `<div class="muted">${esc(o.category)}</div>` : ''}</td>
          <td class="r">${esc(o.quantity)} ${esc(LT_EN[o.load_type] || o.load_type || '')}</td><td class="r">${money(o.unit_price)}</td><td class="r">${+o.discount ? money(o.discount) : ''}</td><td class="r">${money(o.total)}</td></tr>`).join('')}
        ${pg.totals.map(([k, v, cls]) => `<tr class="${cls || ''}"><td colspan="${pg.withOrderNo ? 5 : 4}" class="r">${esc(k)}</td><td class="r">${money(v)}</td></tr>`).join('')}
      </tbody></table>
      ${pg.after || ''}
      ${pg.notes ? `<p class="muted" style="margin-top:20px;white-space:pre-wrap">${esc(pg.notes)}</p>` : ''}
      ${pg.sign ? `<div class="sign">${pg.sign.map(x => `<div>${esc(x)}</div>`).join('')}</div>` : ''}
      ${pg.footer ? `<div class="footer">${esc(pg.footer)}</div>` : ''}</div>`).join('')}
    <p class="np" style="text-align:center;margin-top:30px"><button onclick="print()" style="padding:8px 24px;font-size:14px">Print / Save as PDF</button></p></body></html>`);
  w.document.close();
}
const partyLines = (p, bill) => [p.name, p.contact ? 'Attn: ' + p.contact : '', (bill ? (p.bill_same !== '1' && fmtAddr(p, true)) || fmtAddr(p) : fmtAddr(p)), [p.phone, p.email].filter(Boolean).join(' · ')];
function orderDocPage(o) {
  const isSO = o.order_type === 'sales';
  const party = (isSO ? CUSTOMERS.find(p => p.id === o.customer_id) : SUPPLIERS.find(p => p.id === o.supplier_id)) || { name: o.customer_name || o.supplier_name || '' };
  const pickup = isSO && o.fulfillment === 'pickup';
  // 自提 SO: 提货地点 = 关联 PO 的提货地址 (没填就用那个货源的地址)
  const po = pickup && o.po_id ? ORDERS.find(x => x.id === o.po_id) : null;
  const poSup = po ? SUPPLIERS.find(p => p.id === po.supplier_id) : null;
  const pickupAddr = (po && po.address) || (poSup && fmtAddr(poSup)) || '';
  return {
    heading: isSO ? 'SALES ORDER' : 'PURCHASE ORDER', no: o.order_no,
    meta: [['Date', o.order_date], [isSO ? (pickup ? 'Pickup Date' : 'Delivery Date') : 'Pickup Date', o.sched_date], ['Invoice #', o.invoice_no]],
    blocks: isSO
      ? [{ label: 'Bill To', lines: partyLines(party, true) }, pickup ? { label: 'Pickup Location (Customer Pickup)', lines: [pickupAddr || '—'] } : { label: 'Ship To', lines: [party.name, o.address || fmtAddr(party)] }]
      : [{ label: 'Vendor', lines: partyLines(party, true) }, { label: 'Pickup Location', lines: [party.name, o.address || fmtAddr(party)] }],
    lines: [o], totals: [['Total', o.total, 'tot']], notes: o.notes,
    sign: isSO ? ['Authorized Signature', 'Customer Signature / Date'] : ['Authorized Signature', 'Vendor Signature / Date'],
  };
}
function printOrders(ids) {
  const list = ids.map(id => ORDERS.find(o => o.id === id)).filter(Boolean);
  if (!list.length) return toast(t('select_first'), 'error');
  docWindow(list.length === 1 ? list[0].order_no : `${list[0].order_type === 'sales' ? 'SO' : 'PO'} x${list.length}`, list.map(orderDocPage));
}
function printSelected(type) { printOrders(applySort(type === 'sales' ? 'so' : 'po', orderRows(type), ORDER_GET).filter(o => SEL[type].has(o.id)).map(o => o.id)); }
// 发票版式照 pallet: Terms / Currency, Subtotal + Sales Tax, Amount Due, 付款方式, 条款, 页脚
function printInvoice(id) {
  const i = INVOICES.find(x => x.id === id); if (!i) return;
  const isS = i.invoice_type === 'sales';
  const party = (isS ? CUSTOMERS : SUPPLIERS).find(p => p.id === i.party_id) || { name: i.party_name || '' };
  const ship = isS ? [...new Set(i.orders.map(o => (ORDERS.find(x => x.id === o.id) || {}).address).filter(Boolean))] : [];
  const bal = invBalance(i), paid = +i.paid_amount || 0;
  const row = (k, v, cls = '') => `<div class="${cls}"><span>${k}</span><span>${v}</span></div>`;
  const pay = isS ? (CONFIG.payment || []).filter(m => m.on && m.title) : [];
  const terms = isS && CONFIG.terms ? esc(CONFIG.terms).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>') : '';
  docWindow(i.invoice_no, [{
    heading: isS ? t('inv_sales') : t('inv_purchase'), no: i.invoice_no, withOrderNo: true,
    meta: [['Invoice Date:', i.invoice_date], ['Due Date:', i.due_date || i.invoice_date], ['Terms:', i.due_date && i.due_date !== i.invoice_date ? 'Due by ' + i.due_date : 'Due on Receipt'],
      ['Ref:', i.their_invoice_no], ['Currency:', 'USD']],
    blocks: [{ label: isS ? t('bill_to') : t('vendor'), lines: partyLines(party, true) }, ...(ship.length ? [{ label: 'Delivery Address', lines: [party.name, ...ship] }] : [])],
    lines: i.orders, totals: [],
    after: `<div class="sub">${row('Subtotal', money(i.total))}${row('Sales Tax', money(0))}${row('<span class="muted" style="font-size:10px">No sales tax charged</span>', '')}
        ${row('TOTAL DUE (USD)', money(i.total), 't')}${paid ? row('Paid', '−' + money(paid)) + row('<b>Balance Due</b>', `<b>${money(bal)}</b>`) : ''}</div>
      ${isS ? `<div class="due"><div><div class="lbl">${bal > 0 ? 'Amount Due' : 'Paid in Full'}</div><div class="muted" style="color:#92400e;margin-top:2px">${bal > 0 ? (i.due_date && i.due_date !== i.invoice_date ? 'Payment due by ' + esc(i.due_date) : 'Payment due upon receipt of invoice') : 'Thank you for your payment'}</div></div><div class="amt">${money(bal)}</div></div>` : ''}
      ${pay.length ? `<div class="pay"><div class="pay-title">Payment Methods / Remittance Instructions</div><div class="pay-grid">${pay.map(m =>
        `<div class="pay-m"><h4>${esc(m.title)}</h4>${[m.l1, m.l2, m.l3].filter(Boolean).map(l => `<p>${esc(l)}</p>`).join('')}</div>`).join('')}</div></div>` : ''}
      ${terms ? `<div class="terms">${terms}</div>` : ''}`,
    notes: i.notes, footer: isS ? CONFIG.footer : '',
  }]);
}
// 发票设置 (管理员): 抬头 / 付款方式 / 条款 / 页脚, 存在服务器上, 所有人打印都用这一份
function openInvSettings() {
  const c = CONFIG.company || {}, pay = [0, 1, 2].map(n => (CONFIG.payment || [])[n] || { title: '', l1: '', l2: '', l3: '', on: false });
  openModal(LANG === 'zh' ? '发票设置' : 'Invoice Settings', `
    <div class="modal-section">${LANG === 'zh' ? '抬头 (公司)' : 'Header (company)'}</div>
    <div class="modal-row">${field(t('name'), inp('is-name', c.name))}${field(t('phone'), inp('is-phone', c.phone))}</div>
    <div class="modal-row">${field(LANG === 'zh' ? '地址' : 'Address', inp('is-address', c.address))}${field(t('email'), inp('is-email', c.email))}</div>
    <div class="modal-section">${LANG === 'zh' ? '付款方式 (打印在销售发票上)' : 'Payment methods (printed on sales invoices)'}</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${pay.map((m, n) => `<div style="border:1px solid var(--g200);border-radius:8px;padding:8px;display:flex;flex-direction:column;gap:5px">
      <label style="font-size:11px;font-weight:600;display:flex;gap:5px;align-items:center"><input type="checkbox" id="is-p${n}-on" ${m.on ? 'checked' : ''}/>${LANG === 'zh' ? '显示' : 'Show'}</label>
      ${inp(`is-p${n}-title`, m.title, 'text', 'placeholder="Zelle / ACH / Wire…" style="font-weight:700"')}${inp(`is-p${n}-l1`, m.l1)}${inp(`is-p${n}-l2`, m.l2)}${inp(`is-p${n}-l3`, m.l3)}</div>`).join('')}</div>
    <div class="modal-row" style="margin-top:10px">${field(LANG === 'zh' ? '条款 (**粗体**)' : 'Terms (**bold**)', `<textarea class="modal-input" id="is-terms" rows="3">${esc(CONFIG.terms || '')}</textarea>`, true)}</div>
    <div class="modal-row">${field(LANG === 'zh' ? '页脚' : 'Footer', inp('is-footer', CONFIG.footer), true)}</div>
    <div class="modal-actions"><button class="btn-cancel" onclick="closeModal()">${t('cancel')}</button><button class="btn-save" onclick="saveInvSettings()">${t('save')}</button></div>`, 760);
}
async function saveInvSettings() {
  const v = k => $('is-' + k).value.trim();
  const body = { company: { name: v('name'), address: v('address'), phone: v('phone'), email: v('email') },
    payment: [0, 1, 2].map(n => ({ title: v(`p${n}-title`), l1: v(`p${n}-l1`), l2: v(`p${n}-l2`), l3: v(`p${n}-l3`), on: $(`is-p${n}-on`).checked })),
    terms: $('is-terms').value.trim(), footer: v('footer') };
  try { await api('/api/settings', { method: 'PUT', body }); Object.assign(CONFIG, body); closeModal(); toast(t('saved')); } catch (e) { toast(e.message, 'error'); }
}
async function invoiceOrder(id) {
  try {
    const inv = await api('/api/invoices', { method: 'POST', body: { order_ids: [id] } });
    toast('✓ ' + inv.invoice_no); await refreshAll(); closeModal(); printInvoice(inv.id);
  } catch (e) { toast(e.message, 'error'); }
}

// ---------- 历史订单 (已完成 SO) ----------
function renderHistory() {
  const q = $('oh-search').value.trim().toLowerCase(), f = $('oh-from').value, to = $('oh-to').value;
  const rows = ORDERS.filter(o => o.order_type === 'sales' && o.status === 'completed' && (!f || (o.sched_date || o.order_date || '') >= f) && (!to || (o.sched_date || o.order_date || '') <= to) &&
    (!q || [o.order_no, o.customer_name, o.title, o.po_no].some(v => (v || '').toLowerCase().includes(q))))
    .sort((a, b) => (b.sched_date || b.order_date || '').localeCompare(a.sched_date || a.order_date || ''));
  const truckOf = o => TRUCKS.filter(b => b.orders.some(x => x.id === o.id || x.id === o.po_id));
  $('oh-thead').innerHTML = `<tr><th>${t('th_order')}</th><th>${t('th_customer')}</th><th>${t('th_desc')}</th><th>${t('th_po')}</th><th class="num">${t('th_total')}</th><th class="num">${t('th_cost')}</th><th class="num">${t('th_profit')}</th><th class="num">${t('th_margin')}</th><th>${t('th_delivery_date')}</th><th>${t('truck_company')}</th><th class="num">${t('th_truck')}</th><th>${t('th_payment')}</th></tr>`;
  let tt = 0, tc = 0, tp = 0;
  $('oh-tbody').innerHTML = rows.length ? rows.map(o => {
    tt += +o.total || 0; tc += +o.total_cost || 0; tp += o.profit || 0;
    const trucks = truckOf(o);
    return `<tr onclick="openOrderModal(${o.id})"><td class="tdn">${esc(o.order_no)}</td><td class="tdn" style="font-weight:600">${esc(o.customer_name || '')}</td><td>${esc(o.title || '')}</td><td>${esc(o.po_no || '—')}</td>
      <td class="num">${money(o.total)}</td><td class="num">${o.po_id ? money(o.total_cost) : '—'}</td><td class="num ${plCls(o.profit)}">${o.profit !== null ? money(o.profit) : '—'}</td><td class="num">${o.profit !== null && o.total ? pct(o.profit / o.total) : '—'}</td>
      <td>${esc(o.sched_date || o.order_date || '')}</td><td>${esc([...new Set(trucks.map(b => b.truck_company))].join(', '))}</td><td class="num">${o.truck_cost ? money(o.truck_cost) : ''}</td><td>${payCell(o)}</td></tr>`;
  }).join('') + `<tr style="background:var(--g50);font-weight:700"><td colspan="4">Total (${rows.length})</td><td class="num">${money(tt)}</td><td class="num">${money(tc)}</td><td class="num ${plCls(tp)}">${money(tp)}</td><td class="num">${tt ? pct(tp / tt) : ''}</td><td colspan="4"></td></tr>`
    : `<tr class="empty-row"><td colspan="12">${t('history_empty')}</td></tr>`;
}

// ---------- 待结账 ----------
function renderCheckout() {
  const pending = GROUPS.filter(g => g.status === 'pending');
  const badge = $('ck-badge'); badge.textContent = pending.length; badge.style.display = pending.length ? '' : 'none';
  if (!pending.length) { $('checkout-content').innerHTML = `<div style="text-align:center;color:var(--g400);padding:40px;font-size:12px">${t('checkout_empty')}<div style="margin-top:6px;font-size:11px">${t('checkout_hint')}</div></div>`; return; }
  $('checkout-content').innerHTML = pending.map(g => {
    const ords = ORDERS.filter(o => o.checkout_group_id === g.id);
    const total = ords.reduce((a, o) => a + (+o.total || 0), 0);
    return `<div class="card" style="border:1px solid var(--g200);border-radius:8px;margin:12px 8px;overflow:hidden">
      <div style="padding:12px 16px;background:var(--g50);display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
        <div><b>${esc(g.group_code)}</b> · <span class="badge ${g.group_type === 'sales' ? 'bg' : 'bb'}">${g.group_type === 'sales' ? 'SO' : 'PO'}</span> · <b>${esc(g.party_name || '')}</b>
          <div style="font-size:10px;color:var(--g500)">${ords.length} ${t('orders_n')} · ${esc(g.created_at || '')} · ${esc(g.created_by || '')}</div></div>
        <div style="display:flex;gap:8px;align-items:center"><span style="font-size:16px;font-weight:800;color:var(--pri)">${money(total)}</span>
          <button class="btn btn-pri btn-sm" onclick="invoiceGroup(${g.id})">${t('make_invoice')}</button>
          <button class="btn btn-out btn-sm" style="color:var(--red)" onclick="deleteGroup(${g.id})">${t('remove')}</button></div></div>
      <table><thead><tr><th>${t('th_order')}</th><th>${t('th_desc')}</th><th>${t('th_date')}</th><th class="num">${t('th_qty')}</th><th class="num">${t('f_unit_price')}</th><th class="num">${t('th_total')}</th><th>${t('th_status')}</th><th></th></tr></thead>
      <tbody>${ords.map(o => `<tr onclick="openOrderModal(${o.id})"><td class="tdn">${esc(o.order_no)}</td><td>${esc(o.title || '')}</td><td>${esc(o.order_date || '')}</td><td class="num">${esc(o.quantity)}</td>
        <td class="num">${money(o.unit_price)}</td><td class="num">${money(o.total)}</td><td>${statusBadge(o.status)}</td>
        <td onclick="event.stopPropagation()"><button class="btn-icon" title="${t('remove')}" onclick="removeFromGroup(${g.id},${o.id})">&times;</button></td></tr>`).join('')}</tbody></table></div>`;
  }).join('');
}
async function invoiceGroup(id) {
  try {
    const inv = await api(`/api/checkout-groups/${id}/invoice`, { method: 'POST', body: {} });
    toast('✓ ' + inv.invoice_no); await refreshAll(); switchTab(inv.invoice_type === 'sales' ? 'so-invoices' : 'po-invoices'); openInvoiceModal(inv.id);
  } catch (e) { toast(e.message, 'error'); }
}
async function deleteGroup(id) {
  if (!confirm(t('confirm_delete'))) return;
  try { await api('/api/checkout-groups/' + id, { method: 'DELETE' }); refreshAll(); } catch (e) { toast(e.message, 'error'); }
}
async function removeFromGroup(gid, oid) {
  try { await api(`/api/checkout-groups/${gid}/orders/${oid}`, { method: 'DELETE' }); refreshAll(); } catch (e) { toast(e.message, 'error'); }
}

// ---------- suppliers / customers (列表统计基于 PO / SO) ----------
function renderParties(kind) {
  const isSup = kind === 'suppliers';
  const q = $(isSup ? 'sup-search' : 'cust-search').value.trim().toLowerCase();
  const list = isSup ? SUPPLIERS : CUSTOMERS;
  const stats = {};
  for (const o of ORDERS) {
    if (o.status === 'cancelled') continue;
    const pid = isSup ? (o.order_type === 'purchase' && o.supplier_id) : (o.order_type === 'sales' && o.customer_id);
    if (!pid) continue;
    const s = stats[pid] = stats[pid] || { n: 0, sold: 0, spent: 0, rev: 0, profit: 0, bal: 0 };
    s.n += +o.quantity || 0; s.spent += +o.total || 0; s.rev += +o.total || 0; s.profit += o.profit || 0;
    if (isSup) s.sold += +o.sold_qty || 0;
  }
  for (const i of INVOICES) if ((i.invoice_type === 'sales') !== isSup && stats[i.party_id]) stats[i.party_id].bal += invBalance(i);
  if (!isSup) for (const o of ORDERS) if (o.order_type === 'sales' && o.status !== 'cancelled' && !o.invoice_id && stats[o.customer_id]) stats[o.customer_id].bal += +o.total || 0;
  const rows = list.filter(p => !q || [p.name, p.contact, p.phone, p.email, p.city, p.state, fmtAddr(p)].some(v => (v || '').toLowerCase().includes(q)));
  const cols = isSup
    ? [['name'], ['contact'], ['phone'], ['th_location_city'], ['loads_bought', 1], ['total_spent', 1], ['loads_sold', 1], ['s_profit', 1]]
    : [['name'], ['contact'], ['phone'], ['th_location_city'], ['delivery_method'], ['loads_sold', 1], ['total_revenue', 1], ['s_profit', 1], ['s_ar', 1]];
  $(kind + '-thead').innerHTML = '<tr>' + cols.map(([k, n]) => `<th class="${n ? 'num' : ''}">${t(k)}</th>`).join('') + '</tr>';
  $(kind + '-tbody').innerHTML = rows.length ? rows.map(p => {
    const s = stats[p.id] || { n: 0, sold: 0, spent: 0, rev: 0, profit: 0, bal: 0 };
    const nums = isSup ? [s.n, money(s.spent), s.sold, `<span class="${plCls(s.profit)}">${money(s.profit)}</span>`]
      : [s.n, money(s.rev), `<span class="${plCls(s.profit)}">${money(s.profit)}</span>`, s.bal ? `<span class="neg">${money(s.bal)}</span>` : money(0)];
    const initials = esc((p.name || '?').trim().slice(0, 2).toUpperCase());
    const loc = [p.city, p.state].filter(Boolean).join(', ');
    const ver = p.addr1 ? (p.addr_verified === '1' ? ' <span style="color:var(--grn)" title="Verified">&#10003;</span>' : ' <span style="color:var(--amb)" title="Unverified">&#9888;</span>') : '';
    const dm = !isSup ? `<td>${p.delivery_method ? `<span class="badge ${p.delivery_method === 'delivery' ? 'ba' : 'bb'}">${esc(t('dm_' + p.delivery_method))}</span>` : ''}</td>` : '';
    return `<tr onclick="openPartyModal('${kind}',${p.id})"><td><div class="tdv"><div class="tda" style="background:${isSup ? '#8B6914' : '#0891b2'}">${initials}</div><div class="tdn">${esc(p.name)}</div></div></td>
      <td>${esc(p.contact || '')}</td><td>${esc(p.phone || '')}</td><td>${esc(loc)}${ver}</td>${dm}${nums.map(v => `<td class="num">${v}</td>`).join('')}</tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="${cols.length}">${t('no_data')}</td></tr>`;
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

function csv(name, header, rows) {
  const q = v => { v = v ?? ''; v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  const blob = new Blob(['﻿' + [header, ...rows].map(r => r.map(q).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${name}-${today()}.csv`; a.click();
}

const payMethodsList = () => `<datalist id="pay-methods"><option>Cash</option><option>Zelle</option><option>Check</option><option>Wire / ACH</option><option>Venmo</option><option>Credit Card</option></datalist>`;

// ---------- modal ----------
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


// ---------- address verification (Google Geocoding via /api/geocode, fallback Mapbox) ----------
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
async function geoSearch(q) {
  if (CONFIG.geocoder === 'google') return api('/api/geocode?q=' + encodeURIComponent(q.trim()));
  return mbSearch(q);
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
  if (CONFIG.geocoder !== 'google' && !CONFIG.mapbox_token) return setAddrStatus(statusId, false, `<span style="color:var(--amb);font-size:9px">&#9888; GOOGLE_MAPS_API_KEY ${LANG === 'zh' ? '未设置 (请在 Railway 环境变量里添加)' : 'is not set (add it in Railway variables)'}</span>`);
  if (!q.trim()) return setAddrStatus(statusId, false, `<span style="color:var(--red);font-size:9px">${t('addr_not_found')}</span>`);
  setAddrStatus(statusId, false, `<span style="color:var(--g400);font-size:9px">${t('verifying')}</span>`);
  try { showMatches(statusId, await geoSearch(q), onPick); }
  catch (e) { setAddrStatus(statusId, false, `<span style="color:var(--amb);font-size:9px">&#9888; ${CONFIG.geocoder === 'google' ? esc(e.message) : t('net_err')}</span>`); }
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



// ---------- 卡车订单 ----------
const tbBadge = s => `<span class="badge ${s === 'paid' ? 'badge-completed' : 'badge-pending'}">${esc(t('tb_' + s))}</span>`;
const tbDates = b => esc(b.date_start || '') + (b.date_end && b.date_end !== b.date_start ? ' ~ ' + esc(b.date_end) : '');
const tbReceiptLinks = b => b.receipts.length ? b.receipts.map((f, i) => `<a href="/api/files/${encodeURIComponent(f)}" target="_blank" onclick="event.stopPropagation()" class="chip">&#128206; ${i + 1}</a>`).join(' ') : '<span style="color:var(--g400)">—</span>';
const tbOrders = b => b.orders.length ? b.orders.map(o => `<span class="chip" style="margin:1px">${esc(o.order_no)}</span>`).join('') + (b.orders.length > 1 ? `<div class="tdct">${t('per_order')} ${money(b.amount / b.orders.length)}</div>` : '')
  : `<span style="color:var(--amb);font-size:10px">&#9888; ${t('unallocated')}</span>`;
function tbRows() {
  const q = $('tb-search').value.trim().toLowerCase(), st = $('tb-status').value, co = $('tb-company').value, pu = $('tb-purpose').value;
  const f = $('tb-from').value, to = $('tb-to').value;
  return TRUCKS.filter(b => (!st || b.status === st) && (!co || b.truck_company === co) && (!pu || b.purpose === pu) &&
    (!f || (b.date_start || '') >= f) && (!to || (b.date_start || '') <= to) &&
    (!q || [b.bill_no, b.truck_company, b.state, b.invoice_no, b.paid_by, b.payment_method, b.notes, ...b.orders.map(o => o.order_no + ' ' + (o.title || ''))].some(v => (v || '').toLowerCase().includes(q))));
}
const TB_GET = { bill_no: b => b.bill_no || '', truck_company: b => (b.truck_company || '').toLowerCase(), date_start: b => b.date_start || '', purpose: b => b.purpose || '', amount: b => +b.amount || 0, status: b => b.status };
function renderTruckBills() {
  const open = TRUCKS.filter(b => b.status !== 'paid');
  const badge = $('tb-badge'); badge.textContent = open.length; badge.style.display = open.length ? '' : 'none';
  thead('tb-thead', [
    { t: 'th_bill', key: 'bill_no' }, { t: 'th_dates', key: 'date_start' }, { t: 'th_company', key: 'truck_company' }, { t: 'th_purpose', key: 'purpose' },
    { t: 'th_total', key: 'amount', num: 1 }, { t: 'th_linked' }, { t: 'notes' }, { t: 'th_receipt' }, { t: 'f_tb_method' }, { t: 'th_paid_by' }, { t: 'th_their_inv' }, { t: 'th_status', key: 'status' },
  ], 'tb', 'renderTruckBills');
  if (!sortState.tb) sortState.tb = { key: 'date_start', dir: -1 };
  const rows = applySort('tb', tbRows(), TB_GET);
  const total = rows.reduce((a, b) => a + (+b.amount || 0), 0), openAmt = rows.filter(b => b.status !== 'paid').reduce((a, b) => a + (+b.amount || 0), 0);
  $('tb-stats').innerHTML = chip(t('th_total'), money0(total)) + chip(t('tb_unpaid'), money0(openAmt)) + chip('#', rows.length);
  $('tb-tbody').innerHTML = rows.length ? rows.map(b => `<tr onclick="openTruckBillModal(${b.id})">
      <td class="tdn">${esc(b.bill_no)}${b.quote_no ? `<div class="tdct">${esc(b.quote_no)}</div>` : ''}</td><td>${tbDates(b)}</td>
      <td><div class="tdn" style="font-weight:600">${esc(b.truck_company || '')}</div><div class="tdct">${esc([b.state, b.size].filter(Boolean).join(' · '))}</div></td>
      <td>${esc(t('tp_' + b.purpose))}</td><td class="num" style="font-weight:700">${money(b.amount)}</td>
      <td style="white-space:normal;max-width:240px">${tbOrders(b)}</td><td style="max-width:160px;overflow:hidden;text-overflow:ellipsis">${esc(b.notes || '')}</td>
      <td>${tbReceiptLinks(b)}</td><td>${esc(b.payment_method || '')}</td><td>${esc(b.paid_by || '')}</td><td>${esc(b.invoice_no || '')}</td>
      <td>${tbBadge(b.status)}${b.paid_date ? `<div class="tdct">${esc(b.paid_date)}</div>` : ''}</td></tr>`).join('')
    : `<tr class="empty-row"><td colspan="12">${t('no_data')}</td></tr>`;
  $('tb-tfoot').innerHTML = rows.length ? `<tr><td colspan="4">${rows.length}</td><td class="num">${money(total)}</td><td colspan="7"></td></tr>` : '';
}
function openTruckBillModal(id) {
  const b = id ? TRUCKS.find(x => x.id === id) : { purpose: 'pickup', status: 'unpaid', date_start: today(), orders: [], receipts: [] };
  const linked = new Set(b.orders.map(o => o.id));
  const sel = (fid, opts, v, extra = '') => `<select class="modal-input" id="${fid}" ${extra}>${opts.map(([k, lab]) => `<option value="${esc(k)}" ${String(k) === String(v ?? '') ? 'selected' : ''}>${esc(lab)}</option>`).join('')}</select>`;
  const orderList = ORDERS.filter(o => o.status !== 'cancelled' || linked.has(o.id)).sort((x, y) => (linked.has(y.id) - linked.has(x.id)) || (y.id - x.id));
  openModal(id ? `${t('edit_truck')} — ${esc(b.bill_no)}` : t('new_truck'), `
    <datalist id="tb-co-list">${truckCompanies().map(c => `<option>${esc(c)}</option>`).join('')}</datalist>
    <datalist id="tb-paidby-list">${[...new Set(TRUCKS.map(x => x.paid_by).filter(Boolean))].map(c => `<option>${esc(c)}</option>`).join('')}</datalist>
    ${payMethodsList()}
    <div class="modal-row">${field(t('f_quote'), sel('tb-f-truck_quote_id', [['', t('none')], ...QUOTES.map(q => [q.id, `${q.quote_no} · ${q.company_name} · ${q.state || ''} · ${q.size || ''} · ${money(q.price)} ${t('pu_' + q.price_unit)}`])], b.truck_quote_id, 'onchange="tbQuotePicked()"'), true)}</div>
    <div class="modal-row" style="grid-template-columns:2fr 1fr 1fr 1fr">${field(t('f_truck_co') + ' *', inp('tb-f-truck_company', b.truck_company, 'text', 'list="tb-co-list"'))}
      ${field(t('f_state'), inp('tb-f-state', b.state, 'text', 'maxlength="2" style="text-transform:uppercase"'))}${field(t('f_size'), inp('tb-f-size', b.size))}
      ${field(t('f_purpose'), sel('tb-f-purpose', ['pickup', 'delivery', 'other'].map(k => [k, t('tp_' + k)]), b.purpose))}</div>
    <div class="modal-row" style="grid-template-columns:1fr 1fr 1fr">${field(t('f_date_start'), inp('tb-f-date_start', b.date_start, 'date', 'onchange="tbQuoteCalc(true)"'))}
      ${field(t('f_date_end'), inp('tb-f-date_end', b.date_end, 'date', 'onchange="tbQuoteCalc(true)"'))}
      ${field(t('f_amount') + ' *', inp('tb-f-amount', b.amount, 'number', 'oninput="tbPerOrder()"'))}</div>
    <div id="tb-calc" style="font-size:10px;color:var(--g500);margin:-4px 0 6px"></div>
    <div class="modal-section">${t('sec_pay')}</div>
    <div class="modal-row" style="grid-template-columns:repeat(4,1fr)">
      ${field(t('f_tb_status'), sel('tb-f-status', [['unpaid', t('tb_unpaid')], ['paid', t('tb_paid')]], b.status))}${field(t('f_paid_date'), inp('tb-f-paid_date', b.paid_date, 'date'))}
      ${field(t('f_tb_method'), inp('tb-f-payment_method', b.payment_method, 'text', 'list="pay-methods"'))}${field(t('f_paid_by'), inp('tb-f-paid_by', b.paid_by, 'text', 'list="tb-paidby-list"'))}</div>
    <div class="modal-row">${field(t('f_their_inv'), inp('tb-f-invoice_no', b.invoice_no))}<div></div></div>
    <div class="modal-section">${t('f_link_orders')} <span id="tb-per" style="float:right;color:var(--g600);font-weight:600"></span></div>
    <input class="modal-input" placeholder="${t('search')}" oninput="tbFilterOrders(this.value)" style="margin-bottom:6px"/>
    <div id="tb-order-list" style="max-height:200px;overflow:auto;border:1px solid var(--g200);border-radius:7px">
      ${orderList.length ? orderList.map(o => `<label data-s="${esc((o.order_no + ' ' + (o.title || '') + ' ' + (o.supplier_name || '') + ' ' + (o.customer_name || '')).toLowerCase())}" style="display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--g100);font-size:11px;cursor:pointer">
        <input type="checkbox" class="tb-ord" value="${o.id}" ${linked.has(o.id) ? 'checked' : ''} onchange="tbPerOrder()" style="accent-color:var(--pri)"/>
        <span class="badge ${o.order_type === 'sales' ? 'bg' : 'bb'}">${o.order_type === 'sales' ? 'SO' : 'PO'}</span><b>${esc(o.order_no)}</b>
        <span style="flex:1;color:var(--g600);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(o.title || '')} · ${esc(o.supplier_name || o.customer_name || '')}${o.sched_date ? ' · ' + esc(o.sched_date) : ''}</span>${statusBadge(o.status)}</label>`).join('')
        : `<div style="padding:12px;color:var(--g400);font-size:11px">${t('no_data')}</div>`}
    </div>
    <div class="modal-section">${t('receipts')}</div>
    <div id="tb-receipts" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">${tbReceiptChips(b)}</div>
    <input type="file" id="tb-files" multiple accept="image/*,application/pdf" style="font-size:11px"/>
    <div class="modal-row" style="margin-top:10px">${field(t('notes'), `<textarea class="modal-input" id="tb-f-notes">${esc(b.notes || '')}</textarea>`, true)}</div>
    <div class="modal-actions">
      ${id && currentUser.role === 'admin' ? `<button class="btn-del" onclick="deleteTruckBill(${id})">${t('delete')}</button>` : ''}
      <button class="btn-cancel" onclick="closeModal()">${t('cancel')}</button><button class="btn-save" id="tb-save" onclick="saveTruckBill(${id || 'null'})">${t('save')}</button>
    </div>`, 760);
  tbPerOrder();
}
// 选报价 → 带出公司/州/尺寸, 按天/趟算金额
function tbQuotePicked() {
  const q = QUOTES.find(x => String(x.id) === $('tb-f-truck_quote_id').value);
  if (!q) return tbQuoteCalc();
  $('tb-f-truck_company').value = q.company_name || ''; $('tb-f-state').value = q.state || ''; $('tb-f-size').value = q.size || '';
  tbQuoteCalc(true);
}
function tbQuoteCalc(force) {
  const q = QUOTES.find(x => String(x.id) === $('tb-f-truck_quote_id').value);
  if (!q) { $('tb-calc').textContent = ''; return; }
  let n = 1;
  if (q.price_unit === 'day' && $('tb-f-date_start').value) {
    const e = $('tb-f-date_end').value || $('tb-f-date_start').value;
    n = Math.max(1, Math.round((new Date(e) - new Date($('tb-f-date_start').value)) / 864e5) + 1);
  }
  const amt = Math.round(q.price * n * 100) / 100;
  $('tb-calc').textContent = `${money(q.price)} ${t('pu_' + q.price_unit)}${q.price_unit === 'day' ? ` × ${n} ${t('days')}` : ''} = ${money(amt)}`;
  if (force || !$('tb-f-amount').value) { $('tb-f-amount').value = amt; tbPerOrder(); }
}
const tbReceiptChips = b => (b.receipts || []).map((f, i) => `<span class="chip"><a href="/api/files/${encodeURIComponent(f)}" target="_blank">&#128206; ${t('th_receipt')} ${i + 1}</a>
  <a href="#" onclick="event.preventDefault();delTruckReceipt(${b.id},'${esc(f)}')" style="color:var(--red);margin-left:4px">&times;</a></span>`).join('');
function tbFilterOrders(q) { q = q.toLowerCase(); document.querySelectorAll('#tb-order-list label').forEach(l => { l.style.display = !q || l.dataset.s.includes(q) ? 'flex' : 'none'; }); }
function tbPerOrder() {
  const n = document.querySelectorAll('.tb-ord:checked').length, amt = +$('tb-f-amount').value || 0;
  $('tb-per').innerHTML = n ? `${n} × ${money(amt / n)}` : `<span style="color:var(--amb)">${t('unallocated')}</span>`;
}
async function saveTruckBill(id) {
  const body = {};
  ['truck_quote_id', 'truck_company', 'state', 'size', 'purpose', 'date_start', 'date_end', 'amount', 'status', 'paid_date', 'payment_method', 'paid_by', 'invoice_no', 'notes'].forEach(k => body[k] = $('tb-f-' + k).value);
  body.order_ids = [...document.querySelectorAll('.tb-ord:checked')].map(c => +c.value);
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
  csv('truck-orders', ['Rental #', 'Truck Company', 'State', 'Size', 'Purpose', 'Start', 'End', 'Amount', 'Linked Orders', 'Per Order', 'Their Invoice', 'Payment Method', 'Paid By', 'Status', 'Paid Date', 'Notes'],
    applySort('tb', tbRows(), TB_GET).map(b => [b.bill_no, b.truck_company, b.state, b.size, b.purpose, b.date_start, b.date_end, b.amount, b.orders.map(o => o.order_no).join(' '),
      b.orders.length ? (b.amount / b.orders.length).toFixed(2) : '', b.invoice_no, b.payment_method, b.paid_by, b.status, b.paid_date, b.notes]));
}

// ---------- 卡车明细 (报价) ----------
function renderTruckQuotes() {
  const q = $('tq-search').value.trim().toLowerCase(), co = $('tq-company').value, st = $('tq-state').value, sz = $('tq-size').value;
  const rows = QUOTES.filter(x => (!co || x.company_name === co) && (!st || x.state === st) && (!sz || x.size === sz) &&
    (!q || [x.quote_no, x.company_name, x.state, x.size, x.notes].some(v => (v || '').toLowerCase().includes(q))));
  $('tq-thead').innerHTML = `<tr><th>${t('th_quote')}</th><th>${t('th_company')}</th><th>${t('f_state')}</th><th>${t('th_size')}</th><th class="num">${t('th_price')}</th><th>${t('th_unit')}</th><th>${t('th_date')}</th><th class="num">${t('th_uses')}</th><th>${t('notes')}</th></tr>`;
  $('tq-tbody').innerHTML = rows.length ? rows.map(x => `<tr onclick="openQuoteModal(${x.id})"><td class="tdn">${esc(x.quote_no)}</td><td class="tdn" style="font-weight:600">${esc(x.company_name)}</td>
    <td>${esc(x.state || '')}</td><td>${esc(x.size || '')}</td><td class="num" style="font-weight:700">${money(x.price)}</td><td>${esc(t('pu_' + x.price_unit))}</td><td>${esc(x.quote_date || '')}</td>
    <td class="num">${x.use_count || 0}</td><td style="max-width:240px;overflow:hidden;text-overflow:ellipsis">${esc(x.notes || '')}</td></tr>`).join('')
    : `<tr class="empty-row"><td colspan="9">${t('no_data')}</td></tr>`;
}
function openQuoteModal(id) {
  const q = id ? QUOTES.find(x => x.id === id) : { price_unit: 'day', quote_date: today() };
  openModal(id ? `${t('edit_quote')} — ${esc(q.quote_no)}` : t('new_quote'), `
    <datalist id="tq-co-list">${truckCompanies().map(c => `<option>${esc(c)}</option>`).join('')}</datalist>
    <div class="modal-row" style="grid-template-columns:2fr 1fr 1fr">${field(t('th_company') + ' *', inp('tq-f-company_name', q.company_name, 'text', 'list="tq-co-list"'))}
      ${field(t('f_state'), inp('tq-f-state', q.state, 'text', 'maxlength="2" style="text-transform:uppercase"'))}${field(t('f_size'), inp('tq-f-size', q.size, 'text', 'placeholder="26ft / 53ft / box truck"'))}</div>
    <div class="modal-row" style="grid-template-columns:1fr 1fr 1fr">${field(t('th_price'), inp('tq-f-price', q.price, 'number'))}
      ${field(t('th_unit'), `<select class="modal-input" id="tq-f-price_unit">${['day', 'trip', 'hour'].map(u => `<option value="${u}" ${q.price_unit === u ? 'selected' : ''}>${t('pu_' + u)}</option>`).join('')}</select>`)}
      ${field(t('th_date'), inp('tq-f-quote_date', q.quote_date, 'date'))}</div>
    <div class="modal-row">${field(t('notes'), `<textarea class="modal-input" id="tq-f-notes">${esc(q.notes || '')}</textarea>`, true)}</div>
    <div class="modal-actions">
      ${id && currentUser.role === 'admin' ? `<button class="btn-del" onclick="deleteQuote(${id})">${t('delete')}</button>` : ''}
      <button class="btn-cancel" onclick="closeModal()">${t('cancel')}</button><button class="btn-save" onclick="saveQuote(${id || 'null'})">${t('save')}</button>
    </div>`, 600);
}
async function saveQuote(id) {
  const body = {}; ['company_name', 'state', 'size', 'price', 'price_unit', 'quote_date', 'notes'].forEach(k => body[k] = $('tq-f-' + k).value);
  if (!body.company_name.trim()) return toast(t('th_company') + '?', 'error');
  try { await api('/api/truck-quotes' + (id ? '/' + id : ''), { method: id ? 'PUT' : 'POST', body }); closeModal(); toast(t('saved')); refreshAll(); }
  catch (e) { toast(e.message, 'error'); }
}
async function deleteQuote(id) {
  if (!confirm(t('confirm_delete'))) return;
  try { await api('/api/truck-quotes/' + id, { method: 'DELETE' }); closeModal(); toast(t('deleted')); refreshAll(); } catch (e) { toast(e.message, 'error'); }
}

// ---------- 租车历史 (已完成卡车订单) ----------
function renderTruckHistory() {
  const q = $('thi-search').value.trim().toLowerCase(), f = $('thi-from').value, to = $('thi-to').value;
  const rows = TRUCKS.filter(b => b.status === 'paid' && (!f || (b.date_start || '') >= f) && (!to || (b.date_start || '') <= to) &&
    (!q || [b.bill_no, b.truck_company, b.notes, ...b.orders.map(o => o.order_no)].some(v => (v || '').toLowerCase().includes(q))))
    .sort((a, b) => (b.date_start || '').localeCompare(a.date_start || ''));
  $('thi-thead').innerHTML = `<tr><th>${t('th_bill')}</th><th>${t('th_dates')}</th><th>${t('th_company')}</th><th>${t('th_purpose')}</th><th class="num">${t('th_total')}</th><th>${t('th_linked')}</th><th>${t('f_paid_date')}</th><th>${t('f_tb_method')}</th><th>${t('th_paid_by')}</th><th>${t('th_receipt')}</th></tr>`;
  const total = rows.reduce((a, b) => a + (+b.amount || 0), 0);
  $('thi-tbody').innerHTML = rows.length ? rows.map(b => `<tr onclick="openTruckBillModal(${b.id})"><td class="tdn">${esc(b.bill_no)}</td><td>${tbDates(b)}</td>
    <td class="tdn" style="font-weight:600">${esc(b.truck_company || '')}</td><td>${esc(t('tp_' + b.purpose))}</td><td class="num" style="font-weight:700">${money(b.amount)}</td>
    <td style="white-space:normal;max-width:240px">${tbOrders(b)}</td><td>${esc(b.paid_date || '')}</td><td>${esc(b.payment_method || '')}</td><td>${esc(b.paid_by || '')}</td><td>${tbReceiptLinks(b)}</td></tr>`).join('') +
    `<tr style="background:var(--g50);font-weight:700"><td colspan="4">Total (${rows.length})</td><td class="num">${money(total)}</td><td colspan="5"></td></tr>`
    : `<tr class="empty-row"><td colspan="10">${t('no_data')}</td></tr>`;
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
