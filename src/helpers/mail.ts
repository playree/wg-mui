import { t } from '@/locale/server'
import sgMail from '@sendgrid/mail'
import { createTransport } from 'nodemailer'

import { getAppName } from './env'
import { errSystemError } from './error'
import { TypeUser } from './schema'

type SendEmail = {
  to: string | { name: string; email: string; address: string }
  from: string | { name: string; email: string; address: string }
  subject: string
  text: string
}

/**
 * SendGrid
 * @param param
 */
const sendGrid = async (param: SendEmail) => {
  if (!process.env.SENDGRID_API_KEY) {
    throw errSystemError('SENDGRID_API_KEY not set')
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  await sgMail.send(param)
}

/**
 * sendmailコマンド
 * @param param
 */
const sendMail = async (param: SendEmail) => {
  if (!process.env.SENDMAIL_PATH) {
    throw errSystemError('SENDMAIL_PATH not set')
  }

  const tp = createTransport({
    sendmail: true,
    newline: 'unix',
    path: process.env.SENDMAIL_PATH,
  })
  await tp.sendMail(param)
}

/**
 * SMTP
 * @param param
 */
const sendSmtp = async (param: SendEmail) => {
  if (!process.env.SMTP_HOST) {
    throw errSystemError('SMTP_HOST not set')
  }
  if (!process.env.SMTP_PORT) {
    throw errSystemError('SMTP_PORT not set')
  }
  if (!process.env.SMTP_USER) {
    throw errSystemError('SMTP_USER not set')
  }
  if (!process.env.SMTP_PASS) {
    throw errSystemError('SMTP_PASS not set')
  }

  const tp = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
  await tp.sendMail(param)
}

const sendEmail = async (param: Omit<SendEmail, 'from'>) => {
  console.debug('sendEmail:', param.subject, param.to)
  if (!process.env.MAIL_FROM) {
    throw errSystemError('MAIL_FROM not set')
  }

  if (process.env.DEBUG_SEND_EMAIL) {
    // デバッグ用
    console.debug('sendEmail:Debug:', param.text)
    return
  }

  const from = {
    name: getAppName(),
    email: process.env.MAIL_FROM,
    address: process.env.MAIL_FROM,
  }
  switch (process.env.MAIL_SEND) {
    case 'sendgrid':
      return sendGrid({
        from,
        ...param,
      })
    case 'sendmail':
      return sendMail({
        from,
        ...param,
      })
    case 'smtp':
      return sendSmtp({
        from,
        ...param,
      })
  }
  throw errSystemError('Unable to send email')
}

/**
 * パスワード再設定メール送信
 * @param to
 * @param onetimeId
 */
export const sendEmailPasswordReset = async (param: { user: TypeUser; to: string; onetimeId: string }) => {
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
  const { username, locale = '', to, onetimeId } = param

  const url = new URL(`/mlchange/${onetimeId}`, process.env.NEXTAUTH_URL)
  console.debug('@mail:locale:', locale)
  await sendEmail({
    to,
    subject: t(locale, 'mail_email_confirm_subject', { appname: getAppName() }),
    text: t(locale, 'mail_email_confirm_body', { username: username, url: url.toString() }),
  })
}
