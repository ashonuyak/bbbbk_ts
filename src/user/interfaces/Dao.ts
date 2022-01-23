import { UserDto } from '.'
export interface Dao {
  getAll: () => Promise<UserDto.GetAllUsers> 

  create: ({ fname, lname, email, password }: UserDto.UserCreate) => Promise<void>

  update: ({ fname, lname, email, password, id }: UserDto.UserUpdate) => Promise<void>

  insertInfo: ({ country, city, rate, stack, id_category, id }: UserDto.InsertInfoResponse) => Promise<void>

  updateInfo: ({ country, city, rate, stack, id_category, id_info }: UserDto.UpdateInfo) => Promise<void>

  delete: (id: number) => Promise<void>

  getUserByEmail: (email: string) => Promise<number>

  changePassword: (password: string, email: string) => Promise<void>

  getPasswordByEmail: (email: string) => Promise<string>

  checkEmail: (email: string) => Promise<string | null>

  searchUsers: ({ search, country, city, id_category, stack }: 
    UserDto.SearchUsers) => Promise<UserDto.SearchUsersResponse[]>

  updatePhoto: (photoUrl: string, email: string) => Promise<void>

  emailConfirmed: (email: string) => Promise<void>
}