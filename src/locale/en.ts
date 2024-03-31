import { LocaleItems } from '.'

export const en: LocaleItems = {
  menu_initial_setting: 'Initial Setting',
  menu_dashboard: 'Dashboard',
  menu_users: 'Users',
  menu_labels: 'Labels',
  menu_peers: 'Peers',
  menu_settings: 'Settings',
  menu_theme: 'Theme',
  menu_signout: 'Sign Out',
  menu_peer: 'Peer(Connect)',
  menu_account: 'Account',
  menu_password_reset: 'Reset Password',
  group_user: 'User',
  group_admin: 'Admin',
  item_user: 'User',
  item_user_create: 'Create User',
  item_user_update: 'Update User',
  item_user_info: 'User information',
  item_admin: 'Administrator',
  item_add: 'Add',
  item_update: 'Update',
  item_edit: 'Edit',
  item_delete: 'Delete',
  item_ok: 'OK',
  item_cancel: 'Cancel',
  item_signin: 'Sign In',
  item_true: 'True',
  item_false: 'False',
  item_username: 'User name',
  item_username_email: 'Username / Email',
  item_password: 'Password',
  item_email: 'Email',
  item_isadmin: 'Is administrater',
  item_generate: 'Generate',
  item_action: 'Action',
  item_delete_confirm: 'Delete confirmation',
  item_confirme: 'Confirme',
  item_confirmed: 'Confirmed',
  item_change_password: 'Change password',
  item_label: 'Label',
  item_label_create: 'Create Label',
  item_label_update: 'Update Label',
  item_label_name: 'Label name',
  item_explanation: 'Explanation',
  item_updated_at: 'Updated at',
  item_conf_dir_path: 'Config file directory path',
  item_interface_name: 'Interface name',
  item_address: 'Address',
  item_listen_port: 'Listen Port',
  item_post_up: 'PostUp',
  item_post_down: 'PostDown',
  item_post_up_down: 'PostUp/Down script',
  item_generate_post_updown: 'Generate PostUp/Down script',
  item_private_key: 'Private Key',
  item_end_point: 'End point',
  item_dns: 'DNS',
  item_peer: 'Peer',
  item_peer_management: 'Management Peer',
  item_peer_create: 'Create Peer',
  item_peer_update: 'Update Peer',
  item_generate_key: 'Generate Key',
  item_allowed_ips: 'Allowed IPs',
  item_remarks: 'Remarks',
  item_persistent_keepalive: 'Persistent Keep-Alive',
  item_start: 'Start',
  item_stop: 'Stop',
  item_starting: 'Starting',
  item_stopped: 'Stopped',
  item_restart: 'Restart',
  item_autostart_on: 'Auto Start ON',
  item_autostart_off: 'Auto Start OFF',
  item_enable: 'Enable',
  item_disable: 'Disable',
  item_enabled: 'Enabled',
  item_disabled: 'Disabled',
  item_refresh: 'Refresh',
  item_download_conf_file: 'Download Config File',
  item_download_conf_file_dns: 'Download Config File (Use DNS specified by VPN)',
  item_scan_qr: 'Scan from QR code',
  item_scan_qr_dns: 'Scan from QR code (Use DNS specified by VPN)',
  item_close: 'Close',
  item_status: 'Status',
  item_from_ip: 'From',
  item_transfer: 'Transfer',
  item_latest_handshake: 'Latest Handshake',
  item_receive: 'Receive',
  item_send: 'Send',
  item_deleting: 'Deleting',
  item_google_signin: 'Sign in with Google',
  item_gitlab_signin: 'Sign in with GitLab',
  item_app_info: 'App Infomation',
  item_app_version: 'Version',
  item_app_buildno: 'Build No',
  item_server_info: 'Server Infomation',
  item_free_memory: 'Free Memory',
  item_uptime: 'Up Time',
  item_transfer_info: 'Network Transfer Infomation',
  item_transfer_pool_usage: 'Pool Usage',
  item_transfer_billable: 'Billable',
  item_default_allowed_ips: 'Default Allowed IPs',
  item_default_keepalive: 'Default Persistent Keep-Alive',
  item_generate_global_cidr: 'Specify this IP band and global IP band',
  item_last_signin_at: 'Last SignIn',
  item_send_email_password: 'Send an email for initial password setting',
  item_signin_message: 'Sign in message',
  item_locale: 'Locale',
  item_send_mail: 'Send E-Mail',
  item_top_page_notice: 'Announcement',
  item_download_client_tools: 'Download client tools',
  item_link_oauth: 'Link with ${name}',
  item_signin_with_password: 'Sign in with Password',
  item_unlink: 'Unlink',
  item_wg_conf: 'WireGuard Config',
  item_for_clients: 'For clients',

  msg_password_confirm: 'The password can be confirmed only once on the completion screen.',
  msg_user_delete: 'Delete ${username}.\n*All linked information will be deleted.',
  msg_label_delete: 'Delete ${name}.\n*All linked information will be deleted.',
  msg_common_error: 'An error has occurred',
  msg_enter_search_word: 'Enter search word',
  msg_not_installed: 'Not installed',
  msg_peer_delete: 'Delete ${peer}.\n*Deletion will not take effect until WireGuard is restarted.',
  msg_wg_stop_confirm: 'Do you want to stop WireGuard?',
  msg_wg_autostart_disable_confirm: 'Disable WireGuard autostart?',
  msg_wg_restart_confirm: 'Do you want to restart WireGuard?',
  msg_conf_dir_permission_confirm:
    'The execution user (${user}) cannot access ${path}.\nWould you like to run the following command to grant permission?\n\n$ sudo chgrp ${user} ${path}\n$ sudo chmod g+x ${path}',
  msg_add_tunnel: 'Add a tunnel to your device',
  msg_create_admin: 'Create an admin user',
  msg_initialize_wg: 'Perform initial settings for WireGuard',
  msg_password_reset: 'Reset your password.\nPlease enter the password you want to set.',
  msg_send_reset_confirm: 'A password reset email will be sent to this email address.\n\n${email}',
  msg_link_oauth:
    'We will link the user with the above email address with ${name}.\nTo confirm, please sign in with your password below.',
  msg_linked_oauth: '${name} link has been completed.\nFrom next time onwards, you can sign in with ${name}.',
  msg_unlink_oauth_confirm: 'Do you want to unlink from ${oauth}?',

  mail_password_reset_subject: '[${appname}] Please set a password',
  mail_password_reset_body: `username: \${username}

You have started using the service or have been requested to reset your password.
Please use the service by setting a password from the URL below.
This URL will expire in 48 hours.

\${url}
`,

  '@required_field': 'Required field',
  '@invalid_username': '2-30 alphanumeric characters (.-_)',
  '@invalid_password': '8-30 alphanumeric characters',
  '@invalid_email': 'Invalid email format',
  '@invalid_username_or_password': 'Incorrect username or password',
  '@invalid_label_name': '1-20 characters',
  '@invalid_explanation': 'Within 80 characters',
  '@invalid_conf_dir_path': 'Absolute path (ex. /etc/wireguard',
  '@invalid_interface_name': '1-60 alphanumeric characters (.-_)',
  '@invalid_address': 'Invalid CIDR format (ex. 192.168.1.1/24',
  '@invalid_port': '1-65535',
  '@invalid_private_key': 'Alphanumeric characters',
  '@invalid_end_point': 'Invalid URL format',
  '@invalid_dns': 'Invalid DNS format',
  '@invalid_ip': 'Invalid IP format (ex. 192.168.1.1',
  '@invalid_allowed_ips': 'Invalid format',
  '@invalid_keepalive': '0-600',
  '@invalid_string_too_long': 'String too long',
  '@already_exists': 'Already exists',
}
