const crypto = require("crypto")

const md5password = (password) => {
  const md5 = crypto.createHash('md5')
  const result = md5.update(password).digest('hex') // digest()是控制进制的
  return result
}

module.exports = md5password