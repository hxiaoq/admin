<template>
  <div class="dashboard-container">
    <el-row v-loading="loading" :gutter="20">
      <el-col v-for="(item, key) in topObj" :key="key" :sm="12" :lg="6">
        <el-card class="box-card" :class="key === 'all' ? 'active' : 'normal'">
          <div class="topDiv">
            <div class="numberD">
              <span>{{ item.value }}</span>
              <div class="num-name">{{ item.name }}</div>
            </div>
            <div v-if="key === 0">
              <svg-icon icon-class="shebeiguanli" style="font-size: 40px" />
            </div>
             <div v-else>
              <el-progress
                type="circle"
                :percentage="Number(item.percent*100)"
                color="#44B1FD"
                :width="65"
                :show-text="false"
                stroke-linecap="butt"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chartGroup">
      <el-col :span="12" style="margin: 15px 0">
        <el-card class="box-card">
          <div slot="header" class="chart-card">
            <span class="chart-title"> 最近12月OBD设备安装情况 <em>(单位/台)</em> </span>
          </div>
          <div id="topLeftEchart" v-loading="loading1" class="chart" />
        </el-card>
      </el-col>
      <el-col :span="12" style="margin: 15px 0">
        <el-card class="box-card">
          <div slot="header" class="chart-card">
            <span class="chart-title"> 行政区OBD设备安装分布 <em>(单位/台)</em></span>
          </div>
          <div id="topRightEchart" v-loading="loading2" class="chart" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chartGroup">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="chart-card">
            <span class="chart-title"> OBD设备安装运维公司TOP5 <em>(单位/台)</em></span>
          </div>
          <div id="bottomLeftEchart" v-loading="loading3" class="chart" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="chart-card">
            <span class="chart-title"> OBD厂商设备安装TOP10<em>(单位/台)</em> </span>
          </div>
          <div id="bottomRightEchart" v-loading="loading4" class="chart" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import Cookies from 'js-cookie'
