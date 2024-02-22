import { getSessionUser } from '@/config/auth-options'
import { Session } from 'next-auth'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema, z } from 'zod'

import { ClientError, errInvalidSession, errPermissionDenied, errSystemError, errValidation } from './error'

export const ALLOW_ORIGIN_ALL = { 'Access-Control-Allow-Origin': '*' }

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export const validateApi = <
  B extends ZodSchema = ZodSchema,
  Q extends ZodSchema = ZodSchema,
  P extends ZodSchema = ZodSchema,
>(
  { query, body, params }: { query?: Q; body?: B; params?: P },
  next: (req: NextRequest, items: { query: z.infer<Q>; body: z.infer<B>; params: z.infer<P> }) => void,
) => {
  return async (req: NextRequest, { params: _params }: { params: Record<string, unknown> }) => {
    const schema = z.object({
      query: query || z.object({}),
      body: body || z.object({}),
      params: params || z.object({}),
    })
    const items = {
      query: {} as Record<string, unknown>,
      body: req.headers.get('Content-Type') === 'application/json' ? await req.json() : {},
      params: _params || {},
    }
    req.nextUrl.searchParams.forEach((value, key) => {
      items.query[key] = value
    })
    const parsed = schema.safeParse(items)
    if (!parsed.success) {
      const errorMessage = JSON.parse(parsed.error.message)
      console.warn('validation error', parsed.error.message)
      return NextResponse.json(errorMessage, { status: 400 })
    }

    return next(req, items)
  }
}

export const validateAuthApi = <
  B extends ZodSchema = ZodSchema,
  Q extends ZodSchema = ZodSchema,
  P extends ZodSchema = ZodSchema,
>(
  { query, body, params }: { query?: Q; body?: B; params?: P },
  next: (
    req: NextRequest,
    items: { query: z.infer<Q>; body: z.infer<B>; params: z.infer<P>; user: Session['user'] },
  ) => void,
  requreAdmin = false,
) => {
  return async (req: NextRequest, { params: _params }: { params: Record<string, unknown> }) => {
    const user = await getSessionUser()
    if (!user) {
      return new NextResponse('Invalid session', { status: 403 })
    }
    if (requreAdmin && !user.isAdmin) {
      return new NextResponse('Permission denied', { status: 403 })
    }

    const schema = z.object({
      query: query || z.object({}),
      body: body || z.object({}),
      params: params || z.object({}),
    })
    const items = {
      query: {} as Record<string, unknown>,
      body: req.headers.get('Content-Type') === 'application/json' ? await req.json() : {},
      params: _params || {},
      user,
    }
    req.nextUrl.searchParams.forEach((value, key) => {
      items.query[key] = value
    })
    const parsed = schema.safeParse(items)
    if (!parsed.success) {
      const errorMessage = JSON.parse(parsed.error.message)
      console.warn('validation error', parsed.error.message)
      return NextResponse.json(errorMessage, { status: 400 })
    }

    return next(req, items)
  }
}

export const convFormData = (formData: FormData) => {
  const data: Record<string, unknown> = {}
  formData.forEach((value, key) => {
    data[key] = value
  })
  return data
}

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string }

export const validateAuthAction = <REQ extends ZodSchema = ZodSchema, RES = void>(
  reqSchema: REQ,
  next: (param: { req: z.infer<REQ>; user: Session['user'] }) => Promise<RES>,
  requreAdmin = false,
) => {
  return async (req: z.infer<REQ>): Promise<ActionResult<RES>> => {
    const pathname = headers().get('x-pathname') || ''
    console.debug(`va@${pathname}@${next.name}`)

    try {
      const user = await getSessionUser()
      if (!user) {
        throw errInvalidSession()
      }
      if (requreAdmin && !user.isAdmin) {
        throw errPermissionDenied()
      }

      const parsed = reqSchema.safeParse(req)
      if (!parsed.success) {
        throw errValidation(parsed.error.message)
      }

      return {
        ok: true,
        data: await next({ req, user }),
      }
    } catch (e) {
      if (e instanceof ClientError) {
        console.warn(e.message)
        return {
          ok: false,
          error: e.message,
        }
      }

      console.error(e)
      return {
        ok: false,
        error: errSystemError().message,
      }
    }
  }
}
