const errorTypes = require("../constants/error-types")

const errorHandler = (error, ctx) => {
  let status, message

  switch (error.message) {
    case errorTypes.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400 // bad request
      message = '用户名或者密码不能为空'
      break;
    case errorTypes.USER_ALREADY_EXISTS:
      status = 409 // conflict 矛盾
      message = '用户名已存在'
      break;
    case errorTypes.USER_DOES_NOT_EXISTS:
      status = 400 // 错误的请求
      message = '用户名不存在'
      break;
    case errorTypes.PASSWORD_IS_INCORRENT:
      status = 401 // 密码错误
      message = '密码错误'
      break;
    case errorTypes.UNAUTHIRIZATION:
      status = 401 // 没有权限
      message = '未授权的token'
      break;
    case errorTypes.UNPERMISSION:
      status = 401 // 没有权限
      message = '您不具备此操作的权限'
      break;
    default:
      status = 404
      message = 'NOT FOUND'
      break;
  }

  ctx.status = status
  ctx.body = message
  console.log(ctx.body);
}


module.exports = errorHandler