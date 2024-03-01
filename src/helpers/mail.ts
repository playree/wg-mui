import sgMail from '@sendgrid/mail'

import { getAppName } from './env'
import { errSystemError } from './error'

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
export const sendEmailPasswordReset = async (param: { username: string; to: string; onetimeId: string }) => {
  if (!process.env.SENDGRID_API_KEY) {
    throw errSystemError('SENDGRID_API_KEY not set')
  }
  const { username, to, onetimeId } = param

  const url = new URL(`/pwreset/${onetimeId}`, process.env.NEXTAUTH_URL)
  await sendEmail({
    to,
    subject: `[${getAppName()}] Password Reset`,
    text: `username: ${username}

Please reset your password from the URL below.
This URL will expire in 48 hours.

${url}
`,
  })
}
