<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="addDialogVisible = true"
        >添加角色</el-button
      >
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              class="bdbottom"
              :class="index1 ? '' : 'bdtop'"
              type="flex"
              align="middle"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级、三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="index2 ? 'bdtop' : ''"
                  type="flex"
                  align="middle"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showUpdateDialog(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRightDialog(scope.row)"
                >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
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
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入角色描述"
            v-model="addForm.roleDesc"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色信息对话框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="updateDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="updateDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="updataForm"
        :rules="updataFormRules"
        ref="updateFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="updataForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入角色描述"
            v-model="updataForm.roleDesc"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updataRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      @close="setRightDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        ref="treeRef"
        default-expand-all
        :default-checked-keys="defaultKeys"
      ></el-tree>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 所有角色列表数据
      rolesList: [],
      // 所有权限数据列表
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认勾选的节点的 key 的数组
      defaultKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
      // 控制添加角色对话框的显隐
      addDialogVisible: false,
      // 控制修改角色对话框的显隐
      updateDialogVisible: false,
      // 控制分配权限对话框的显隐
      setRightDialogVisible: false,
      // 添加角色数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 修改角色数据
      updataForm: {},
      // 添加表单的验证规则对象
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名长度在2~10个字符之间', trigger: 'blur' }
        ]
      },
      // 修改表单的验证规则对象
      updataFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名长度在2~10个字符之间', trigger: 'blur' }
        ]
      },
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表
    getRolesList() {
      this.$http.get("roles").then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error('请求角色列表失败！')
        }
        this.rolesList = res.data
      })
    },
    // 监听添加角色对话框的关闭事件
    addDialogClosed() {
      // 重置表单
      this.$refs.addFormRef.resetFields();
    },
    // 监听修改角色对话框的关闭事件
    updateDialogClosed() {
      // 重置表单
      this.$refs.updateFormRef.resetFields();
    },
    // 添加角色
    addRole() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          // 如果校验通过则发送添加请求
          this.$http.post("roles", this.addForm).then(({ data: res }) => {
            if (res.meta.status !== 201) {
              return this.$message.error('添加角色失败！')
            }
            this.addDialogVisible = false
            this.$message.success("添加角色成功！")
            this.getRolesList()
          })
        } else {
          return this.$message.error("表单校验失败！")
        }
      });

    },
    // 根据 roleId 和 rightId 删除指定权限
    removeRightById(role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`roles/${role.id}/rights/${rightId}`).then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error("删除角色权限失败！")
          }
          role.children = res.data
          this.$message.success("删除角色权限成功！")
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 显示分配权限对话框
    showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限树形数据
      this.$http.get("rights/tree").then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取权限数据失败！")
        }
        this.rightsList = res.data

        // 查找当前角色 有哪些 权限
        this.getLeafKeys(role, this.defaultKeys)

        this.setRightDialogVisible = true
      })
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defaultKeys 数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听 分配权限 对话框 关闭 后 的事件
    setRightDialogClosed() {
      this.defaultKeys = []
    },
    // 分配权限
    allotRights() {
      const keysStr = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()].toString()
      // 角色授权的请求
      this.$http.post(`roles/${this.roleId}/rights`, { rids: keysStr }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error("分配权限失败！")
        }
        this.$message.success("分配权限成功！")
        this.getRolesList()
        this.setRightDialogVisible = false
      })
    },
    // 显示修改角色信息对话框
    showUpdateDialog(id) {
      // 打开对话框之前，先获取到该角色信息
      this.$http.get(`roles/${id}`).then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error("获取角色信息失败！")
        this.updataForm = res.data
        this.updateDialogVisible = true
      })
    },
    // 修改角色信息
    updataRole() {
      this.$refs['updateFormRef'].validate((valid) => {
        if (valid) {
          // 如果表单校验通过，则发送修改请求
          this.$http.put(`roles/${this.updataForm.roleId}`, this.updataForm).then(({ data: res }) => {
            if (res.meta.status !== 200) return this.$message.error("修改角色信息失败！")
            this.$message.success("修改角色信息成功！")
            this.getRolesList()
            this.updateDialogVisible = false
          })
        } else {
          return this.$message.error("表单校验失败！")
        }
      });
    },
    // 删除角色
    removeRoleById(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`roles/${id}`).then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error("删除角色失败！")
          }
          this.$message.success("删除角色成功！")
          this.getRolesList()
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
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>