const koa = require('koa')
const bodyParser = require("koa-bodyparser") // bodyParser主要是对JSON数据进行解析
const errorHandler = require("./error-handle") // 用来处理报错
const useRouters = require("../router/index")

const app = new koa()

app.useRouters = useRouters

app.use(bodyParser())
app.useRouters()
app.on('error', errorHandler)

module.exports = app

