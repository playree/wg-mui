type LocaleKV = Record<string, string>
type LocaleLang = Record<string, LocaleKV>

export type LocaleConfig = {
  locales: string[]
  resources: LocaleLang
  cookie: {
    name: string
    maxAge: number
  }
}
