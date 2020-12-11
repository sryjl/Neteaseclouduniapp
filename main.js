import Vue from 'vue'
import App from './App'
import Vuecookie from 'vue-cookies'
import request from 'common/request.js'
import store from './store/index.js'
// 使用vuecookie管理h5端的cookie
Vue.use(Vuecookie)

Vue.config.productionTip = false
// 挂载封装好的request请求
Vue.prototype.$http = request

Vue.prototype.$store = store;

import { ZAudio } from 'zaudio/index.js'

Vue.use(ZAudio)
function showLoading(){
	store.commit('request_show_loading');
}
function hideLoading(){
	store.commit('request_hide_loading');
}
Vue.prototype.$showLoading = showLoading; //全局显示动画可以 this.$showLoading();
Vue.prototype.$hideLoading = hideLoading; //全局隐藏动画可以 this.$hideLoading();

App.mpType = 'app'
// 挂载音乐

const app = new Vue({
    ...App,
	//挂载store
	store
})
app.$mount()
