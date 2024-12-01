import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
import SlideVerify from 'vue-monoplasty-slide-verify';
import VueParticles from 'vue-particles'

Vue.use(VueParticles)
Vue.use(SlideVerify);

import axios from 'axios'
import Cookies from 'js-cookie'
//配置请求的根路径
axios.defaults.baseURL = 'http://localhost:9090/api/'
axios.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json;charset=utf-8'
  const adminJson = Cookies.get('admin')
  if (adminJson) {
    config.headers['token'] = JSON.parse(adminJson).token
    // 在最后必须return config
  }
  return config
}, error => {
  return Promise.reject(error)
})

Vue.config.productionTip = false
Vue.prototype.$http = axios


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
