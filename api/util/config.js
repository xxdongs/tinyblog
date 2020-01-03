const path = require('path')

const Config = {


    prot: 3000,
    appKeys: ['dfdfd9923823kmk-923222'],

    jwtSecret: 'dfdf929302mfjk12494',
    jwtExpire: 3600 * 24 * 7,

    isDev: true,

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
    db: {
        // Connections are lazily created by the pool, default is 10
        connectionLimit: 10,
        // host: 'db',
        host: '127.0.0.1',
        user: 'edgar',
        password: '1234',
        port: 3306,
        // password: '1292nm09',
        database: 'blog'
    },
    maxFileSize: 2 * 1024 * 1024,
    staticDir: path.join(__dirname,'../static'),

    defaultHotArticlesCount: 5,
}

module.exports = Config