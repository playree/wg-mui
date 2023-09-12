import { pathToRegexp } from 'path-to-regexp'

export const match = (path: string, matcher?: string[]) => {
  if (matcher) {
    for (const regex of matcher) {
      const regexp = pathToRegexp(regex)
      if (regexp.exec(path)) {
        return true
      }
    }
  }
  return false
}
