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

    static async getArticle(id, isPublic = 1) {
        let url = null
        if (isPublic === 1) {
            url = '/api/pub/article/'
        } else {
            url = '/api/article/'
        }
        let par = { url: url.concat(id) }
        return await Http.get(par)
    }

    static async getArticleList(payload, isPublic = 1, start, size) {
        let url = isPublic === 1 ? '/api/pub/articles/list' : '/api/articles/list'
        if (start || size) {
            payload.start = start
            payload.size = size
        }
        let par = { url, data: payload }
        console.log(par)
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
}
