<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏菜单 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#343744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activeIndex"
        >
          <!-- 一级菜单 -->
          <el-submenu
            v-for="(menu, index) in menuList"
            :index="menu.id + ''"
            :key="menu.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="`el-icon-${icons[index]}`"></i>
              <!-- 文本 -->
              <span>{{ menu.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="child in menu.children"
              :index="child.path"
              :key="child.id"
              @click="saveNavState(child.path)"
            >
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ child.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // 左侧菜单列表
      menuList: [],
      // icon图标存放
      icons: ['user-solid', 's-flag', 's-goods', 's-order', 's-data'],
      // 菜单展开折叠
      isCollapse: false,
      // 当前激活菜单的 index
      activeIndex: ''
    }
  },
  created() {
    this.getMenuList()
    this.activeIndex = sessionStorage.getItem("activePath")
  },
  methods: {
    // 退出功能
    logout() {
      sessionStorage.removeItem("token")
      this.$router.push('/login')
    },
    // 左侧菜单数据
    getMenuList() {
      this.$http.get('menus').then((res) => {
        this.menuList = res.data.data;
      }).catch((error) => error)
    },
    // 菜单折叠展开方法
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },

    saveNavState(activePath) {
      sessionStorage.setItem("activePath", activePath)
      this.activeIndex = sessionStorage.getItem("activePath")
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    > span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border: none;
  }
}
.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0.2em;
}
</style>