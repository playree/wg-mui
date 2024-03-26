export const getAppName = () => process.env.APP_NAME || 'WG-MUI'

export const isGoogleEnabled = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
export const isGoogleSimpleLogin = () =>
  process.env.GOOGLE_SIMPLE_LOGIN ? process.env.GOOGLE_SIMPLE_LOGIN.toUpperCase() !== 'FALSE' : false
export const getGoogleConfig = () => ({
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
})

export const isGitLabEnabled = () =>
  !!(process.env.GITLAB_URL && process.env.GITLAB_CLIENT_ID && process.env.GITLAB_CLIENT_SECRET)
export const isGitLabSimpleLogin = () =>
  process.env.GITLAB_SIMPLE_LOGIN ? process.env.GITLAB_SIMPLE_LOGIN.toUpperCase() !== 'FALSE' : false
export const getGitLabUrl = () => process.env.GITLAB_URL || ''
export const getGitLabConfig = () => ({
  clientId: process.env.GITLAB_CLIENT_ID || '',
  clientSecret: process.env.GITLAB_CLIENT_SECRET || '',
})
