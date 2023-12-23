import { Label, Prisma, PrismaClient, User, UserLabel } from '@prisma/client'

import { hashPassword } from './password'
import { CreateUser, TypeUser, UpdateUser } from './schema'

export type AllOrCount = 'all' | 'count'

const convCreateLabelList = (target: string[]) => {
  return target
    ? target.map((value) => ({
        labelId: value,
      }))
    : undefined
}

const convDeleteLabelList = (target: UserLabel[]) => {
  return target
    ? target.map((value) => ({
        id: value.id,
      }))
    : undefined
}

const convUserLabel = (userLabel: UserLabel & { label: Label }) => ({
  id: userLabel.label.id,
  name: userLabel.label.name,
})

const convUser = (
  inUser: User & {
    userLabelList?: (UserLabel & { label: Label })[]
  },
): TypeUser => {
  // passwordHashは返却から除外
  const { passwordHash: _, userLabelList, ...outUser } = inUser
  const labelList = userLabelList?.map((value) => convUserLabel(value))
  return {
    ...outUser,
    labelList,
  }
}

export const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async getAllList(withLabel = false) {
        const userList = await prisma.user.findMany({
          include: withLabel
            ? {
                userLabelList: {
                  include: { label: true },
                },
              }
            : undefined,
          orderBy: { createdAt: 'asc' },
        })
        return userList.map((value) => convUser(value))
      },
      async createUser(data: CreateUser) {
        const { password, labelList, ...input } = data

        // Labelの紐付け
        const createLabelList = convCreateLabelList(Array.from(labelList))

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
        const { password, labelList, ...input } = data

        // 更新対象を取得
        const target = await prisma.user.findUnique({ where: { id }, include: { userLabelList: true } })
        if (!target) {
          throw new Error('user not found')
        }
        const targetLabelList = target.userLabelList.map((value) => value.labelId)

        // Labelの紐付け
        const createLabelList = convCreateLabelList(
          Array.from(labelList).filter((value) => !targetLabelList.includes(value)),
        )
        const deleteLabelList = convDeleteLabelList(
          target.userLabelList.filter((value) => !labelList.has(value.labelId)),
        )

        // passwordHashは返却から除外
        const { passwordHash: _, ...user } = await prisma.user.update({
          where: { id },
          data: {
            ...input,
            passwordHash: password ? hashPassword(password) : undefined,
            userLabelList: {
              create: createLabelList,
              delete: deleteLabelList,
            },
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
