import { el } from '@/locale'
import { z } from 'zod'

// const convUndefined = <T>(value: T): T | undefined => {
//   return value || undefined
// }

const convNull = <T>(value: T): T | null => {
  return value || null
}

export const zUUID = z.string().uuid()
export const zUsername = z.string().min(4, el('@invalid_username'))
export const zUsernameConfirm = z.string().min(1, el('@required_field'))
export const zPassword = z.string().min(8, el('@invalid_password'))
export const zPasswordConfirm = z.string().min(1, el('@required_field'))
export const zEmail = z.string().email('@invalid_email').or(z.string().length(0)).transform(convNull)

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
  email: zEmail.optional(),
})
export type CreateUser = z.infer<typeof scCreateUser>

// ユーザー更新
export const scUpdateUser = z.object({
  id: zUUID,
  name: zUsername,
  password: zPassword.optional(),
  isAdmin: z.boolean(),
  email: zEmail.optional(),
})
export type UpdateUser = z.infer<typeof scUpdateUser>

// ユーザー
export type TypeUser = Omit<UpdateUser, 'password'> & { createdAt: Date; updatedAt: Date }
