import jwt from 'jwt-simple'
import passport from 'koa-passport'

import { SameEmailError } from './errors/SameEmailError'
import { ChangePasswordError } from './errors/ChangePasswordError'
import { EmailCheckError } from './errors/EmailCheckError'
import { RefreshTokenExpiredError } from './errors/RefreshTokenExpiredError'
import { AppContext } from '../app'
import { inject, injectable } from 'inversify'
import { TYPES } from './constants'
import { IUserService } from './interfaces'

@injectable()
export class UserController {
  constructor (
    @inject(TYPES.UserServiceProvider) private readonly service: IUserService
    ) {}

  getUser = async (ctx: AppContext): Promise<void> => {
    ctx.body = {
      user: ctx.state.user
    }
  }

  refresh = async (ctx: AppContext): Promise<void> => {
    const token = ctx.headers.authorization?.split(' ')[1]
    if(token) {
      try {
        const { accessToken, refreshToken } = await this.service.refresh(token)
        ctx.status = 200
        ctx.body = {
          accessToken: jwt.encode(accessToken, 'super_secret'),
          accessTokenExpirationDate: accessToken.expiresIn,
          refreshToken: jwt.encode(refreshToken, 'super_secret_refresh'),
          refreshTokenExpirationDate: refreshToken.expiresIn
        }
      } catch (err) {
        if (err instanceof RefreshTokenExpiredError) {
          ctx.status = 400
          ctx.body = {
            message: err.message
          }
        }
      }
    }
  }

  getAllUsers = async (ctx: AppContext): Promise<void> => {
    const users = await this.service.getAllUsers()
    ctx.body = { users }
  }

  userCreate = async (ctx: AppContext): Promise<void> => {
    const body = ctx.request.body
    console.log("hello1")
    try {
      await this.service.userCreate(body)
      ctx.status = 201
    } catch (err) {
      if (err instanceof SameEmailError) {
        ctx.status = 400
        ctx.body = {
          message: err.message
        }
      }
      throw new Error
    }
    console.log('hello2')
  }

  userUpdate = async (ctx: AppContext): Promise<void> => {
    const { fname, lname, email, password } = ctx.request.body
    try {
      await this.service.userUpdate({ fname, lname, email, password, id: ctx.state.user.id })
      ctx.status = 200
    } catch (err) {
      if (err instanceof SameEmailError) {
        ctx.status = 400
        ctx.body = {
          message: err.message
        }
      }
    }
  }

  insertInfo = async (ctx: AppContext): Promise<void> => {
    const { country, city, rate, stack, id_category } = ctx.request.body
    console.log(country, id_category)
    await this.service.insertInfo({ country, city, rate, stack, id_category, id: ctx.state.user.id, id_info: ctx.state.user.id_info })
    ctx.status = 200
  }

  userDelete = async (ctx: AppContext): Promise<void> => {
    const { id } = ctx.request.params
    this.service.userDelete(Number(id))
    ctx.status = 200
  }

  checkEmail = async (ctx: AppContext): Promise<void> => {
    const { email } = ctx.request.params
    try {
      ctx.body = await this.service.checkEmail(email)
    } catch (err) {
      if (err instanceof EmailCheckError) {
        ctx.status = 404
        ctx.body = {
          message: err.message
        }
        return
      }
    }
  }

  changePassword = async (ctx: AppContext): Promise<void> => {
    const { password, email } = ctx.request.body
    try {
      await this.service.changePassword(password, email)
      ctx.status = 200
    } catch (err) {
      if (err instanceof ChangePasswordError) {
        ctx.status = 400
        ctx.body = {
          message: err.message
        }
      }
    }
  }

  logIn = async (ctx: AppContext, next: () => Promise<void>): Promise<void> => {
    await passport.authenticate('local', (err, user) => {
      if (user) {
        ctx.body = user
      } else {
        ctx.status = 400
        if (err) {
          ctx.body = { error: err }
        }
      }
    })(ctx, next)
  }

  searchUsers = async (ctx: AppContext): Promise<void> => {
    const { search, country, city, id_category, stack } = ctx.request.body
    const users = await this.service.searchUsers({ search, country, city, id_category, stack })
    ctx.body = { users }
  }

  updatePhoto = async (ctx: AppContext): Promise<void> => {
    const { photo } = ctx.request.body
    const photoUrl = await this.service.updatePhoto(photo, ctx.state.user.email)
    ctx.body = { photoUrl }
  }

  emailConfirmed = async (ctx: AppContext): Promise<void> => {
    const { email } = ctx.request.params
    await this.service.emailConfirmed(email)
  }
}
