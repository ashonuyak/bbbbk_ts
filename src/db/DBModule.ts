import { Container } from "inversify"
import 'reflect-metadata'

import { DBService, IDBService, TYPES } from "."

const dbContainer = new Container()

dbContainer.bind(DBService).toSelf().inSingletonScope()

// dbContainer.bind<IDBService>(TYPES.DBService).to(DBService).inSingletonScope()

export { dbContainer }