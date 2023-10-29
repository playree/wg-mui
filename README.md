# WireGuard Managenent UI

- [WireGuard Managenent UI](#wireguard-managenent-ui)
- [はじめに](#はじめに)
- [モジュール構成](#モジュール構成)
- [ビルドと起動](#ビルドと起動)

# はじめに

WireGuard(VPN)の接続設定などをユーザー単位で管理できるようにするWeb画面UIです。\
Next.jsの最新機能を率先して利用して開発しています。

# モジュール構成

- [Next.js](https://nextjs.org/) v14.0.x \
  出来るだけ最新機能を利用して開発しています。
  - Using App Router
  - Using Server Components
  - Using Server Actions
- [Tailwind CSS](https://tailwindcss.com/) \
  CSS Framework
- [NextUI](https://nextui.org/) v2 \
  ベースのUIコンポーネント
- [Prisma](https://www.prisma.io/) \
  DB接続ORM
- [Auth.js](https://authjs.dev/) \
  認証機能

# ビルドと起動

```sh
yarn install
yarn migrate
yarn build
yarn start
```
