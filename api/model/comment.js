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

    static getArticleComments(articleId) {
        let GET_ARTICLE_COMMENTS = `SELECT 
        id,article_id,reply_id,user_id,avatar,content,created_at 
        FROM Comment WHERE article_id=? 
        ORDER BY created_at DESC;`
        return super.query(GET_ARTICLE_COMMENTS, [articleId])
    }

    static deleteComment(column,val) {
        let DELETE_COMMENT = `DELETE FROM Comment WHERE ${column}=?;`
        return super.query(DELETE_COMMENT, [val])
    }

    static getComments(timeStart, timeEnd) {
        let GET_COMMENTS = `SELECT 
        a.title AS article_title,
        c.id,c.article_id,c.reply_id,c.user_id,c.avatar,c.content,c.created_at 
        FROM Comment c JOIN Article a ON a.id=c.article_id WHERE c.created_at BETWEEN ? AND ?
        ORDER BY created_at DESC;`
        return super.query(GET_COMMENTS, [timeStart, timeEnd])
    }
}

module.exports = CommentModel