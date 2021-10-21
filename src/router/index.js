import Vue from "vue";
import Router from "vue-router";
import apiServer from "../api/apiServer";
// 引入组件
import LoginPanel from "../components/regpanel/loginpanel";
import Main from "../components/mainpage";
import Register from "../components/regpanel/Register";
import ForgetPassword from "../components/regpanel/ForgetPassword";


// 要告诉 vue 使用 vueRouter
Vue.use(Router);

const router = new Router({
    mode:'history',
    routes: [
        // {
        //     path: '/',
        //     redirect: '/login'
        // },
        {
            path: '/login',
            name: 'loginpanel',
            component: LoginPanel
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/getpassword',
            name: 'forgetpassword',
            component: ForgetPassword
        },
        {
            path: '/index',
            name: 'main',
            component: Main
        }
    ]
});

router.beforeEach((to, from, next) => {

    if (to.path === '/login' || to.path === '/register' || to.path === '/getpassword') {
        next();
    } else {
        let token = window.sessionStorage.getItem('access_token');
        //let token = apiServer.getCookie('access_token');
        if (token === null || token === '') {
            next('/login');
        } else {
            next();
        }
    }
});
export default router

