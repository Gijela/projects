const errorTypes = require("../constants/error-types")
const service = require("../service/user.service")
const md5password = require("../utils/password-handle")

// 中间件1：验证待新建的账号密码是否为空， 或者账号重复
const verifyUser = async (ctx, next) => {
  // 1. 获取用户名和密码
  const { name, password } = ctx.request.body

  // 2. 判断用户名或者密码不能为空
  if (!name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }

  // 3. 判断这次注册的用户名是否注册过的
  const result = await service.getUserByName(name)
  // console.log('----------');
  // console.log(result); // devin存在时, 返回的是[{id: 1, name: 'devin', ...}]
  // console.log('----------');
  if (result.length) {
    const error = new Error(errorTypes.USER_ALREADY_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  await next() // 只有验证通过了, 才会进入下一个中间件create, 如果验证不通过将不能执行create
}

// 中间件2：给密码加密
const handlePassword = async (ctx, next) => {
  const { password } = ctx.request.body
  ctx.request.body.password = md5password(password)

  await next()
}
module.exports = {
  verifyUser,
  handlePassword
}