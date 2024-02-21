'use server'

import { errInvalidSession, errNotFound } from '@/helpers/error'
import { prisma } from '@/helpers/prisma'
import { scUpdatePassword } from '@/helpers/schema'
import { validateAuthAction } from '@/helpers/server'
import { z } from 'zod'

export const getAccount = validateAuthAction(z.void(), async function getAccount({ user }) {
  const account = await prisma.user.get(user.id)
  if (!account) {
    throw errNotFound()
  }
  return account
})

export const updatePassword = validateAuthAction(scUpdatePassword, async function updatePassword({ req, user }) {
  if (req.id !== user.id) {
    throw errInvalidSession()
  }
  await prisma.user.updatePassword(req.id, req.password)
  return
})
