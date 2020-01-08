const path = require('path')
const cf = require(`./${process.env.NODE_BLOG_ENV}Config`)

const Config = {
    prot: 3000,
    appKeys: ['dfdfd9923823kmk-923222'],

    jwtSecret: 'dfdf929302mfjk12494',
    jwtExpire: 3600 * 24 * 7,

    qiniuAK: 'hJxZDahaQNEmGUpPPsXRs9Zb6tzOdXCBK-4X2_3R',
    qiniuSK: '0NLNSRbfnFy0SiKt6uW1BSC8vGwY4Sa2QI6xzjk9',
    qiniuBucket: 'tiny-blog',
    qiniuTokenExpire: 3600 * 12,

    adminEmail: [
        'doforce@126.com',
        'doforce@outlook.com',
    ],

    unlessAuth: [
        /^\/api\/pub\/*/,
        /^\/.+\.(jpeg|jpg)$/,
    ],
    maxFileSize: 2 * 1024 * 1024,
    staticDir: path.join(__dirname, '../static'),

    defaultHotArticlesCount: 5,
}

Object.keys(cf).forEach(e => Config[e] = cf[e])
module.exports = Config