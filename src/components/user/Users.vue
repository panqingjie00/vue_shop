<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input
            clearable
            @clear="getUserList"
            placeholder="请输入内容"
            v-model="queryParams.query"
          >
            <el-button
              slot="append"
              @click="getUserList"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showUpdateDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="addDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="updateDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="updateDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="updateForm"
        :rules="updateFormRules"
        ref="updateFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="updateForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="updateForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    // 邮箱的自定义验证规则
    let checkEmail = (rule, value, callback) => {
      // 邮箱校验正则
      const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (regEmail.test(value)) {
        return callback()
      } else {
        callback(new Error('邮箱格式不正确！'))
      }
    }
    // 手机的自定义验证规则
    let checkMobile = (rule, value, callback) => {
      // 手机号校验正则
      const regMobile = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      } else {
        callback(new Error('手机号格式不正确！'))
      }
    }
    return {
      queryParams: {
        query: '',
        // 当前页码数
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显隐
      addDialogVisible: false,
      // 修改用户对话框的显隐
      updateDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户的表单数据
      updateForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3~10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '密码长度在6~15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改表单的验证规则对象
      updateFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 请求用户数据列表
    getUserList() {
      this.$http.get("users", { params: this.queryParams }).then(({ data: res }) => {
        this.userList = res.data.users;
        this.total = res.data.total;
      }).catch((error) => error)
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.queryParams.pagesize = val
      this.getUserList()
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.queryParams.pagenum = val
      this.getUserList()
    },
    // 监听 Switch 开关状态改变
    userStateChange(userInfo) {
      this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error("更新状态失败！")
        }
        this.$message.success(res.meta.msg)
      })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      // 重置表单
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户功能
    addUser() {
      // 添加表单预校验
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          // 添加用户请求
          this.$http.post("users", this.addForm).then(({ data: res }) => {
            if (res.meta.status !== 201) {
              return this.$message.error("用户添加失败！")
            }
            this.$message.success("用户添加成功！")
            // 隐藏添加用户对话框
            this.addDialogVisible = false
            // 重新获取新增后的用户列表数据
            this.getUserList()
          })
        } else {
          this.$message.error("表单校验失败！")
          return false;
        }
      })
    },
    // 弹出修改用户对话框
    showUpdateDialog(id) {
      this.updateDialogVisible = true
      this.$http.get(`users/${id}`).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error("查询用户信息失败！")
        }
        this.updateForm = res.data
      })
    },
    // 监听修改用户对话框的关闭事件
    updateDialogClosed() {
      // 重置表单
      this.$refs.updateFormRef.resetFields();
    },
    // 修改用户功能
    updateUser() {
      this.$refs.updateFormRef.validate(valid => {
        if (valid) {
          // 修改用户请求
          this.$http.put(`users/${this.updateForm.id}`, { email: this.updateForm.email, mobile: this.updateForm.mobile }).then(({ data: res }) => {
            if (res.meta.status !== 200) {
              return this.$message.error("用户信息修改失败！")
            }
            // 隐藏修改用户对话框
            this.updateDialogVisible = false
            // 提示成功
            this.$message.success("用户信息修改成功！")
            // 重新获取修改后的用户列表数据
            this.getUserList()
          })
        } else {
          this.$message.error("表单校验失败！")
          return false;
        }
      })
    },
    // 根据 id 删除对应的用户
    removeUserById(id) {
      // 弹框询问用户是否删除数据？
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送删除单个用户的请求
        this.$http.delete(`users/${id}`).then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error("用户删除失败！")
          }
          // 删除成功提示
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 获取删除后的数据列表
          this.getUserList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style>
</style>