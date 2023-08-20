<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 头部警告区 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedKeys"
            :options="categoryList"
            :props="{
              expandTrigger: 'hover',
              label: 'cat_name',
              value: 'cat_id',
              children: 'children',
            }"
            @change="cascaderSelectedChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- Tabs 页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加 动态参数 的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加按钮 -->
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数 表格 -->
          <el-table :data="manyTableData" border stripe :key="activeName">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag, index) in scope.row.attr_vals"
                  :key="tag"
                  closable
                  @close="handleTagClose(scope.row, index)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showUpdateParamsDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加 静态属性 的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性 表格 -->
          <el-table :data="onlyTableData" border stripe :key="activeName">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag, index) in scope.row.attr_vals"
                  :key="tag"
                  closable
                  @close="handleTagClose(scope.row, index)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showUpdateParamsDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="`添加${titleText}`"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="addParamsDialogClosed"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsRules"
        ref="addParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="`修改${titleText}`"
      :visible.sync="updateParamsDialogVisible"
      width="50%"
      @close="updateParamsDialogClosed"
    >
      <el-form
        :model="updateParamsForm"
        :rules="updateParamsRules"
        ref="updateParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="updateParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      // 所有分类列表
      categoryList: [],
      // 选中的 第三级 id
      selectedKeys: [],
      // tabs 激活的页签name
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制 添加参数对话框的 显隐
      addParamsDialogVisible: false,
      // 控制 修改参数对话框的 显隐
      updateParamsDialogVisible: false,
      // 添加参数 的表单 数据对象
      addParamsForm: {
        attr_name: ''
      },
      // 添加表单的验证规则对象
      addParamsRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 修改参数 的表单 数据对象
      updateParamsForm: {
        attr_name: ''
      },
      // 修改表单的验证规则对象
      updateParamsRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    // 根据selectedKeys控制 添加按钮是否禁用
    isBtnDisabled() {
      return this.selectedKeys.length !== 3
    },
    // 获取到 3级分类的id
    categoryId() {
      return this.selectedKeys[2]
    },
    // 动态计算 dialog title
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    // 请求所有分类列表
    getCategoryList() {
      this.$http.get("categories").then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error("分类列表获取失败！")
        }
        this.categoryList = res.data
      })
    },
    // 监听 级联选择变化
    cascaderSelectedChange(keys) {
      // 控制 级联选择 只能选择第三级
      if (keys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      this.getParamsData()
    },
    // tabs 点击事件
    handleTabClick() {
      this.getParamsData()
    },
    // 获取 参数列表
    getParamsData() {
      // 选择了 第三级 则 发送请求
      this.$http.get(`categories/${this.categoryId}/attributes`, { params: { sel: this.activeName } }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error("参数请求失败！")
        }
        // 处理 attr_vals
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 让每一个 参数 都有 自己的 inputVisible 和 inputValue
          item.inputVisible = false
          item.inputValue = ''
        });

        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      })
    },
    // 监听 添加参数 对话框的close事件
    addParamsDialogClosed() {
      this.$refs.addParamsFormRef.resetFields()
    },
    // 添加参数
    addParams() {
      this.$refs.addParamsFormRef.validate((valid) => {
        if (valid) {
          this.$http.post(`categories/${this.categoryId}/attributes`, {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }).then(({ data: res }) => {
            if (res.meta.status !== 201) {
              return this.$message.error("添加参数失败！")
            }
            this.$message.success("添加参数成功！")
            this.getParamsData()
            this.addParamsDialogVisible = false
          })
        } else {
          return this.$message.error("表单校验失败！")
        }
      });
    },
    // 展示 修改参数 对话框
    showUpdateParamsDialog(paramsInfo) {
      this.updateParamsForm.attr_name = paramsInfo.attr_name
      this.updateParamsForm.attr_id = paramsInfo.attr_id
      this.updateParamsDialogVisible = true
    },
    // 修改参数
    updateParams() {
      this.$refs.updateParamsFormRef.validate((valid) => {
        if (valid) {
          this.$http.put(`categories/${this.categoryId}/attributes/${this.updateParamsForm.attr_id}`, {
            attr_name: this.updateParamsForm.attr_name,
            attr_sel: this.activeName
          }).then(({ data: res }) => {
            if (res.meta.status !== 200) {
              return this.$message.error("修改参数失败！")
            }
            this.$message.success("修改参数成功！")
            this.getParamsData()
            this.updateParamsDialogVisible = false
          })
        } else {
          return this.$message.error("表单校验失败！")
        }
      });
    },
    // 修改参数对话框 关闭事件
    updateParamsDialogClosed() {
      this.$refs.updateParamsFormRef.resetFields()
    },
    // 删除参数
    removeParams(attr_id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`categories/${this.categoryId}/attributes/${attr_id}`).then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error("删除分类失败！")
          }
          this.$message.success("删除分类成功！")
          this.getParamsData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 点击 +New Tag 后显示 input 输入框
    showInput(paramsInfo) {
      paramsInfo.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 新增tag输入框 回车键 或者 失焦 会触发本函数
    handleInputConfirm(paramsInfo) {
      // 如果输入值没有意义则清空退出，不进行下一步操作
      if (paramsInfo.inputValue.trim().length === 0) {
        paramsInfo.inputValue = ''
        paramsInfo.inputVisible = false
        return
      }
      // 如果输入值是有意义的，则进行下一步操作
      paramsInfo.attr_vals.push(paramsInfo.inputValue)
      paramsInfo.inputValue = ''
      paramsInfo.inputVisible = false

      this.updatedSaveTagsToDatabase(paramsInfo)
    },
    // 删除 选中 的 tag 标签
    handleTagClose(paramsInfo, index) {
      // 先删除vals数组中的
      paramsInfo.attr_vals.splice(index, 1)
      // 再更新到数据库
      this.updatedSaveTagsToDatabase(paramsInfo)
    },
    // 修改 tag 后 保存到数据库
    updatedSaveTagsToDatabase(paramsInfo) {
      this.$http.put(`categories/${this.categoryId}/attributes/${paramsInfo.attr_id}`, {
        attr_name: paramsInfo.attr_name,
        attr_sel: this.activeName,
        attr_vals: paramsInfo.attr_vals.join(' ')
      }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error("修改参数tag失败！")
        }
      })
    }
  }
}
</script>

<style scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.el-table .el-tag:first-of-type {
  margin-left: 20px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>