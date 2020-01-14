const Connection = require('./connection')

class CommentModel extends Connection {

    static addComment(data) {
        let ADD_COMMENT = `INSERT INTO Comment SET ?;`
        return super.query(ADD_COMMENT, data)
    }

    static isCommentExisted(id) {
        let COMMENT_EXISTED = 'SELECT id FROM Comment WHERE id=?;'
        return super.query(COMMENT_EXISTED, [id])
    }

    static deleteComment(column, val) {
        let DELETE_COMMENT = `DELETE FROM Comment WHERE ${column}=?;`
        return super.query(DELETE_COMMENT, [val])
    }

    static getArticleComments(articleId, start, size) {
        let sqlList = `SELECT 
        id,article_id,reply_id,user_id,content,created_at 
        FROM Comment 
        WHERE article_id=? 
        AND reply_id=0 
        ORDER BY created_at DESC
        LIMIT ?,?;`
        let sqlCount = `SELECT 
        COUNT(*) as count 
        FROM Comment 
        WHERE article_id=? 
        AND reply_id=0;`
        return Promise.all([super.query(sqlList, [articleId, start, size]),
        super.query(sqlCount, [[articleId]])])
    }

    static getComments(timeStart, timeEnd, start, size) {
        let sqlList = `SELECT 
        a.title AS article_title,
        c.id,c.article_id,c.reply_id,c.user_id,
        c.content,c.created_at 
        FROM Comment c JOIN Article a 
        ON a.id=c.article_id 
        WHERE (c.created_at BETWEEN ? AND ?)
        AND reply_id=0 
        ORDER BY created_at DESC
        LIMIT ?,?;`
        let sqlCount = `SELECT 
        COUNT(*) as count 
        FROM Comment 
        WHERE (created_at BETWEEN ? AND ?)
        AND reply_id=0;`
        return Promise.all([super.query(sqlList, [timeStart, timeEnd, start, size]),
        super.query(sqlCount, [timeStart, timeEnd])])
    }

    static getReplyComments(replyIds) {
        let symbol = ''
        for (let i = 0; i < replyIds.length; i++) {
            symbol += '?,'
        }
        symbol = symbol.substring(0, symbol.length - 1)
        let sql = `SELECT id,article_id,reply_id,user_id,
        content,created_at 
        FROM Comment 
        WHERE reply_id in (${symbol});`
        return super.query(sql, replyIds)
    }
}

module.exports = CommentModel