import { DefaultLocaleItems } from '.'

export const ja: DefaultLocaleItems = {
  menu_initial_setting: '初期設定',
  menu_dashboard: 'ダッシュボード',
  menu_users: 'ユーザー管理',
  menu_labels: 'ラベル管理',
  menu_peers: 'ピア一覧',
  menu_settings: '設定',
  menu_theme: 'テーマ',
  menu_signout: 'サインアウト',
  menu_peer: 'ピア(接続)',
  menu_account: 'アカウント',
  menu_password_reset: 'パスワードリセット',
  group_user: 'ユーザー',
  group_admin: '管理者',
  item_user: '一般ユーザー',
  item_user_create: 'ユーザー作成',
  item_user_update: 'ユーザー更新',
  item_user_info: 'ユーザー情報',
  item_admin: '管理者',
  item_add: '追加',
  item_update: '更新',
  item_edit: '編集',
  item_delete: '削除',
  item_ok: 'OK',
  item_cancel: 'キャンセル',
  item_signin: 'サインイン',
  item_true: 'あり',
  item_false: 'なし',
  item_username: 'ユーザー名',
  item_username_email: 'ユーザー名 / Eメール',
  item_password: 'パスワード',
  item_email: 'Eメール',
  item_isadmin: '管理者権限',
  item_generate: '自動生成',
  item_action: '操作',
  item_delete_confirm: '削除確認',
  item_confirme: '確認',
  item_confirmed: '確認しました',
  item_change_password: 'パスワード変更',
  item_label: 'ラベル',
  item_label_create: 'ラベル作成',
  item_label_update: 'ラベル更新',
  item_label_name: 'ラベル名',
  item_explanation: '説明',
  item_updated_at: '更新日時',
  item_conf_dir_path: '設定ファイル格納パス',
  item_interface_name: 'インターフェース名',
  item_address: 'アドレス',
  item_listen_port: 'Listen Port',
  item_post_up: 'PostUp',
  item_post_down: 'PostDown',
  item_post_up_down: 'PostUp/Downスクリプト',
  item_generate_post_updown: '↓PostUp/Downスクリプトを自動生成',
  item_private_key: '秘密鍵',
  item_end_point: 'エンドポイントアドレス',
  item_dns: 'DNS',
  item_peer: 'ピア',
  item_peer_management: 'ピア管理',
  item_peer_create: 'ピア作成',
  item_peer_update: 'ピア更新',
  item_generate_key: '鍵生成',
  item_allowed_ips: '許可IP',
  item_remarks: '備考',
  item_persistent_keepalive: 'Persistent Keep-Alive',
  item_start: '起動',
  item_stop: '停止',
  item_starting: '起動中',
  item_stopped: '停止中',
  item_restart: '再起動',
  item_autostart_on: '自動起動ON',
  item_autostart_off: '自動起動OFF',
  item_enable: '有効化',
  item_disable: '無効化',
  item_enabled: '有効',
  item_disabled: '無効',
  item_refresh: '更新',
  item_download_conf_file: '設定ファイルをダウンロード',
  item_download_conf_file_dns: '設定ファイルをダウンロード(VPNが指定するDNSを利用)',
  item_scan_qr: 'QRコードをスキャン',
  item_scan_qr_dns: 'QRコードをスキャン(VPNが指定するDNSを利用)',
  item_close: '閉じる',
  item_status: 'ステータス',
  item_from_ip: '接続元',
  item_transfer: '転送量',
  item_latest_handshake: '最新送受信',
  item_receive: '受信',
  item_send: '送信',
  item_deleting: '削除中',
  item_google_signin: 'Googleでサインイン',
  item_gitlab_signin: 'GitLabでサインイン',
  item_app_info: 'アプリ情報',
  item_app_version: 'バージョン',
  item_app_buildno: 'ビルドNo',
  item_server_info: 'サーバー情報',
  item_free_memory: '空きメモリ',
  item_uptime: '起動時間',
  item_transfer_info: 'ネットワーク転送情報',
  item_transfer_pool_usage: 'プール使用量',
  item_transfer_billable: '請求対象',
  item_default_allowed_ips: 'デフォルトの Allowed IPs',
  item_default_keepalive: 'デフォルトの Persistent Keep-Alive',
  item_generate_global_cidr: '↓このIP帯域とグローバルIP帯域を指定する',
  item_last_signin_at: '最終認証',
  item_send_email_password: 'パスワード初期設定用のメールを送信',
  item_signin_message: 'サインインメッセージ',
  item_locale: '言語',
  item_send_mail: 'メール送信',
  item_top_page_notice: 'アナウンス',
  item_download_client_tools: 'クライアンツールのダウンロード',
  item_link_oauth: '${name}連携',
  item_signin_with_password: 'パスワードでサインイン',
  item_unlink: '連携解除',
  item_wg_conf: 'WireGuard設定',
  item_for_clients: 'クライアント向け',
  item_password_score: 'パスワードスコア',

  msg_password_confirm: 'パスワードは完了画面で一度だけ確認できます。',
  msg_user_delete: '${username} を削除します。\n※紐づく情報はすべて削除されます。',
  msg_label_delete: '${name} を削除します。\n※紐づく情報はすべて削除されます。',
  msg_common_error: 'エラーが発生しました',
  msg_enter_search_word: '検索ワードを入力',
  msg_not_installed: 'インストールされていません',
  msg_peer_delete: '${peer} を削除します。\n※削除はWireGuardを再起動するまで反映されません。',
  msg_wg_stop_confirm: 'WireGuardを停止しますか？',
  msg_wg_autostart_disable_confirm: 'WireGuardの自動起動を無効にしますか？',
  msg_wg_restart_confirm: 'WireGuardを再起動しますか？',
  msg_conf_dir_permission_confirm:
    '実行ユーザー(${user})は${path}へアクセスできません。\n権限を付与する為に下記コマンドを実行しますか？\n\n$ sudo chgrp ${user} ${path}\n$ sudo chmod g+x ${path}',
  msg_add_tunnel: '端末にトンネルを追加',
  msg_create_admin: '管理者ユーザーを作成します',
  msg_initialize_wg: 'WireGuardの初期設定を行います',
  msg_password_reset: 'パスワードをリセットします。\n設定したいパスワードを入力してください。',
  msg_send_reset_confirm: 'このメールアドレスにパスワードリセット用のメールを送信します。\n\n${email}',
  msg_link_oauth:
    '上記メールアドレスのユーザーを${name}と連携します。\n確認の為、下記からパスワードでサインインを行ってください。',
  msg_linked_oauth: '${name}連携が完了しました。\n次回から${name}でサインインがご利用いただけます。',
  msg_unlink_oauth_confirm: '${name}との連携を解除しますか？',
  msg_password_score_required: '${score}以上が必要',

  mail_password_reset_subject: '[${appname}] パスワード設定',
  mail_password_reset_body: `ユーザー名: \${username}

サービスのご利用が開始、またはパスワード再設定が要求されました。
下記URLよりパスワードを設定してサービスをご利用ください。
このURLの有効期限は48時間です。

\${url}
`,

  '@required_field': '必須入力項目',
  '@invalid_username': '半角英数記号(.-_)2～30文字',
  '@invalid_password': '半角英数記号8～30文字',
  '@invalid_email': 'Eメールフォーマット不正',
  '@invalid_username_or_password': 'ユーザー名またはパスワードが間違っています',
  '@invalid_label_name': '1～20文字',
  '@invalid_explanation': '80文字以内',
  '@invalid_conf_dir_path': '絶対パス指定 例)/etc/wireguard',
  '@invalid_interface_name': '半角英数記号(.-_)1～60文字',
  '@invalid_address': 'CIDRフォーマット不正 例)192.168.1.1/24',
  '@invalid_port': '1～65535',
  '@invalid_private_key': '半角英数記号',
  '@invalid_end_point': 'URLフォーマット不正',
  '@invalid_dns': 'DNSフォーマット不正',
  '@invalid_ip': 'IPフォーマット不正 例)192.168.1.1',
  '@invalid_allowed_ips': 'フォーマット不正',
  '@invalid_keepalive': '1～65535',
  '@invalid_string_too_long': '文字列が長すぎます',
  '@invalid_password_score': 'パスワードスコアが不足しています',
  '@already_exists': '既に存在しています',
}
