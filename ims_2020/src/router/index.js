import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/login/Login.vue'
import CustomerSelection from '../pages/manage/customerSelection/List.vue' //客群筛选
import CustomerManage from '../pages/manage/customerManage/List.vue' //客群管理
import CustomerAnalysis from '../pages/manage/customerAnalysis/List.vue' //客群分析
import testtest from '../components/HelloWorld.vue' //测试

Vue.use(Router)


const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
export default new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'Login',
        component: Login
    }, {
        path: '/login',
        name: 'Login',
        component: Login
    }, {
        path: '/customerSelection',
        name: 'CustomerSelection',
        component: CustomerSelection
    }, {
        path: '/customerManage',
        name: 'CustomerManage',
        component: CustomerManage
    }, {
        path: '/customerAnalysis',
        name: 'CustomerAnalysis',
        component: CustomerAnalysis
    },{
        path: '/testtest',
        name: 'testtest',
        component: testtest
    }]
})