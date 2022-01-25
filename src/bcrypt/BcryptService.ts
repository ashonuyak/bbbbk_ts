import bcrypt from 'bcrypt'
import { injectable } from 'inversify'
import { IBcryptService } from './interfaces/IBcryptService'

@injectable()
export class BcryptService implements IBcryptService {
 hash(password: string): Promise<string> {
   return bcrypt.hash(password, 10)
 }

 compare(newPassword: string, currentPassword: string): Promise<boolean> {
   return bcrypt.compare(newPassword, currentPassword)
 }
}