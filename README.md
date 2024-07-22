# WireGuard Managenent UI

- [WireGuard Managenent UI](#wireguard-managenent-ui)
- [はじめに](#はじめに)
- [モジュール構成](#モジュール構成)
- [推奨環境](#推奨環境)
- [ビルド](#ビルド)
- [環境変数](#環境変数)
  - [設定サンプル](#設定サンプル)
  - [必須項目](#必須項目)
    - [APP\_NAME](#app_name)
      - [設定例](#設定例)
    - [NEXTAUTH\_URL](#nextauth_url)
      - [設定例](#設定例-1)
    - [NEXTAUTH\_SECRET](#nextauth_secret)
      - [設定例](#設定例-2)
    - [DEFAULT\_LOCALE](#default_locale)
      - [設定例](#設定例-3)
    - [MAIL\_SEND](#mail_send)
      - [設定例(sendgrid)](#設定例sendgrid)
      - [設定例(sendmail)](#設定例sendmail)
      - [設定例(smtp)](#設定例smtp)
  - [オプション項目](#オプション項目)
    - [Googleでログイン](#googleでログイン)
      - [簡易認証](#簡易認証)
      - [設定例](#設定例-4)
    - [GitLabでログイン](#gitlabでログイン)
      - [簡易認証](#簡易認証-1)
      - [設定例](#設定例-5)
    - [Linode連携](#linode連携)
      - [設定例](#設定例-6)
- [起動](#起動)
  - [PM2](#pm2)
    - [PM2のインストール](#pm2のインストール)
    - [PM2で起動](#pm2で起動)
- [初期設定](#初期設定)
- [開発用](#開発用)
  - [パッケージ更新](#パッケージ更新)
  - [yarn更新](#yarn更新)

# はじめに

WireGuard(VPN)の接続設定などをユーザー単位で管理できるようにするWeb画面UIです。\
Next.jsの最新機能を率先して利用して開発しています。

基本的に自らの利用の為に開発を行っていますので、その為の機能開発が優先になっています。\
（Googleでログイン、GitLabでログイン、Linode連携、SendGridでメール送信など。

ご利用は自由ですが、自己責任でお使いください。

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
- Node.js v20

# ビルド

```sh
yarn install
yarn migrate
yarn build
```

# 環境変数

ビルドが完了したら、`.env`ファイルを作成し下記環境変数の設定を行ってください。

`.env`

## 設定サンプル

```conf
APP_NAME=sample VPN
NEXTAUTH_URL=https://vpn.sample.dev
NEXTAUTH_SECRET=xxx
DEFAULT_LOCALE=ja

GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
GOOGLE_SIMPLE_LOGIN=true

GITLAB_URL=https://gitlab.sample.dev
GITLAB_CLIENT_ID=xxx
GITLAB_CLIENT_SECRET=gloas-xxx
GITLAB_SIMPLE_LOGIN=true

LINODE_ID=00000000
LINODE_PERSONAL_ACCESS_TOKEN=xxx
LINODE_ACCESS_INTERVAL=180

MAIL_SEND=sendgrid
MAIL_FROM=vpn@automail.sample.dev
SENDGRID_API_KEY=SG.xxx
```

## 必須項目

### APP_NAME

アプリ名を指定してください。

#### 設定例

```conf
APP_NAME=sample VPN
```

### NEXTAUTH_URL

運用するURLを指定してください。

#### 設定例

```conf
NEXTAUTH_URL=https://xxx.sample.dev
```

### NEXTAUTH_SECRET

暗号化に利用するシークレットを指定してください。

下記コマンドなどで生成するのが簡単です。

```sh
$ openssl rand -base64 32
```

#### 設定例

```conf
NEXTAUTH_SECRET=H/F+hWCWhXeX78paTLdm+Mo71JLinVlk68VWszlp1D8=
```

### DEFAULT_LOCALE

デフォルトとして設定するロケールを指定してください。

`ja` or `en`

#### 設定例

```conf
DEFAULT_LOCALE=ja
```

### MAIL_SEND

メール送信の方法を下記から指定してください。

- sendgrid\
  SendGridを利用します。
- sendmail\
  sendmailコマンドを利用します。\
  ※WG-MUIが稼働するサーバーで`sendmail`コマンドが利用できる必要があります。
- smtp\
  SMTPを利用します。

#### 設定例(sendgrid)

```conf
MAIL_SEND=sendgrid
MAIL_FROM=vpn@sample.dev
SENDGRID_API_KEY=SG.xxx
```

#### 設定例(sendmail)

```conf
MAIL_SEND=sendmail
MAIL_FROM=vpn@sample.dev
SENDMAIL_PATH=/usr/sbin/sendmail
```

#### 設定例(smtp)

```conf
MAIL_SEND=smtp
MAIL_FROM=vpn@sample.dev
SMTP_HOST=smtp.sample.dev
SMTP_PORT=465
SMTP_USER=test_user
SMTP_PASS=test_pass
```

## オプション項目

### Googleでログイン

設定することでログイン認証にGoogleアカウントを利用できます。\
クライアントID(`GOOGLE_CLIENT_ID`)とクライアントシークレット(`GOOGLE_CLIENT_SECRET`)を発行し、指定してください。

認証情報登録時の情報は下記になります。

- 承認済みの JavaScript 生成元\
  `NEXTAUTH_URL`と同値。
- 承認済みのリダイレクト URI\
  `NEXTAUTH_URL` `/api/auth/callback/google`

#### 簡易認証

ユーザーがGoogleアカウントでログインする為には、WG-MUIアカウントとGoogleアカウントの連携が必要になります。\
連携する為にはWG-MUIアカウントとパスワードで一度ログインする必要があります。

`GOOGLE_SIMPLE_LOGIN`に`true`を設定すると、上記の連携操作を省略できます。\
GoogleアカウントのメールアドレスとWG-MUIのメールアドレスが一致するアカウントとしてログインすることになります。

#### 設定例

```conf
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
# GOOGLE_SIMPLE_LOGIN=true
```

### GitLabでログイン

設定することでログイン認証にGitLabアカウントを利用できます。\
アプリケーションID(`GITLAB_CLIENT_ID`)とシークレット(`GITLAB_CLIENT_SECRET`)を発行し、指定してください。

アプリケーション登録時の情報は下記になります。

- コールバックURL\
  `NEXTAUTH_URL` `/api/auth/callback/gitlab`

#### 簡易認証

ユーザーがGitLabアカウントでログインする為には、WG-MUIアカウントとGitLabアカウントの連携が必要になります。\
連携する為にはWG-MUIアカウントとパスワードで一度ログインする必要があります。

`GITLAB_SIMPLE_LOGIN`に`true`を設定すると、上記の連携操作を省略できます。\
GitLabアカウントのメールアドレスとWG-MUIのメールアドレスが一致するアカウントとしてログインすることになります。

#### 設定例

```conf
GITLAB_URL=https://gitlab.sample.dev
GITLAB_CLIENT_ID=xxx
GITLAB_CLIENT_SECRET=xxx
# GITLAB_SIMPLE_LOGIN=true
```

### Linode連携

運用サーバーにLinodeを利用している場合、連携することでネットワーク転送量の情報(プール使用量や請求対象のデータ量など)をダッシュボードに表示できるようになります。

Personal Access Tokenを発行し、下記のように設定してください。

#### 設定例

```conf
LINODE_ID=00000000
LINODE_PERSONAL_ACCESS_TOKEN=xxx
LINODE_ACCESS_INTERVAL=180
```

# 起動

```sh
./wg-mui.sh
```

## PM2

アプリを永続化して起動したいなら、PM2で起動させてください。

### PM2のインストール

```sh
npm install -g pm2
```

### PM2で起動

```sh
pm2 start ./wg-mui.sh
```

# 初期設定

起動したら下記URLにアクセスし、初期設定を行ってください。

`NEXTAUTH_URL /initialize` (例. `https://vpn.sample.dev/initialize`)

管理者ユーザーの作成とWiregurdの初期設定を行います。

---


# 開発用

## パッケージ更新

```sh
yarn upgrade-interactive
```

## yarn更新

```sh
yarn set version latest --yarn-path
```