import resize from '@/views/archives/resize'
import api from '@/api/archivesYW/equipmentManagement/equipmentStatistical'
export default {
  mixins: [resize],
  props: ['apprefs'],
  data() {
    return {
       chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      bodyHeight: null,
      topObj: { all: 0, gz: 0, zc: 0, lx: 0 },
      loading: true,
      loading1: true,
      loading2: true,
      loading3: true,
      loading4: true

    }
  },
  mounted() {
    this.getHeight()
    this.getTopValue()
    this.getDeviceCountByDate()
    this.getDeviceCountByOrg()
    this.getDeviceCountByOper()
    this.getDeviceCountByFactory()
  },
  methods: {
    getHeight() {
      if (!Cookies.get('appContainerHeight')) {
        const appContainerHeight = parseInt(window.getComputedStyle(this.apprefs.appBasicContainer).getPropertyValue('height')) - 20
        this.bodyHeight = appContainerHeight + 'px'
      } else {
        this.bodyHeight = Cookies.get('appContainerHeight') + 'px'
      }
    },
    getTopValue() {
      api.getTopValue().then((response) => {
        this.topObj = response.data
        this.loading = false
      })
    },
    getDeviceCountByDate() {
      api.getDeviceCountByDate().then((response) => {
        const { data, xAxis } = response.data
        this.initTopLeftEchart(data, xAxis)
        this.loading1 = false
      })
    },
    initTopLeftEchart(data, xAxis) {
      this.chart1 = echarts.init(document.getElementById('topLeftEchart'))
      this.chart1.setOption({
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        color: ['#4f81bd'],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis,
          axisLabel: {
            interval: 0,
            rotate: 40
          }
        },
        yAxis: {
          type: 'value',
          name: '单位(台)'
        },
        series: [
          {
            data,
            type: 'line',
            areaStyle: {}
          }
        ]
      })
    },
    getDeviceCountByOrg() {
      api.getDeviceCountByOrg().then((response) => {
        const { data, xAxis } = response.data
        this.initTopRightEchart(data, xAxis)
        this.loading2 = false
      })
    },
    initTopRightEchart(data, xAxis) {
      this.chart2 = echarts.init(document.getElementById('topRightEchart'))
      this.chart2.setOption({
        // title: {
        //   text: "行政区车企分布",
        //   left: "center",
        //   align: "center",
        // },
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
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '0%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: xAxis,
          axisLabel: {
            interval: 0,
            rotate: 40
          }
        },
        series: [
          {
            // name: '2012年',
            type: 'bar',
            barWidth: '50%',
            data,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 1,
                color: '#41d6f3'
              },
              {
                offset: 0,
                color: '#3da0ff'
              }
            ]),
            itemStyle: {
              // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [5, 5, 0, 0]
              }
            }
          }
        ]
      })
    },
    getDeviceCountByOper() {
      api.getDeviceCountByOper().then((response) => {
        const { data, xAxis } = response.data
        this.initBottomLeftEchart(data, xAxis)
        this.loading3 = false
      })
    },
    initBottomLeftEchart(data, xAxis) {
      this.chart3 = echarts.init(document.getElementById('bottomLeftEchart'))
      var placeHolderStyle = {
        normal: {
          color: 'rgba(0,0,0,0)',
          label: {
            show: false
          },
          labelLine: {
            show: false
          }
        },
        emphasis: {
          color: 'rgba(0,0,0,0)'
        }
      }
      var dataStyle = {
        normal: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          shadowBlur: 30,
          shadowColor: 'rgba(40, 40, 40, 0.3)'
        }
      }

      this.chart3.setOption({
        color: [
          '#857ABA',
          '#4C3CAE',
          '#8C0F86',
          '#CA2C95',
          '#E1A4C4',
          '#857ABA'
        ],
        tooltip: {
          show: true,
          formatter: '{b} <br/>{c}台 （占比{d}%） '
        },
        legend: {
          orient: 'vertical',
          left: '80%',
          bottom: '10%',
          textStyle: {
            color: '#FE80C8'
          },
          data: xAxis
        },

        series: [
          {
            name: 'Line 1',
            type: 'pie',
            top: '20%',
            clockWise: false,
            radius: [100, 120],
            hoverAnimation: false,
            itemStyle: dataStyle,
            data: [
              { ...data[0].data[1] },
              {
                ...data[0].data[0],
                itemStyle: placeHolderStyle
              }
            ]
          },
          {
            name: 'Line 2',
            type: 'pie',
            top: '20%',
            clockWise: false,
            radius: [80, 100],
            hoverAnimation: false,
            itemStyle: dataStyle,
            data: [
              { ...data[1].data[1] },
              {
                ...data[1].data[0],
                itemStyle: placeHolderStyle
              }
            ]
          },
          {
            name: 'Line 3',
            type: 'pie',
            top: '20%',
            clockWise: false,
            hoverAnimation: false,
            radius: [60, 80],
            itemStyle: dataStyle,
            data: [
              { ...data[2].data[1] },
              {
                ...data[2].data[0],
                itemStyle: placeHolderStyle
              }
            ]
          },
          // {
          //   name: 'Line 4',
          //   type: 'pie',
          //   top: '20%',
          //   clockWise: false,
          //   hoverAnimation: false,
          //   itemStyle: dataStyle,
          //   radius: [40, 60],
          //   data: [
          //     { ...data[3].data[1] },
          //     {
          //       ...data[3].data[0],
          //       itemStyle: placeHolderStyle
          //     }
          //   ]
          // },
          // {
          //   name: 'Line 5',
          //   type: 'pie',
          //   top: '20%',
          //   clockWise: false,
          //   hoverAnimation: false,
          //   radius: [20, 40],
          //   itemStyle: dataStyle,
          //   data: [
          //     { ...data[4].data[1] },
          //     {
          //       ...data[4].data[0],
          //       itemStyle: placeHolderStyle
          //     }
          //   ]
          // }
        ]
      })
    },
    getDeviceCountByFactory() {
      api.getDeviceCountByFactory().then((response) => {
        const { data, xAxis } = response.data
        this.initBottomRightEchart(data, xAxis)
        this.loading4 = false
      })
    },
    initBottomRightEchart(data, xAxis) {
      this.chart4 = echarts.init(document.getElementById('bottomRightEchart'))
      this.chart4.setOption({
        // title: {
        //   text: "车企车辆排名TOP10",
        //   left: "center",
        //   align: "center",
        // },
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
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        color: ['#4f81bd'],
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: xAxis.reverse(),
          name: '单位(辆)'
        },
        series: [
          {
            // name: '2012年',
            type: 'bar',
            barWidth: '50%',
            data:data.reverse()
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  height: 100%;
  position: relative;

  .chart-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .chart-title {
      font-size: 18px;
      color: #707070;
    }
  }
  .chart {
    height: 260px;
  }
}
.topDiv {
  text-align: center;
  .numberD {
    margin-bottom: 10px;
  }
}
.box-card {
  &.active {
    color: #ffffff;
    background: #44b1fd;
  }
  &.normal {
    color: #3285ff;
    background: #ffffff;
    .num-name {
      color: #999999;
    }
  }
}
.topDiv {
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;

  .numberD {
    // margin-bottom: 10px;
    span {
      font-size: 24px;
      font-weight: bold;
    }
    div {
      margin-top: 10px;
      font-size: 15px;
    }
  }
}
</style>
<style lang='scss' scoped>
::v-deep .vue-treeselect {
  width: 200px !important;
}
::v-deep .el-form-item--small .el-form-item__content,
.el-form-item--small .el-form-item__label {
  line-height: 30px;
}
::v-deep .vue-treeselect__control {
  height: 30px;
}
::v-deep .el-card__header {
  border: none;
  padding: 18px 15px 5px;
}
::v-deep .el-card__body {
  padding: 10px;
}
 em {
        font-size: 14px;
        font-style: normal;
        color: #a1a1a1;
        margin-left: 5px;
 }
</style>
