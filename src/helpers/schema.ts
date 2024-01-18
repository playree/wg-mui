import { el } from '@/locale'
import { z } from 'zod'

/**
 * undefined変換
 * フォームの未入力項目をundefinedとして渡したい場合に利用
 */
const convUndefined = <T>(value: T): T | undefined => {
  return value || undefined
}

/**
 * null変換
 * フォームの未入力項目をnullとして渡したい場合に利用
 */
const convNull = <T>(value: T): T | null => {
  return value || null
}

const reHalfString = /^[a-zA-Z0-9!-/:-@¥[-`{-~ ]*$/
const rePattern1String = /^[a-zA-Z0-9.\-_]*$/
const reAbsolutePath = /^\/.*$/
const reCIDR =
  /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\/([1-2]?[0-9]|3[0-2])$/

const zUsername = z
  .string()
  .min(4, el('@invalid_username'))
  .max(30, el('@invalid_username'))
  .regex(rePattern1String, el('@invalid_username'))
const zUsernameConfirm = z.string().min(1, el('@required_field'))
const zPassword = z
  .string()
  .min(8, el('@invalid_password'))
  .max(30, el('@invalid_password'))
  .regex(reHalfString, el('@invalid_password'))
const zPasswordUpdate = z
  .string()
  .min(8, el('@invalid_password'))
  .max(30, el('@invalid_password'))
  .regex(reHalfString, el('@invalid_password'))
  .or(z.string().length(0))
  .transform(convUndefined)
const zPasswordConfirm = z.string().min(1, el('@required_field'))
const zEmail = z.string().email(el('@invalid_email')).or(z.string().length(0)).transform(convNull)

const zLabelName = z.string().min(1, el('@invalid_label_name')).max(20, el('@invalid_label_name'))
const zExplanation = z.string().max(80, el('@invalid_label_name'))

const zConfDirPath = z.string().min(1, el('@invalid_conf_dir_path')).regex(reAbsolutePath, el('@invalid_conf_dir_path'))
const zInterfaceName = z
  .string()
  .min(1, el('@invalid_interface_name'))
  .max(60, el('@invalid_interface_name'))
  .regex(rePattern1String, el('@invalid_interface_name'))
const zAddress = z.string().regex(reCIDR, el('@invalid_address'))
const zPrivateKey = z.string().regex(reHalfString, el('@invalid_private_key'))
const zEndPoint = z.string().url(el('@invalid_end_point'))
const zDns = z.string().regex(reHalfString, el('@invalid_dns')).or(z.string().length(0)).transform(convNull)
const zAllowedIPs = z
  .string()
  .regex(reHalfString, el('@invalid_allowed_ips'))
  .or(z.string().length(0))
  .transform(convNull)
const zPersistentKeepalive = z.number()
const zRemarks = z.string().or(z.string().length(0)).transform(convNull)

// サインイン
export const scSignin = z.object({
  username: zUsernameConfirm,
  password: zPasswordConfirm,
})
export type Signin = z.infer<typeof scSignin>

// ユーザー作成
export const scCreateUser = z.object({
  name: zUsername,
  password: zPassword,
  isAdmin: z.boolean(),
  email: zEmail,
  labelList: z.set(z.string()),
})
export type CreateUser = z.infer<typeof scCreateUser>

// ユーザー更新
export const scUpdateUser = z.object({
  name: zUsername,
  password: zPasswordUpdate,
  isAdmin: z.boolean(),
  email: zEmail,
  labelList: z.set(z.string()),
})
export type UpdateUser = z.infer<typeof scUpdateUser>

// ユーザー
export type TypeUser = {
  id: string
  name: string
  isAdmin: boolean
  email: string | null
  labelList?: {
    id: string
    name: string
  }[]
  peerAddressList?: string[]
  createdAt: Date
  updatedAt: Date
}

// ラベル作成・更新
export const scEditLabel = z.object({
  name: zLabelName,
  explanation: zExplanation,
})
export type EditLabel = z.infer<typeof scEditLabel>

// ラベル
export type TypeLabel = EditLabel & { id: string; createdAt: Date; updatedAt: Date }

// WG Conf初期設定
export const scInitializeWgConf = z.object({
  confDirPath: zConfDirPath,
  interfaceName: zInterfaceName,
  address: zAddress,
  privateKey: zPrivateKey,
  endPoint: zEndPoint,
  dns: zDns,
})
export type InitializeWgConf = z.infer<typeof scInitializeWgConf>

// Peer作成
export const scCreatePeer = z.object({
  address: zAddress,
  userId: z.string().uuid(),
  privateKey: zPrivateKey,
  allowedIPs: zAllowedIPs,
  persistentKeepalive: zPersistentKeepalive,
  remarks: zRemarks,
})
export type CreatePeer = z.infer<typeof scCreatePeer>

// Peer更新
export const scUpdatePeer = z.object({
  allowedIPs: zAllowedIPs,
  persistentKeepalive: zPersistentKeepalive,
  remarks: zRemarks,
})
export type UpdatePeer = z.infer<typeof scUpdatePeer>

// Peer
export type TypePeer = UpdatePeer & { address: string; createdAt: Date; updatedAt: Date }
