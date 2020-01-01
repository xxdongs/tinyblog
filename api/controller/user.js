const userModel = require('../model/user')
const { md5 } = require('../util/crypto')
const jwt = require('jsonwebtoken')
const config = require('../util/config')

class UserController {

    static async register(ctx, next) {
        let body = ctx.request.body;
        if (!("email" in body && "password" in body) || !config.adminEmail.includes(body.email)) {
            ctx.status = 400
            return
        }
        body.password = md5(body.password)
        let results = await userModel.register(body);
        if (!results) {
            ctx.status = 400
            return
        }
        if (results.affectedRows <= 0) ctx.status = 400
        else ctx.status = 201
    }

    static async login(ctx, next) {
        let body = ctx.request.body;
        if (!("email" in body && "password" in body)) {
            ctx.status = 400
            return
        }
        let results = await userModel.getPassword(body);
        if (!results || results.length === 0) {
            ctx.status = 404
            return
        }
        console.log(md5(body.password))
        console.log(md5(results[0].password))
        if (md5(body.password) !== results[0].password) {
            ctx.status = 400
        } else {
            ctx.status = 201
            ctx.body = {
                token: jwt.sign({
                    id: results[0].id,
                }, config.jwtSecret, { expiresIn: config.jwtExpire }),
                expire: config.jwtExpire
            }
        }
    }

    static async exists(ctx, next) {
        let query = ctx.query;
        if (!("id" in query)) {
            ctx.status = 400
            return
        }
        let results = await userModel.getPassword(query)
        if (!results || results.length === 0) {
            ctx.status = 404
            return
        }
        ctx.status = 204
    }

    static async info(ctx, next) {
        let results = await userModel.getUserInfo(ctx.state.user.id)
        if (!results || results.length === 0) {
            ctx.status = 404
            return
        }
        ctx.body = results[0]
        ctx.status = 200
    }

    static async update(ctx, next) {
        let body = ctx.request.body;
        if (Object.keys(body).length === 0) {
            ctx.status = 400
            return
        }
        let results = await userModel.upateUserInfo(ctx.state.user.id, body)
        if (!results || results.affectedRows <= 0) {
            ctx.status = 400
            return
        }
        ctx.status = 204
    }

    static async remove(ctx, next) {
        let results = await userModel.deleteUser(ctx.state.user.id)
        if (!results || results.affectedRows === 0) {
            ctx.status = 404
            return
        }
        ctx.status = 204
    }

    static async about(ctx, next) {
        let results = await userModel.getAbout()
        if (!results || results.length === 0) {
            ctx.status = 404
            return
        }
        ctx.status = 200
        ctx.body = results[0]
    }

    static async updatePassword(ctx, next) {
        let body = ctx.request.body;
        console.log(body)
        let results = await userModel.updatePassword(md5(body.new_pwd), md5(body.old_pwd), ctx.state.user.id)
        if (!results || results.affectedRows === 0) {
            ctx.status = 400
            return
        }
        ctx.status = 204
    }

}

module.exports = UserController