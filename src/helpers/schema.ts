import { el } from '@/locale'
import { z } from 'zod'

export const zUsername = z.string().nonempty(el('@required_field')).min(4, el('@invalid_username'))
export const zUsernameConfirm = z.string().nonempty(el('@required_field'))
export const zPassword = z.string().nonempty(el('@required_field')).min(8, el('@invalid_password'))
export const zPasswordConfirm = z.string().nonempty(el('@required_field'))

// サインイン
export const scSignin = z.object({
  username: zUsernameConfirm,
  password: zPasswordConfirm,
})
export type TypeSignin = z.infer<typeof scSignin>
