const logger = require('./log')
const config = require('./config')
const { genLogMsg } = require('./util')
const constant = require('./constant')

class Middleware {
    static async runLogMidd(ctx, next) {
        await next()
        const msg = genLogMsg(ctx)
        if (config.isDev) {
            console.log(msg)
        }
        logger.debug(msg)
    }

    static async exceptionMidd(ctx, next) {
        try {
            await next()
        } catch (error) {
            logger.error(`ErrorMessage: ${error.message}`)
            ctx.status = 500
            if (config.isDev) {
                throw error
            }
        }
    }

    static paramsCheck(option) {
        // option: {param1:{type: String,require: true}}
        // option: ['param1 require type'] default type string,default require 1
        // option: ['username 1 string']
        return async function check(ctx, next) {
            if (!option) {
                await next()
                return
            }
            let params = {}
            if (ctx.request.method === 'GET') {
                // option: ['param1','param2']
                params = ctx.request.query;
                if (Object.keys(params).length === 0) {
                    ctx.status = 400
                    ctx.body = { err: constant.response.ParamsError }
                    return
                }
                if (option.filter(p =>
                    Object.keys(params).indexOf(p) >= 0).length < option.length) {
                    ctx.status = 400
                    ctx.body = { err: constant.response.ParamsError }
                    return
                }

            } else {
                params = ctx.request.body
                if (Object.keys(params).length === 0) {
                    ctx.status = 400
                    ctx.body = { err: constant.response.ParamsError }
                    return
                }
                let ok = true;
                for (let p of option) {
                    let par = p.split(" ")
                    if(par.length === 1) {
                        if(Object.keys(params).indexOf(par[0]) < 0) {
                            ok = false;
                            break;
                        }
                    }else if(par.length === 2) {
                        
                    }
                }
            }
        }
    }
}

module.exports = Middleware