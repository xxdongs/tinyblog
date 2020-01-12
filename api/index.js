const Koa = require('koa')
const {
    apiRouter,
    userRouter,
    qiniuRouter,
    labelRouter,
    articleRouter,
    commentRouter,
    fileRouter
} = require('./router/auth')
const pubRouter = require('./router/pub')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const config = require('./util/config')
const koajwt = require('koa-jwt')
const middleware = require('./util/middleware')
const app = new Koa()

app.keys = config.appKeys
app.use(bodyParser())

app.use(middleware.exceptionMidd)
app.use(middleware.runLogMidd)
app.use(koajwt({
    secret: config.jwtSecret
}).unless({
    path: config.unlessAuth
}))


app.use(apiRouter.routes()).use(apiRouter.allowedMethods())
app.use(userRouter.routes()).use(userRouter.allowedMethods())
app.use(qiniuRouter.routes()).use(qiniuRouter.allowedMethods())
app.use(labelRouter.routes()).use(labelRouter.allowedMethods())
app.use(articleRouter.routes()).use(articleRouter.allowedMethods())
app.use(commentRouter.routes()).use(commentRouter.allowedMethods())
app.use(fileRouter.routes()).use(fileRouter.allowedMethods())
app.use(pubRouter.routes()).use(pubRouter.allowedMethods())

app.use(static(config.staticDir));


app.listen(config.prot, () => {
    console.log(`Server starting at http://localhost:${config.prot}`)
})