'use server'

import { prisma } from '@/helpers/prisma'
import { CreateUser } from '@/helpers/schema'

export const createUser = async (data: CreateUser) => {
  console.debug('createUser:in:', data)
  const user = await prisma.user.createUser(data)
  console.debug('createUser:out:', user)
  return user
}

export const deleteUser = async (userId: string, formData: Record<string, unknown>) => {
  console.debug('deleteUser:', userId, formData)
}
