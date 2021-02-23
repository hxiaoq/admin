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
          v-model="formInline.orgId"
          :multiple="false"
          size="small"
           :clearable="clearable"
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
           :picker-options="pickerOptions"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item style='float:right'>
        <el-button type="success" icon="el-icon-search" @click="loadTable()">
          查询
        </el-button>
        <el-button
          class="filter-item"
          size="small"
          style="margin-left: 10px"
           type="primary"
          icon="el-icon-download"
          @click="exportt"
        >
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>行政区预警次数排名</span>
          </div>
          <div id="myChart1" class="chart" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>行政区预警时长排名</span>
          </div>
          <div id="myChart2" class="chart" /> </el-card
      ></el-col>
    </el-row>
    <el-row>
      <el-table
        ref="tableDiv"
        class="auth-table"
        :data="tableData"
        style="width: 100%; margin: 10px 0"
        border
      >
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column
          v-for="(item, index) in tableLabel"
          :key="index"
          :min-width="item.width"
          :label="item.label"
          :prop="item.prop"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button
              v-if="item.prop === 'warningCount'"
              type="text"
              size="mini"
              @click="goDetail(scope.row)"
              v-html="scope.row[item.prop]"
            />
            <span v-else v-html="scope.row[item.prop]" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :page-size="limit"
        :hide-on-single-page="hidePage"
        @current-change="handleCurrentChange"
      />
    </el-row>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import echarts from 'echarts'
import enumPublic from '@/api/enumPublic.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Moment from 'moment'
import analysis from '@/api/data/analysisYW.js'
import resize from '@/views/archives/resize'
export default {
  components: {
    Treeselect
  },
    mixins: [resize],
  data() {
    return {
      token:"",
       hidePage: true,
      clearable:false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      formInline: {
        time: [
          Moment().add(-1, 'months').format('YYYYMMDD'),
          Moment().add(-1, 'day').format('YYYYMMDD')
        ],
        orgId: []
      },
      areaTree: [],
      normalizer(node) {
        return {
          id: node.orgId,
          label: node.orgName,
          children: node.childOrgs
        }
      },
      tableData: [],
      // 子组件的表头数据
      tableLabel: [
        { label: '行政区', width: '', prop: 'orgName' },
        { label: '车企名称', width: '', prop: 'companyName' },
        { label: '车牌号', width: '', prop: 'plateNo' },
        { label: '运维公司', width: '', prop: 'opsName' },
        { label: '开始时间', width: '', prop: 'beginTimeStr' },
        { label: '结束时间', width: '', prop: 'endTimeStr' },
        { label: '预警次数', width: '', prop: 'warningCount' },
        { label: '预警时长', width: '', prop: 'exceptionTime' }
      ],
      limit: 5,
      page: 1,
      total: 0
    }
  },
  mounted() {
    this.token =getToken();
    this.getBase()
  },
  methods: {
    loadTable() {
      this.getChartData()
      this.getEarlyWarningTimesPageByCar(this.limit, this.page)
    },
    getBase() {
      enumPublic.getOrgTree({}).then((response) => {
         this.formInline.orgId.push(response.data.orgId);
        this.areaTree.push(response.data)
         this.loadTable()
      })
    },
    getChartData() {
      this.getCarEarlyWarningCountByOrg()
      this.getCarEarlyWarningTimesByOrg()
    },
    async getCarEarlyWarningCountByOrg() {
      this.formInline.orgId = this.formInline.orgId.toString();
      await analysis
        .getCarEarlyWarningCountByOrg({
          orgId: this.formInline.orgId,
          startDate: this.formInline.time[0],
          endDate: this.formInline.time[1]
        })
        .then((response) => {
          const { data } = response
          this.initChart(data.data, data.xAxis)
        })
    },
    async getCarEarlyWarningTimesByOrg() {
      this.formInline.orgId = this.formInline.orgId.toString();
      await analysis
        .getCarEarlyWarningTimesByOrg({
          orgId: this.formInline.orgId,
          startDate: this.formInline.time[0],
          endDate: this.formInline.time[1]
        })
        .then((response) => {
          const { data } = response
          this.initChart2(data.data, data.xAxis)
        })
    },
    async getEarlyWarningTimesPageByCar(limit, page) {
      this.formInline.orgId = this.formInline.orgId.toString();
      await analysis
        .getEarlyWarningTimesPageByCar({
          limit: limit,
          page: page,
          orgId: this.formInline.orgId,
          startDate: this.formInline.time[0],
          endDate: this.formInline.time[1]
        })
        .then((response) => {
          const { data } = response
          this.tableData = data.data
          this.total = data.count
        })
    },
       //导出
    exportt(data) {
       window.location.href=process.env.VUE_APP_BASE_API+"api-obdMonitor/carEarlyWarningCountOper/getEarlyWarningTimesByCar?access_token="+this.token+
       "&endDate="+this.formInline.time[0]+
       "&orgId="+this.formInline.orgId+
       "&startDate="+this.formInline.time[0]
    },
    goDetail(data) {
      this.$router.push({
        path: '/warnYW/warnDetails',
        query: { startDate: this.formInline.time[0], endDate: this.formInline.time[1], plateNo: data.plateNo }
      })
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      this.getEarlyWarningTimesPageByCar(
        this.limit,
        page
      )
        .then((response) => {
          const { data } = response
          this.tableData = data.data
          this.total = data.count
          this.listLoading = false
        })
        .catch((error) => error)
    },
    initChart(data, xAxis) {
      debugger
      this.chart1 = echarts.init(
        document.getElementById('myChart1')
      )
      this.chart1.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        // legend: {
        //     data: ['2011年', '2012年']
        // },
        color:['#F45E23'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top:'15%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: xAxis.reverse(),
          name: '单位:(次)'
        },
        series: [
          {
            // name: "2012年",
            type: 'bar',
            barWidth: '50%',
            data: data.reverse()
          }
        ]
      })
    },
    initChart2(data, xAxis) {
      this.chart2 = echarts.init(
        document.getElementById('myChart2')
      )
      this.chart2.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        // legend: {
        //     data: ['2011年', '2012年']
        // },
        color:['#F45E23'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top:'15%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: xAxis.reverse(),
          name: '单位:(h)'
        },
        series: [
          {
            name: '2012年',
            type: 'bar',
            barWidth: '50%',
            data: data.reverse()
          }
        ]
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.chart {
  height: 300px;
  width: 100%;
}
.el-form-item {
  margin-bottom: 10px;
}
.vue-treeselect {
  width: 200px !important;
}
.el-form-item--small .el-form-item__content,
.el-form-item--small .el-form-item__label {
  line-height: 30px;
}
.vue-treeselect__control {
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
