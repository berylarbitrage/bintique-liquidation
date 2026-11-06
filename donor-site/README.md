# 卵子 / 精子捐赠者招募网站（donor-site）

Next.js 15（App Router）+ TypeScript + Tailwind v4 + shadcn/ui 风格组件 + Supabase + Resend。
所有品牌/补偿/州等占位符集中在 **`config/site.ts`**，资格规则在 **`config/eligibility.ts`**。

---

## 1. 本地启动

```bash
cd donor-site
pnpm install
cp .env.example .env.local   # 然后填入下面第 2 节拿到的值
pnpm dev                     # http://localhost:3000
```

不配置 Supabase 也能浏览所有营销页面；提交问卷会返回 503（“暂不可用”）。

常用命令：

| 命令 | 作用 |
|---|---|
| `pnpm dev` / `pnpm build` / `pnpm start` | 开发 / 构建 / 生产启动 |
| `pnpm lint` / `pnpm typecheck` | ESLint / TypeScript 检查 |
| `pnpm test` | 单元测试（资格规则、API、CSV、邮件模板等，无需数据库） |
| `pnpm test:rls` | **真实 Supabase** 上的 RLS + 照片签名 URL 集成测试（见第 3 节） |
| `pnpm test:rls:sql` | 在普通 Postgres 上跑迁移 + RLS 断言（无需 Docker） |
| `pnpm email:test you@example.com` | 用 Resend 把三种邮件模板发到指定邮箱 |

---

## 2. 需要你在第三方平台操作的步骤（清单）

> 这些步骤我无法替你完成，请逐项勾选。

### Supabase
- [ ] 在 supabase.com 新建项目（建议区域：US East）
- [ ] Project Settings → API：复制 `Project URL`、`anon` key、`service_role` key 到 `.env.local`
      （`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`）
- [ ] 执行数据库迁移（二选一）：
  - CLI：`npx supabase login` → `npx supabase link --project-ref <ref>` → `npx supabase db push`
  - 或在 Dashboard → SQL Editor 中**按文件名顺序**粘贴运行 `supabase/migrations/*.sql`
- [ ] Authentication → Providers → Email：保持开启；**关闭 “Allow new users to sign up”**
      （账号只由服务器在申请人预筛合格后创建）
- [ ] Authentication → URL Configuration：Site URL 填 `https://{{DOMAIN}}`；
      Redirect URLs 加入 `https://{{DOMAIN}}/auth/confirm` 和 `http://localhost:3000/auth/confirm`
- [ ] Storage：确认迁移已创建 **private** bucket `donor-photos`（5MB、仅 JPG/PNG）

> 登录邮件由本站通过 Resend 发送（链接指向 `/auth/confirm`），**不需要**修改 Supabase 的邮件模板。

### Resend
- [ ] 注册 resend.com，创建 API Key → `RESEND_API_KEY`
- [ ] 测试模式：不设置 `EMAIL_FROM` 时用 `onboarding@resend.dev` 发信，**只能发给你注册 Resend 的邮箱**
- [ ] 上线前：Domains → 添加并验证 `{{DOMAIN}}`（加 DNS 记录），然后设置
      `EMAIL_FROM="Brand Name <hello@{{DOMAIN}}>"`
- [ ] `ADMIN_NOTIFY_EMAIL` 填接收新申请通知的邮箱

### Cloudflare Turnstile（防刷）
- [ ] Cloudflare Dashboard → Turnstile → Add site（域名填 `{{DOMAIN}}` 和 `localhost`）
- [ ] 复制 Site Key / Secret Key → `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`
- 未配置时会跳过 Turnstile 校验（本地开发方便），生产环境务必配置

### 统计
- [ ] GA4：创建数据流 → Measurement ID（`G-XXXX`）→ `NEXT_PUBLIC_GA_ID`
- [ ] Meta：Events Manager 创建 Pixel → `NEXT_PUBLIC_META_PIXEL_ID`
- 两者只在访客点击 Cookie 横幅 “Accept all” 后才加载；预筛提交成功触发 GA4 `generate_lead` 与 Meta `Lead`

### Vercel 部署
- [ ] vercel.com → Add New Project → 导入此仓库，**Root Directory 选 `donor-site`**（Framework: Next.js，包管理器 pnpm 自动识别）
- [ ] Settings → Environment Variables：填入 `.env.example` 中的全部变量（`NEXT_PUBLIC_SITE_URL=https://{{DOMAIN}}`）
- [ ] Settings → Domains：添加 `{{DOMAIN}}` 和 `www.{{DOMAIN}}`，按提示在域名商处配置 DNS
- [ ] 部署后按第 5 节做一次全流程验收

