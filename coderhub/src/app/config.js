const { log } = require('console')
const dotenv = require('dotenv')
const fs = require("fs")
const path = require("path")

dotenv.config()

// 根目录下的环境变量文件.env中的所有数据都将会被dotenv库加载解析到process.env对象中

const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './key/private.key'))
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './key/public.key'))




module.exports = {
  APP_PORT,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD 
} = process.env
module.exports.PRIVATE_KEY = PRIVATE_KEY
module.exports.PUBLIC_KEY = PUBLIC_KEY
