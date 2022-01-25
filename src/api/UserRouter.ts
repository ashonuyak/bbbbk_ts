import passport from 'koa-passport'
import Router from 'koa-joi-router'
import { UserValidator } from '../user/UserValidator'
import container from '../user/UserModule'
import { IUserController } from '../user/interfaces'
import { TYPES } from '../user/constants'

const UserController = container.get<IUserController>(TYPES.UserControllerProvider)

const router = Router()

router.get('/user', passport.authenticate('jwt', { session: false }), UserController.getUser)
router.get('/refresh', UserController.refresh)
router.post('/user', UserValidator.signUp, UserController.userCreate)
router.post('/user/session', UserValidator.logIn, UserController.logIn)
router.put(
  '/user',
  UserValidator.signUp,
  passport.authenticate('jwt', { session: false }),
  UserController.userUpdate
)
router.get('/users', UserController.getAllUsers)
router.delete('/user/:id', UserController.userDelete)
router.put('/user/password', UserValidator.resetPassword, UserController.changePassword)
router.post('/user/info', UserValidator.insertInfo, passport.authenticate('jwt', { session: false }), UserController.insertInfo)
router.get('/user/search', UserValidator.search, passport.authenticate('jwt', { session: false }), UserController.searchUsers)
router.put('/user/photo', UserValidator.photo, passport.authenticate('jwt', { session: false }), UserController.updatePhoto)
router.get('/user/:email', UserController.checkEmail)
router.get('/user/email-confirmed/:email', UserController.emailConfirmed)

export default router
