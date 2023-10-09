'use server'

import { prisma } from '@/helpers/prisma'
import { CreateUser } from '@/helpers/schema'

export const getUserList = async () => {
  console.debug('getUserList:in:')
  const userList = await prisma.user.getAllList()
  console.debug('getUserList:out:', userList.length)
  return userList
}

export const createUser = async (data: CreateUser) => {
  console.debug('createUser:in:', data)
  const user = await prisma.user.createUser(data)
  console.debug('createUser:out:', user)
  return user
}

export const deleteUser = async (id: string) => {
  console.debug('deleteUser:in:', id)
  await prisma.user.delete({ where: { id } })
  return
}
