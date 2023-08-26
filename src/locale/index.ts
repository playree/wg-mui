import { useLocale } from '@/components/nextekit/locale/client'

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

export const useLocaleW = () => useLocale<LocaleItem>()