<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 添加分类区域 -->
      <el-button type="primary" @click="showAddCategoryDialog"
        >添加分类</el-button
      >
      <!-- 用户列表区域 -->
      <tree-table
        class="treeTable"
        v-loading="loading"
        :data="categoryList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            :class="scope.row.cat_deleted ? 'el-icon-error' : 'el-icon-success'"
          ></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="option" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdateCategoryDialog(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCategory(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

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

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :close-on-click-modal="false"
      :visible.sync="addCategoryDialogVisible"
      width="50%"
      @close="addCategoryDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCategoryForm"
        :rules="addCategoryRules"
        ref="addCategoryRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父类分级">
          <el-cascader
            expand-trigger="hover"
            :options="parentCategoryList"
            v-model="selectedKeys"
            @change="selectedChange"
            :props="{
              label: 'cat_name',
              value: 'cat_id',
              children: 'children',
              checkStrictly: true,
            }"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- Dialog 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类对话框 -->
    <el-dialog
      title="修改分类"
      :close-on-click-modal="false"
      :visible.sync="updateCategoryDialogVisible"
      width="50%"
      @close="updateCategoryDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="updateCategoryForm"
        :rules="addCategoryRules"
        ref="updateCategoryRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="updateCategoryForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- Dialog 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateCategoryDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="updateCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      // 商品分类的数据列表
      categoryList: [],
      // 查询参数
      queryParams: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      // 总数据条数
      total: 0,
      // 树形表格每一列的配置项
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      // 初次加载 分类请求 页面的loading遮罩
      loading: true,
      // 控制 添加分类对话框 的显隐
      addCategoryDialogVisible: false,
      // 控制 修改分类对话框 的显隐
      updateCategoryDialogVisible: false,
      // 添加分类 表单数据
      addCategoryForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 修改分类 表单数据
      updateCategoryForm: {
        cat_name: '',
      },
      // 修改分类 需要的 分类id
      categoryId: '',
      // 添加分类 表单校验规则
      addCategoryRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类（前两层）列表
      parentCategoryList: [],
      // 选中的父级分类 id数组
      selectedKeys: []
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    // 商品分类数据列表 请求
    getCategoryList() {
      // 注：get请求 携带请求参数时，必须 用 params 声明
      this.$http.get("categories", { params: this.queryParams }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error("商品分类请求失败！")
        }
        this.categoryList = res.data.result
        this.total = res.data.total
        this.loading = false
      })
    },
    // 监听 pagesize 改变
    handleSizeChange(newPagesize) {
      this.queryParams.pagesize = newPagesize
      this.getCategoryList()
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPagenum) {
      this.queryParams.pagenum = newPagenum
      this.getCategoryList()
    },
    // 展示 添加分类 对话框
    showAddCategoryDialog() {
      // 先获取 父类分类（前两层分类数据）
      this.$http.get("categories", { params: { type: 2 } }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取父类分类失败！")
        }
        this.parentCategoryList = res.data
      })

      this.addCategoryDialogVisible = true
    },
    // 监听 级联选择 变化
    selectedChange(keys) {
      // 1、2 的情况
      if (keys.length > 0) {
        this.addCategoryForm.cat_pid = keys[keys.length - 1]
        this.addCategoryForm.cat_level = keys.length
      }
      else {
        this.addCategoryForm.cat_pid = 0
        this.addCategoryForm.cat_level = 0
      }
    },
    // 添加分类
    addCategory() {
      this.$refs.addCategoryRef.validate((valid) => {
        if (valid) {
          this.$http.post("categories", this.addCategoryForm).then(({ data: res }) => {
            if (res.meta.status !== 201) {
              return this.$message.error("添加分类失败！")
            }
            this.$message.success("添加分类成功！")
            this.getCategoryList()
            this.addCategoryDialogVisible = false
          })
        } else {
          return this.$message.error("表单验证失败！");
        }
      });
    },
    // 监听 添加分类 对话框关闭事件
    addCategoryDialogClosed() {
      // 重置表单
      this.selectedKeys = []
      this.addCategoryForm.cat_pid = 0
      this.addCategoryForm.cat_level = 0
      this.$refs.addCategoryRef.resetFields();
    },
    // 展示 修改分类 对话框
    showUpdateCategoryDialog(categoryInfo) {
      this.updateCategoryDialogVisible = true
      this.categoryId = categoryInfo.cat_id
      this.updateCategoryForm.cat_name = categoryInfo.cat_name
    },
    // 修改分类
    updateCategory() {
      this.$refs.updateCategoryRef.validate((valid) => {
        if (valid) {
          this.$http.put(`categories/${this.categoryId}`, this.updateCategoryForm).then(({ data: res }) => {
            if (res.meta.status !== 200) {
              return this.$message.error("修改分类失败！")
            }
            this.$message.success("修改分类成功！")
            this.getCategoryList()
            this.updateCategoryDialogVisible = false
          })
        } else {
          return this.$message.error("表单验证失败！");
        }
      });
    },
    // 监听 修改分类 对话框关闭事件
    updateCategoryDialogClosed() {
      this.$refs.updateCategoryRef.resetFields();
    },
    // 删除分类
    removeCategory(cat_id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`categories/${cat_id}`).then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error("删除分类失败！")
          }
          this.$message.success("删除分类成功！")
          this.getCategoryList()
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

<style scoped>
i[class="el-icon-success"] {
  color: rgb(128, 200, 19);
}

i[class="el-icon-error"] {
  color: red;
}
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>