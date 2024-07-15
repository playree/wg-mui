export type LocaleItemBase =
  | 'menu_initial_setting'
  | 'menu_dashboard'
  | 'menu_users'
  | 'menu_labels'
  | 'menu_peers'
  | 'menu_settings'
  | 'menu_theme'
  | 'menu_signout'
  | 'menu_peer'
  | 'menu_account'
  | 'menu_password_reset'
  | 'menu_email_change'
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
  | 'item_username_email'
  | 'item_password'
  | 'item_email'
  | 'item_isadmin'
  | 'item_generate'
  | 'item_generate'
  | 'item_action'
  | 'item_delete_confirm'
  | 'item_confirme'
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
  | 'item_post_up_down'
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
  | 'item_enabled'
  | 'item_disabled'
  | 'item_refresh'
  | 'item_download_conf_file'
  | 'item_download_conf_file_dns'
  | 'item_scan_qr'
  | 'item_scan_qr_dns'
  | 'item_close'
  | 'item_status'
  | 'item_from_ip'
  | 'item_transfer'
  | 'item_latest_handshake'
  | 'item_receive'
  | 'item_send'
  | 'item_deleting'
  | 'item_google_signin'
  | 'item_gitlab_signin'
  | 'item_app_info'
  | 'item_app_version'
  | 'item_app_buildno'
  | 'item_server_info'
  | 'item_free_memory'
  | 'item_uptime'
  | 'item_transfer_info'
  | 'item_transfer_pool_usage'
  | 'item_transfer_billable'
  | 'item_default_allowed_ips'
  | 'item_default_keepalive'
  | 'item_generate_global_cidr'
  | 'item_last_signin_at'
  | 'item_send_email_password'
  | 'item_signin_message'
  | 'item_locale'
  | 'item_send_mail'
  | 'item_top_page_notice'
  | 'item_download_client_tools'
  | 'item_link_oauth'
  | 'item_signin_with_password'
  | 'item_unlink'
  | 'item_wg_conf'
  | 'item_for_clients'
  | 'item_password_score'
  | 'item_release_notes'
  | 'item_view_release_notes'
  | 'item_view_disabled'
  | 'item_view_enabled_all'
  | 'item_view_enabled_admin'
  | 'item_user_settings'
  | 'item_required_password_score'
  | 'item_password_score_mid'
  | 'item_password_score_high'
  | 'item_allow_change_email'
  | 'item_change_email'
  | 'item_not_set'
  | 'item_send_confirm_email'
  | 'item_dashboard_settings'
  | 'msg_password_confirm'
  | 'msg_user_delete'
  | 'msg_label_delete'
  | 'msg_common_error'
  | 'msg_enter_search_word'
  | 'msg_not_installed'
  | 'msg_peer_delete'
  | 'msg_wg_stop_confirm'
  | 'msg_wg_autostart_disable_confirm'
  | 'msg_wg_restart_confirm'
  | 'msg_conf_dir_permission_confirm'
  | 'msg_add_tunnel'
  | 'msg_create_admin'
  | 'msg_initialize_wg'
  | 'msg_password_reset'
  | 'msg_send_reset_confirm'
  | 'msg_link_oauth'
  | 'msg_linked_oauth'
  | 'msg_unlink_oauth_confirm'
  | 'msg_password_score_required'
  | 'msg_markdown_available'
  | 'msg_send_confirm_email'
  | 'msg_confirmed_email'
  | 'msg_updated'
  | 'msg_wg_started'
  | 'msg_wg_stoped'
  | 'msg_wg_restarted'
  | 'msg_wg_autostart_enabled'
  | 'msg_wg_autostart_disabled'
  | 'mail_password_reset_subject'
  | 'mail_password_reset_body'
  | 'mail_email_confirm_subject'
  | 'mail_email_confirm_body'

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
  | '@invalid_keepalive'
  | '@invalid_string_too_long'
  | '@invalid_password_score'
  | '@already_exists'
export const el = (item: LocaleItemError) => item

export type LocaleItem = LocaleItemBase | LocaleItemError
export type DefaultLocaleItems = Record<LocaleItem, string>
export type LocaleItems = Partial<Record<LocaleItem, string>>
