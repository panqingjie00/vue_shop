<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 订单查询区域 -->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryParams.query"
            clearable
            @clear="getOrdersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表区域 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="120px"
        ></el-table-column>
        <el-table-column label="是否付款" width="100px">
          <template slot-scope="scope">
            <el-tag v-if="+scope.row.pay_status" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" width="100px">
          <template slot-scope="scope">
            {{ +scope.row.is_send ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showUpdateAddressDialog"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showExpressProgressDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>

      <!-- 修改地址对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="updateAddressDialogVisible"
        width="50%"
        @close="updateAddressDialogClosed"
      >
        <el-form
          :model="updateAddressForm"
          :rules="updateAddressFormRules"
          ref="updateAddressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              :options="cityData"
              v-model="updateAddressForm.address1"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="updateAddressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateAddressDialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="updateAddress">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 物流进度对话框 -->
      <el-dialog
        title="物流进度"
        :visible.sync="expressProgressDialogVisible"
        width="50%"
      >
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in expressProgressInfo"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from './citydata.js'
import expressProgress from './expressProgress.js'
export default {
  name: 'Order',
  data() {
    return {
      // 订单列表数据的请求参数
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单列表数据
      ordersList: [],
      // 订单列表总条数
      total: 0,
      // 控制 修改地址 对话框的显隐
      updateAddressDialogVisible: false,
      // 修改地址的表单数据对象
      updateAddressForm: {
        address1: [],
        address2: ''
      },
      // 修改地址的表单验证规则对象
      updateAddressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 省市区/县 数据
      cityData,
      // 控制 物流进度对话框 的显隐
      expressProgressDialogVisible: false,
      // 物流进度信息
      expressProgressInfo: []
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取 所有订单列表数据
    getOrdersList() {
      this.$http.get('orders', { params: this.queryParams }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error("请求订单列表失败！")
        }
        this.ordersList = res.data.goods
        this.total = res.data.total
      })
    },
    // 监听 pagesize 
    handleSizeChange(pagesize) {
      this.queryParams.pagesize = pagesize
      this.getOrdersList()
    },
    // 监听 pagenum
    handleCurrentChange(pagenum) {
      this.queryParams.pagenum = pagenum
      this.getOrdersList()
    },
    // 展示 修改地址对话框
    showUpdateAddressDialog() {
      this.updateAddressDialogVisible = true
    },
    // 修改地址对话框的关闭事件
    updateAddressDialogClosed() {
      this.$refs.updateAddressFormRef.resetFields()
    },
    // 修改地址
    updateAddress() {
      this.$refs['updateAddressFormRef'].validate((valid) => {
        if (valid) {
          this.$message.success("修改地址成功！")
          this.updateAddressDialogVisible = false
        } else {
          this.$message.error("修改地址失败！")
        }
      });
    },
    // 显示 物流进度对话框
    showExpressProgressDialog() {
      this.expressProgressInfo = expressProgress
      this.expressProgressDialogVisible = true
    }
  }
}
</script>

<style scoped>
</style>