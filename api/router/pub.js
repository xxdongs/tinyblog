const Router = require('koa-router');
const userController = require('../controller/user')
const labelController = require('../controller/label')
const articleController = require('../controller/article')
const commentController = require('../controller/comment')

const router = new Router({
    prefix: '/api/pub'
});

router.get('/', (ctx, next) => {
    ctx.body = { msg: 'OK' }
})
router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/exists', userController.exists)
router.get('/about', userController.about)

router.get('/labels', labelController.getLabels)
router.get('/article/:id', articleController.getPublicArticle)
router.get('/article/:id/labels', labelController.getArticleLables)
router.get('/article/:id/comments', commentController.getArticleComments)
router.get('/articles/list', articleController.getPublicArticleList)
router.get('/articles/timeline', articleController.getArticleListByTime)
router.get('/articles/hot', articleController.getHotArticles)

router.post('/comment', commentController.addComment)
router.get('/comment/list', commentController.getComments)

module.exports = router;
