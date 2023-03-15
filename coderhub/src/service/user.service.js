const connection = require("../app/database")

class UserService {
  // 将user存储到数据库中
  async create(user) { // 这个方法是创建数据的
    // 解构出name和password
    const { name, password } = user
    // 创建sql语句
    const statement = `INSERT INTO users (name, password) VALUES (?, ?)`
    // 连接数据库, 执行sql语句, 并且还能给sql语句中的一些变量赋值
    const result = await connection.execute(statement, [name, password])

    return result[0]
  }

  // 获取数据库中的用户名,判断待新建的用户名是否存在
  async getUserByName(name) {
    // 创建sql语句
    const statement = `SELECT * FROM users WHERE name= ?;`
    // 用连接器执行sql语句, 判断是否存在
    const result = await connection.execute(statement, [name])
    console.log(result);
    return result[0]
  }

}


module.exports = new UserService()

