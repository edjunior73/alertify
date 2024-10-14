import { Injectable } from '@nestjs/common'
import { SendGridProvider } from '@common/mechanisms/email'
import { EMAIL_SERVICE } from '@common/constants'
import { EmailService } from '@common/enums'
import { EmailAdapterInterface } from '../interfaces'

@Injectable()
export class EmailAdapter {
  emailAdapter: EmailAdapterInterface

  constructor() {
    switch (EMAIL_SERVICE) {
      case EmailService.SENDGRID:
        this.emailAdapter = new SendGridProvider()
        break
      default:
        throw new Error(`Invalid Email provider: ${EMAIL_SERVICE}`)
    }
  }

  async sendEmail(args: { to: string; subject: string; body: string }): Promise<void> {
    await this.emailAdapter.sendEmail(args)
  }
}
