'use server'

import { prisma } from '@/helpers/prisma'
import { CreateUser, UpdateUser } from '@/helpers/schema'

export const getUserList = async (withLabel = false) => {
  console.debug('getUserList:in:')
  const userList = await prisma.user.getAllList(withLabel)
  console.debug('getUserList:out:', userList.length)
  return userList
}

export const createUser = async (data: CreateUser) => {
  console.debug('createUser:in:', data)
  const user = await prisma.user.createUser(data)
  console.debug('createUser:out:', user)
  return user
}

export const updateUser = async (id: string, data: UpdateUser) => {
  console.debug('updateUser:in:', data)
  const user = await prisma.user.updateUser(id, data)
  console.debug('updateUser:out:', user)
  return user
}

export const deleteUser = async (id: string) => {
  console.debug('deleteUser:in:', id)
  await prisma.user.delete({ where: { id } })
  console.debug('deleteUser:out:')
  return
}

export const existsUserName = async (name: string) => {
  console.debug('existsUser:in:', name)
  const user = await prisma.user.findUnique({ where: { name } })
  const exists = !!user
  console.debug('existsUser:out:', exists)
  return exists
}
