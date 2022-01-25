import { Strategy } from 'passport-local'
import jwt from 'jwt-simple'
import bcrypt from 'bcrypt'
import { decorate, inject, injectable } from 'inversify'

import { DBProvider, UserDto } from '../user/interfaces'
import { TYPES } from './constants'
import { UserDaoProvider } from './interfaces'

decorate(injectable(), Strategy)
@injectable()
export class LocalStrategy extends Strategy {
  constructor (
    @inject(TYPES.UserDaoProvider)private readonly dao: UserDaoProvider,
    @inject(TYPES.DBProvider) private readonly db: DBProvider
  ) {
    super( {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true as true,
      session: false
    }, 
    (req, email, password, done) => {
      this.dao.checkPassword(email)
      .then( async (checkPasswordResponse) => {
        if (!checkPasswordResponse) {
          return done({ message: `User with email: ${email}, does not exist` }, false)
        }
        const check = await bcrypt.compare(password, checkPasswordResponse.user.password)
        if (!check) {
          return done({ message: 'Incorrect password' }, false)
        }
  
        const { user } = checkPasswordResponse
        const accessTokenPayload = {
          id: user.id,
          expiresIn: new Date().setTime(new Date().getTime() + 20000000)
        }
        const refreshTokenPayload = {
          email: user.email,
          expiresIn: new Date().setTime(new Date().getTime() + 1000000000)
        }
  
        const tokens = {
          accessToken: jwt.encode(accessTokenPayload, 'super_secret'),
          accessTokenExpirationDate: accessTokenPayload.expiresIn,
          refreshToken: jwt.encode(refreshTokenPayload, 'super_secret_refresh'),
          refreshTokenExpirationDate: refreshTokenPayload.expiresIn
        }
        const data: UserDto.WholeUser & { 
          tokens: {
            accessToken: string, accessTokenExpirationDate: number, refreshToken: string, refreshTokenExpirationDate: number} } = { ...user, tokens }
        return done(null, data)
      })
      .catch((err) => done({ message: err.message }, false))
    })
  }
}
