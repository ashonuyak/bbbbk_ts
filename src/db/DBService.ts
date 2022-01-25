import { Pool } from 'pg'
import conf from 'config'
import { injectable } from 'inversify'
import 'reflect-metadata'

import { IDBService } from '.'

@injectable()
export class DBService implements IDBService{
  private readonly config: {
    user: string, 
    host: string,
    database: string,
    password: string,
    port: number
  }
  private readonly pool: Pool
  constructor() {
    this.config = {
      user: conf.get('database.user'),
      host: conf.get('database.host'),
      database: conf.get('database.dbName'),
      password: conf.get('database.password'),
      port: conf.get('database.port')
    }
    this.pool = new Pool(this.config)
  }

  query(sql: any): Promise<any> {
    return this.pool.query(sql)
  }

  close(): Promise<void> {
    return this.pool.end()
  }
}
