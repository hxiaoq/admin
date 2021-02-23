<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import Api from '@/api/dashboard/dashboard'
// import { Message } from 'element-ui'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      xAxisData: [],
      seriesData: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getTotalUserCountByType()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {

    async getTotalUserCountByType() {
      await Api.getTotalUserCountByType().then((response) => {
        const { data } = response
        this.xAxisData = data.xAxis
        this.seriesData = data.series
        this.initChart()
      }).catch(error => error)
    },
    initChart() {
      const _this = this

      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: _this.xAxisData,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: 'pageA',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: _this.seriesData,
          animationDuration,
          itemStyle: {
            normal: {
              color: function(params) { // 展示正值的柱子，负数设为透明
                const colorArr = params.value > 0 ? ['#FF9A22', '#FFD56E'] : ['rgba(0,0,0,0)', 'rgba(0,0,0,0)']
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: colorArr[0] // 0% 处的颜色
                }, {
                  offset: 1,
                  color: colorArr[1]// 100% 处的颜色
                }], false)
              }
            }
          }
        }]
      })
    }
  }
}
</script>
