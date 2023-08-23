# vue_shop

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Problems
1、Element-ui el-tabs 的 pane 中 包含 el-tree 时，切换会出现闪烁。
解决办法：
在 el-tree 上加 :key="activeName"（activeName为el-tabs的绑定值）。

2、通过 axios 请求拦截器，为所有通过 axios 的请求添加token验证字段
axios.interceptors.request.use((config) => {
  // 为请求头对象添加 Token 验证的 Authorization 字段
  config.headers.Authorization = sessionStorage.getItem("token")
  return config
})
