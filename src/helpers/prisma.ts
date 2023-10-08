import { PrismaClient } from '@prisma/client'

import { hashPassword } from './password'
import { CreateUser } from './schema'

export const prisma = new PrismaClient().$extends({
  model: {
    user: {
      getAllList() {
        return prisma.user.findMany({
          select: { id: true, name: true, isNotInit: true, isAdmin: true, updatedAt: true, createdAt: true },
        })
      },
      createUser(data: CreateUser) {
        const { password, ...input } = data
        return prisma.user.create({
          data: {
            ...input,
            passwordHash: hashPassword(password),
          },
        })
      },
    },
  },
})
