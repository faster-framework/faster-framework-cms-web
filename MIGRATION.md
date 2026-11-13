# 技术栈升级说明（Ant Design Pro v5）

本次升级只调整底层依赖与必要的语法兼容，页面结构、组件组织方式和业务交互保持不变。

## 版本

| 包 | 升级前 | 升级后 |
|---|---|---|
| React / ReactDOM | 16.8 | **18.3.1** |
| antd | 3.24 | **5.29.3** |
| @ant-design/pro-layout | 4.8 | 由 **@ant-design/pro-components 2.8.10** 提供 |
| umi / @umijs/max | 2.9 | **4.7.32** |
| dva | 2.4 | 由 `@umijs/plugins` 的 dva 插件提供 |
| braft-editor | 2.3.8 | **2.3.9**（保持最新；其 peer 仍声明 React 15/16，使用 `legacy-peer-deps` 安装） |
| Node | >=10 | **>=18**（当前用 Node 24 验证） |
| 测试 | 无 | Vitest + Testing Library（`tests/`） |

> antd 6 已发布，但 `@ant-design/pro-components@2` 的 peerDependencies 仅支持 antd 4/5；为了使用 Pro v5 组件，本项目固定在 antd 5 最新版。

## 主要兼容性改动

1. **umi 4 运行时**
   - 布局组件由 `props.children` 改为 `<Outlet />`（SecurityLayout / BasicLayout / LoginLayout）。
   - `umi/router` 改为 `history`，`Redirect` 改为 `Navigate`，`Link`/`connect` 改从 `@umijs/max` 导入。
   - 新增 `src/common/utils/store.js`，用 `getDvaApp()` 替代 umi 2 的 `window.g_app`。
2. **antd 5 组件兼容**
   - 新增 `src/common/components/Form` 兼容层，保留 `Form.create()`、`getFieldDecorator()`、`validateFields(callback)` 写法，内部转换为 antd 5 的 `Form.Item name/rules` 与 Promise 校验。
   - `Table.Column`、`Tabs.TabPane` 在 antd 5 中已无渲染能力：`TablePro` 内部把 Column children 转成 `columns`；`Tabs` 改为 `items`。
   - `Icon` 改为 `@ant-design/icons`；Button 的字符串 `icon` 改为图标组件。
   - `Modal.visible` → `Modal.open`，`Dropdown.overlay` → `Dropdown.menu`，`Select.Option` → `options`。
   - 表单自定义校验由 callback 改为 Promise（`UserAdd` / `UserPwdModify`）。
   - 页面内 `ref="xxx"` 全部改为 callback ref，Modal 刷新改为 `tableList={() => this.tableList}`，避免 React 18 的 string ref 警告，同时修复弹窗保存后刷新时机问题。
3. **样式**
   - antd 5 不再提供 Less 主题变量，新增 `src/common/styles/antd-theme.less`（与 antd 5 默认 token 对齐）。
   - 引入 `antd/dist/reset.css`（`src/app.jsx`）。
   - 文章页的 GridContent 内部多了一层 `.ant-pro-grid-content-children`，补充 flex 规则以保持左右布局。
   - 隐藏 ProLayout 在侧边栏底部重复渲染的用户操作区。
4. **构建与环境**
   - 配置改为 umi 4 的 `defineConfig`，移除已废弃的主题插件与 `plugin.config.js`。
   - `BASE_API` 支持 `API_BASE` 环境变量覆盖；prod/test 仍默认 `http://127.0.0.1:8080/admin`，部署时请显式传入。
   - 提交 `package-lock.json`，新增 `.nvmrc`、`.npmrc`（`legacy-peer-deps=true`）。
5. **自测数据**
   - 补充 `mock/content.js`、`mock/sys/dict/all`，并同步 Mock 权限码，便于本地跑通所有页面。

## 运行与自测

```bash
npm ci                # 需要 Node 18+；如遇 braft-editor peer 警告，本项目 .npmrc 已处理
npm run mock          # Mock 模式，默认 http://localhost:8000
npm run dev           # 连接本地后端 http://127.0.0.1:8080/admin
npm run prod          # 生产构建
npm run test          # test 环境构建（沿用原脚本语义）
npm run test:unit     # Vitest 单元测试
```

生产构建指定接口地址：

```bash
API_BASE=https://api.example.com/admin npm run prod
```

## 自测结果（2026-11-13）

- 生产构建通过（Umi 4.7.32 / webpack 5）。
- 10 条路由（首页、用户/角色/权限/字典、栏目/文章、站点、登录、404）在 Chromium 中渲染通过，无 HTTP 4xx/5xx。
- 登录 → 首页、新增用户弹窗提交、页签切换（只渲染一份当前页面）均通过。
- 生产 bundle 在 5000 端口静态服务 + Mock API 跨域场景下，路由、登录、弹窗、表格全部通过，控制台 0 error。
- 单元测试 3/3 通过（Form 兼容层）。
- 已知非阻断提示（仅开发模式）：antd 静态 `message` 的上下文提示、antd Tooltip 的 `findDOMNode` 弃用提示；生产构建不会输出。

## 仍建议后续处理

- 用 antd 5 原生 Form 逐步替换兼容层（`Form.create`/`getFieldDecorator` 最终移除）。
- 用 `App.useApp()` 替代静态 `message`，消除开发提示。
- 将 braft-editor 替换为仍维护的编辑器（其 peer 依赖仍停留在 React 16）。
- 补充真实后端联调、接口错误码与 CORS 配置。
