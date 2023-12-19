import { Prisma, PrismaClient } from '@prisma/client'

import { hashPassword } from './password'
import { CreateUser, UpdateUser } from './schema'

export type AllOrCount = 'all' | 'count'

export const prisma = new PrismaClient().$extends({
  model: {
    user: {
      getAllList() {
        return prisma.user.findMany({
          select: {
            id: true,
            name: true,
            isNotInit: true,
            isAdmin: true,
            email: true,
            updatedAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'asc' },
        })
      },
      async createUser(data: CreateUser) {
        const { password, labelList, ...input } = data
        // Labelの紐付け
        const createLabelList =
          labelList.size > 0
            ? Array.from(labelList).map((value) => ({
                labelId: value,
              }))
            : undefined
        // passwordHashは返却から除外
        const { passwordHash: _, ...user } = await prisma.user.create({
          data: {
            ...input,
            passwordHash: hashPassword(password),
            userLabelList: { create: createLabelList },
          },
        })
        return user
      },
      async updateUser(id: string, data: UpdateUser) {
        const { password, ...input } = data
        // passwordHashは返却から除外
        const { passwordHash: _, ...user } = await prisma.user.update({
          where: { id },
          data: {
            ...input,
            passwordHash: password ? hashPassword(password) : undefined,
          },
        })
        return user
      },
    },
    label: {
      getAllList(withUser?: AllOrCount) {
        const include: Prisma.LabelInclude | undefined = withUser
          ? {
              userLabelList: withUser === 'all',
              _count: withUser === 'count' ? { select: { userLabelList: true } } : undefined,
            }
          : undefined
        return prisma.label.findMany({
          orderBy: { createdAt: 'asc' },
          include,
        })
      },
    },
  },
})
