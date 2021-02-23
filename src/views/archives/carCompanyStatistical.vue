<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="行政区">
        <el-select v-model="formInline.region" placeholder="输入行政区">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="formInline.time"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class=""
          size="small"
          type="success"
          icon="el-icon-search"
          @click="loadTable()"
        >
          查询
        </el-button>
        <el-button
          class="filter-item"
          size="small"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-download"
        >
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="12"><div id="myChart1" class="chart" /></el-col>
      <el-col :span="12"><div id="myChart2" class="chart" /></el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
// import resize from './dashboard/components/mixins/resize'
export default {
  // mixins: [resize],
  data() {
    return {
      formInline: {
        time: '',
        region: ''
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
      this.initChart2()
    })
  },
  // beforeDestroy() {
  //   if (!this.chart) {
  //     return
  //   }
  //   this.chart.dispose()
  //   this.chart = null
  // },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById('myChart1'), 'macarons')
      this.chart.setOption({
        title: {
          text: '行政区预警次数排名'

        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        // legend: {
        //     data: ['2011年', '2012年']
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)'],
          name: '单位:(次)'
        },
        series: [
          {
            name: '2012年',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807]
          }
        ]
      })
    },
    initChart2() {
      this.chart = echarts.init(document.getElementById('myChart2'), 'macarons')
      this.chart.setOption({
        title: {
          text: '行政区预警时长排名'

        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        // legend: {
        //     data: ['2011年', '2012年']
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)'],
          name: '单位:(h)'
        },
        series: [
          {
            name: '2012年',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807]
          }
        ]
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .chart{
    height:300px;
    width:100%;
  }
  .el-form-item{
    margin-bottom: 10px;
  }
</style>
