import { injectable, inject } from 'inversify'

import { User } from './User'
import { DBProvider, UserDto } from '../interfaces'
import { IUserDao } from '../interfaces/IUserDao'
import { TYPES } from '../constants'
import { DBService } from '../../db'

@injectable()
export class UserDao implements IUserDao {
  private readonly database: DBProvider
  constructor (
    // @inject(TYPES.DBProvider) private readonly database: DBProvider
    ) {
      this.database =  new DBService()
    }
  async get(id: number): Promise<UserDto.GetUser> {
    const userResponse = await this.database.query(`
      SELECT * 
      FROM "user_table" 
      WHERE id=${id}
      `)

    if (!userResponse.rowCount) {
      throw new Error(`User with id: ${id}, does not exist`)
    }

    return new User(userResponse.rows[0])
  }

  async getAll(): Promise<UserDto.GetAllUsers> {
    const userListResponse = await this.database.query(`
      select u.fname, u.lname, u.email, u.photo,
        it.country, it.city, it.rate, it.stack, ct.category_name 
      from user_table u 
        left join info_table it on it.id = u.id_info 
        left join category_table ct on ct.id = it.id_category;
      `)

    const users = userListResponse.rows.map((userDb: User) => new User(userDb).getAllUsers())
    return users
  }

  async create({ fname, lname, email, password }: UserDto.UserCreate): Promise<void> {
    await this.database.query(`
      INSERT 
      INTO "user_table" 
      (fname, 
      lname, 
      email, 
      password) 
      VALUES 
      ('${fname}', 
      '${lname}',  
      '${email}', 
      '${password}')
      RETURNING *
      `)
  }

  async update({ fname, lname, email, password, id }: UserDto.UserUpdate): Promise<void> {
    await this.database.query(`
      UPDATE "user_table" 
      SET fname='${fname}', 
      lname='${lname}', 
      email='${email}', 
      password='${password}' 
      WHERE id=${id}
      `)
  }

  async insertInfo({ country, city, rate, stack, id_category, id }: UserDto.InsertInfoResponse): Promise<void> {
    const infoid = await this.database.query(`
    INSERT INTO "info_table" (country, city, rate, ${id_category ? `id_category,` : ''} stack)
    VALUES 
    ('${country}',
    '${city}',
    '${rate}',
    ${id_category ? `${id_category},` : ''}
    '${stack}')
    RETURNING *
    `)
    await this.database.query(`
    UPDATE "user_table"
    SET id_info=${infoid.rows[0].id}
    WHERE id=${id}
    `)
  }

  async updateInfo({ country, city, rate, stack, id_category, id_info }: UserDto.UpdateInfo): Promise<void> {
    const info = { country, city, rate, stack, id_category }
    const userInfo = Object.entries(info)
      .reduce((acc, item) => {
        if (item[0] && item[1]) {
          if (item[0] === 'id_category') {
            return (acc += `${item[0] + `=${item[1]}, `}`)
          }
          return (acc += `${item[0] + `='${item[1]}', `}`)
        }
        return (acc += '')
      }, '')
      .slice(0, -2)
    await this.database.query(`
    update info_table
    set ${userInfo}
    where id=${id_info};
    `)
  }

  async delete(id: number): Promise<void> {
    await this.database.query(`
      DELETE 
      FROM "user_table"
      WHERE id=${id}
      `)
  }

  async getUserByEmail(email: string): Promise<number> {
    const userResponse = await this.database.query(`SELECT u.id FROM user_table u WHERE email = '${email}'`)

    if (!userResponse.rowCount) {
      throw new Error(`User with email: ${email}, does not exist`)
    }
    const userId = userResponse.rows[0]

    return userId.id
  }

  async checkPassword(email: string): 
    Promise<{user: User} | false> {
    const userResponse = await this.database.query(`
      select *
      from user_table
      WHERE email = '${email}'`)

    if (!userResponse.rowCount) {
      return false
    }

    return { user: new User(userResponse.rows[0])}
  }

  async changePassword(password: string, email: string): Promise<void> {
    await this.database.query(`
    UPDATE "user_table"
    SET password='${password}'
    WHERE email='${email}'`)
  }

  async getPasswordByEmail(email: string): Promise<string> {
    const response = await this.database.query(`
    SELECT password
    FROM user_table
    WHERE email='${email}'`)
    const { password }: {password: string} = { ...response.rows[0]}
    return password
  }

  async checkEmail(email: string): Promise<string | null> {
    const response = await this.database.query(`
      SELECT * 
      FROM "user_table" 
      WHERE email = '${email}'`)
    if (!response.rowCount) {
      return null
    }
    const { email: emailCheck } = new User(response.rows[0]).getEmail()
    return emailCheck
  }

  async searchUsers({ search, country, city, id_category, stack }: 
    UserDto.SearchUsers): Promise<UserDto.SearchUsersResponse[]> {
    const result = await this.database.query(`
      select u.fname, u.lname, u.photo, it.country, 
      it.city, it.stack, it.rate, u.email
      from user_table u
        left join info_table it on it.id = u.id_info
      where CONCAT (fname, ' ', lname) ILIKE  '%${search}%' 
        ${id_category ? `AND it.id_category = ${id_category}` : ''} 
        ${stack ? `AND stack ILIKE '%${stack}%'` : ''}
        ${country ? `AND country ILIKE '%${country}%'` : ''}
        ${city ? `AND city ILIKE '%${city}%'` : ''}
      `)
    const users = result.rows.map((user: User) => new User(user).getFullInfo())
    return users
  }

  async updatePhoto(photoUrl: string, email: string): Promise<void> {
    await this.database.query(`
    UPDATE "user_table" SET photo = '${photoUrl}'
    WHERE email = '${email}'
    `)
  }

  async emailConfirmed(email: string): Promise<void> {
    await this.database.query(`
    update user_table 
    set email_confirmed = true 
    where email = '${email}';
    `)
  }
}
