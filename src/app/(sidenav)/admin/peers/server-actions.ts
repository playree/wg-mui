'use server'

import { prisma } from '@/helpers/prisma'

export const getPeerAllList = async () => prisma.peer.getAllList()
