import { LocaleItem } from '.'

export const ja: Record<LocaleItem, string> = {
  menu_dashboard: 'ダッシュボード',
  menu_users: 'ユーザー管理',
  menu_labels: 'ラベル管理',
  menu_settings: '設定',
  menu_locale: '言語',
  menu_theme: 'テーマ',
  menu_signout: 'サインアウト',
  group_user: 'ユーザー',
  group_admin: '管理者',
  item_user: '一般ユーザー',
  item_user_create: 'ユーザー作成',
  item_user_update: 'ユーザー更新',
  item_user_info: 'ユーザー情報',
  item_admin: '管理者',
  item_systeminfo: 'システム情報',
  item_freemem: '空きメモリ',
  item_uptime: '起動時間',
  item_add: '追加',
  item_update: '更新',
  item_ok: 'OK',
  item_cancel: 'キャンセル',
  item_signin: 'サインイン',
  item_true: 'あり',
  item_false: 'なし',
  item_username: 'ユーザー名',
  item_password: 'パスワード',
  item_email: 'Eメール',
  item_isadmin: '管理者権限',
  item_generate: '自動生成',
  item_action: '操作',
  item_delete_confirm: '削除確認',
  item_confirmed: '確認しました',
  item_change_password: 'パスワード変更',
  item_label: 'ラベル',
  item_label_create: 'ラベル作成',
  item_label_update: 'ラベル更新',
  item_label_name: 'ラベル名',
  item_explanation: '説明',
  item_updated_at: '更新日時',
  msg_password_confirm: 'パスワードは完了画面で一度だけ確認できます。',
  msg_user_delete: '${username} を削除します。\n※紐づく情報はすべて削除されます。',
  msg_common_error: 'エラーが発生しました',
  msg_enter_search_word: '検索ワードを入力',

  '@required_field': '必須入力項目',
  '@invalid_username': '半角英数記号(.-_)4～30文字',
  '@invalid_password': '半角英数記号8～30文字',
  '@invalid_email': 'Eメールフォーマットが不正',
  '@invalid_username_or_password': 'ユーザー名またはパスワードが間違っています',
  '@invalid_label_name': '1～20文字',
  '@invalid_explanation': '80文字以内',
  '@already_exists': '既に存在しています',
}
