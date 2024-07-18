# WireGuard Managenent UI

- [WireGuard Managenent UI](#wireguard-managenent-ui)
- [はじめに](#はじめに)
- [モジュール構成](#モジュール構成)
- [推奨環境](#推奨環境)
- [ビルド](#ビルド)
- [環境変数](#環境変数)
- [起動](#起動)
  - [PM2](#pm2)
    - [PM2のインストール](#pm2のインストール)
    - [PM2で起動](#pm2で起動)
- [開発用](#開発用)
  - [パッケージ更新](#パッケージ更新)
  - [yarn更新](#yarn更新)

# はじめに

WireGuard(VPN)の接続設定などをユーザー単位で管理できるようにするWeb画面UIです。\
Next.jsの最新機能を率先して利用して開発しています。

# モジュール構成

- [Next.js](https://nextjs.org/) v14.2.5 \
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

# 推奨環境

- Ubuntu 22.04

# ビルド

```sh
yarn install
yarn migrate
yarn build
```

# 環境変数

`.env`

```conf
APP_NAME=sample VPN
NEXTAUTH_URL=http://localhost:63001
NEXTAUTH_SECRET=xxxx
DEFAULT_LOCALE=ja

GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

LINODE_ID=00000000
LINODE_PERSONAL_ACCESS_TOKEN=xxx
LINODE_ACCESS_INTERVAL=180

MAIL_SEND=sendgrid
MAIL_FROM=vpn@sample.dev
SENDGRID_API_KEY=SG.xxx

MAIL_SEND=sendmail
MAIL_FROM=vpn@sample.dev
SENDMAIL_PATH=/usr/sbin/sendmail

MAIL_SEND=smtp
MAIL_FROM=vpn@sample.dev
SMTP_HOST=smtp.sample.dev
SMTP_PORT=465
SMTP_USER=test_user
SMTP_PASS=test_pass

DEBUG_LINODE_DUMMY={"used":1200109071,"quota":4662,"billable":0,"total":5005784383488}
DEBUG_SEND_EMAIL=true
```

# 起動

```sh
./wg-mui.sh
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

## yarn更新

```sh
yarn set version latest --yarn-path
```
