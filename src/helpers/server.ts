import { authOptions } from '@/config/auth-options'
import { Session, getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema, z } from 'zod'

export const ALLOW_ORIGIN_ALL = { 'Access-Control-Allow-Origin': '*' }

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export const handleZod = <
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
      console.warn(errorMessage)
      return NextResponse.json(errorMessage, { status: 400 })
    }

    return next(req, items)
  }
}

export const handleZodWithAuth = <
  B extends ZodSchema = ZodSchema,
  Q extends ZodSchema = ZodSchema,
  P extends ZodSchema = ZodSchema,
>(
  { query, body, params }: { query?: Q; body?: B; params?: P },
  next: (
    req: NextRequest,
    items: { query: z.infer<Q>; body: z.infer<B>; params: z.infer<P>; session: Session },
  ) => void,
  requreAdmin = false,
) => {
  return async (req: NextRequest, { params: _params }: { params: Record<string, unknown> }) => {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Invalid session', { status: 403 })
    }
    if (requreAdmin && !session.user?.isAdmin) {
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
      session,
    }
    req.nextUrl.searchParams.forEach((value, key) => {
      items.query[key] = value
    })
    const parsed = schema.safeParse(items)
    if (!parsed.success) {
      const errorMessage = JSON.parse(parsed.error.message)
      console.warn(errorMessage)
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
