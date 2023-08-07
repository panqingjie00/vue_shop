<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    // 退出功能
    logout() {
      sessionStorage.removeItem("token")
      this.$router.push('/login')
    }
  }
}
</script>

<style>
</style>