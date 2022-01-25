import { Container } from "inversify"
import 'reflect-metadata'

import { TYPES, IBcryptService, BcryptService } from "."

const bcryptContainer = new Container()

bcryptContainer.bind<IBcryptService>(TYPES.BcryptService).to(BcryptService).inSingletonScope()

export { bcryptContainer }
