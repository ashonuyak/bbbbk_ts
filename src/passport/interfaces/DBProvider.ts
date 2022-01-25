import { IDBService } from "../../db"

export interface DBProvider extends Pick<IDBService, 'query'> {}