import { injectable, inject, decorate } from 'inversify'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { TYPES } from './constants'
import { UserDaoProvider, DBProvider } from './interfaces'

decorate(injectable(), Strategy)

@injectable()
export class JwtStrategy extends Strategy {
  constructor(
    @inject(TYPES.UserDaoProvider) private readonly dao: UserDaoProvider,
    @inject(TYPES.DBProvider) private readonly db: DBProvider
    ) {
    super( { 
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
      secretOrKey: 'super_secret'
    }, 
    (jwtPayload, done) => {
      if (jwtPayload.expiresIn <= new Date().getTime()) {
        done({ isPassport: true, message: 'Expired access token.' }, false)
      }
      this.dao.get(jwtPayload.id)
        .then((user) => done(null, user))
        .catch((err) => done({ isPassport: true, message: err.message }, false))
    })
  }
}
