import Http from './http'

export default class Comment {

    static async addComment(data) {
        let par = { url: '/api/pub/comment', data }
        return await Http.post(par)
    }

    static async getArticleComments(articleId) {
        let par = { url: `/api/pub/article/${articleId}/comments` }
        return await Http.get(par)
    }

    static async deleteComment(commentId) {
        return await Http.delete({
            url: '/api/comment/'.concat(commentId)
        })
    }

    static async getComments(timeStart, timeEnd) {
        return await Http.get({
            url: '/api/pub/comment/list',
            data: { time_start: timeStart, time_end: timeEnd }
        })
    }
}