const commentModel = require('../model/comment')

class CommentController {

    static async getArticleComments(ctx, next) {
        
        let articleId = parseInt(ctx.params.id)
        let start = parseInt(ctx.request.query.start) || 0
        let size = parseInt(ctx.request.query.size) || 10
        console.log('this')
        console.log(start,size)
        if (!articleId) {
            ctx.status = 400
            return
        }

        let all = await commentModel.getArticleComments(articleId, start, size)
        let results = all[0]
        let count = all[1][0].count
        if (count <= 0 || !results || results.length <= 0) {
            ctx.status = 404
            return
        }
        ctx.body = { results, count }
        ctx.status = 200
    }

    static async getComments(ctx, next) {
        let body = ctx.request.body
        let timeStart = ctx.request.query.time_start
        let timeEnd = ctx.request.query.time_end
        let start = parseInt(ctx.request.query.start) || 0
        let size = parseInt(ctx.request.query.size) || 10
        if (!(timeStart && timeEnd)) {
            ctx.status = 400
            return
        }
        let all = await commentModel.getComments(timeStart, timeEnd, start, size)
        let results = all[0]
        let count = all[1][0].count
        if (count <= 0 || !results || results.length <= 0) {
            ctx.status = 404
            return
        }
        ctx.body = { results, count }
        ctx.status = 200
    }

    static async getReplyComments(ctx, next) {
        let param = ctx.request.query.reply_ids
        if (!param) {
            ctx.status = 400
            return
        }
        let replyIds = param.split(",").map(id => parseInt(id))
        let results = await commentModel.getReplyComments(replyIds)
        if (!results || results.length === 0) {
            ctx.status = 404
            return
        }
        ctx.status = 200
        ctx.body = { results }
    }

    static async addComment(ctx, next) {
        let body = ctx.request.body
        if (!('article_id' in body && 'content' in body)) {
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
        let results = await commentModel.deleteComment('id', commentId)
        if (!results || results.affectedRows <= 0) {
            ctx.status = 404
            return
        }
        await commentModel.deleteComment('reply_id', commentId)
        ctx.status = 204
    }
}

module.exports = CommentController