import { prisma } from './prisma'

export type KeyString = ''
export type KeyNumber = ''
export type KeyJson = 'signin_message' | 'top_page_notice'

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
