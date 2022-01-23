import jwt from 'jwt-simple'

import { AWSS3 } from '../utils/uploadS3'
import { ChangePasswordError } from './errors/ChangePasswordError'
import { RefreshTokenExpiredError } from './errors/RefreshTokenExpiredError'
import { SameEmailError } from './errors/SameEmailError'
import { EmailCheckError } from './errors/EmailCheckError'
import { UserDto, Service as IService } from './interfaces'
import { UserDB } from './models/UserDB'
import { Bcrypt } from '../bcrypt'
import { MailgunService } from '../mailgun'

export class Service implements IService {
  constructor (private readonly dao: UserDB, private readonly aws: AWSS3, private readonly bcrypt: Bcrypt, private readonly mailgun: MailgunService) {}
  async refresh(token: string): Promise<UserDto.Tokens> {
    const decodedToken = jwt.decode(token, 'super_secret_refresh')

    if (decodedToken.expiresIn <= new Date().getTime()) {
      throw new RefreshTokenExpiredError()
    }

    const userId = await this.dao.getUserByEmail(decodedToken.email)

    const accessToken = {
      id: userId,
      expiresIn: new Date().setTime(new Date().getTime() + 200000)
    }
    const refreshToken = {
      email: decodedToken.email,
      expiresIn: new Date().setTime(new Date().getTime() + 1000000)
    }
    return { accessToken, refreshToken }
  }

  async getAllUsers(): Promise<UserDto.GetAllUsers> {
    return (await this.dao.getAll())
  }

  async userCreate({fname, lname, email, password}: UserDto.UserCreate): Promise<void> {
    console.log('hello3')
    const passwordHash = await this.bcrypt.hash(password)
    // console.log("hello4")
    await this.dao.create({ fname, lname, email, password: passwordHash }).catch((err: any) => {
      if (err.constraint === 'user_table_email_key') {
        throw new SameEmailError()
      }
      throw new Error(err.message)
    })
    await this.mailgun.send(email)
  }

  async userUpdate({ fname, lname, email, password, id }: UserDto.UserUpdate): Promise<void> {
    const passwordHash = await this.bcrypt.hash(password)
    await this.dao.update({ fname, lname, email, password: passwordHash, id }).catch((err: any) => {
      if (err.constraint === 'user_table_email_key') {
        throw new SameEmailError()
      }
      throw new Error(err.message)
    })
  }

  async insertInfo({ country, city, rate, stack, id_category, id, id_info }: UserDto.InsertInfo): Promise<void> {
    if (id_info) return this.dao.updateInfo({ country, city, rate, stack, id_category, id_info })
    console.log(country, id_category)
    return this.dao.insertInfo({ country, city, rate, stack, id_category, id })
  }

  async userDelete(id: number): Promise<void> {
    await this.dao.delete(id)
  }

  async changePassword(pass: string, email: string): Promise<void> {
    const password = await this.dao.getPasswordByEmail(email)
    const check = await this.bcrypt.compare(pass, password)
    const passwordHash = await this.bcrypt.hash(pass)
    if (check) {
      throw new ChangePasswordError()
    }
    await this.dao.changePassword(passwordHash, email)
  }

  async checkEmail(email: string): Promise<string> {
    const emailCheck = await this.dao.checkEmail(email)
    if (!emailCheck) {
      throw new EmailCheckError()
    }
    return emailCheck
  }

  async searchUsers({ search, country, city, id_category, stack }: 
    UserDto.SearchUsers): Promise<UserDto.SearchUsersResponse[]> {
    return (await this.dao.searchUsers(
      { search, country, city, id_category, stack }))
  }

  async updatePhoto(photo: string, email: string): 
    Promise<string> {
    const photoUrl = await this.aws.uploadS3(photo, 'users', `${email}'s_photos`)
    await this.dao.updatePhoto(photoUrl, email)
    return photoUrl
  }

  async emailConfirmed(email: string): Promise<void> {
    return this.dao.emailConfirmed(email)
  }
}
