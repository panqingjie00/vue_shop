<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 权限列表区域 -->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="authName" label="商品管理"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      // 所有权限列表数据
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 请求所有权限列表
    getRightsList() {
      this.$http.get("rights/list").then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error("请求权限列表失败！")
        }
        this.rightsList = res.data
      })
    },
  }
}
</script>

<style>
</style>