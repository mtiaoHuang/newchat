// polyfill
// import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import store from './store';
import axios from 'axios';
import router from "./router"
import vuescroll from 'vuescroll';
import BaiduMap from "vue-baidu-map";
import Strophe from './api/strophe-1.32'
Vue.config.devtools = true;
Vue.prototype.$http = axios
new Vue({
    el: '#app',
    components: { App },
    store: store,
    router,
   Strophe,
    render: h => h(App)
});
Vue.use(vuescroll, {
    ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {},
        bar: {
            onlyShowBarOnScroll: false,
            keepShow: true,
            background:'#b2b2b2',
        }
    },
    name: 'vuescroll'
});
Vue.use(BaiduMap, {
    // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
    ak: 'jKNQmZGpICFGGVpZL2qMIWz5FQQG14PW'
})