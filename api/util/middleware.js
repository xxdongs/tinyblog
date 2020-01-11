const logger = require('./log')
const config = require('./config')

class Middleware {
    static runLog(msg) {
        logger.debug(msg)
    }

    static genLogMsg(ctx) {
        let body = ''
        if (ctx.request.method == 'GET') {
            body = `Query: ${JSON.stringify(ctx.request.query)}`
        } else {
            body = `Body: ${JSON.stringify(ctx.request.body)}`
        }
        return `URL: ${ctx.path} Method: ${ctx.request.method} Status: ${ctx.response.status} ${body}`
    }

    static async runLogMidd(ctx, next) {
        await next()
        let msg = Middleware.genLogMsg(ctx)
        if (config.isDev) {
            console.log(msg)
        }
        Middleware.runLog(msg)
    }

    static exceptionLog(error) {
        logger.error(`ErrorMessage: ${error.message}`)
    }

    static async exceptionMidd(ctx, next) {
        try {
            await next()
        } catch (error) {
            Middleware.exceptionLog(error)
            ctx.status = 500
            if (config.isDev) {
                throw error
            }
        }
    }
}

module.exports = Middleware