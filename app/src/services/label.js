import Http from './http'

export default class Label {

    static async addLabel(name) {
        let par = { url: '/api/label', data: { label: name } }
        return await Http.post(par)
    }

    static async getAllLabels() {
        let par = { url: '/api/pub/labels' }
        return await Http.get(par)
    }
}