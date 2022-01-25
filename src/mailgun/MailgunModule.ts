import { Container } from "inversify"
import 'reflect-metadata'

import { TYPES, IMailgunService, MailgunService } from "."

const mailgunContainer = new Container()

mailgunContainer.bind(MailgunService).toSelf().inSingletonScope()

export { mailgunContainer }
