<template>
  <div>
    <el-form
      :inline="true"
      :model="formInline"
      size="small"
      class="demo-form-inline"
    >
      <el-form-item id="modalAreaId" label="行政区">
        <treeselect
          v-model="formInline.modalAreaId"
          :multiple="false"
          :normalizer="normalizer"
          :options="areaTree"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="formInline.time"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyyMMdd"
          format="yyyy-MM-dd"
          style="width: 230px"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class=""
          size="small"
          type="success"
          icon="el-icon-search"
          @click="search()"
        >
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" style='padding-left:0'>
        <div class="box-card">
          <div
            class="card-panel no1"
            @click="handleSetLineChartData('newVisitis')"
          >
            <div class="card-panel-icon-wrapper icon-people">
              <i class="el-icon-bangzhu" />
            </div>
            <div class="card-panel-description">
              <count-to
                :start-val="0"
                :end-val="one"
                :duration="2600"
                class="card-panel-num"
              /><span>辆</span>
              <div class="card-panel-text">NOX排放超标</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="box-card">
          <div
            class="card-panel no2"
            @click="handleSetLineChartData('messages')"
          >
            <div class="card-panel-icon-wrapper icon-message">
              <i class="el-icon-stopwatch" />
            </div>
            <div class="card-panel-description">
              <count-to
                :start-val="0"
                :end-val="two"
                :duration="3000"
                class="card-panel-num"
              /><span>辆</span>
              <div class="card-panel-text">尿素液位过低</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-box">
          <div
            class="card-panel no3"
            @click="handleSetLineChartData('purchases')"
          >
            <div class="card-panel-icon-wrapper icon-money">
              <i class="el-icon-truck" />
            </div>
            <div class="card-panel-description">
              <count-to
                :start-val="0"
                :end-val="three"
                :duration="3200"
                class="card-panel-num"
              /><span>辆</span>
              <div class="card-panel-text">行驶超速</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" style='padding-right:0'>
        <div class="card-box">
          <div
            class="card-panel no4"
            @click="handleSetLineChartData('shoppings')"
          >
            <div class="card-panel-icon-wrapper icon-shopping">
              <i class="el-icon-circle-close" />
            </div>
            <div class="card-panel-description">
              <count-to
                :start-val="0"
                :end-val="four"
                :duration="3600"
                class="card-panel-num"
              /><span>辆</span>
              <div class="card-panel-text">进入限行区</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 10px">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>行政区车辆预警等级分布</span><span style='margin-left:5px;font-size:14px;color:#AAA1B6'>(单位:辆)</span>
          </div>
          <div id="myChart1" class="chart" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>车辆预警类型趋势</span><span style='margin-left:5px;font-size:14px;color:#AAA1B6'>(单位:辆)</span>
          </div>
          <div id="myChart2" class="chart" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>车辆预警等级趋势</span><span style='margin-left:5px;font-size:14px;color:#AAA1B6'>(单位:辆)</span>
          </div>
          <div id="myChart3" class="chart" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>车辆预警等级TOP10</span><span style='margin-left:5px;font-size:14px;color:#AAA1B6'>(单位:次)</span>
          </div>
          <div id="myChart4" class="chart" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import CountTo from 'vue-count-to'
