import { prisma } from '@/helpers/prisma'
import { zReq, zString } from '@/helpers/schema'
import { resBadRequest, validApi } from '@/helpers/server'
import { localeConfig } from '@/locale/config'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const scSetLocaleApi = zReq({ locale: zString })
export type SetLocaleApi = z.infer<typeof scSetLocaleApi>

export const POST = validApi({
  schema: { body: scSetLocaleApi },
  requireAuth: true,
  next: async (request, { body: { locale }, user }) => {
    if (localeConfig.locales.includes(locale)) {
      await prisma.user.update({ where: { id: user.id }, data: { locale } })
    } else {
      return resBadRequest()
    }
    return NextResponse.json(null)
  },
})
