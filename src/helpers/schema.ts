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

const zUsername = z.string().min(4, el('@invalid_username')).max(30, el('@invalid_username'))
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
const zEmail = z.string().email('@invalid_email').or(z.string().length(0)).transform(convNull)

const zLabelName = z.string().min(1, el('@invalid_label_name')).max(30, el('@invalid_label_name'))
const zExplanation = z.string().max(80, el('@invalid_label_name'))

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
})
export type CreateUser = z.infer<typeof scCreateUser>

// ユーザー更新
export const scUpdateUser = z.object({
  name: zUsername,
  password: zPasswordUpdate,
  isAdmin: z.boolean(),
  email: zEmail,
})
export type UpdateUser = z.infer<typeof scUpdateUser>

// ユーザー
export type TypeUser = Omit<UpdateUser, 'password'> & { id: string; createdAt: Date; updatedAt: Date }

// ラベル作成・更新
export const scEditLabel = z.object({
  name: zLabelName,
  explanation: zExplanation,
})
export type EditLabel = z.infer<typeof scEditLabel>

// ラベル
export type TypeLabel = EditLabel & { id: string; createdAt: Date; updatedAt: Date }
