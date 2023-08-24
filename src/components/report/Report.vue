<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" style="width: 1000px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 引入 echarts
import * as echarts from 'echarts';
import _ from 'lodash';
export default {
  name: "Report",
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {

  },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 数据请求
    const { data: res } = await this.$http.get('reports/type/1')
    // 合并选项
    const result = _.merge(res.data, this.options)
    // 绘制图表
    myChart.setOption(result);
  },
  methods: {
  }
}
</script>

<style scoped>
</style>