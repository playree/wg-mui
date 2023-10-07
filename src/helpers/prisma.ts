import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient().$extends({
  model: {
    user: {
      getAllList() {
        return prisma.user.findMany({
          select: { id: true, name: true, isNotInit: true, isAdmin: true, updatedAt: true, createdAt: true },
        })
      },
    },
  },
})
