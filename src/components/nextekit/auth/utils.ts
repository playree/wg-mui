import { match } from '../utils'

export type MatchCondition = {
  require?: string[]
  exclude?: string[]
}

export const matchCondition = (path: string, condition?: MatchCondition) => {
  if (condition) {
    const require = condition.require ? match(path, condition.require) : true
    return require && !match(path, condition.exclude)
  }
  return false
}
