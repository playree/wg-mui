import type { ActionResult } from './server'

export const parseAction = async <T>(actionResult: Promise<ActionResult<T>>) => {
  const result = await actionResult
  if (!result.ok) {
    throw new Error(result.error)
  }
  return result.data
}
