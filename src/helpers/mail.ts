import { t } from '@/locale/server'
import sgMail from '@sendgrid/mail'
import { createTransport } from 'nodemailer'

import {
  getEnvAppName,
  getEnvMailFrom,
  getEnvMailSend,
  getEnvNextauthUrl,
  getEnvSendgridApiKey,
  getEnvSendmailPath,
  getEnvSmtpHost,
  getEnvSmtpPass,
  getEnvSmtpPort,
  getEnvSmtpUser,
  isEnvDebugSendEmail,
} from './env'
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
  sgMail.setApiKey(getEnvSendgridApiKey())
  await sgMail.send(param)
}

/**
 * sendmailコマンド
 * @param param
 */
const sendMail = async (param: SendEmail) => {
  const tp = createTransport({
    sendmail: true,
    newline: 'unix',
    path: getEnvSendmailPath(),
  })
  await tp.sendMail(param)
}

/**
 * SMTP
 * @param param
 */
const sendSmtp = async (param: SendEmail) => {
  const user = getEnvSmtpUser()
  const pass = getEnvSmtpPass()

  const tp = createTransport({
    host: getEnvSmtpHost(),
    port: getEnvSmtpPort(),
    ignoreTLS: true,
    auth:
      user && pass
        ? {
            user,
            pass,
          }
        : undefined,
  })
  await tp.sendMail(param)
}

const sendEmail = async (param: Omit<SendEmail, 'from'>) => {
  console.debug('sendEmail:', param.subject, param.to)
  const mailFrom = getEnvMailFrom()

  if (isEnvDebugSendEmail()) {
    // デバッグ用
    console.debug('sendEmail:Debug:', param.text)
    return
  }

  const from = {
    name: getEnvAppName(),
    email: mailFrom,
    address: mailFrom,
  }
  switch (getEnvMailSend()) {
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

  const url = new URL(`/pwreset/${onetimeId}`, getEnvNextauthUrl())
  const locale = user.locale || ''
  console.debug('@mail:locale:', locale)
  await sendEmail({
    to,
    subject: t(locale, 'mail_password_reset_subject', { appname: getEnvAppName() }),
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

  const url = new URL(`/mlchange/${onetimeId}`, getEnvNextauthUrl())
  console.debug('@mail:locale:', locale)
  await sendEmail({
    to,
    subject: t(locale, 'mail_email_confirm_subject', { appname: getEnvAppName() }),
    text: t(locale, 'mail_email_confirm_body', { username: username, url: url.toString() }),
  })
}
