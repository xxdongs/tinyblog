import Http from './http'

export default class Label {

    static async addTag(name) {
        return await Http.post({
            url: '/api/label',
            data: { label: name }
        })
    }

    static async deletTag(tagId) {
        return await Http.delete({
            url: '/api/label/'.concat(tagId)
        })
    }

    static async getTags() {
        return await Http.get({
            url: '/api/pub/labels'
        })
    }
}