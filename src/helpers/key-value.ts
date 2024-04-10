import { prisma } from './prisma'

export type KeyString = 'enabled_release_note'
export type KeyNumber = ''
export type KeyJson = 'signin_message' | 'top_page_notice'

export type EnabledType = 'disabled' | 'enabled_all' | 'enabled_admin'

export const getKeyValueString = async <T extends string = string>(key: KeyString) => {
  const kv = await prisma.keyValue.findUnique({ where: { key } })
  return kv?.value ? (kv.value as T) : undefined
}

export const setKeyValueString = async (key: KeyString, value: string) => {
  await prisma.keyValue.upsert({
    where: { key },
    create: { key, value },
    update: { value },
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
  // @todo 暫定
  return 4
}

export const getEnabledReleaseNote = async () => {
  return (await getKeyValueString<EnabledType>('enabled_release_note')) || 'disabled'
}
export const setEnabledReleaseNote = async (status: EnabledType) => {
  await setKeyValueString('enabled_release_note', status)
}
