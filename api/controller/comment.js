const commentModel = require('../model/comment')

class CommentController {

    static async getArticleComments(ctx, next) {
        let articleId = parseInt(ctx.params.id)
        if (!articleId) {
            ctx.status = 400
            return
        }

        let results = await commentModel.getArticleComments(articleId)
        if (!results || results.length <= 0) {
            ctx.status = 404
            return
        }
        ctx.body = results
        ctx.status = 200
    }

    static async getComments(ctx, next) {
        let body = ctx.request.body
        let timeStart = ctx.request.query.time_start
        let timeEnd = ctx.request.query.time_end
        if (!(timeStart && timeEnd)) {
            ctx.status = 400
            return
        }
        let results = await commentModel.getComments(timeStart, timeEnd)
        if (!results || results.length <= 0) {
            ctx.status = 404
            return
        }
        ctx.body = results
        ctx.status = 200
    }

    static async addComment(ctx, next) {
        let body = ctx.request.body
        if (!('article_id' in body && 'content' in body && 'avatar' in body)) {
            ctx.status = 400
            return
        }
        if ('reply_id' in body) {
            let res = await commentModel.isCommentExisted(body['reply_id'])
            if (!res || res.length <= 0) {
                ctx.status = 400
                return
            }
        }
        let results = await commentModel.addComment(body)
        if (!results || results.affectedRows <= 0) {
            ctx.status = 400
            return
        }
        ctx.body = { id: results.insertId }
        ctx.status = 201
    }

    static async deleteComment(ctx, next) {
        let commentId = parseInt(ctx.params.id)
        if (!commentId) {
            ctx.status = 400
            return
        }
        let results = await commentModel.deleteComment(commentId)
        if (!results || results.affectedRows <= 0) {
            ctx.status = 404
            return
        }
        await commentModel.deleteReply(commentId)
        ctx.status = 204
    }
}

module.exports = CommentController