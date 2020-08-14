import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import { checkToken } from '@/api/apis'

Vue.use(VueRouter)


const router = new VueRouter({
    routes:[
        {
            path:'/',
            name:'default',
            component: Login
        },
        {
            path:'/main',
            name:'main',
            component: () => import('../views/Main'),
            children:[
                {
                    path:'/main/index',
                    name:'index',
                    component: () => import('../views/main/Index'),
                    meta: { breadList: ["首页"] }
                },
                {
                    path:'/main/personal',
                    name:'personal',
                    component: () => import('../views/main/Personal'),
                    meta: { breadList: ["个人中心"] }
                },
                {
                    path:'/main/shopcategory',
                    name:'shopcategory',
                    component: () => import('../views/main/shop/ShopCategory'),
                    meta: { breadList: ["商品管理" , "商品分类"] }
                },
                {
                    path:'/main/shopList',
                    name:'shopList',
                    component: () => import('../views/main/shop/ShopList'),
                    meta: { breadList: ["商品管理" , "商品列表"] }
                },
                {
                    path:'/main/addShop',
                    name:'addShop',
                    component: () => import('../views/main/shop/AddShop'),
                    meta: { breadList: ["商品管理" , "添加商品"] }
                },
                {
                    path:'/main/addAcc',
                    name:'addAcc',
                    component: () => import('../views/main/acc/AddAcc'),
                    meta: { breadList: ["账号管理" , "添加账号"] }
                },
                {
                    path:'/main/changePwd',
                    name:'changePwd',
                    component: () => import('../views/main/acc/ChangePwd'),
                    meta: { breadList: ["账号管理" , "修改密码"] }
                },
                {
                    path:'/main/accList',
                    name:'accList',
                    component: () => import('../views/main/acc/AccList'),
                    meta: { breadList: ["账号管理" , "账号列表"] }
                },
                {
                    path:'/main/shopManager',
                    name:'shopManager',
                    component: () => import('../views/main/StoreManager'),
                    meta: { breadList: ["店铺管理"] }
                },
                {
                    path:'/main/shopStatis',
                    name:'statis',
                    component: () => import('../views/main/statis/ShopStatis'),
                    meta: { breadList: ["商品统计"] }
                },
                {
                    path:'/main/orderStatis',
                    name:'orderStatis',
                    component: () => import('../views/main/statis/OrderStatis'),
                    meta: { breadList: ["订单统计"] }
                },
                {
                    path:'/main/orderManager',
                    name:'orderManager',
                    component: () => import('../views/main/OrderManager'),
                    meta: { breadList: ["订单管理"] }
                },
            ]
        },
        /*  */
    ]
})

router.beforeEach((to, from,next) => {
    //to 跳转的页面
    //from 跳转之前的页面
    //next()  是否拦截
    if( to.path != '/'){
        checkToken(localStorage.token).then(res => {
            if(res.data.code == 0){
                // if(localStorage.role == "normal" && to.path == '/main/index')
                next()
            }else
                next('/')
        })
    }else
        next()
})
export default router