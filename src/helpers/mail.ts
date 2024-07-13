import { t } from '@/locale/server'
import sgMail from '@sendgrid/mail'

import { getAppName } from './env'
import { errSystemError } from './error'
import { TypeUser } from './schema'

type SendEmail = {
  to: string | { name?: string; email: string }
  from: string | { name?: string; email: string }
  subject: string
  text: string
}

const sendGrid = async (param: SendEmail) => {
  if (!process.env.SENDGRID_API_KEY) {
    throw errSystemError('SENDGRID_API_KEY not set')
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  await sgMail.send(param)
}

const sendEmail = async (param: Omit<SendEmail, 'from'>) => {
  console.debug('sendEmail:', param.subject, param.to)
  if (!process.env.MAIL_FROM) {
    throw errSystemError('SENDGRID_API_KEY not set')
  }

  if (process.env.DEBUG_SEND_EMAIL) {
    // デバッグ用
    console.debug('sendEmail:Debug:', param.text)
    return
  }

  const from = {
    name: getAppName(),
    email: process.env.MAIL_FROM,
  }
  switch (process.env.MAIL_SEND) {
    case 'sendgrid':
      return sendGrid({
        from,
        ...param,
      })
  }
  throw errSystemError('MAIL_SEND not set')
}

/**
 * パスワード再設定メール送信
 * @param to
 * @param onetimeId
 */
export const sendEmailPasswordReset = async (param: { user: TypeUser; to: string; onetimeId: string }) => {
  if (!process.env.SENDGRID_API_KEY) {
    throw errSystemError('SENDGRID_API_KEY not set')
  }
  const { user, to, onetimeId } = param

  const url = new URL(`/pwreset/${onetimeId}`, process.env.NEXTAUTH_URL)
  const locale = user.locale || ''
  console.debug('@mail:locale:', locale)
  await sendEmail({
    to,
    subject: t(locale, 'mail_password_reset_subject', { appname: getAppName() }),
    text: t(locale, 'mail_password_reset_body', { username: user.name, url: url.toString() }),
  })
}

/**
 * メールアドレス確認メール送信
 * @param to
 * @param onetimeId
 */
export const sendEmailConfirm = async (param: { username: string; locale?: string; to: string; onetimeId: string }) => {
  if (!process.env.SENDGRID_API_KEY) {
    throw errSystemError('SENDGRID_API_KEY not set')
  }
  const { username, locale = '', to, onetimeId } = param

  const url = new URL(`/mlconfirm/${onetimeId}`, process.env.NEXTAUTH_URL)
  console.debug('@mail:locale:', locale)
  await sendEmail({
    to,
    subject: t(locale, 'mail_email_confirm_subject', { appname: getAppName() }),
    text: t(locale, 'mail_email_confirm_body', { username: username, url: url.toString() }),
  })
}
