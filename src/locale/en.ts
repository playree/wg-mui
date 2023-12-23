import { LocaleItem } from '.'

export const en: Record<LocaleItem, string> = {
  menu_dashboard: 'Dashboard',
  menu_users: 'Users',
  menu_labels: 'Labels',
  menu_settings: 'Settings',
  menu_locale: 'Locale',
  menu_theme: 'Theme',
  menu_signout: 'Sign Out',
  group_user: 'User',
  group_admin: 'Admin',
  item_user: 'User',
  item_user_create: 'Create User',
  item_user_update: 'Update User',
  item_user_info: 'User information',
  item_admin: 'Administrator',
  item_systeminfo: 'System info',
  item_freemem: 'Free memory',
  item_uptime: 'Up time',
  item_add: 'Add',
  item_update: 'Update',
  item_ok: 'OK',
  item_cancel: 'Cancel',
  item_signin: 'Sign In',
  item_true: 'True',
  item_false: 'False',
  item_username: 'User name',
  item_password: 'Password',
  item_email: 'Email',
  item_isadmin: 'Is administrater',
  item_generate: 'Generate',
  item_action: 'Action',
  item_delete_confirm: 'Delete confirmation',
  item_confirmed: 'Confirmed',
  item_change_password: 'Change password',
  item_label: 'Label',
  item_label_create: 'Create Label',
  item_label_update: 'Update Label',
  item_label_name: 'Label name',
  item_explanation: 'Explanation',
  item_updated_at: 'Updated at',
  msg_password_confirm: 'The password can be confirmed only once on the completion screen.',
  msg_user_delete: 'Delete ${username}.\n*All linked information will be deleted.',
  msg_common_error: 'An error has occurred',
  msg_enter_search_word: 'Enter search word',

  '@required_field': 'Required field',
  '@invalid_username': '4-30 alphanumeric characters (.-_)',
  '@invalid_password': '8-30 alphanumeric characters',
  '@invalid_email': 'Invalid email format',
  '@invalid_username_or_password': 'Incorrect username or password',
  '@invalid_label_name': '1-20 characters',
  '@invalid_explanation': 'Within 80 characters',
  '@already_exists': 'Already exists',
}
