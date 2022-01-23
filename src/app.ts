import Koa, { Context } from 'koa'
import config from 'config'
import cors from '@koa/cors'
import Router from 'koa-router'
import bodyParser from "koa-bodyparser"

import userRouter from './user/router'
import passport from './libs/passport/koaPassport'
// import { errorCatcher } from './middlewares/errorCatcher'

export interface AppContext extends Context {}

passport.initialize()

const app: Koa = new Koa()

const router = new Router()

app.use(cors())

app.use(bodyParser())

// app.use(errorCatcher)

router.use('', userRouter.middleware())

app.use(router.middleware())

const port = config.get('server.port')

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

export default app
