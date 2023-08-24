import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/components/Login')
const Home = () => import('@/components/Home')
const Welcome = () => import('@/components/Welcome')
const Users = () => import('@/components/user/Users')
const Rights = () => import('@/components/power/Rights')
const Roles = () => import('@/components/power/Roles')
const Category = () => import('@/components/goods/Category')
const Params = () => import('@/components/goods/Params')
const List = () => import('@/components/goods/List')
const Add = () => import('@/components/goods/Add')
const Update = () => import('@/components/goods/Update')
const Order = () => import('@/components/order/Order')
const Report = () => import('@/components/report/Report')

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: 'home/welcome',
        children: [
            {
                path: 'welcome',
                component: Welcome
            },
            {
                path: 'users',
                component: Users
            },
            {
                path: 'rights',
                component: Rights
            },
            {
                path: 'roles',
                component: Roles
            },
            {
                path: 'categories',
                component: Category
            },
            {
                path: 'params',
                component: Params
            },
            {
                path: 'goods',
                component: List,
            },
            {
                path: 'add',
                component: Add,
            },
            {
                path: 'update',
                component: Update,
            },
            {
                path: 'orders',
                component: Order,
            },
            {
                path: 'reports',
                component: Report,
            }
        ]
    }
]

const router = new VueRouter({
    routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path == '/login') return next()
    const token = sessionStorage.getItem("token")
    if (token) {
        next()
    }
    else {
        next('/login')
    }
})

export default router
