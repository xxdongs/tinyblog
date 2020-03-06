const crypto = require('crypto')

const randomList = function (arr) {
    results = []
    let len = Math.round(Math.random() * (arr.length))
    for (let i = 0; i < len; i++) {
        let tmp = arr[Math.round(Math.random() * (arr.length - 1))]
        while (results.indexOf(tmp) != -1) {
            tmp = arr[Math.round(Math.random() * (arr.length - 1))]
        }
        results.push(tmp)
    }
    return results
}

const genLogMsg = function (ctx) {
    let body = ''
    if (ctx.request.method == 'GET') {
        body = `Query: ${JSON.stringify(ctx.request.query)}`
    } else {
        body = `Body: ${JSON.stringify(ctx.request.body)}`
    }
    return `URL: ${ctx.path} Method: ${ctx.request.method} Status: ${ctx.response.status} ${body}`
}

const md5 = function (text) {
    let md5 = crypto.createHash('md5')
    md5.update(text)
    return md5.digest('hex')
}


module.exports = {
    randomList,
    genLogMsg,
    md5
}