const Router = require('koa-router')
const {
  create
} = require("../controller/user.controller")

const {
  verifyUser,
  handlePassword
} = require("../middleware/user.middleware")

const userRouter = new Router({prefix: '/users'})

// 多加一层verifyUser验证, 只有验证通过了,进入下一个中间件create 
userRouter.post('/', verifyUser, handlePassword, create)

module.exports = userRouter

