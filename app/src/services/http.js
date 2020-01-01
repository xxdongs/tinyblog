import axios from './base'

export default class Http {
    static async request(method, params) {
        let config = {
            method: method,
            timeout: 5000,
            url: params.url,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            }
        }
        if (params.header) {
            Object.assign(config.headers, params.header)
        }
        if (method === 'get') {
            config.params = params.data
        } else {
            config.data = params.data
        }
        if (params.headers) {
            Object.keys(params.headers).forEach((key) => config.headers[key] = params.headers[key])
        }
        try {
            let response = await axios(config)
            console.log({ url: config.url, response })
            return {
                data: response.data,
                ok: true
            }
        } catch (error) {
            return {
                ok: false
            }
        }
    }

    static async get(params) {
        return await this.request('get', params)
    }

    static async put(params) {
        return await this.request('put', params)
    }

    static async post(params) {
        return await this.request('post', params)
    }

    static async delete(params) {
        return await this.request('delete', params)
    }
    static async upload(file, url) {
        let data = new FormData()
        data.append('file', file)
        let params = {
            header: {
                'Content-Type': 'multipart/form-data'
            },
            url: url,
            data
        }
        return await this.post(params)
    }
}