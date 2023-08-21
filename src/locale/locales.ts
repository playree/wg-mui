export type LocaleItem =
  | 'menu_dashboard'
  | 'menu_users'
  | 'menu_settings'
  | 'menu_locale'
  | 'menu_theme'
  | 'menu_signout'
  | 'group_user'
  | 'group_admin'
  | 'item_user'
  | 'item_user_add'
  | 'item_user_edit'
  | 'item_user_info'
  | 'item_admin'
  | 'item_systeminfo'
  | 'item_freemem'
  | 'item_uptime'
  | 'item_add'
  | 'item_update'
  | 'item_ok'
  | 'item_cancel'
  | 'item_true'
  | 'item_false'
  | 'item_signin'
  | 'item_username'
  | 'item_password'
  | 'item_email'
  | 'item_isadmin'
  | 'item_generate'
  | 'item_generate'
  | 'msg_password_confirm'
  | 'msg_user_add_complete'
  | 'msg_user_add_notice'
  | 'msg_user_update_complete'
  | 'msg_user_update_notice'
  | 'msg_common_error'

export const locales: Record<LocaleItem, { en: string; ja?: string }> = {
  menu_dashboard: {
    en: 'Dashboard',
    ja: 'ダッシュボード',
  },
  menu_users: {
    en: 'Users',
    ja: 'ユーザー管理',
  },
  menu_settings: {
    en: 'Settings',
    ja: '設定',
  },
  menu_locale: {
    en: 'Locale',
    ja: '言語',
  },
  menu_theme: {
    en: 'Theme',
    ja: 'テーマ',
  },
  menu_signout: {
    en: 'Sign Out',
    ja: 'サインアウト',
  },
  group_user: {
    en: 'User',
    ja: 'ユーザー',
  },
  group_admin: {
    en: 'Admin',
    ja: '管理者',
  },
  item_user: {
    en: 'User',
    ja: '一般ユーザー',
  },
  item_user_add: {
    en: 'Add User',
    ja: 'ユーザー追加',
  },
  item_user_edit: {
    en: 'Edit User',
    ja: 'ユーザー編集',
  },
  item_user_info: {
    en: 'User information',
    ja: 'ユーザー情報',
  },
  item_admin: {
    en: 'Administrator',
    ja: '管理者',
  },
  item_systeminfo: {
    en: 'System info',
    ja: 'システム情報',
  },
  item_freemem: {
    en: 'Free Memory',
    ja: '空きメモリ',
  },
  item_uptime: {
    en: 'Up time',
    ja: '起動時間',
  },
  item_add: {
    en: 'Add',
    ja: '追加',
  },
  item_update: {
    en: 'Update',
    ja: '更新',
  },
  item_ok: {
    en: 'OK',
    ja: 'OK',
  },
  item_cancel: {
    en: 'Cancel',
    ja: 'キャンセル',
  },
  item_signin: {
    en: 'Sign In',
    ja: 'サインイン',
  },
  item_true: {
    en: 'True',
    ja: 'あり',
  },
  item_false: {
    en: 'False',
    ja: 'なし',
  },
  item_username: {
    en: 'User Name',
    ja: 'ユーザー名',
  },
  item_password: {
    en: 'Password',
    ja: 'パスワード',
  },
  item_email: {
    en: 'Email',
    ja: 'Eメール',
  },
  item_isadmin: {
    en: 'Is Administrater',
    ja: '管理者権限',
  },
  item_generate: {
    en: 'Generate',
    ja: '自動生成',
  },
  msg_password_confirm: {
    en: 'The password can be confirmed only once on the completion screen.',
    ja: 'パスワードは完了画面で一度だけ確認できます。',
  },
  msg_user_add_complete: {
    en: 'User addition is complete.',
    ja: 'ユーザーの追加が完了しました。',
  },
  msg_user_add_notice: {
    en: 'Notice of user registration',
    ja: 'ユーザー登録のお知らせ',
  },
  msg_user_update_complete: {
    en: 'User update is complete.',
    ja: 'ユーザーの更新が完了しました。',
  },
  msg_user_update_notice: {
    en: 'Notice of user update',
    ja: 'ユーザー更新のお知らせ',
  },
  msg_common_error: {
    en: 'An error has occurred',
    ja: 'エラーが発生しました',
  },
}
