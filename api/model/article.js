const Connection = require('./connection')

class LabelModel extends Connection {

    static addArticle(data) {
        let ADD_ARTICLE = `INSERT INTO Article SET ?;`
        return super.query(ADD_ARTICLE, data)
    }

    static updateArticle(articleId, data) {
        let UPDATE_ARTICLE = 'UPDATE Article SET ? WHERE id=?;'
        return super.query(UPDATE_ARTICLE, [data, articleId])
    }

    static getArticle(articleId, isPublic) {
        let symbol = isPublic === 1 ? 'AND public=1 ' : ''
        let GET_ARTICLE = `SELECT 
        a.id,a.title,a.content,a.views,a.public,a.created_at,
        COUNT(DISTINCT c.id) as comment_count
        FROM Article a 
        LEFT JOIN Comment c
        on c.article_id=a.id
        WHERE a.id=? ${symbol}
        group by a.id
        ;`
        return super.query(GET_ARTICLE, [articleId])
    }

    static getArticleList(label_id, isPublic) {
        let symbol1 = ''
        let symbol2 = ''
        let params = null
        if (label_id) {
            if (label_id === '-1') {
                symbol2 = 'AND a.id not in (SELECT article_id FROM ArticleLabel al) '
                params = [isPublic]
            } else {
                symbol1 = 'GROUP_CONCAT(DISTINCT l.label) as labels,'
                symbol2 = 'AND al.label_id=? '
                params = [isPublic, parseInt(label_id)]
            }
        } else {
            symbol1 = 'GROUP_CONCAT(DISTINCT l.label) as labels,'
            params = [isPublic]
        }
        let GET_ARTICLE_LIST = `SELECT 
        a.id,a.title,a.views,a.created_at,
        ${symbol1} 
        COUNT(DISTINCT c.id) as comment_count
        FROM Article a 
        LEFT JOIN ArticleLabel al 
        ON al.article_id=a.id
        LEFT JOIN Label l
        on al.label_id=l.id
        LEFT JOIN Comment c
        ON a.id=c.article_id
        WHERE a.public=? ${symbol2}
        GROUP BY a.id
        ORDER BY a.created_at DESC
        ;`
        return super.query(GET_ARTICLE_LIST, params)
    }

    static deleteArticle(articleId) {
        let DELETE_ARTICLE = `DELETE FROM Article WHERE id=?;`
        return super.query(DELETE_ARTICLE, [articleId])
    }

    static getArticleTimeline() {
        let GET_ARTICLE_TIMELINE = `select DATE_FORMAT(created_at,'%Y') as year,id,title,views from Article order by created_at desc;`
        return super.query(GET_ARTICLE_TIMELINE, null)
    }

    static getArticlesByViews(count) {
        let GET_ARTICLES_BY_VIEWS = `SELECT 
        id,title,views FROM Article 
        ORDER BY views DESC 
        LIMIT 0,?;`
        return super.query(GET_ARTICLES_BY_VIEWS, [count])
    }

    static getArticlesByKey(key, isPublic) {
        let symbol = isPublic === 1 ? 'AND public=1' : ''
        let SELECT_ARTICLES_BY_KEY = `SELECT 
        id,title,public FROM Article 
        WHERE (LOCATE(?,title) > 0 OR LOCATE(?,content))
        ${symbol}
        ORDER BY created_at DESC;`
        return super.query(SELECT_ARTICLES_BY_KEY, [key, key, isPublic])
    }

    static addViews(articleId) {
        let ADD_ARTICLE_VIEWS = `UPDATE Article set views=views+1 WHERE id=?;`
        return super.query(ADD_ARTICLE_VIEWS, [articleId])
    }
}

module.exports = LabelModel