import { UserDto } from '.'
export interface Service {
  refresh: (token: string) => Promise<UserDto.Tokens>

  getAllUsers: () => Promise<UserDto.GetAllUsers>

  userUpdate: ({ fname, lname, email, password, id }: UserDto.UserUpdate) => Promise<void>

  insertInfo: ({ country, city, rate, stack, id_category, id, id_info }: UserDto.InsertInfo) => Promise<void>

  userDelete: (id: number) => Promise<void>

  changePassword: (pass: string, email: string) => Promise<void>

  checkEmail: (email: string) => Promise<string>

  searchUsers: ({ search, country, city, id_category, stack }: UserDto.SearchUsers) => Promise<UserDto.SearchUsersResponse[]>

  updatePhoto:(photo: string, email: string) => Promise<string>

  emailConfirmed:(email: string) => Promise<void>
}
