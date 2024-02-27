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
const reAbsolutePath = /^\/[a-zA-Z0-9.\-_/!#$%&()=@[\]]*$/
const reIp = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/
const reCIDR =
  /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\/([1-2]?[0-9]|3[0-2])$/

export const zUUID = z.string().uuid()
export const zString = z.string()
export const zBoolean = z.boolean()
export const zEmpty = z.string().length(0).nullish()

export const zAllOrCount = z.union([z.literal('all'), z.literal('count')])

export const zUsername = z
  .string()
  .min(4, el('@invalid_username'))
  .max(30, el('@invalid_username'))
  .regex(rePattern1String, el('@invalid_username'))
export const zUsernameConfirm = z.string().min(1, el('@required_field'))
export const zPassword = z
  .string()
  .min(8, el('@invalid_password'))
  .max(30, el('@invalid_password'))
  .regex(reHalfString, el('@invalid_password'))
export const zPasswordUpdate = z
  .string()
  .min(8, el('@invalid_password'))
  .max(30, el('@invalid_password'))
  .regex(reHalfString, el('@invalid_password'))
  .or(zEmpty)
  .transform(convUndefined)
export const zPasswordConfirm = z.string().min(1, el('@required_field'))
export const zEmail = z.string().email(el('@invalid_email')).or(zEmpty).transform(convNull)

export const zLabelName = z.string().min(1, el('@invalid_label_name')).max(20, el('@invalid_label_name'))
export const zExplanation = z.string().max(80, el('@invalid_label_name'))

export const zConfDirPath = z
  .string()
  .min(1, el('@invalid_conf_dir_path'))
  .regex(reAbsolutePath, el('@invalid_conf_dir_path'))
export const zInterfaceName = z
  .string()
  .min(1, el('@invalid_interface_name'))
  .max(60, el('@invalid_interface_name'))
  .regex(rePattern1String, el('@invalid_interface_name'))
export const zAddress = z.string().regex(reCIDR, el('@invalid_address'))
export const zListenPort = z.number().min(1, el('@invalid_port')).max(65535, el('@invalid_port'))
export const zPrivateKey = z.string().regex(reHalfString, el('@invalid_private_key'))
export const zEndPoint = z.string().url(el('@invalid_end_point'))
export const zDns = z.string().regex(reHalfString, el('@invalid_dns')).or(zEmpty).transform(convNull)
export const zIp = z.string().regex(reIp, el('@invalid_ip'))
export const zAllowedIPs = z.string().regex(reHalfString, el('@invalid_allowed_ips')).or(zEmpty).transform(convNull)
export const zKeepalive = z.number().min(0, el('@invalid_keepalive')).max(600, el('@invalid_keepalive'))
export const zRemarks = z.string().or(zEmpty).transform(convNull)
export const zPostUp = z.string().or(zEmpty).transform(convNull)
export const zPostDown = z.string().or(zEmpty).transform(convNull)

export const zReq = z.object

export const scVoid = z.void()

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
  id: zUUID,
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
  peerIpList?: string[]
  createdAt: Date
  updatedAt: Date
}

// ラベル作成
export const scCreateLabel = z.object({
  name: zLabelName,
  explanation: zExplanation,
})
export type CreateLabel = z.infer<typeof scCreateLabel>

// ラベル更新
export const scUpdateLabel = z.object({
  id: zUUID,
  name: zLabelName,
  explanation: zExplanation,
})
export type UpdateLabel = z.infer<typeof scUpdateLabel>

// ラベル
export type TypeLabel = UpdateLabel & { createdAt: Date; updatedAt: Date }

// ユーザーパスワード
export const scUserPassword = z.object({
  username: zUsername,
  password: zPassword,
})
export type UserPassword = z.infer<typeof scUserPassword>

// WG Conf初期設定
export const scInitializeWgConf = z.object({
  confDirPath: zConfDirPath,
  interfaceName: zInterfaceName,
  address: zAddress,
  listenPort: zListenPort,
  privateKey: zPrivateKey,
  postUp: zPostUp,
  postDown: zPostDown,
  endPoint: zEndPoint,
  dns: zDns,
  defaultAllowedIPs: zAllowedIPs,
  defaultKeepalive: zKeepalive,
})
export type InitializeWgConf = z.infer<typeof scInitializeWgConf>

// Peer作成
export const scCreatePeer = z.object({
  ip: zIp,
  userId: zUUID,
  privateKey: zPrivateKey,
  remarks: zRemarks,
})
export type CreatePeer = z.infer<typeof scCreatePeer>

// Peer更新
export const scUpdatePeer = z.object({
  ip: zIp,
  remarks: zRemarks,
})
export type UpdatePeer = z.infer<typeof scUpdatePeer>

// Peer
export type TypePeer = UpdatePeer & { createdAt: Date; updatedAt: Date }

// パスワード更新
export const scUpdatePassword = z.object({
  id: zUUID,
  password: zPassword,
})
export type UpdatePassword = z.infer<typeof scUpdatePassword>
