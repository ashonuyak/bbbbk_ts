import { AppContext } from "../../app";

export interface IUserController {
  getUser: (ctx: AppContext) => Promise<void>

  refresh: (ctx: AppContext) => Promise<void>

  getAllUsers: (ctx: AppContext) => Promise<void>

  userCreate: (ctx: AppContext) => Promise<void>

  userUpdate: (ctx: AppContext) => Promise<void>

  insertInfo: (ctx: AppContext) => Promise<void>

  userDelete: (ctx: AppContext) => Promise<void>

  checkEmail: (ctx: AppContext) => Promise<void>

  changePassword: (ctx: AppContext) => Promise<void>

  logIn: (ctx: AppContext, next: () => Promise<void>) => Promise<void>
  
  searchUsers: (ctx: AppContext) => Promise<void>

  updatePhoto: (ctx: AppContext) => Promise<void>
  
  emailConfirmed: (ctx: AppContext) => Promise<void>
}