# Bintique Liquidation — liquidation.bintique.com

弃货 (liquidation load) 管理系统。布局/风格与 pallet.bintique.com 一致。

核心思路（照 pallet 的 PO / SO）：
- **PO Orders（采购）**：从货源买进一拖弃货 —— 我们的成本 = 金额 + 额外支出（人工/装卸…）+ 卡车费
- **SO Orders（销售）**：卖给谁、卖多少钱；SO 关联到卖的是哪一张 PO
- **毛利**自动算：SO 金额 − PO 成本（按数量分摊，卖一半就摊一半）− SO 自己的额外支出和卡车费
- 卡车订单关联到 PO/SO，金额平摊进这些订单的成本

## 菜单（和 pallet 一样）
| 菜单 | 内容 |
|---|---|
| 总览 Dashboard | 销售额、销售成本、毛利、毛利率、采购额、未卖出 PO、待收款、待付款、卡车费用；按年/月筛选；图表 |
| Suppliers / Customers | 货源 / 买家；Google Maps 地址验证（未验证不能保存；没设 Google key 时退回 Mapbox）；买家选 送货 / 自提 |
| PO Orders / SO Orders | 订单列表、筛选、导出 CSV；勾选同一个客户/货源的订单 → 生成发票 或 Move to Checkout；PO 里点「卖出」直接建 SO；**打印 PO / SO 单据**（订单弹窗里的「打印 PO/SO」，或勾选多张后点「打印」批量出）；订单弹窗里可直接「生成发票」/「打印发票」 |
| 销售发票 / 采购发票 | 发票列表、记录付款（付清后订单自动变已完成）、回执上传、打印发票 |
| 历史订单 | 已完成的 SO，带成本、毛利、卡车 |
| 待结账 | 移过来的订单组，一键生成发票 |
| 卡车订单 / 卡车明细 / 租车历史 | 租车单（关联订单、付款、收据）、卡车报价（选报价自动按天/趟算金额）、已完成的租车 |
| 用户 / Backup | 管理员：账号、JSON 备份 |

银行账单 / 银行流水：等 pallet 的 API 加上登录验证后，再接 pallet 的同一套银行数据。

旧版「弃货库存」的数据在第一次启动时会自动迁移成 PO（+ 已卖出的生成 SO，已收款的生成销售发票），旧表保留在备份里。

## 本地运行
```
npm install
npm start
```
打开 http://localhost:3000 ，默认账号 `admin` / `liquidation2026`（首次启动时创建，**上线前请设置 `ADMIN_PASS`**）。

## 部署到 Railway
1. 在 Railway 新建项目 → 连接本仓库
2. 添加 Volume，挂载路径 `/data`（SQLite 数据库存在这里）
3. 环境变量：`ADMIN_USER=admin`、`ADMIN_PASS=<强密码>`；`GOOGLE_MAPS_API_KEY=<Google Cloud API key，需开通 Geocoding API>`（地址验证要用，没设的话「验证」按钮会提示；也可以只设 `MAPBOX_TOKEN` 继续用 Mapbox）
   打印单据抬头的公司信息（可选）：`COMPANY_NAME`、`COMPANY_ADDRESS`、`COMPANY_PHONE`、`COMPANY_EMAIL`
   卡车收据文件存在 `/data/uploads`
4. Deploy

## 绑定域名 liquidation.bintique.com
Railway → Settings → Networking → Custom Domain → 填 `liquidation.bintique.com`，
然后在 bintique.com 的 DNS 里加一条 **CNAME**：`liquidation` → Railway 给出的目标地址。

## 技术
Node.js + Express + better-sqlite3，单页前端（`public/`），Chart.js 由服务器本地提供。
