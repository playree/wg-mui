export type ErrorLocaleItem =
  | '@required_field'
  | '@invalid_username'
  | '@invalid_email'
  | '@invalid_password'
  | '@invalid_username_or_password'

export const errorLocales: Record<ErrorLocaleItem, { en: string; ja?: string }> = {
  '@required_field': {
    en: 'Required field',
    ja: '必須入力項目',
  },
  '@invalid_username': {
    en: '4 or more alphanumeric characters (.-_)',
    ja: '半角英数記号(.-_)4文字以上',
  },
  '@invalid_password': {
    en: '8 characters or more',
    ja: '8文字以上',
  },
  '@invalid_email': {
    en: 'Invalid email format',
    ja: 'Eメールフォーマットが不正',
  },
  '@invalid_username_or_password': {
    en: 'Incorrect username or password',
    ja: 'ユーザー名またはパスワードが間違っています',
  },
}
