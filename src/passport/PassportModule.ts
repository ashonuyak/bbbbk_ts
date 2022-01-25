import { Container } from "inversify"
import 'reflect-metadata'

import { TYPES } from "./constants"
import { UserDaoProvider, DBProvider } from "./interfaces"
import { UserDao } from '../user/models/UserDao'
import { DBService } from "../db"
import { JwtStrategy } from "./JwtStrategy"
import { LocalStrategy } from "./LocalStrategy"

const passportContainer = new Container()

passportContainer.bind<DBProvider>(TYPES.DBProvider).to(DBService).inSingletonScope()

passportContainer.bind<UserDaoProvider>(TYPES.UserDaoProvider).to(UserDao).inSingletonScope()

passportContainer.bind(JwtStrategy).toSelf().inSingletonScope()

passportContainer.bind(LocalStrategy).toSelf().inSingletonScope()

export { passportContainer }

