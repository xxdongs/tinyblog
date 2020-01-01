const { qiniuToken } = require('../util/crypto')

class QiniuController {

    static async token(ctx, next) {
        ctx.body = { token: qiniuToken() }
        ctx.status = 201
    }
}

module.exports = QiniuController