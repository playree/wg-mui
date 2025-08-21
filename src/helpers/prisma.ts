import { Label, LastSignIn, Peer, Prisma, PrismaClient, User, UserLabel } from '@/generated/client'
import { randomUUID } from 'crypto'

import { OAuthType } from './env'
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

const convUserLabel = (userLabel: UserLabel & { label?: Label }) => ({
  id: userLabel.label?.id || '',
  name: userLabel.label?.name || '',
})

const convPeerIp = (peer: Peer) => peer.ip

const convUser = (
  inUser: User & {
    userLabelList?: (UserLabel & { label?: Label })[]
    peerList?: Peer[]
    lastSignIn?: LastSignIn | null
  },
): TypeUser => {
  // passwordHashは返却から除外
  const { passwordHash: _, userLabelList, peerList, lastSignIn, ...outUser } = inUser
  const labelList = userLabelList?.map((value) => convUserLabel(value))
  const peerIpList = peerList?.map((value) => convPeerIp(value))
  return {
    ...outUser,
    labelList,
    peerIpList,
    lastSignInAt: lastSignIn?.updatedAt,
    lastSignInProvider: lastSignIn?.provider,
  }
}

export type GetUserOption = { withLabel?: boolean; withPeer?: boolean; withLastSignIn?: boolean }

export const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async get(id: string) {
        const user = await prisma.user.findUnique({ where: { id } })
        return user ? convUser(user) : undefined
      },
      async getAllList({ withLabel = false, withPeer = false, withLastSignIn = false }: GetUserOption) {
        const userList = await prisma.user.findMany({
          include: {
            userLabelList: withLabel
              ? {
                  include: { label: true },
                }
              : undefined,
            peerList: withPeer,
            lastSignIn: withLastSignIn,
          },

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
            passwordHash: password ? hashPassword(password) : '',
            userLabelList: { create: createLabelList },
          },
        })
        return user
      },
      async updateUser(data: UpdateUser) {
        const { id, password, labelList, ...input } = data

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
      async updatePassword(id: string, password: string) {
        await prisma.user.update({
          where: { id },
          data: {
            passwordHash: hashPassword(password),
          },
        })
      },
      async updateEmail(id: string, email: string) {
        await prisma.user.update({
          where: { id },
          data: {
            email,
          },
        })
      },
      async getUserLinkOAuth(type: OAuthType, email: string) {
        const user = await prisma.user.findUnique({
          where: { email },
          include: { linkOAuthList: true },
        })
        if (user) {
          const { linkOAuthList, ...nextUser } = user
          for (const linkOAuth of linkOAuthList) {
            if (linkOAuth.type === type) {
              return { ...nextUser, linkOAuth }
            }
          }
          return { ...nextUser, linkOAuth: undefined }
        }
        return null
      },
    },
    label: {
      async getAllList(withUser?: AllOrCount) {
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
    peer: {
      async getAllList() {
        return prisma.peer.findMany({ orderBy: { ip: 'asc' }, include: { user: true } })
      },
      async getAllListByUser(userId: string, includeDeleting = false) {
        return prisma.peer.findMany({
          where: { userId, isDeleting: includeDeleting ? undefined : false },
          select: {
            ip: true,
            remarks: true,
            isDeleting: true,
            updatedAt: true,
            createdAt: true,
          },
        })
      },
    },
    linkOAuth: {
      async get(type: OAuthType, userId: string) {
        return prisma.linkOAuth.findUnique({
          where: { id_type: { id: userId, type } },
        })
      },
      async enable(type: OAuthType, userId: string) {
        return prisma.linkOAuth.update({
          where: { id_type: { id: userId, type } },
          data: { enabled: true },
        })
      },
      async getEnabled(type: OAuthType, sub: string) {
        return prisma.linkOAuth.findUnique({
          where: { type_sub: { type, sub }, enabled: true },
          include: { user: true },
        })
      },
      async isEnabled(type: OAuthType, userId: string) {
        const link = await prisma.linkOAuth.findUnique({ where: { id_type: { id: userId, type } } })
        return !!link?.enabled
      },
      async registOneTime(type: OAuthType, userId: string, sub?: string) {
        const onetimeId = randomUUID()
        if (sub) {
          return prisma.linkOAuth.upsert({
            where: { id_type: { id: userId, type } },
            create: { id: userId, type, sub, onetimeId },
            update: { sub, onetimeId },
          })
        }

        // subが未指定なら任意連携用(subに一時的にワンタイムを登録)
        return prisma.linkOAuth.upsert({
          where: { id_type: { id: userId, type } },
          create: { id: userId, type, sub: onetimeId, onetimeId },
          update: { sub: onetimeId, onetimeId },
        })
      },
      async getOnetimeUser(onetimeId: string) {
        return prisma.linkOAuth.findUnique({
          where: { onetimeId },
          include: { user: { select: { id: true, email: true } } },
        })
      },
      async unlink(type: OAuthType, userId: string) {
        return prisma.linkOAuth.delete({ where: { id_type: { id: userId, type } } })
      },
      async linkSub(onetimeId: string, type: OAuthType, sub: string) {
        // 連携を有効化
        await prisma.linkOAuth.update({
          where: { onetimeId, type },
          data: { sub, enabled: true },
        })
        return prisma.linkOAuth.getEnabled(type, sub)
      },
    },
  },
})
