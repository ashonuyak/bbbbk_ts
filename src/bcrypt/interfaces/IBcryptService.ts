export interface IBcryptService {
  hash(password: string): Promise<string>

  compare(newPassword: string, currentPassword: string): Promise<boolean>
}