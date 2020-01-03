const Connection = require('./connection')

const ADD_ARTICLE = `INSERT INTO Article SET ?;`
const UPDATE_ARTICLE = 'UPDATE Article SET ? WHERE id=?;'
const GET_ARTICLE = `SELECT 
                            a.id,a.title,a.content,a.views,a.created_at,
                            COUNT(DISTINCT c.id) as comment_count
                            FROM Article a 
                            LEFT JOIN Comment c
                            on c.article_id=a.id
                            WHERE a.id=?
                            group by a.id
                            ;`
const GET_ARTICLE_LIST = `SELECT 
                                a.id,a.title,a.views,a.created_at,
                                GROUP_CONCAT(DISTINCT l.label) as labels, 
                                COUNT(DISTINCT c.id) as comment_count
                                FROM Article a 
                                LEFT JOIN ArticleLabel al 
                                ON al.article_id=a.id
                                LEFT JOIN Label l
                                on al.label_id=l.id
                                LEFT JOIN Comment c
                                ON a.id=c.article_id
                                GROUP BY a.id
                                ORDER BY a.created_at DESC
                                ;`

const GET_ARTICLE_LIST_BY_LABEL = `SELECT 
                                    a.id,a.title,a.views,a.created_at,
                                    GROUP_CONCAT(DISTINCT l.label) as labels, 
                                    COUNT(DISTINCT c.id) as comment_count
                                    FROM Article a 
                                    LEFT JOIN ArticleLabel al 
                                    ON al.article_id=a.id
                                    LEFT JOIN Label l
                                    on al.label_id=l.id
                                    LEFT JOIN Comment c
                                    ON a.id=c.article_id
                                    WHERE al.label_id=?
                                    GROUP BY a.id
                                    ORDER BY a.created_at DESC
                                    ;`
const GET_ARTICLE_LIST_NO_LABEL = `SELECT 
                                    a.id,a.title,a.views,a.created_at,
                                    COUNT(DISTINCT c.id) as comment_count
                                    FROM Article a 
                                    LEFT JOIN Comment c
                                    ON a.id=c.article_id
                                    WHERE a.id not in
                                    (SELECT article_id FROM ArticleLabel al)
                                    GROUP BY a.id
                                    ORDER BY a.created_at DESC;
                                    `
const DELETE_ARTICLE = `DELETE FROM Article
                        WHERE id=?
                        ;`

const GET_ARTICLE_TIMELINE = `select DATE_FORMAT(created_at,'%Y') as year,id,title,views from Article order by created_at desc;`
const GET_ARTICLES_BY_VIEWS = `SELECT id,title,views FROM Article ORDER BY views DESC LIMIT 0,?;`

const SELECT_ARTICLES_BY_KEY = `SELECT id,title FROM Article WHERE LOCATE(?,title) > 0 OR LOCATE(?,content) ORDER BY created_at DESC;`
const ADD_ARTICLE_VIEWS = `UPDATE Article set views=views+1 WHERE id=?;`

class LabelModel extends Connection {

    static addArticle(data) {
        return super.query(ADD_ARTICLE, data)
    }

    static updateArticle(articleId, data) {
        return super.query(UPDATE_ARTICLE, [data, articleId])
    }

    static getArticle(articleId) {
        return super.query(GET_ARTICLE, [articleId, articleId])
    }

    static getArticleList(label_id) {
        if (label_id) {
            if (label_id === '-1') {
                console.log(label_id)
                return super.query(GET_ARTICLE_LIST_NO_LABEL, null)
            }
            return super.query(GET_ARTICLE_LIST_BY_LABEL, [parseInt(label_id)])
        } else {
            return super.query(GET_ARTICLE_LIST, null)
        }
    }

    static deleteArticle(articleId) {
        return super.query(DELETE_ARTICLE, [articleId])
    }

    static getArticleTimeline() {
        return super.query(GET_ARTICLE_TIMELINE, null)
    }

    static getArticlesByViews(count) {
        return super.query(GET_ARTICLES_BY_VIEWS, [count])
    }

    static getArticlesByKey(key) {
        return super.query(SELECT_ARTICLES_BY_KEY, [key, key])
    }

    static addViews(articleId) {
        return super.query(ADD_ARTICLE_VIEWS, [articleId])
    }
}

module.exports = LabelModel