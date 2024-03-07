import { prisma } from './prisma'

export type KeyString = ''
export type KeyNumber = ''
export type KeyJson = 'signin_message'

export const getKeyValueJson = async <T extends Record<string, unknown>>(key: KeyJson) => {
  const value = await prisma.keyValue.findUnique({ where: { key } })
  return value ? (JSON.parse(value.value) as T) : undefined
}

export const setKeyValueJson = async (key: KeyJson, jsonValue: Record<string, unknown>) => {
  await prisma.keyValue.upsert({
    where: { key },
    create: { key, value: JSON.stringify(jsonValue) },
    update: { value: JSON.stringify(jsonValue) },
  })
}
