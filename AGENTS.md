# Pallas

Pallas 是 Aegis 认证服务的前端界面，负责登录、授权同意、OAuth 回调、错误展示和用户安全设置等认证体验。

## 技术栈

- React 19
- Vite 7
- TypeScript 5
- shadcn/ui + Radix UI + Tailwind CSS
- 独立仓库发布的 `@heliannuuthus/ui` 组件库
- React Router 7
- Sass
- `@heliannuuthus/aegis-ts`

## 目录结构

| 路径 | 说明 |
|------|------|
| `src/pages/Login/` | 登录流程、IDP/验证码/Passkey 等 |
| `src/pages/Consent/` | OAuth 授权同意 |
| `src/pages/Callback/` | OAuth 回调处理 |
| `src/pages/Profile/` | 用户安全设置等 |
| `src/services/` | API 服务层 |
| `src/types/` | 共享类型 |
| `src/styles/` | 全局样式 |

## 常用命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm type-check
pnpm format:check
```

## 关键约束

- API 调用必须走 `src/services/`，不要在组件中直接拼底层请求。
- 与 Aegis 后端交互时，优先使用 IdP entry / challenge / MFA 的现有服务封装。
- OAuth authorize 路径、回调参数、returnTo、state 校验不要随意改语义。
- 通用、领域无关的 UI primitive 归 `heliannuuthus/ui` 独立仓库维护，通过 `@heliannuuthus/ui/<component>` 显式子路径导入。
- 开发前先检查 `@heliannuuthus/ui`；缺少基础组件或扩展点时，先在独立 `ui` 仓库补齐 API、文档与验证，再升级 Pallas 依赖，禁止在 Pallas 本地新增平行 primitive。
- 公共组件 API 以 Ant Design 的成熟度为设计参照，包括稳定命名、受控/非受控模式、ref、事件、尺寸、状态、组合与扩展点；这不允许引入 Ant Design 或实现兼容 facade。
- shadcn/ui 是组件配方，不是依赖命名空间；业务组件不得暴露 Radix 或 shadcn 来源细节。
- Pallas 不得引入 Ant Design、Ant Design Icons 或兼容 facade；图标统一使用 Lucide。
- 认证流程和 API 状态保留在 `src/`，不得下沉到公共 UI 包。
- 登录流程涉及安全边界，改动后必须考虑失败态、过期态、重复提交和错误展示。

## 验证 Checklist

1. `pnpm type-check`
2. `pnpm lint`
3. `pnpm build`
4. 登录/授权相关改动手动走一遍失败态与成功态。
5. 搜索 `antd`、`@ant-design/icons` 和 `.ant-`，运行时命中视为迁移未完成。
