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
          :clearable="clearable"
          size="small"
          :normalizer="normalizer"
          :options="areaTree"
          placeholder="请选择"
        />
      </el-form-item>

      <el-form-item label="车辆类型">
        <el-select v-model="formInline.vehicleType" placeholder="车辆类型">
          <el-option
            v-for="item in vehicleTypeArr"
            :key="item.enumCode"
            :label="item.enumName"
            :value="item.enumCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="formInline.time"
          style="width: 230px"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyyMMdd"
          format="yyyy-MM-dd"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item style='float:right'>
        <el-button
          class=""
          size="small"
          type="success"
          icon="el-icon-search"
          @click="loadTable"
        >
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
            <span>每日NOX排放情况</span>
          </div>
          <div id="myChart1" class="chart" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>行政区NOX排名</span>
          </div>
          <div id="myChart2" class="chart" />
        </el-card>
      </el-col>
    </el-row>
      <el-table
        :data="tableData"
        border
        fit
        row-key="id"
        highlight-current-row
        style="width: 100%; margin: 10px 0"
      >
        <el-table-column type="index" label="序号" width="80"/>
        <el-table-column prop="vehicleTypeName" label="车辆类型"  show-overflow-tooltip/>
        <el-table-column prop="companyName" label="车企名称"  show-overflow-tooltip/>
        <el-table-column prop="plateNo" label="车牌号"  show-overflow-tooltip/>
        <el-table-column prop="dischargeStandardName" label="排放标准"  show-overflow-tooltip/>
        <el-table-column prop="startDateStr" label="开始时间"  show-overflow-tooltip/>
        <el-table-column prop="endDateStr" label="结束时间"  show-overflow-tooltip/>
        <el-table-column label="NOX排放量" align="center">
          <el-table-column
            v-for="(item, index) in tableLabel"
            :key="index"
            :min-width="item.width"
            :label="item.label"
            :prop="item.prop"
            show-overflow-tooltip
          />
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
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import echarts from 'echarts'
import enumPublic from '@/api/enumPublic.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Moment from 'moment'
import analysis from '@/api/data/analysis.js'
import resize from '@/views/archives/resize'
export default {
   mixins: [resize],
  components: {
    Treeselect
  },
  data() {
    return {
      hidePage: true,
      clearable:false,
      token:"",
      formInline: {
        time: [
          Moment().add(-1, 'months').format('YYYYMMDD'),
          Moment().format('YYYYMMDD')
        ],
        orgId: [],
        vehicleType: '-1'
      },
      vehicleTypeArr: [],
      tableLabel: [],
      limit: 5,
      page: 1,
      total: 0,
      tableData: [],
      areaTree: [],
      normalizer(node) {
        return {
          id: node.orgId,
          label: node.orgName,
          children: node.childOrgs
        }
      }
    }
  },
  mounted() {
    this.token =getToken();
    this.getBase()
  },
  methods: {
    loadTable() {
      this.formInline.orgId = this.formInline.orgId.toString();
      this.getNOXLetOutDaily()
      this.getNOXLetOutByOrg()
      this.getNOXLetOutList()
    },
    getBase() {
      enumPublic.getOrgTree({}).then((response) => {
        this.formInline.orgId.push(response.data.orgId)
        this.areaTree.push(response.data)
         this.loadTable()
      })
      enumPublic.enumPublic({ groupCode: 'VehicleType' }).then((response) => {
        const arr = [{ enumName: '全部', enumCode: '-1' }, ...response.data]
        this.vehicleTypeArr = arr
      })
    },
    async getNOXLetOutDaily() {
      await analysis
        .getNOXLetOutDaily({
          orgId: this.formInline.orgId,
          startDate: this.formInline.time[0],
          endDate: this.formInline.time[1],
          vehicleType: this.formInline.vehicleType
        })
        .then((response) => {
          const { data } = response
          this.initChart(data.data, data.xAxis)
        })
    },
    async getNOXLetOutByOrg() {
      await analysis
        .getNOXLetOutByOrg({
          orgId: this.formInline.orgId,
          startDate: this.formInline.time[0],
          endDate: this.formInline.time[1],
          vehicleType: this.formInline.vehicleType
        })
        .then((response) => {
          const { data } = response
          this.initChart2(data.data, data.xAxis)
        })
    },
    async getNOXLetOutList() {
      this.formInline.orgId = this.formInline.orgId.toString();
      await analysis
        .getNOXLetOutList({
          limit: this.limit,
          page: this.page,
          orgId: this.formInline.orgId,
          startDate: this.formInline.time[0],
          endDate: this.formInline.time[1],
          vehicleType: this.formInline.vehicleType
        })
        .then((response) => {
          const { data } = response
          this.tableData = data.data
          this.tableLabel = data.tableLabel
          this.total = data.count
        })
    },
    handleCurrentChange(page) {
      this.page = page
      this.getNOXLetOutList(
        this.limit,
        page
      )
        .then((response) => {
          const { data } = response
          this.tableData = data.data
          this.total = data.count
          this.tableLabel = data.tableLabel
        })
        .catch((error) => error)
    },
    initChart(data, xAxis) {
      this.chart1 = echarts.init(document.getElementById('myChart1'))
      this.chart1.setOption({
        tooltip: {
          trigger: 'axis',
        },
        color:['#FFE793'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: data,
          type: 'line',
          areaStyle: {}
        }]
      })
    },
    initChart2(data, yAxis) {
      this.chart2 = echarts.init(document.getElementById('myChart2'))
      this.chart2.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        color:['#FFE793'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: yAxis.reverse(),
          name: '单位:(h)'
        },
        series: [
          {
            // name: '2012年',
            type: 'bar',
            barWidth: '50%',
            data: data.reverse()
          }
        ]
      })
    },
      //导出
    exportt(data) {
       window.location.href=process.env.VUE_APP_BASE_API+"api-obdMonitor/noxLetOutAnalysis/getNOXLetOutExport?access_token="+this.token+
       "&orgId="+this.formInline.orgId+
       "&startDate="+this.formInline.time[0]+
       "&endDate="+this.formInline.time[1]+
       "&vehicleType="+this.formInline.vehicleType
    },
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
