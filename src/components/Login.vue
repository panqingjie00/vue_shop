<template>
  <div class="login_container">
    <el-alert
      title="请使用以下游客账号密码登录网站"
      type="error"
      center
      description="账号：visitor   密码：123456  管理员admin账号已被禁用！"
    >
    </el-alert>
    <div class="login_box">
      <div class="avater_box">
        <img src="../assets/logo.png" />
      </div>

      <el-form
        ref="loginForm"
        :model="loginForm"
        label-width="0px"
        class="login_form"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model.trim="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model.trim="loginForm.password"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitLoginForm('loginForm')"
            >登录</el-button
          >
          <el-button type="info" @click="resetLoginForm('loginForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // 这是登录表单绑定的数据对象
      loginForm: {
        username: '',
        password: '',
      },
      // 这是登录表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitLoginForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('login', this.loginForm).then(({ data: res }) => {
            if (res.meta.status !== 200) {
              this.$message.error('登录失败！');
            }
            else {
              this.$message.success("登录成功！");
              // 把token保存在session里
              sessionStorage.setItem("token", res.data.token)
              this.$router.push({
                path: '/home'
              })
            }
          }).catch((error) => error)

        } else {
          return this.$message.error("表单校验失败！");
        }
      });
    },
    // 重置表单
    resetLoginForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: skyblue;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avater_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  // el-form 默认是 content-box，padding会出问题
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}

.el-alert {
  height: 100px;
}
</style>
