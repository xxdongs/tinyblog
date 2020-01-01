const logger = require('./log')
const config = require('./config')

class Middleware {
    static runLog(ctx) {
        logger.debug(`URL: ${ctx.path} Method: ${ctx.request.method} Status: ${ctx.response.status} Body: ${JSON.stringify(ctx.request.body)} Authorization: ${ctx.request.header.authorization || 'null'} User-Agent: ${ctx.request.header['user-agent']}`)
        // logger.debug(`URL: ${ctx.path} Method: ${ctx.request.method} Status: ${ctx.response.status} Authorization: ${ctx.request.header.authorization || 'null'} User-Agent: ${ctx.request.header['user-agent']}`)
    }

    static async runLogMidd(ctx, next) {
        await next()
        if (config.isDev) {
            console.log(`URL: ${ctx.path} Method: ${ctx.request.method} Status: ${ctx.response.status} \nBody: ${JSON.stringify(ctx.request.body)} \nAuthorization: ${ctx.request.header.authorization || 'null'} \nUser-Agent: ${ctx.request.header['user-agent']}\n`)
            // console.log(`URL: ${ctx.path} Method: ${ctx.request.method} Status: ${ctx.response.status} \nAuthorization: ${ctx.request.header.authorization || 'null'} \nUser-Agent: ${ctx.request.header['user-agent']}\n`)
            Middleware.runLog(ctx)
        } else {
            Middleware.runLog(ctx)
        }   
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