import { useLocale as ul } from '@/components/nextekit/locale/client'

export type LocaleItemBase =
  | 'menu_dashboard'
  | 'menu_users'
  | 'menu_settings'
  | 'menu_locale'
  | 'menu_theme'
  | 'menu_signout'
  | 'group_user'
  | 'group_admin'
  | 'item_user'
  | 'item_user_create'
  | 'item_user_update'
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
  | 'item_action'
  | 'item_delete_confirm'
  | 'item_confirmed'
  | 'msg_password_confirm'
  | 'msg_user_delete'
  | 'msg_common_error'

export type LocaleItemError =
  | '@required_field'
  | '@invalid_username'
  | '@invalid_email'
  | '@invalid_password'
  | '@invalid_username_or_password'
export const el = (item: LocaleItemError) => item

export type LocaleItem = LocaleItemBase | LocaleItemError
export const useLocale = () => {
  const ulItem = ul<LocaleItem>()
  const fet = (fieldError?: { message?: string }) => {
    if (fieldError) {
      return ulItem.t(fieldError.message as LocaleItem)
    }
    return undefined
  }
  return {
    ...ulItem,
    fet,
  }
}
