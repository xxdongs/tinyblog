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

    static getArticleList(labelId, orderBy, byViews, start, size, isPublic) {
        let symbol1 = ''
        let symbol2 = ''
        let symbol3 = ''
        let params = null
        if (labelId === 0) {
            symbol1 = 'GROUP_CONCAT(DISTINCT l.label) as labels,'
            params = [isPublic, start, size]
        } else {
            symbol1 = 'GROUP_CONCAT(DISTINCT l.label) as labels,'
            symbol2 = 'AND al.label_id=? '
            params = [isPublic, labelId, start, size]
        }
        if(byViews === 1) {
            symbol3 = 'a.views DESC '
        }else {
            symbol3 = 'a.created_at '.concat(orderBy)
        }
        let sqlList = `SELECT 
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
        ORDER BY ${symbol3} 
        limit ?,?;`
        let sqlCount = `SELECT 
        COUNT(distinct a.id) as count 
        FROM Article a 
        LEFT JOIN ArticleLabel al 
        ON al.article_id=a.id
        WHERE a.public=? ${symbol2};`
        return Promise.all([super.query(sqlList, params),
        super.query(sqlCount, [isPublic, labelId])]
        )
    }

    static getArticlesCount(isPublic) {
        let sql = `SELECT COUNT(*) as count FROM Article WHERE public=?;`
        return super.query(sql, [isPublic])
    }

    static deleteArticle(articleId) {
        let DELETE_ARTICLE = `DELETE FROM Article WHERE id=?;`
        return super.query(DELETE_ARTICLE, [articleId])
    }

    static getArticleTimeline() {
        let GET_ARTICLE_TIMELINE = `select DATE_FORMAT(created_at,'%Y') as year,id,title,views from Article order by created_at desc;`
        return super.query(GET_ARTICLE_TIMELINE, null)
    }

    static getArticlesByKey(key, isPublic) {
        let symbol = isPublic === 1 ? 'AND public=1' : ''
        let sqlList = `SELECT 
        id,title,public FROM Article 
        WHERE (LOCATE(?,title) > 0 OR LOCATE(?,content))
        ${symbol}
        ORDER BY created_at DESC;`
        return super.query(sqlList, [key, key])
    }

    static addViews(articleId) {
        let ADD_ARTICLE_VIEWS = `UPDATE Article set views=views+1 WHERE id=?;`
        return super.query(ADD_ARTICLE_VIEWS, [articleId])
    }
}

module.exports = LabelModel