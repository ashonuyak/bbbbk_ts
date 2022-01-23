import bcrypt from 'bcrypt'

export class Bcrypt {
 hash(password: string): Promise<string> {
   return bcrypt.hash(password, 10)
 }

 compare(newPassword: string, currentPassword: string): Promise<boolean> {
   return bcrypt.compare(newPassword, currentPassword)
 }
}