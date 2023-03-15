const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require("../app/config")

class AuthController {
  // 登录成功后用jwt.sign()加密token
  async login(ctx, next) {
    const { id, name } = ctx.user
    const token = jwt.sign({ id, name }, PRIVATE_KEY, { 
      expiresIn: 60 * 60 * 24 , algorithm: "RS256"
    }) 

    console.log(`${name}登录成功`);
    ctx.body = { id, name, token } 
  }
  
  async success(ctx, next) {
    ctx.body = '授权成功'
  }
}

module.exports = new AuthController()