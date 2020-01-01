const labelModel = require('../model/label')
const articleModel = require('../model/article')

class LabelController {

    static async addLabel(ctx, next) {
        let body = ctx.request.body
        if (!('label' in body)) {
            ctx.status = 400
            return
        }
        let results = await labelModel.addLabel(body.label)
        if (!results || results.affectedRows <= 0) {
            ctx.status = 400
            return
        }
        ctx.body = { id: results.insertId }
        ctx.status = 201
    }

    static async getLabels(ctx, next) {
        let results = await labelModel.getAllLabels()
        if (!results || results.length === 0) {
            ctx.status = 404
            return
        }
        ctx.body = { results }
        ctx.status = 200
    }

    static async getArticleLables(ctx, next) {
        let articleId = parseInt(ctx.params.id)
        if (!articleId) {
            ctx.status = 400
            return
        }
        let results = await labelModel.getArticleLables(articleId)
        if (!results || results.length === 0) {
            ctx.status = 404
            return
        }
        ctx.body = results
        ctx.status = 200
    }
}

module.exports = LabelController