import { Controller } from './controller'
import { Service } from './service'
import { UserDB } from './models/UserDB'
import { AWSS3 } from '../utils/uploadS3'
import { Bcrypt } from '../bcrypt'
import { Database } from '../db'
import { MailgunService } from '../mailgun'

const database = new Database()
const repository = new UserDB(database)
const aws = new AWSS3()
const bcrypt = new Bcrypt()
const mailgun = new MailgunService()
const service = new Service(repository, aws, bcrypt, mailgun)
export const controller = new Controller(service)