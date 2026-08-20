<p align="center">
  <img src="./assets/brand/hero-ice.png" width="256" alt="Pallas logo" />
</p>

<h1 align="center">Pallas</h1>

Pallas 是 Aegis 面向用户的认证界面。登录、OAuth 授权同意、回调、错误提示、个人资料和账户安全设置，都由它承接。它不碰认证逻辑本身——那些都在 Aegis 后端——Pallas 只负责把这些流程做成一个像样的前端。

Pallas is the human-facing authentication UI for Aegis: login, OAuth consent, callbacks, error presentation, profile, and account-security settings. The auth logic lives in Aegis; Pallas turns those flows into the actual interface.

## 能力

- 多种身份提供方、Passkey、MFA 与挑战流程
- OAuth 授权同意与回调处理
- 个人资料与安全设置
- 完整的失败态、过期态、重复提交态

## 技术栈

React 19、TypeScript、Vite 7、React Router 7、Sass，以及独立仓库发布的 `@heliannuuthus/ui` 组件库。

## 开发

```bash
pnpm install
pnpm dev
pnpm type-check
pnpm lint
pnpm build
pnpm format:check
```

本地开发前把 `.env.example` 复制成 `.env`。API 访问统一收在 `src/services`；认证流程的状态留在 Pallas 内部。