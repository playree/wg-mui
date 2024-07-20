'use server'

import { errValidation } from '@/helpers/error'
import { getRequiredPasswordScore } from '@/helpers/key-value'
import { sendEmailPasswordReset } from '@/helpers/mail'
import { prisma } from '@/helpers/prisma'
import { scCreateUser, scUpdateUser, zReq, zString, zUUID } from '@/helpers/schema'
import { validAction } from '@/helpers/server'
import { refWgMgr } from '@/helpers/wgmgr'
import { zxcvbn } from '@zxcvbn-ts/core'
import { randomUUID } from 'crypto'

/**
 * 設定取得(管理者権限)
 */
export const getSettings = validAction('getSettings', {
  requireAuth: true,
  requireAdmin: true,
  next: async () => {
    return {
      requiredPasswordScore: Number(await getRequiredPasswordScore()),
    }
  },
})

/**
 * ユーザーリスト取得(管理者権限)
 */
export const getUserList = validAction('getUserList', {
  requireAuth: true,
  requireAdmin: true,
  next: async () => {
    return prisma.user.getAllList({ withLabel: true, withPeer: true, withLastSignIn: true })
  },
})

const resetPwd = async (userId: string) => {
  const user = await prisma.user.get(userId)
  if (user?.email) {
    // パスワード設定用メール送信
    const passwordReset = await prisma.passwordReset.upsert({
      where: { id: user.id },
      create: { id: user.id, onetimeId: randomUUID() },
      update: { onetimeId: randomUUID() },
    })
    await sendEmailPasswordReset({
      user,
      to: user.email,
      onetimeId: passwordReset.onetimeId,
    })
  }
}

/**
 * ユーザー作成(管理者権限)
 */
export const createUser = validAction('createUser', {
  schema: scCreateUser,
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req }) => {
    // パスワードスコアチェック
    if (req.password) {
      const res = zxcvbn(req.password)
      if (res.score < Number(await getRequiredPasswordScore())) {
        throw errValidation('password score')
      }
    }

    const user = await prisma.user.createUser(req)
    if (!req.password && req.email) {
      // パスワード初期設定用メール送信
      await resetPwd(user.id)
    }
    return user
  },
})

/**
 * ユーザー更新(管理者権限)
 */
export const updateUser = validAction('updateUser', {
  schema: scUpdateUser,
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req }) => {
    // パスワードスコアチェック
    if (req.password) {
      const res = zxcvbn(req.password)
      if (res.score < Number(await getRequiredPasswordScore())) {
        throw errValidation('password score')
      }
    }

    return prisma.user.updateUser(req)
  },
})

/**
 * ユーザー削除(管理者権限)
 */
export const deleteUser = validAction('deleteUser', {
  schema: zReq({ id: zUUID }),
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req: { id } }) => {
    // 削除判定
    if (!(await checkDelete(id))) {
      throw errValidation(`can't delete`)
    }

    // ピアの削除
    const wgMgr = await refWgMgr()
    await wgMgr.deletePeerByUser(id)
    // ユーザーの削除
    await prisma.user.delete({ where: { id } })
    return
  },
})

/**
 * ユーザー名の存在確認(管理者権限)
 */
export const existsUserName = validAction('existsUserName', {
  schema: zReq({ name: zString, excludeId: zUUID.optional() }),
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req: { name, excludeId } }) => {
    const user = await prisma.user.findUnique({ where: { name } })
    if (user) {
      return excludeId ? user.id !== excludeId : true
    }
    return false
  },
})

/**
 * メールアドレスの存在確認(管理者権限)
 */
export const existsEmail = validAction('existsEmail', {
  schema: zReq({ email: zString, excludeId: zUUID.optional() }),
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req: { email, excludeId } }) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      return excludeId ? user.id !== excludeId : true
    }
    return false
  },
})

/**
 * パスワードリセット(管理者権限)
 */
export const resetPassword = validAction('resetPassword', {
  schema: zReq({ id: zUUID }),
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req: { id } }) => {
    await resetPwd(id)
  },
})

const checkDelete = async (id: string) => {
  const user = await prisma.user.get(id)
  if (user?.isAdmin) {
    // 管理者を削除する場合、管理者が残り一人なら削除不可
    const adminList = await prisma.user.findMany({ where: { isAdmin: true } })
    return adminList.length > 1
  }
  return true
}

/**
 * 削除可能判定(管理者権限)
 */
export const checkDeleteUser = validAction('checkDeleteUser', {
  schema: zReq({ id: zUUID }),
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req: { id } }) => {
    return checkDelete(id)
  },
})
