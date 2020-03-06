const Router = require('koa-router');
const userController = require('../controller/user')
const labelController = require('../controller/label')
const articleController = require('../controller/article')
const commentController = require('../controller/comment')
const fileController = require('../controller/file')

const userRouter = new Router({
    prefix: '/api/user'
})

const apiRouter = new Router({
    prefix: '/api'
})
userRouter.put('/', userController.update)
userRouter.delete('/', userController.remove)
userRouter.get('/', userController.info)
userRouter.put('/pwd', userController.updatePassword)

const labelRouter = new Router({
    prefix: '/api/label'
})
labelRouter.post('/',labelController.addLabel)
labelRouter.delete('/:id',labelController.deleteLabel)

const articleRouter = new Router({
    prefix: '/api/article'
})

articleRouter.get('/:id', articleController.getArticle)
apiRouter.get('/articles/list', articleController.getPrivateArticleList)
articleRouter.post('/', articleController.addArticle)
articleRouter.delete('/:id', articleController.deleteArticle)
articleRouter.put('/:id', articleController.updateArticle)

const commentRouter = new Router({
    prefix: '/api/comment'
})
commentRouter.delete('/:id', commentController.deleteComment)

const fileRouter = new Router({
    prefix: '/api/file'
})
fileRouter.post('/upload', fileController.uploadFile)

module.exports = {
    apiRouter,
    userRouter,
    labelRouter,
    articleRouter,
    commentRouter,
    fileRouter,
}
