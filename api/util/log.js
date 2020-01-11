const log4js = require('log4js')
const config = require('./config')

log4js.configure({
    appenders: {
        debugLog: { type: 'file', filename: `${config.logsDir}/${new Date().getFullYear()}/${new Date().getMonth() + 1}_access.log` },

    },
    categories: {
        default: { appenders: ['debugLog'], level: 'debug' },
    }
})

let logger = log4js.getLogger()

module.exports = logger
