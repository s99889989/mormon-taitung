# 合併說明

## 專案結構

```
前台路由 /          → layouts/default.vue（Bootstrap NavBar）
後台路由 /admin     → layouts/admin.vue（Tailwind NavBar + BottomBar）
登入頁  /admin/login → layouts/blank.vue（無 NavBar）
```

---

## 整合步驟

### 1. 以後台專案為基底，複製這些新增檔案進去

| 檔案 | 說明 |
|------|------|
| `nuxt.config.ts` | 整合後的設定（同時引入 Bootstrap + Tailwind） |
| `app.vue` | 改用 `<NuxtLayout>` |
| `package.json` | 加入 bootstrap 依賴 |
| `tailwind.config.js` | 不變 |
| `assets/css/main.css` | 不變 |
| `layouts/default.vue` | 前台 layout |
| `layouts/admin.vue` | 後台 layout |
| `layouts/blank.vue` | 登入頁 layout |
| `middleware/auth.global.ts` | 後台登入驗證 |
| `server/api/login.post.ts` | 登入 API |
| `server/api/logout.post.ts` | 登出 API |
| `components/NavBar.vue` | 後台導覽（加了登出按鈕） |
| `components/BottomBar.vue` | 後台底部導覽 |
| `components/NavBarWebsite.vue` | 前台導覽 |
| `pages/index.vue` | 前台首頁 |
| `pages/admin/login.vue` | 登入頁 |
| `pages/admin/index.vue` | 後台首頁（跳轉） |
| `pages/activity/...` | 前台活動頁（從前台專案複製） |
| `pages/baptism/...` | 前台洗禮頁 |
| `pages/genealogy/...` | 前台族譜頁 |
| `pages/clean/...` | 前台打掃頁 |
| `pages/temple/...` | 前台聖殿頁 |
| `pages/english.vue` | 前台英文會話頁 |
| `pages/link.vue` | 前台連結頁 |

### 2. 安裝新依賴

```bash
npm install bootstrap
```

### 3. 幫所有後台頁面加上 layout meta

把後台現有的 pages/admin 所有 .vue 檔複製進來後，執行：

```bash
node add_admin_layout.mjs
```

這個 script 會自動幫所有 `pages/admin` 下的頁面加上：
```js
definePageMeta({ layout: 'admin' })
```

### 4. 複製前台的 public 資源

把前台專案的 `public/` 資料夾內容複製到後台專案的 `public/` 下：
```
public/english/taidong.jpg
public/active/...
public/assets/icon/hat.png
public/baptism/...
public/clean/...
public/genealogy/...
```

### 5. 設定後台密碼

在專案根目錄建立 `.env`：
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=你的密碼
```

---

## 登入驗證說明

- 訪問任何 `/admin/*` 路由時，`middleware/auth.global.ts` 會檢查 cookie
- 沒有登入會跳到 `/admin/login`
- 登入成功後 cookie 有效期 7 天
- 登出會清除 cookie

---

## 路由對照

| 路由 | 說明 |
|------|------|
| `/` | 前台首頁 |
| `/activity/ActivityIndex` | 前台活動列表 |
| `/english` | 英文會話 |
| `/admin/login` | 後台登入 |
| `/admin/roll_call/list` | 後台點名列表 |
| `/admin/member/list` | 後台人員列表 |
| `/admin/family/list` | 後台家庭列表 |
| `/admin/activity/list` | 後台活動列表 |
