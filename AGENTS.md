# Pallas

Pallas 是 Aegis 认证服务的前端界面，负责登录、授权同意、OAuth 回调、错误展示和用户安全设置等认证体验。

## 技术栈

- React 19
- Vite 7
- TypeScript 5
- Ant Design 6
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
- UI 交互优先使用 Ant Design 6；按钮、表单、图片、加载状态不要手写原生替代。
- 登录流程涉及安全边界，改动后必须考虑失败态、过期态、重复提交和错误展示。

## 验证 Checklist

1. `pnpm type-check`
2. `pnpm lint`
3. `pnpm build`
4. 登录/授权相关改动手动走一遍失败态与成功态。
