const Connection = require('./connection')

const ADD_COMMENT = `INSERT INTO Comment SET ?;`
const GET_ARTICLE_COMMENTS = `SELECT 
                            id,article_id,reply_id,user_id,avatar,content,created_at 
                            FROM Comment WHERE article_id=? 
                            ORDER BY created_at DESC;`
const DELETE_COMMENT = `DELETE FROM Comment WHERE id=?;`
const DELETE_COMMENT_BY_ARTICLE = `DELETE FROM Comment WHERE article_id=?;`
const DELETE_REPLY = `DELETE FROM COMMENT WHERE reply_id=?;`
const GET_COMMENTS = `SELECT 
                        a.title AS article_title,
                        c.id,c.article_id,c.reply_id,c.user_id,c.avatar,c.content,c.created_at 
                        FROM Comment c JOIN Article a ON a.id=c.article_id WHERE c.created_at BETWEEN ? AND ?
                        ORDER BY created_at DESC;`

const COMMENT_EXISTED = 'SELECT id FROM Comment WHERE id=?;'

class CommentModel extends Connection {

    static addComment(data) {
        return super.query(ADD_COMMENT, data)
    }

    static isCommentExisted(id) {
        return super.query(COMMENT_EXISTED, [id])
    }

    static getArticleComments(articleId) {
        return super.query(GET_ARTICLE_COMMENTS, [articleId])
    }

    static deleteComment(commentId) {
        return super.query(DELETE_COMMENT, [commentId])
    }
    static deleteReply(replyId) {
        return super.query(DELETE_REPLY, [replyId])
    }

    static deleteCommentByArticle(articleId) {
        return super.query(DELETE_COMMENT_BY_ARTICLE, [articleId])
    }

    static getComments(timeStart, timeEnd) {
        return super.query(GET_COMMENTS, [timeStart, timeEnd])
    }
}

module.exports = CommentModel