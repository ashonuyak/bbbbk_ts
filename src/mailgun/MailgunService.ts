import { injectable } from 'inversify'
import Mailgun from "mailgun.js"
import config from 'config'
import FormData from "form-data"
import 'reflect-metadata'

import { IMailgunService } from '.'

@injectable()
export class MailgunService implements IMailgunService {
  private readonly mailgun: Mailgun
  constructor() {
    this.mailgun = new Mailgun(FormData)
  }
  async send(email: string): Promise<void> {
    const client = this.mailgun.client({username: 'api', key: config.get('mailgun.mailgunApiKey')})
    
    const messageData = {
      from: 'bbbbk',
      to: `${email}`,
      subject: 'Hello',
      text: 'Please, confirm your email address.',
      html: `<a href="http://localhost:3002/user/email-confirmed/${email}">Click Here</a>`
    }
    console.log(messageData);
    
    client.messages.create(config.get('mailgun.mailgunDomain'), messageData)
      .catch((err) => {
        err = {
          isMailgun: true,
          message: 'Incorrect email'
        }
        throw err
      }) 
  }
}