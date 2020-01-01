const Connection = require('./connection')

const ADD_LABEL = `INSERT INTO Label SET label=?;`
const GET_ALL_LABELS = `SELECT id,label FROM Label ORDER BY label;`
const BIND_LABEL = `INSERT INTO ArticleLabel(article_id,label_id) values`
const GET_ARTICLE_LABELS = 'SELECT la.id,la.label FROM Label la WHERE la.id in(SELECT label_id FROM ArticleLabel WHERE article_id=?);'
const DELETE_BOUND = 'DELETE FROM ArticleLabel WHERE article_id=?;'

class LabelModel extends Connection {

    static addLabel(name) {
        return super.query(ADD_LABEL, [name])
    }

    static getAllLabels() {
        return super.query(GET_ALL_LABELS, [])
    }

    static bindLabel(article_id, label_ids) {
        let tmp = ''
        for (let i = 0; i < label_ids.length; i++) {
            tmp += `(${article_id},${label_ids[i]}),`
        }
        tmp = tmp.substring(0, tmp.length - 1)
        tmp += ';'
        return super.query(BIND_LABEL.concat(tmp), null)
    }

    static updateBondLabel(articleId, label_ids) {
        if (label_ids.length > 0)
            return super.query(DELETE_BOUND, [articleId])
                .then(this.bindLabel(articleId, label_ids))
        else
            return super.query(DELETE_BOUND, [articleId])
    }

    static getArticleLables(articleId) {
        return super.query(GET_ARTICLE_LABELS, [articleId])
    }
}

module.exports = LabelModel