'use server'

import { errNotFound } from '@/helpers/error'
import { prisma } from '@/helpers/prisma'
import { validateAction } from '@/helpers/server'
import { z } from 'zod'

export const getAccount = validateAction(z.void(), async function getAccount({ user }) {
  const account = await prisma.user.get(user.id)
  if (!account) {
    throw errNotFound()
  }
  return account
})
