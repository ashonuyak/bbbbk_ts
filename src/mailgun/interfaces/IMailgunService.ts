export interface IMailgunService {
  send(email: string): Promise<void>
}