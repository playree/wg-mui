export const OAUTH_TYPE_GOOGLE = 'google'
export const OAUTH_TYPE_GITLAB = 'gitlab'
export type OAuthType = 'google' | 'gitlab'

export const getAppName = () => process.env.APP_NAME || 'WG-MUI'

export const isOAuthEnabled = (type: OAuthType) => {
  switch (type) {
    case 'google':
      return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    case 'gitlab':
      return !!(process.env.GITLAB_URL && process.env.GITLAB_CLIENT_ID && process.env.GITLAB_CLIENT_SECRET)
  }
}
export const isOAuthSimpleLogin = (type: OAuthType) => {
  switch (type) {
    case 'google':
      return process.env.GOOGLE_SIMPLE_LOGIN ? process.env.GOOGLE_SIMPLE_LOGIN.toUpperCase() !== 'FALSE' : false
    case 'gitlab':
      return process.env.GITLAB_SIMPLE_LOGIN ? process.env.GITLAB_SIMPLE_LOGIN.toUpperCase() !== 'FALSE' : false
  }
}

export const getOAuthConfig = (type: OAuthType) => {
  switch (type) {
    case 'google':
      return {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      }
    case 'gitlab':
      return {
        clientId: process.env.GITLAB_CLIENT_ID || '',
        clientSecret: process.env.GITLAB_CLIENT_SECRET || '',
      }
  }
}

export const getGitLabUrl = () => process.env.GITLAB_URL || ''
