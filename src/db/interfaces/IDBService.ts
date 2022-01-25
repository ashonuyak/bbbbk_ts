export interface IDBService {
  query(sql: any): Promise<any>

  close(): Promise<void>
}