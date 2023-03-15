const fs = require("fs")

const useRouters = function() {
  // fs 模块中的 readdirSync() 作用是读取文件夹的内容。
  // 该方法会将文件夹内的所有文件名作为数组列出，并将它们返回以供进一步操作。
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') return 
    const router = require(`./${file}`)
    this.use(router.routes())
    this.use(router.allowedMethods())
  })
}

module.exports = useRouters