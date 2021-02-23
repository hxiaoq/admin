<template>
  <div class="dashboard-container">
    <el-row v-loading="loading" :gutter="20">
      <el-col v-for="(item, key) in topObj" :key="key" :sm="8" :lg="4">
        <el-card class="box-card" :class="key === 0 ? 'active' : 'normal'">
          <div class="topDiv">
            <div class="numberD">
              <span>{{ item.value }}</span>
              <div class="num-name">{{ item.name }}</div>
            </div>
            <div v-if="key === 0">
              <svg-icon icon-class="qiche" style="font-size: 40px" />
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

    <el-row :gutter="20" class="chartGroup no2">
      <el-col :span="9" style="margin: 15px 0">
        <el-card class="box-card">
          <div slot="header" class="chart-card">
            <span class="chart-title"> 车辆实时状态 <em>(单位/辆)</em> </span>
          </div>
          <div id="topLeftEchart" v-loading="loading1" class="chart" />
        </el-card>
      </el-col>
      <el-col :span="9" style="margin: 15px 0">
        <el-card class="box-card">
          <div slot="header" class="chart-card">
            <span class="chart-title">
              车辆品牌型号 <em>(单位/辆)</em>
              <em class="left-top">TOP5</em>
            </span>
          </div>
          <!-- <div id="topRightEchart" v-loading="loading2" class="chart" /> -->
          <el-table
            v-loading="loading2"
            :data="topRightEchartData"
            stripe
            style="width: 100%"
            class="chart"
          >
            <el-table-column type="index" label="排名" width="50">
              <template slot-scope="scope">
                <span
                  class="top"
                  :class="
                    scope.$index === 0
                      ? 'top1'
                      : scope.$index === 1
                      ? 'top2'
                      : 'top3'
                  "
                >
                  {{ scope.$index + 1 }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="车辆名称" width="80" />
            <el-table-column prop="value" label="">
              <template slot-scope="scope">
                <el-progress
                  :percentage="scope.row.value"
                  :stroke-width="12"
                  :show-text="false"
                  :color="
                    scope.$index === 0
                      ? '#64a3ff'
                      : scope.$index === 1
                      ? '#9cc5ff'
                      : '#999999'
                  "
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="value"
              label="车数量"
              width="70"
              align="center"
            />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" style="margin: 15px 0">
          <div slot="header" class="chart-card">
            <span class="chart-title">
              车辆排放标准分类 <em>(单位/辆)</em>
            </span>
          </div>
          <div id="bottomRightEchart" v-loading="loading4" class="chart" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chartGroup">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="chart-card">
            <span class="chart-title"> 行政区车辆分布 <em>(单位/辆)</em></span>
          </div>
          <div id="bottomLeftEchart" v-loading="loading3" class="chart" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import Cookies from 'js-cookie'
import resize from '@/views/archives/resize'
import api from '@/api/archivesYW/carManagement/carStatistical'
export default {
  mixins: [resize],
  props: ['apprefs'],
  data() {
    return {
      bodyHeight: null,
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      loading: true,
      loading1: true,
      loading2: true,
      loading3: true,
      loading4: true,
      topRightEchartData: [],
      topObj: []
    }
  },
  mounted() {
    this.getHeight()
    this.getTopValue()
    this.getCarCountByStatus()
    this.getCarByBrandTop()
    this.getCarByOrg()
    this.getCarByDischargeStandard()
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
    getCarCountByStatus() {
      api.getCarCountByStatus().then((response) => {
        const { data, xAxis, warningCountList } = response.data
        const barData = warningCountList.map(item => { return { name: item.id, value: item.count } })
        this.initTopLeftEchart(data, xAxis, barData)
        this.loading1 = false
      })
    },
    initTopLeftEchart(data, xAxis, barData) {
      const colorData = barData.map((item) => {
        return {
          ...item,
          itemStyle: {
            color:item.name === '正常' ? '#42B983':item.name === '超标' ? "yellow":item.name === '超速' ? "orange":item.name === '离线' ? 'gray' : 'red'

          }
        }
      })
      this.chart1 = echarts.init(document.getElementById('topLeftEchart'))
      this.chart1.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          // boundaryGap: false,
          data: xAxis
        },
        yAxis: {
          type: 'value',
          name: '单位(辆)'
        },
        series:
        {
          data: colorData,
          type: 'bar',
          barWidth: '50%'
        }

      })
    },
    getCarByBrandTop() {
      api.getCarByBrandTop().then((response) => {
        const { warningCountList } = response.data
        const tableData = warningCountList.map(item => { return { name: item.id, value: item.count } })
        // this.initTopRightEchart(data, xAxis)
        this.topRightEchartData = tableData
        this.loading2 = false
      })
    },
    initTopRightEchart(data, xAxis) {
      this.chart2 = echarts.init(document.getElementById('topRightEchart'))
      this.chart2.setOption({
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
          top: '3%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        color: ['#4f81bd'],
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: xAxis,
          name: '单位(辆)'
        },
        series: [
          {
            // name: '2012年',
            type: 'bar',
            data: data,
            barWidth: '50%'
          }
        ]
      })
    },
    getCarByOrg() {
      api.getCarByOrg().then((response) => {
        const { data, xAxis } = response.data
        this.initBottomLeftEchart(data, xAxis)
        this.loading3 = false
      })
    },
    initBottomLeftEchart(data, xAxis) {
      this.chart3 = echarts.init(document.getElementById('bottomLeftEchart'))
      this.chart3.setOption({
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
          top: '3%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          name: '单位(辆)'
        },
        xAxis: {
          type: 'category',
          data: xAxis
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
                color: '#9CC5FF'
              },
              {
                offset: 0,
                color: '#64A3FF'
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
    getCarByDischargeStandard() {
      api.getCarByDischargeStandard().then((response) => {
        const { data, xAxis, warningCountList } = response.data
        var total = 0
        const pieData = warningCountList.map(item => {
          total += item.count
          return { name: item.id, value: item.count }
        })
        this.initBottomRightEchart(data, xAxis, pieData, total)
        this.loading4 = false
      })
    },
    initBottomRightEchart(data, xAxis, pieData, total) {
      this.chart4 = echarts.init(document.getElementById('bottomRightEchart'))
      var color = ['#F52A64', '#FBD178', '#64A3FF','#55E0B6' ]
      var myPieData = []
      for (var i = 0; i < pieData.length; i++) {
        myPieData.push({
          value: pieData[i].value,
          name: pieData[i].name,
          itemStyle: {
            normal: {
              borderWidth: 5,
              borderColor: color[i]
            }
          }
        }, {
          value: total * 0.03,
          name: '',
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              color: 'rgba(0, 0, 0, 0)',
              borderColor: 'rgba(0, 0, 0, 0)',
              borderWidth: 0
            }
          }
        })
      }

      this.chart4.setOption({
        // title: {
        //   text: "车企性质分布",
        //   left: "center",
        //   align: "center",
        // },
        tooltip: {
          trigger: 'item'
          // formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        color: color,
        legend: {
          orient: 'horizontal',
          left: 'center',
          bottom: '0px',
          data: xAxis,
          formatter: (name) => {
            const data = pieData
            let target
            for (let i = 0, l = data.length; i < l; i++) {
              if (data[i].name === name) {
                target = data[i].value
              }
            }
            return '{a|' + name + '}{b|' + target + '家}'
          },
          textStyle: {
            rich: {
              a: {
                align: 'center',
                padding: [0, 30, 0, 0]
              },
              b: {
                align: 'center',
                padding: [0, 10, 0, 10]
              }
            }
          }
        },
        // color: ["#4f81bd", "#c0504d", "9bbb59", "8064a2"],

        series: [
          {
            // name: '面积模式',
            type: 'pie',
            radius: ['45%', '60%'],
            center: ['50%', '40%'],
            data: myPieData,
            label: {
              show: false
            }
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
      color: #353535;
      width: 100%;
      em {
        font-size: 14px;
        font-style: normal;
        color: #a1a1a1;
        margin-left: 5px;
        &.left-top {
          float: right;
          font-size: 22px;
          color: #3285ff;
          letter-spacing: 1px;
        }
      }
    }
  }
  .chart {
    height: 260px;
    .top {
      color: #ffffff;
      display: inline-block;
      width: 23px;
      text-align: center;
      border-radius: 5px;
    }
    .top1 {
      background: #64a3ff;
    }
    .top2 {
      background: #9cc5ff;
    }
    .top3 {
      background: #999999;
    }
  }
}
// .no2 .box-card {
//   height: 280px;
// }
.box-card {
  ::v-deep .el-card__header {
    border: none;
    padding: 18px 15px 5px;
  }
  ::v-deep .el-card__body {
    padding: 10px;
  }
  ::v-deep .el-table::before {
    height: 0;
  }
  ::v-deep .el-table td,
  .el-table th.is-leaf {
    border: none;
  }
  ::v-deep .el-table td {
    padding: 10px 0;
  }
  ::v-deep .el-table .el-table__header thead th {
    background-color: #f1f1f5;
  }
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
