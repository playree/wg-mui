import { DefaultLocaleItems } from '.'

export const en: DefaultLocaleItems = {
  menu_initial_setting: 'Initial Setting',
  menu_dashboard: 'Dashboard',
  menu_users: 'Users',
  menu_labels: 'Labels',
  menu_peers: 'Peers',
  menu_settings: 'Settings',
  menu_locale: 'Locale',
  menu_theme: 'Theme',
  menu_signout: 'Sign Out',
  menu_peer: 'Peer(Connect)',
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
  item_edit: 'Edit',
  item_delete: 'Delete',
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
  item_conf_dir_path: 'Config file directory path',
  item_interface_name: 'Interface name',
  item_address: 'Address',
  item_listen_port: 'Listen Port',
  item_post_up: 'PostUp',
  item_post_down: 'PostDown',
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
  item_autostart_on: 'Auto Start ON',
  item_autostart_off: 'Auto Start OFF',
  item_enable: 'Enable',
  item_disable: 'Disable',
  item_refresh: 'Refresh',
  item_download_file: 'Download File',
  item_scan_qr: 'Scan from QR code',
  item_close: 'Close',
  msg_password_confirm: 'The password can be confirmed only once on the completion screen.',
  msg_user_delete: 'Delete ${username}.\n*All linked information will be deleted.',
  msg_common_error: 'An error has occurred',
  msg_enter_search_word: 'Enter search word',
  msg_not_installed: 'Not installed',
  msg_peer_delete: 'Delete ${peer}.\n*Deletion will not take effect until WireGuard is restarted.',
  msg_wg_stop_confirm: 'Do you want to stop WireGuard?',
  msg_wg_autostart_disable_confirm: 'Disable WireGuard autostart?',
  msg_conf_dir_permission_confirm:
    'The execution user (${user}) cannot access ${path}.\nWould you like to run the following command to grant permission?\n\n$ sudo chgrp ${user} ${path}\n$ sudo chmod g+x ${path}',
  msg_add_tunnel: 'Add a tunnel to your device',

  '@required_field': 'Required field',
  '@invalid_username': '4-30 alphanumeric characters (.-_)',
  '@invalid_password': '8-30 alphanumeric characters',
  '@invalid_email': 'Invalid email format',
  '@invalid_username_or_password': 'Incorrect username or password',
  '@invalid_label_name': '1-20 characters',
  '@invalid_explanation': 'Within 80 characters',
  '@invalid_conf_dir_path': 'Absolute path (ex. /etc/wireguard',
  '@invalid_interface_name': '1-60 alphanumeric characters (.-_)',
  '@invalid_address': 'Invalid CIDR format (ex. 192.168.1.1/24',
  '@invalid_port': '1-65535',
  '@invalid_private_key': 'alphanumeric characters',
  '@invalid_end_point': 'Invalid URL format',
  '@invalid_dns': 'Invalid DNS format',
  '@invalid_ip': 'Invalid IP format (ex. 192.168.1.1',
  '@invalid_allowed_ips': 'Invalid format',
  '@already_exists': 'Already exists',
}
