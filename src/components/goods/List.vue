<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 添加商品区域 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryParams.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格（元）"
          prop="goods_price"
          width="120px"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          prop="goods_number"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="100px"
        ></el-table-column>
        <el-table-column label="创建时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="goUpdatePage(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoodById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      // 商品列表数据的请求参数
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表数据
      goodsList: [],
      // 商品列表总条数
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取所有 商品列表数据
    getGoodsList() {
      this.$http.get('goods', { params: this.queryParams }).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error("商品列表数据请求失败！")
        }
        this.goodsList = res.data.goods
        this.total = res.data.total
      })
    },
    // 监听 分页 pagesize 改变
    handleSizeChange(pagesize) {
      this.queryParams.pagesize = pagesize
      this.getGoodsList()
    },
    // 监听 分页 pagenum 改变
    handleCurrentChange(pagenum) {
      this.queryParams.pagenum = pagenum
      this.getGoodsList()
    },
    // 根据 id 删除商品
    removeGoodById(goods_id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`goods/${goods_id}`).then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error("删除商品失败！")
          }
          this.$message.error("删除商品成功！")
          this.getGoodsList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 跳转到 添加商品 页面
    goAddPage() {
      this.$router.push('add')
    },
    // 跳转到 修改商品 页面
    goUpdatePage(goods_id) {
      this.$http.get(`goods/${goods_id}`).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error("查询商品数据失败！")
        }
        this.$router.push({
          path: 'update',
          query: {
            goods_id: res.data.goods_id,
            goods_name: res.data.goods_name,
            goods_price: res.data.goods_price,
            goods_number: res.data.goods_number,
            goods_weight: res.data.goods_weight,
            goods_introduce: res.data.goods_introduce,
            goods_cat: JSON.stringify(res.data.goods_cat),
            cat_one_id: res.data.cat_one_id,
            cat_two_id: res.data.cat_two_id,
            cat_three_id: res.data.cat_three_id,
            pics: JSON.stringify(res.data.pics),
          }
        })
      })
    }
  }
}
</script>

<style scope>
</style>