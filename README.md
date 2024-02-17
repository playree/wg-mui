# WireGuard Managenent UI

- [WireGuard Managenent UI](#wireguard-managenent-ui)
- [はじめに](#はじめに)
- [モジュール構成](#モジュール構成)
- [ビルド](#ビルド)
- [起動](#起動)
  - [PM2](#pm2)
    - [PM2のインストール](#pm2のインストール)
    - [PM2で起動](#pm2で起動)
- [開発用](#開発用)
  - [パッケージ更新](#パッケージ更新)

# はじめに

WireGuard(VPN)の接続設定などをユーザー単位で管理できるようにするWeb画面UIです。\
Next.jsの最新機能を率先して利用して開発しています。

# モジュール構成

- [Next.js](https://nextjs.org/) v14.1.x \
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

# ビルド

```sh
yarn install
yarn migrate
yarn build
```

# 起動

```sh
yarn start
```

## PM2

### PM2のインストール

```sh
npm install -g pm2
```

### PM2で起動

```sh
pm2 start ./wg-mui.sh
```

# 開発用

## パッケージ更新

```sh
yarn upgrade-interactive
```
