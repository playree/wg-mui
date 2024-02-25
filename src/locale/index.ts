import { useLocale as ul } from '@/components/nextekit/locale/client'

export type LocaleItemBase =
  | 'menu_initial_setting'
  | 'menu_dashboard'
  | 'menu_users'
  | 'menu_labels'
  | 'menu_peers'
  | 'menu_settings'
  | 'menu_locale'
  | 'menu_theme'
  | 'menu_signout'
  | 'menu_peer'
  | 'menu_account'
  | 'group_user'
  | 'group_admin'
  | 'item_user'
  | 'item_user_create'
  | 'item_user_update'
  | 'item_user_info'
  | 'item_admin'
  | 'item_add'
  | 'item_update'
  | 'item_edit'
  | 'item_delete'
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
  | 'item_change_password'
  | 'item_label'
  | 'item_label_create'
  | 'item_label_update'
  | 'item_label_name'
  | 'item_explanation'
  | 'item_updated_at'
  | 'item_conf_dir_path'
  | 'item_interface_name'
  | 'item_address'
  | 'item_listen_port'
  | 'item_post_up'
  | 'item_post_down'
  | 'item_generate_post_updown'
  | 'item_private_key'
  | 'item_end_point'
  | 'item_dns'
  | 'item_peer'
  | 'item_peer_management'
  | 'item_peer_create'
  | 'item_peer_update'
  | 'item_generate_key'
  | 'item_allowed_ips'
  | 'item_remarks'
  | 'item_persistent_keepalive'
  | 'item_start'
  | 'item_stop'
  | 'item_starting'
  | 'item_stopped'
  | 'item_restart'
  | 'item_autostart_on'
  | 'item_autostart_off'
  | 'item_enable'
  | 'item_disable'
  | 'item_refresh'
  | 'item_download_file'
  | 'item_scan_qr'
  | 'item_close'
  | 'item_status'
  | 'item_from_ip'
  | 'item_transfer'
  | 'item_latest_handshake'
  | 'item_receive'
  | 'item_send'
  | 'item_deleting'
  | 'item_google_signin'
  | 'item_app_info'
  | 'item_app_version'
  | 'item_app_buildno'
  | 'item_server_info'
  | 'item_free_memory'
  | 'item_uptime'
  | 'item_transfer_info'
  | 'item_transfer_pool_usage'
  | 'item_transfer_billable'
  | 'msg_password_confirm'
  | 'msg_user_delete'
  | 'msg_common_error'
  | 'msg_enter_search_word'
  | 'msg_not_installed'
  | 'msg_peer_delete'
  | 'msg_wg_stop_confirm'
  | 'msg_wg_autostart_disable_confirm'
  | 'msg_wg_restart_confirm'
  | 'msg_conf_dir_permission_confirm'
  | 'msg_add_tunnel'

export type LocaleItemError =
  | '@required_field'
  | '@invalid_username'
  | '@invalid_email'
  | '@invalid_password'
  | '@invalid_username_or_password'
  | '@invalid_username_or_password'
  | '@invalid_label_name'
  | '@invalid_explanation'
  | '@invalid_conf_dir_path'
  | '@invalid_interface_name'
  | '@invalid_address'
  | '@invalid_port'
  | '@invalid_private_key'
  | '@invalid_end_point'
  | '@invalid_dns'
  | '@invalid_ip'
  | '@invalid_allowed_ips'
  | '@already_exists'
export const el = (item: LocaleItemError) => item

export type LocaleItem = LocaleItemBase | LocaleItemError
export type DefaultLocaleItems = Record<LocaleItem, string>
export type LocaleItems = Partial<Record<LocaleItem, string>>
export const useLocale = () => {
  const ulItem = ul<LocaleItem>()
  const fet = (fieldError?: { message?: string }) => {
    if (fieldError) {
      return ulItem.t(fieldError.message as LocaleItem) || fieldError.message
    }
    return undefined
  }
  return {
    ...ulItem,
    fet,
  }
}
