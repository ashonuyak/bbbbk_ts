import Router from 'koa-joi-router'

const joi = Router.Joi

export class UserValidator {
  static signUp: Router.Config = {
    validate: {
      type: 'json',
      body: {
        fname: joi.string().min(3).max(20).required(),
        lname: joi.string().min(3).max(20).required(),
        email: joi.string().min(6).max(30).required().email(),
        password: joi.string().min(6).max(30).required(),
      },
    }
  }

  static logIn: Router.Config = {
    validate: {
      type: 'json',
      body: {
        email: joi.string().min(6).max(30).required().email(),
        password: joi.string().min(6).max(30).required(),
      },
    }
  }

  static checkEmail: Router.Config = {
    validate: {
      type: 'json',
      body: {
        email: joi.string().min(6).max(30).required().email(),
      },
    }
  }

  static resetPassword: Router.Config = {
    validate: {
      type: 'json',
      body: {
        email: joi.string().min(6).max(30).required().email(),
        password: joi.string().min(6).max(30).required(),
      },
    }
  }

  static insertInfo: Router.Config = {
    validate: {
      type: 'json',
      body: {
        country: joi.string().min(2).max(40),
        city: joi.string().min(2).max(40),
        rate: joi.string().min(1).max(10),
        stack: joi.string().min(1).max(30),
        id_category: joi.number(),
      },
    }
  }

  static search: Router.Config = {
    validate: {
      type: 'json',
      body: {
        search: joi.string().min(1).max(40),
        country: joi.string().min(2).max(40),
        city: joi.string().min(2).max(40),
        stack: joi.string().min(1).max(30),
        id_category: joi.number(),
      },
    }
  }

  static photo: Router.Config = {
    validate: {
      type: 'json',
      body: {
        photo: joi.string().required(),
      },
    }
  }
}
