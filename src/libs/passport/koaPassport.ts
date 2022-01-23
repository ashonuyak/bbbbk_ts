import passport from 'koa-passport'
import { ExtractJwt } from 'passport-jwt'
import { Database } from '../../db'
import { UserDB } from '../../user/models/UserDB'
import { JwtStrategy } from './jwtStrategy'
import { LocalStrategy } from './localStrategy'
const database = new Database()
const dao = new UserDB(database)
const optsJWT = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
      secretOrKey: 'super_secret'
    }
const jwtStrategy = new JwtStrategy(dao, optsJWT)
const optsLocal = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true as true,
    session: false
  }
const localStrategy = new LocalStrategy(dao, optsLocal)

passport.use(jwtStrategy)
passport.use(localStrategy)

export default passport
