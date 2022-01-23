import { JwtFromRequestFunction, Strategy } from 'passport-jwt'

import { UserDB } from '../../user/models/UserDB'

export class JwtStrategy extends Strategy {
  constructor(
    private readonly dao: UserDB, 
    opts: { 
      jwtFromRequest: JwtFromRequestFunction,
      secretOrKey: string
    }
    ) {
    super(opts, (jwtPayload, done) => {
      if (jwtPayload.expiresIn <= new Date().getTime()) {
        done({ isPassport: true, message: 'Expired access token.' }, false)
      }
      this.dao.get(jwtPayload.id)
        .then((user) => done(null, user))
        .catch((err) => done({ isPassport: true, message: err.message }, false))
    })
  }
}
