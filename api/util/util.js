
const convertQueryResult = function (results) {
    if (undefined === results || null === results) return
    console.log(results)
    for (let i = 0; i < results.length; i++) {
        if ('created_at' in results[i]) {
            results[i]['created_at'] = results[0]['created_at'].getTime()
        }
        if ('updated_at' in results[i]) {
            results[i]['updated_at'] = results[0]['updated_at'].getTime()
        }
    }
}

const isEmail = function (email) {
    let pattern = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
    return pattern.test(email)
}

const cantNotUpdateColumn = function (params, column) {
    if (column in params) delete params[column]
}

const cantNotUpdateTime = function (params) {
    cantNotUpdateColumn(params, 'created_at')
    cantNotUpdateColumn(params, 'updated_at')
    cantNotUpdateColumn(params, 'id')
}

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


module.exports = {
    convertQueryResult,
    isEmail,
    randomList
    // cantNotUpdateTime
}