import { IMailgunService } from "../../mailgun"

export interface MailgunProvider extends Pick<IMailgunService, 'send'> {}