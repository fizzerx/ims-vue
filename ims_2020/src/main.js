// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/css/common.css'
import 'element-ui/lib/theme-chalk/index.css';
import  Vue  from  'vue'
import  App  from  './App'
import  router  from  './router'
import  ElementUI  from  'element-ui'
import  VueAxios  from  'vue-axios'
import  *  as  Api  from  './api/ManageApi'

// import EasyScroll from 'easyscroll';
import  store  from  './vuex/store';
// internationalization
//import VueI18n from 'vue-i18n';
import locale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';

require('./mock'); //引入mock数据，关闭则注释该行

// Vue.use(EasyScroll);
Vue.config.devtools  =  true
Vue.config.silent  =  false
Vue.config.productionTip = false

Vue.use(ElementUI);

//Vue.use(VueI18n);
//Vue.use(ElementUI, { locale });
/* eslint-disable no-new */




// const i18n = new VueI18n({
//     locale: "zh-CN",
//     messages: {
//         'zh-CN': require('./common/lang/zh'),
//         'en-US': require('./common/lang/en')
//     }
// })

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})