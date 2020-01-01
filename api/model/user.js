const Connection = require('./connection')
const config = require('../util/config')

const INSERT_USER = 'INSERT INTO User SET ?;'
const SELECT_PASSWORD = {
    byEmail: `SELECT id,password FROM User WHERE email=?;`,
    byId: 'SELECT password FROM User WHERE id=?;'
}
const UPDATE_PASSWORD = `UPDATE User SET password=? WHERE password=? and id=?;`
const SELECT_USER = `SELECT 
                    id,nickname,email,avatar,gender,city,summary
                    FROM User WHERE id=?;`
const UPDATE_USER = 'UPDATE User SET ? WHERE id=?;'
const DELETE_USER = "DELETE FROM User WHERE id=?;"
const SELECT_ABOUT = `SELECT nickname,city,summary FROM User WHERE email=?;`

class UserModel extends Connection {

    static register(body) {
        return super.query(INSERT_USER, body)
    }

    static getPassword(body) {
        let sql = ''
        let val = ''
        if ('email' in body) {
            sql = SELECT_PASSWORD.byEmail
            val = body.email
        }
        else if ('id' in body) {
            sql = SELECT_PASSWORD.byId
            val = body.id
        }
        return super.query(sql, [val])
    }

    static getUserInfo(userId) {
        return super.query(SELECT_USER, [userId])
    }

    static upateUserInfo(userId, params) {
        // cantNotUpdateTime(params)
        return super.query(UPDATE_USER, [params, userId])
    }

    static deleteUser(userId) {
        return super.query(DELETE_USER, [userId])
    }

    static getAbout() {
        return super.query(SELECT_ABOUT, [config.adminEmail[0]])
    }
    static updatePassword(newPwd,oldPwd,userId) {
        return super.query(UPDATE_PASSWORD,[newPwd,oldPwd,userId])
    }
}

module.exports = UserModel