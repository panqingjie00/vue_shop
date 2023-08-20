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
Element-ui el-tabs 的 pane 中 包含 el-tree 时，切换会出现闪烁。
解决办法：
在 el-tree 上加 :key="activeName"（activeName为el-tabs的绑定值）
