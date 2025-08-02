import { errSystemError } from './error'

export const OAUTH_TYPE_GOOGLE = 'google'
export const OAUTH_TYPE_GITLAB = 'gitlab'
export type OAuthType = 'google' | 'gitlab'

export const getEnvAppName = () => process.env.APP_NAME || 'WG-MUI'
export const getEnvNextauthUrl = () => process.env.NEXTAUTH_URL
export const getEnvDefaultLocale = () => process.env.DEFAULT_LOCALE

export const isEnvOAuthEnabled = (type: OAuthType) => {
  switch (type) {
    case 'google':
      return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    case 'gitlab':
      return !!(process.env.GITLAB_URL && process.env.GITLAB_CLIENT_ID && process.env.GITLAB_CLIENT_SECRET)
  }
}
export const isEnvOAuthSimpleLogin = (type: OAuthType) => {
  switch (type) {
    case 'google':
      return process.env.GOOGLE_SIMPLE_LOGIN ? process.env.GOOGLE_SIMPLE_LOGIN.toUpperCase() !== 'FALSE' : false
    case 'gitlab':
      return process.env.GITLAB_SIMPLE_LOGIN ? process.env.GITLAB_SIMPLE_LOGIN.toUpperCase() !== 'FALSE' : false
  }
}

export const getEnvOAuthConfig = (type: OAuthType) => {
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

export const getEnvGitLabUrl = () => process.env.GITLAB_URL || ''

export const getEnvSendgridApiKey = (defaultValue?: string) => {
  if (!process.env.SENDGRID_API_KEY) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw errSystemError('SENDGRID_API_KEY not set')
  }
  return process.env.SENDGRID_API_KEY
}

export const getEnvSendmailPath = (defaultValue?: string) => {
  if (!process.env.SENDMAIL_PATH) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw errSystemError('SENDMAIL_PATH not set')
  }
  return process.env.SENDMAIL_PATH
}

export const getEnvSmtpHost = (defaultValue?: string) => {
  if (!process.env.SMTP_HOST) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw errSystemError('SMTP_HOST not set')
  }
  return process.env.SMTP_HOST
}

export const getEnvSmtpPort = () => {
  if (!process.env.SMTP_PORT) {
    throw errSystemError('SMTP_PORT not set')
  }
  return Number(process.env.SMTP_PORT)
}

export const getEnvMailSend = () => process.env.MAIL_SEND
export const getEnvSmtpUser = () => process.env.SMTP_USER
export const getEnvSmtpPass = () => process.env.SMTP_PASS

export const getEnvMailFrom = (defaultValue?: string) => {
  if (!process.env.MAIL_FROM) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw errSystemError('MAIL_FROM not set')
  }
  return process.env.MAIL_FROM
}

export const isEnvDebugSendEmail = () => {
  if (process.env.DEBUG_SEND_EMAIL) {
    return process.env.DEBUG_SEND_EMAIL.toLowerCase() === 'true'
  }
  return false
}

export const getEnvDebugLinodeDummy = () => process.env.DEBUG_LINODE_DUMMY
export const getEnvLinodeId = () => process.env.LINODE_ID
export const getEnvLinodePersonalAccessToken = () => process.env.LINODE_PERSONAL_ACCESS_TOKEN
export const getEnvLinodeAccessInterval = () => process.env.LINODE_ACCESS_INTERVAL
