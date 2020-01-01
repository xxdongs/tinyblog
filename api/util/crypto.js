const crypto = require('crypto')
const qiniu = require('qiniu')
const config = require('./config') 

const md5 = function (text) {
    let md5 = crypto.createHash('md5')
    md5.update(text)
    return md5.digest('hex')
}

qiniuToken = function() {
    let mac = new qiniu.auth.digest.Mac(config.qiniuAK, config.qiniuSK)
    let policy = new qiniu.rs.PutPolicy({scope: config.qiniuBucket, expires: config.qiniuTokenExpire})
    return policy.uploadToken(mac)
}


module.exports = {
    md5,
    qiniuToken
}