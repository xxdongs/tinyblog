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
    randomList
}