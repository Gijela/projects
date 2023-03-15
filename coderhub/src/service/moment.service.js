const { off } = require("../app/database")
const connection = require("../app/database")

const sqlFragment = `
  SELECT 
    m.id id, m.content contant, m.createAt createTime, m.updateAt updateTime,
    JSON_OBJECT("id", u.id, 'name', u.name) user,
  FROM moment m
  LEFT JOIN users u ON m.user_id = u.id
`

class MomentService {

  async create(userId, content) {
    const statement = `INSERT INTO moment (content, user_id) VALUES (?, ?)`
    const [result] = await connection.execute(statement, [content, userId])
    return result
  }

  async getMomentById(id) {
    const statement = `
      ${sqlFragment}
      WHERE m.id = ?;
    `
    const [result] = await connection.execute(statement, [id])
    return result[0]
  }

  async getMomentList(offset, size) {
    const statement = `
      SELECT 
        m.id id, m.content contant, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT("id", u.id, 'name', u.name) user,
        (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount
      FROM moment m
      LEFT JOIN users u ON m.user_id = u.id
      LIMIT ?, ?
    `
    const [result] = await connection.execute(statement, [offset, size])
    return result
  }

  async update(content, momentId) {
    const statement = `UPDATE moment SET content = ? WHERE id = ?`
    const [result] = await connection.execute(statement, [content, momentId])
    return result
  }

  async remove(momentId) {
    // 依据 id 删除moment表中的数据
    const statement = `DELETE FROM moment WHERE id = ?`
    const [result] = await connection.execute(statement, [momentId])
    return result
  }

  async hasLabel(momentId, labelId) {
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`
    const [result] = await connection.execute(statement, [momentId, labelId])
    return result[0] ? true : false
  }

  async addLabel(momentId, labelId) {
    const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?);`
    const [result] = await connection.execute(statement, [momentId, labelId])
    return result
  }
}

module.exports = new MomentService()