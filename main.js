import Vue from 'vue'
import App from './App'
import Vuecookie from 'vue-cookies'
Vue.use(Vuecookie)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
