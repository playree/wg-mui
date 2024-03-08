export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export const fetchJson = async <RES = void, REQ = Record<string, unknown>>(
  url: string,
  param?: {
    method?: HttpMethod
    body?: REQ
  },
): Promise<RES | void> => {
  const method = param?.method || 'GET'
  const body = param?.body ? JSON.stringify(param.body) : undefined

  const res = await fetch(url, {
    method,
    headers: body
      ? {
          'Content-Type': 'application/json',
        }
      : undefined,
    body,
  })
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  try {
    return await res.json()
  } catch {
    return
  }
}
