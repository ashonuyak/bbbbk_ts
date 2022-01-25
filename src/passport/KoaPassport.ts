import passport from 'koa-passport'

import { JwtStrategy } from './JwtStrategy'
import { LocalStrategy } from './LocalStrategy'
import { passportContainer } from './PassportModule'

const jwtStrategy = passportContainer.get(JwtStrategy)
const localStrategy = passportContainer.get(LocalStrategy)

passport.use(jwtStrategy)
passport.use(localStrategy)

export default passport