---

## 3. 数据库迁移与 RLS 测试

迁移文件：`supabase/migrations/`
- `20261106000000_init.sql`：全部表、触发器、RLS、`donor-photos` 私有 bucket 及其策略
- `20261106000100_admin_stats.sql`：后台统计函数（仅管理员可调用）

本地 Supabase（需要 Docker）：

```bash
npx supabase init          # 首次：生成 supabase/config.toml（已有 migrations 目录不受影响）
npx supabase start         # 启动后会打印本地 URL / anon key / service_role key
npx supabase db reset      # 应用所有迁移
SUPABASE_URL=http://127.0.0.1:54321 SUPABASE_ANON_KEY=... SUPABASE_SERVICE_ROLE_KEY=... pnpm test:rls
```

`pnpm test:rls` 会验证：申请人 A 读不到/改不了申请人 B 的申请、完整申请、照片和 Storage 文件；
申请人不能改自己的状态和角色；匿名用户不能读写任何表；bucket 不可公开访问；照片签名 URL 有效期正好 600 秒且过期后失效。
**不要对生产库运行**（会创建/删除测试用户）。

不想装 Docker 时，可用任意 Postgres 跑 SQL 版 RLS 断言：
`PGURL=postgres://postgres@localhost:5432/postgres pnpm test:rls:sql`

---

## 4. 创建第一个管理员账号

1. Supabase Dashboard → Authentication → Users → **Add user** → 输入你的邮箱，勾选 Auto Confirm
2. SQL Editor 运行：
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'you@example.com');
   ```
3. 打开 `/login?next=/admin`，输入邮箱 → 收到登录链接 → 进入 `/admin`

非管理员（包括未登录者）访问 `/admin` 一律得到 404。

---

## 5. 上线验收清单

- [ ] 用一个合格条件提交卵子预筛 → 结果页显示合格 → 收到 “Next steps” 邮件 → 点链接进入 `/portal/application`
- [ ] 完成 5 个表单段、上传童年照 + 近照、签名提交 → 状态变为 `full_app_submitted`，管理员收到通知
- [ ] 用不合格条件提交 → 收到感谢邮件（含推荐链接）
- [ ] 同一邮箱 24 小时内再次提交 → 提示已提交
- [ ] `/refer` 生成链接 → 用该链接打开并提交 → 后台该申请显示推荐人
- [ ] 后台：筛选、搜索、改状态（`audit_log` 有记录）、加备注、导出 CSV、删除申请人数据
- [ ] `/sitemap.xml` 不含 `/admin`、`/portal`；`/robots.txt` 禁止抓取它们

---

## 6. 项目结构

```
config/         site.ts（占位符）、eligibility.ts（资格规则）、us-states.ts
content/faq.ts  FAQ 内容（按 general / egg / sperm 分组）
app/(site)/     公开页面、预筛问卷、推荐、登录、申请人门户
app/admin/      后台（layout 中校验管理员，否则 404）
app/api/        apply / refer / contact / portal/* / admin/* / auth/*
lib/            eligibility（纯函数）、schemas（前后端共用 zod）、supabase 客户端、email、rate-limit、audit…
emails/         React Email 模板
supabase/       迁移 + SQL 测试
tests/          Vitest 单元测试；tests/rls/ 为真实 Supabase 集成测试
```

## 7. 合规与安全说明

- 隐私政策与使用条款为**占位文案，需律师审阅**（页面顶部已标注）
- 健康信息不进入邮件、日志和 URL；服务端日志经 `lib/log.ts` 脱敏
- 预筛结果在服务端重新计算；匿名用户无任何表权限，预筛写入走服务端 service role
- 安全头（CSP、HSTS、X-Frame-Options 等）在 `next.config.ts`
- 速率限制为内存实现（每 IP 每分钟 10 次，按实例计）。流量变大后建议换成 Upstash Redis / Vercel KV
- 补偿文案统一为对时间和付出的补偿，不按个人特征区分报价
- SMS：本期未接入短信发送服务；同意状态存于 `applications.sms_consent`，接入时只对 `true` 的号码发送，并在文案中包含 “Reply STOP to opt out”
