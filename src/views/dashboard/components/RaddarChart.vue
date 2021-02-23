<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

// const animationDuration = 3000

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
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val, 2)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
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
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions()
    },
    setOptions({ xAxis = [], series = [] } = {}) {
      const max = Math.max(...series)
      const maxList = Array(series.length).fill(max)
      this.chart.setOption({
        grid: {
          left: '3%',
          right: '4%',
          bottom: '-10px',
          top: '5px',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            return params[0].name + '<br/>' +
              params[0].seriesName + ' : ' + Number((params[0].value.toFixed(4) / 10000).toFixed(2)).toLocaleString() + ' 次<br/>'
          }
        },
        xAxis: {
          show: false,
          type: 'value'
        },
        yAxis: [{
          type: 'category',
          inverse: true,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#333'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          data: xAxis

        }, {
          type: 'category',
          inverse: true,
          axisTick: 'none',
          axisLine: 'none',
          show: true,
          axisLabel: {
            textStyle: {
              color: '#333',
              fontSize: '12'
            }
          },
          data: series
        }],
        series: [
          {
            name: '2012年',
            type: 'bar',
            zlevel: 1,
            barWidth: '50%',
            data: series,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 1,
              color: '#41d6f3'
            }, {
              offset: 0,
              color: '#3da0ff'
            }])
          }, //  #f3f3f3
          {
            name: '背景',
            type: 'bar',
            data: maxList,
            barWidth: '50%',
            barGap: '-100%',
            color: '#f3f3f3'
          }
        ]
      })
    }
  }
}
</script>
