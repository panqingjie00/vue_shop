import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor, /* { default global options } */)

Vue.component('tree-table', TreeTable)

import {
  Form,
  FormItem,
  Input,
  Button,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Loading,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Popconfirm,
  Steps,
  Step,
  Radio,
  Checkbox,
  CheckboxGroup,
  Upload,
  Timeline,
  TimelineItem
} from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Loading)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Popconfirm)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$loading = Loading.service;

// 导入全局样式表
import './assets/css/global.css'
// 导入axios
import axios from "axios";
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use((config) => {
  // 为请求头对象添加 Token 验证的 Authorization 字段
  config.headers.Authorization = sessionStorage.getItem("token")
  return config
})
// 把 axios 添加到Vue原型对象上
Vue.prototype.$http = axios

// 日期格式化 过滤器
Vue.filter('dateFormat', function (originData) {
  const time = new Date(originData)
  const year = time.getFullYear()
  const month = (time.getMonth() + 1 + '').padStart(2, '0')
  const day = (time.getDate() + '').padStart(2, '0')
  const hour = (time.getHours() + '').padStart(2, '0')
  const minutes = (time.getMinutes() + '').padStart(2, '0')
  const second = (time.getSeconds() + '').padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minutes}:${second}`
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
