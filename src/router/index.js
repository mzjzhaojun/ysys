import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/homePage',
            meta: {
                requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            },
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                path: '/',
                component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
               { path: '/readme',
                  component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
                {
                    path: '/user',
                    component: resolve => require(['../components/page/user.vue'], resolve)
                },
                /*{
                    path: '/vuetable',
                    component: resolve => require(['../components/page/VueTable.vue'], resolve)     // vue-datasource组件
                }*/
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
router.beforeEach((to, from, next) => {
    /*console.log(to)*/
   if (to.matched.some(record => record.meta.requireAuth)) {  // 判断该路由是否需要登录权限
        if (window.sessionStorage.getItem("ms_user") != null) {
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }else {

        next();
    }
})
export default router