import wran from '@/api/warn/wran.js'
import enumPublic from '@/api/enumPublic.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Moment from 'moment'
import resize from '@/views/archives/resize'
export default {
  components: {
    CountTo,
    Treeselect
  },
   mixins: [resize],
  data() {
    return {
       chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      colorList:["#FE0000", "#F45E23", "#FEEF00"],
      formInline: {
        time: [Moment().add(-1, 'y').format('YYYYMMDD'), Moment().format('YYYYMMDD')],
        modalAreaId: []
      },
      areaTree: [],
      normalizer(node) {
        return {
          id: node.orgId,
          label: node.orgName,
          children: node.childOrgs
        }
      },
      one: 0,
      two: 0,
      three: 0,
      four: 0
    }
  },
  mounted() {
    this.getOrgTree()
    this.$nextTick(() => {
      this.search()
    })
  },
  methods: {
    async getEarlyWarningCountByAlarmType(startDate, endDate, orgId) {
      await wran.getEarlyWarningCountByAlarmType({ orgId: orgId, startDate: startDate, endDate: endDate }).then((response) => {
        const { data } = response
        this.initChart2(data.legend, data.series, data.xAxis)
      })
    },
    async getEarlyWarningCountByLevel(startDate, endDate, orgId) {
      await wran.getEarlyWarningCountByLevel({ orgId: orgId, startDate: startDate, endDate: endDate }).then((response) => {
        const { data } = response
        this.initChart3(data.legend, data.series, data.xAxis)
      })
    },
    async getEarlyWarningCountByOrg(startDate, endDate, orgId) {
      await wran.getEarlyWarningCountByOrg({ orgId: orgId, startDate: startDate, endDate: endDate }).then((response) => {
        const { data } = response
        this.initChart(data.legend, data.series, data.xAxis)
      })
    },
    async getTopEarlyWarningCount(startDate, endDate, orgId) {
      await wran.getTopEarlyWarningCount({ orgId: orgId, startDate: startDate, endDate: endDate }).then((response) => {
        const { data } = response
        this.one = data.topValue[0].count
        this.two = data.topValue[1].count
        this.three = data.topValue[2].count
        this.four = data.topValue[3].count
      })
    },
    async getTopEarlyWarningCountByLevel(startDate, endDate, orgId) {
      await wran.getTopEarlyWarningCountByLevel({ orgId: orgId, startDate: startDate, endDate: endDate }).then((response) => {
        const { data } = response
        this.initChart4(data.legend, data.series, data.xAxis)
      })
    },
    search() {
      const startDate = this.formInline.time[0]; const endDate = this.formInline.time[1]; const orgId = this.formInline.modalAreaId[0]
      this.getEarlyWarningCountByAlarmType(startDate, endDate, orgId)
      this.getEarlyWarningCountByLevel(startDate, endDate, orgId)
      this.getEarlyWarningCountByOrg(startDate, endDate, orgId)
      this.getTopEarlyWarningCount(startDate, endDate, orgId)
      this.getTopEarlyWarningCountByLevel(startDate, endDate, orgId)
    },
    getOrgTree() {
      enumPublic.getOrgTree({}).then((response) => {
        this.areaTree.push(response.data)
         this.formInline.modalAreaId.push(response.data.orgId);
      })
    },
    initChart(legend, series, xAxis) {
      this.chart1 = echarts.init(
        document.getElementById('myChart1'))
      this.chart1.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color:this.colorList,
        legend: {
          data: legend
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top:"10%",
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xAxis
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: series
      })
    },
    initChart2(legend, series, xAxis) {
      this.chart2 = echarts.init(
        document.getElementById('myChart2'))
      this.chart2.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        color:this.colorList,
        legend: {
          data: legend
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
           top:"10%",
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xAxis
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: series
      })
    },
    initChart3(legend, series, xAxis) {
      this.chart3 = echarts.init(
        document.getElementById('myChart3'))
      this.chart3.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        color:this.colorList,
        legend: {
          data: legend
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
           top:"10%",
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xAxis
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: series
      })
    },
    initChart4(legend, series, xAxis) {
      this.chart4 = echarts.init(
        document.getElementById('myChart4'))
      this.chart4.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color:this.colorList,
        legend: {
          data: legend
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
           top:"10%",
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: xAxis
        },
        series: series
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.card-panel-icon-wrapper i {
  font-size: 50px;
}
.panel-group {
  margin-left: 0px !important;
  margin-right: 0px !important;

  .card-detail {
    display: flex;
    cursor: pointer;
    height: 30px;
    line-height: 30px;
    color: #fff;
    background: #2a92d9;
    box-shadow: 0px -7px 4px 0px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    border-radius: 0 0 5px 5px;
    font-size: 15px;
    padding: 0 15px;
    align-items: center;
    justify-content: space-between;

    &.no1 {
      background: #2a92d9;
    }
    &.no2 {
      background: #e6434e;
    }
    &.no3 {
      background: #2dbcc8;
    }
    &.no4 {
      background: #8640a3;
    }
  }

  .card-panel-col {
    margin-bottom: 15px;
    .box-card {
      -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #ffffff;
    background: #3598dc;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    border-radius: 5px;

    &.no1 {
      background: #3598dc;
      .card-panel-icon {
        font-size: 65px;
      }
    }
    &.no2 {
      background: #e7505a;
      .card-panel-icon {
        font-size: 58px;
      }
    }
    &.no3 {
      background: #32c5d2;
      .card-panel-icon {
        font-size: 65px;
      }
    }
    &.no4 {
      background: #8e44ad;
      .card-panel-icon {
        font-size: 62px;
      }
    }
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        // background: #b4dbf0;
      }

      .icon-message {
        // background: #ecb7b9;
      }

      .icon-money {
        // background: #abf0ee;
      }

      .icon-shopping {
        // background:#de79cd;
      }
    }

    .icon-people {
      color: #82d2fd;
    }

    .icon-message {
      color: #ff9094;
    }

    .icon-money {
      color: #7dece9;
    }

    .icon-shopping {
      color: #f2e6f0;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 13px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 60px;
    }

    .card-panel-description {
      float: right;

      margin: 26px;
      margin-left: 0px;
      text-align: end;

      .card-panel-text {
        line-height: 16px;
        color: #fff;
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        display: inline-block;
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 3px;
        height: 40px;
        line-height: 40px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}

.chart {
  height: 230px;
  width: 100%;
}
.el-form-item {
  margin-bottom: 10px;
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
</style>
