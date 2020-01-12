const Connection = require('./connection')
const config = require('../util/config')

class UserModel extends Connection {

    static register(body) {
        let INSERT_USER = 'INSERT INTO User SET ?;'
        return super.query(INSERT_USER, body)
    }

    static getPassword(body) {
        let SELECT_PASSWORD = {
            byEmail: `SELECT id,password FROM User WHERE email=?;`,
            byId: 'SELECT password FROM User WHERE id=?;'
        }
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
        let SELECT_USER = `SELECT 
        id,nickname,email,avatar,gender,city,summary
        FROM User WHERE id=?;`
        return super.query(SELECT_USER, [userId])
    }

    static upateUserInfo(userId, params) {
        let UPDATE_USER = 'UPDATE User SET ? WHERE id=?;'
        return super.query(UPDATE_USER, [params, userId])
    }

    static deleteUser(userId) {
        let DELETE_USER = "DELETE FROM User WHERE id=?;"
        return super.query(DELETE_USER, [userId])
    }

    static getAbout() {
        let SELECT_ABOUT = `SELECT 
        nickname,city,summary 
        FROM User 
        WHERE email=?;`
        return super.query(SELECT_ABOUT, [config.adminEmail[0]])
    }
    static updatePassword(newPwd,oldPwd,userId) {
        let UPDATE_PASSWORD = `UPDATE User 
        SET password=? WHERE password=? and id=?;`
        return super.query(UPDATE_PASSWORD,[newPwd,oldPwd,userId])
    }
}

module.exports = UserModel