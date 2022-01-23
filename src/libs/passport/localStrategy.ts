import { Strategy } from 'passport-local'
import jwt from 'jwt-simple'
import bcrypt from 'bcrypt'

import { UserDB } from '../../user/models/UserDB'
import { UserDto } from '../../user/interfaces'

export class LocalStrategy extends Strategy {
  constructor (
    private readonly dao: UserDB,
    opts: {
    usernameField?: string,
    passwordField?: string,
    passReqToCallback: true,
    session?: boolean
  }
  ) {
    super(opts, (req, email, password, done) => {
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

// const opts: {
//   usernameField?: string,
//   passwordField?: string,
//   passReqToCallback: true,
//   session?: boolean
// } = {
//   usernameField: 'email',
//   passwordField: 'password',
//   passReqToCallback: true,
//   session: false
// }
// const database = new Database()
// const dao = new UserDB(database)
// const localStrategy = new LocalStrategy(opts, async (req, email, password, done) => {
//   dao.checkPassword(email)
//     .then( async (checkPasswordResponse) => {
//       if (!checkPasswordResponse) {
//         return done({ message: `User with email: ${email}, does not exist` }, false)
//       }
//       const check = await bcrypt.compare(password, checkPasswordResponse.user.password)
//       if (!check) {
//         return done({ message: 'Incorrect password' }, false)
//       }

//       const { user } = checkPasswordResponse
//       const accessTokenPayload = {
//         id: user.id,
//         expiresIn: new Date().setTime(new Date().getTime() + 20000000)
//       }
//       const refreshTokenPayload = {
//         email: user.email,
//         expiresIn: new Date().setTime(new Date().getTime() + 1000000000)
//       }

//       const tokens = {
//         accessToken: jwt.encode(accessTokenPayload, 'super_secret'),
//         accessTokenExpirationDate: accessTokenPayload.expiresIn,
//         refreshToken: jwt.encode(refreshTokenPayload, 'super_secret_refresh'),
//         refreshTokenExpirationDate: refreshTokenPayload.expiresIn
//       }
//       const data: UserDto.WholeUser & { 
//         tokens: {
//           accessToken: string, accessTokenExpirationDate: number, refreshToken: string, refreshTokenExpirationDate: number} } = { ...user, tokens }
//       return done(null, data)
//     })
//     .catch((err) => done({ message: err.message }, false))
// })

// export default localStrategy
