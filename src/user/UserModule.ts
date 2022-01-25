import { Container } from 'inversify'
import 'reflect-metadata'

import { UserDao } from './models/UserDao'
import { IUserDao, AWSProvider, BcryptProvider, IUserController, DBProvider, MailgunProvider, IUserService } from './interfaces'
import { TYPES } from './constants'
import * as Mailgun from '../mailgun'
import * as Bcrypt from '../bcrypt'
import * as AWS from '../utils'
import * as DB from '../db'
import { UserService } from './UserService'
import { UserController } from './UserController'
import { MailgunService } from '../mailgun'
import { DBService } from '../db'

const container = new Container()

// container
//   .bind<DBProvider>(TYPES.DBProvider)
//   .toConstantValue(DB.dbContainer
//     .get(DBService))

container
  .bind<MailgunProvider>(TYPES.MailgunProvider)
  .toConstantValue(Mailgun.mailgunContainer
    .get(MailgunService))

container
  .bind<BcryptProvider>(TYPES.BcryptProvider)
  .toConstantValue(Bcrypt.bcryptContainer
    .get(Bcrypt.TYPES.BcryptService))

container
  .bind<AWSProvider>(TYPES.AWSProvider)
  .toConstantValue(AWS.awsContainer
    .get(AWS.TYPES.AWSService))

container
  .bind<IUserService>(TYPES.UserServiceProvider)
  .to(UserService)
  .inSingletonScope()

container
  .bind<IUserDao>(TYPES.UserDaoProvider)
  .to(UserDao)
  .inSingletonScope()

container
  .bind<IUserController>(TYPES.UserControllerProvider)
  .to(UserController)
  .inSingletonScope()

export default container
