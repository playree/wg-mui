import { prisma } from './prisma'

export type KeyString = 'enabled_release_note' | 'password_score'
export type KeyNumber = 'password_score'
export type KeyBoolean = ''
export type KeyJson = 'signin_message' | 'top_page_notice'

export type EnabledType = 'disabled' | 'enabled_all' | 'enabled_admin'
export type PasswordScore = '3' | '4'

export const getKeyValueString = async <T extends string = string>(key: KeyString, defaultValue: T) => {
  const kv = await prisma.keyValue.findUnique({ where: { key } })
  return kv?.value ? (kv.value as T) : defaultValue
}

export const setKeyValueString = async (key: KeyString, value: string) => {
  await prisma.keyValue.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  })
}

export const getKeyValueNumber = async <T extends number = number>(key: KeyNumber, defaultValue: T) => {
  const kv = await prisma.keyValue.findUnique({ where: { key } })
  return kv?.value ? (Number(kv.value) as T) : defaultValue
}

export const setKeyValueNumber = async (key: KeyNumber, value: number) => {
  await prisma.keyValue.upsert({
    where: { key },
    create: { key, value: String(value) },
    update: { value: String(value) },
  })
}

export const getKeyValueJson = async <T extends Record<string, unknown>>(key: KeyJson) => {
  const kv = await prisma.keyValue.findUnique({ where: { key } })
  return kv?.value ? (JSON.parse(kv.value) as T) : undefined
}

export const setKeyValueJson = async (key: KeyJson, jsonValue: Record<string, unknown> | null) => {
  await prisma.keyValue.upsert({
    where: { key },
    create: { key, value: jsonValue ? JSON.stringify(jsonValue) : '' },
    update: { value: jsonValue ? JSON.stringify(jsonValue) : '' },
  })
}

export const getRequiredPasswordScore = async () => {
  return getKeyValueString<PasswordScore>('password_score', '4')
}
export const setRequiredPasswordScore = async (score: PasswordScore) => {
  await setKeyValueString('password_score', score)
}

export const getEnabledReleaseNote = async () => {
  return getKeyValueString<EnabledType>('enabled_release_note', 'disabled')
}
export const setEnabledReleaseNote = async (status: EnabledType) => {
  await setKeyValueString('enabled_release_note', status)
}
