const connection = require("../app/database")

class AuthService {
  async checkResource(tabName, id, userId) {
    const statement = `SELECT * FROM ${tabName} WHERE id = ? AND user_id = ?`
    const [result] = await connection.execute(statement, [id, userId])
    return result.length === 0 ? false : true
  }
}

module.exports = new AuthService()