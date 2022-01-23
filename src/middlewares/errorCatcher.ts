import { AppContext } from '../app'
import { Next } from 'koa'
import * as Koa from 'koa';

export const errorCatcher =  async (ctx: AppContext, next: () => Promise<void>) => {
  try {
    await next()
  } catch (err: any) {
    if (err.isJoi) {
      ctx.throw(400, err.details[0].message)
    }
    if (err.isPassport) {
      ctx.throw(401, err.message)
    }
    if(err.isMailgun) {
      ctx.throw(400, err.message)
    }
    ctx.throw(err.status || 500, err.message)
  }
}
