import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { Form, FormItem, Input, Button, Message } from 'element-ui'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)

Vue.prototype.$message = Message;

// 导入全局样式表
import './assets/css/global.css'
// 导入axios
import axios from "axios";
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 把 axios 添加到Vue原型对象上
Vue.prototype.$http = axios

Vue.use(Button)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
