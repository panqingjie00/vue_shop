<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 消息提示区 -->
      <el-alert
        title="修改商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 进度条区 -->
      <el-steps
        :space="200"
        :active="+activeIndex"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs 区域 -->
      <el-form
        :model="updateForm"
        :rules="updateFormRules"
        ref="updateFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="updateForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="updateForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="updateForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="updateForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="updateForm.goods_cat"
                :options="categoryList"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                }"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(param, index) in item.attr_vals"
                  :key="index"
                  :label="param"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"> </el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传到的后台API地址 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="updateForm.goods_introduce"></quill-editor>
            <el-button class="addBtn" type="primary" @click="updateGoods"
              >修改商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!-- 图片预览对话框 -->
      <el-dialog
        title="图片预览"
        :visible.sync="previewDialogVisible"
        width="50%"
      >
        <img :src="previewUrl" class="previewImg" />
      </el-dialog>
    </el-card>
  </div>
</template>
  
  <script>
// 导入 lodash
import _ from 'lodash'
export default {
  name: "Update",
  data() {
    return {
      activeIndex: '0',
      // 修改商品的表单数据对象
      updateForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        goods_cat: [],
        pics: [],
        attrs: []
      },
      // 修改商品的表单校验规则对象
      updateFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      },
      // 商品分类数据列表
      categoryList: [],
      // 动态参数数据列表
      manyTableData: [],
      // 静态属性数据列表
      onlyTableData: [],
      // 为图片上传添加请求头token
      headersObj: {
        Authorization: sessionStorage.getItem('token')
      },
      // 预览图片的url
      previewUrl: '',
      // 控制 预览图片对话框 的显隐
      previewDialogVisible: false,
      fileList: []
    }
  },
  computed: {
    // 三级分类 id
    categoryId() {
      if (this.updateForm.goods_cat.length === 3) {
        return this.updateForm.goods_cat[2]
      } else {
        return null
      }
    },
    // List --> Update 跳转携带的 query 参数
    goodsInfo() {
      return this.$route.query
    }
  },
  created() {
    this.getCategoryList()
    this.updateForm.goods_id = +this.goodsInfo.goods_id
    this.updateForm.goods_name = this.goodsInfo.goods_name
    this.updateForm.goods_price = +this.goodsInfo.goods_price
    this.updateForm.goods_weight = +this.goodsInfo.goods_weight
    this.updateForm.goods_number = +this.goodsInfo.goods_number
    this.updateForm.goods_cat = [+this.goodsInfo.cat_one_id, +this.goodsInfo.cat_two_id, +this.goodsInfo.cat_three_id]
    JSON.parse(this.goodsInfo.pics).forEach((item, index) => {
      this.fileList.push({
        name: index,
        url: item.pics_big_url
      })
    })
    this.updateForm.goods_introduce = this.goodsInfo.goods_introduce
  },
  methods: {
    // 获取 商品分类数据列表
    getCategoryList() {
      this.$http.get('categories').then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品分类数据列表失败！")
        }
        this.categoryList = res.data
      })
    },
    // 监听 级联菜单 变化 
    handleChange() {
      if (this.updateForm.goods_cat.length !== 3) {
        this.updateForm.goods_cat = []
      }
    },
    // 切换标签之前的钩子
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.updateForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类！")
        return false
      }
    },
    // tab 点击事件
    tabClick(tabName) {
      if (tabName.name === '1') {
        this.$http.get(`categories/${this.categoryId}/attributes`, { params: { sel: 'many' } }).then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("获取动态参数列表失败！")
          }
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length ? item.attr_vals.split(' ') : []
          })
          this.manyTableData = res.data
        })
      }
      else if (tabName.name === '2') {
        this.$http.get(`categories/${this.categoryId}/attributes`, { params: { sel: 'only' } }).then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("获取静态属性列表失败！")
          }
          this.onlyTableData = res.data
        })
      }
    },
    // 图片预览事件，file为预览文件的信息
    handlePreview(file) {
      this.previewUrl = file.response.data.url
      this.previewDialogVisible = true
    },
    // 图片移除事件,file 参数为 被移除的文件信息
    handleRemove(file) {
      const tempPath = file.response.data.tmp_path
      const picIndex = this.updateForm.pics.findIndex(item => item.pic === tempPath)
      this.updateForm.pics.splice(picIndex, 1)
    },
    // 图片上传成功事件
    handleSuccess(response) {
      const tempPath = { pic: response.data.tmp_path }
      this.updateForm.pics.push(tempPath)
    },
    // 添加商品
    updateGoods() {
      this.$refs['updateFormRef'].validate((valid) => {
        if (valid) {
          // 因为要处理 goods_cat 和 goods_vals 两个参数，所以我们深拷贝一份 updateForm
          const updateFormClone = _.cloneDeep(this.updateForm)
          // 处理 goods_cat
          updateFormClone.goods_cat = updateFormClone.goods_cat.join(',')
          // 处理 动态参数
          this.manyTableData.forEach(item => {
            updateFormClone.attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            })
          })
          // 处理 静态属性
          this.onlyTableData.forEach(item => {
            updateFormClone.attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            })
          })
          // 请求添加商品
          this.$http.put(`goods/${this.updateForm.goods_id}`, updateFormClone).then(({ data: res }) => {
            if (res.meta.status !== 200) {
              return this.$message.error("修改商品失败！")
            }
            this.$message.success("修改商品成功！")
            this.$router.push('/home/goods')
          })
        } else {
          return this.$message.error('表单校验失败！');
        }
      });
    }
  }
}
  </script>
  
  <style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>