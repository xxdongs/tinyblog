import Vue from 'vue'
import Router from 'vue-router'
import { Token } from "@/store"

const Index = () => import('@/views/Index.vue');
const Post = () => import('@/views/Post.vue');
const About = () => import('@/views/About.vue');
const Timeline = () => import('@/views/Timeline.vue');
const NotFound = () => import('@/components/NotFound.vue');
const Home = () => import('@/components/Home.vue');


const Admin = () => import('@/views/Admin.vue');
const Articles = () => import('@/views/Articles.vue');
const Login = () => import('@/views/Login.vue');
const Editor = () => import('@/views/Editor.vue');
// const ArticleList = () => import('@/components/ArticleList.vue');
const Comments = () => import('@/components/Comments.vue');
const Setting = () => import('@/views/Setting.vue');
const Tag = () => import('@/views/Tag.vue');


Vue.use(Router)

let router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: Index,
            name: 'index',
            children: [{
                path: '',
                component: Home,
                name: 'home'
            },
            {
                path: 'about',
                component: About,
                name: 'about'
            },
            {
                path: 'timeline',
                component: Timeline,
                name: 'timeline'
            },
            {
                path: 'post/:id',
                component: Post,
                name: 'post'
            }]
        },
        {
            path: '/login',
            component: Login,
            name: 'login'
        },
        {
            path: '/admin',
            component: Admin,
            name: 'admin',
            children: [{
                path: '',
                component: Articles,
                name: 'articles',
                meta: {
                    requireAuth: true,
                }
            },
            {
                path: 'comment',
                component: Comments,
                name: 'comments',
                meta: {
                    requireAuth: true,
                }
            },
            {
                path: 'setting',
                component: Setting,
                name: 'setting',
                meta: {
                    requireAuth: true,
                }
            },
            {
                path: 'tag',
                component: Tag,
                name: 'tag',
                meta: {
                    requireAuth: true,
                }
            }
        ]
        },
        {
            path: '/editor',
            component: Editor,
            name: 'editor_new',
            meta: {
                requireAuth: true,
            },
        },
        {
            path: '/editor/:id',
            component: Editor,
            name: 'editor_edit',
            meta: {
                requireAuth: true,
            },
        },
        {
            path: '*',
            name: '404',
            component: NotFound
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) {
        if (!Token.checkToken()) {
            next({ path: '/login' })
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router