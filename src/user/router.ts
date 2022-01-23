import passport from 'koa-passport'
import Router from 'koa-joi-router'
import { Controller } from './controller'
import { Validator } from './validator'
import {controller} from './Module'

const router = Router()

router.get('/user', passport.authenticate('jwt', { session: false }), controller.getUser)
router.get('/refresh', controller.refresh)
router.post('/user', Validator.signUp, controller.userCreate)
router.post('/user/session', Validator.logIn, controller.logIn)
router.put(
  '/user',
  Validator.signUp,
  passport.authenticate('jwt', { session: false }),
  controller.userUpdate
)
router.get('/users', controller.getAllUsers)
router.delete('/user/:id', controller.userDelete)
router.put('/user/password', Validator.resetPassword, controller.changePassword)
router.post('/user/info', Validator.insertInfo, passport.authenticate('jwt', { session: false }), controller.insertInfo)
router.get('/user/search', Validator.search, passport.authenticate('jwt', { session: false }), controller.searchUsers)
router.put('/user/photo', Validator.photo, passport.authenticate('jwt', { session: false }), controller.updatePhoto)
router.get('/user/:email', controller.checkEmail)
router.get('/user/email-confirmed/:email', controller.emailConfirmed)

export default router
