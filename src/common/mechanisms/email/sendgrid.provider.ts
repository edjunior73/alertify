import { Injectable, Logger } from '@nestjs/common'
import sgMail from '@sendgrid/mail'
import { SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL } from '@common/constants'
import { EmailAdapterInterface } from '@modules/global-configs/interfaces'

@Injectable()
export class SendGridProvider implements EmailAdapterInterface {
  constructor() {
    sgMail.setApiKey(SENDGRID_API_KEY)
  }

  async sendEmail({
    body,
    subject,
    to
  }: {
    to: string
    subject: string
    body: string
  }): Promise<void> {
    const msg = {
      to,
      from: SENDGRID_SENDER_EMAIL,
      subject,
      text: body
    }
    await sgMail.send(msg).catch(_error => Logger.log(`It was not possible to send email to ${to}`))
  }
}
