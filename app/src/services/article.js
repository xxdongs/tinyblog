import Http from './http'

export default class Article {

    static async addArticle(data) {
        let par = { url: '/api/article', data: data }
        return await Http.post(par)
    }

    static async updateArticle(article_id, data) {
        let par = { url: '/api/article/'.concat(article_id), data: data }
        return await Http.put(par)
    }

    static async getArticle(id) {
        let par = { url: '/api/pub/article/'.concat(id) }
        return await Http.get(par)
    }

    // static async getArticleList(label_id) {
    static async getArticleList(payload) {
        let par = null
        if (payload.label_id) {
            par = { url: '/api/pub/articles/list', data: { label_id: payload.label_id } }
        } else if (payload.key) {
            par = { url: '/api/pub/articles/list', data: { key: payload.key } }
        }
        else {
            par = { url: '/api/pub/articles/list' }
        }
        return await Http.get(par)
    }

    static async deleteArticle(articleId) {
        return await Http.delete({
            url: '/api/article/'.concat(articleId)
        })
    }

    static async getArticleTimeline() {
        return await Http.get({ url: '/api/pub/articles/timeline' })
    }

    static async getHotArticles() {
        return await Http.get({ url: '/api/pub/articles/hot' })
    }
}
