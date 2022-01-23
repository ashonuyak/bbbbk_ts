import { Pool } from 'pg'
import conf from 'config'

export class Database {
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

  query(sql: any) {
    return this.pool.query(sql)
  }

  close() {
    this.pool.end()
  }
}
