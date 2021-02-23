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
          :normalizer="normalizer"
          :options="areaTree"
          :clearable="clearable"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="排放标准">
        <el-select
          v-model="formInline.dischargeStandard"
          placeholder="排放标准"
        >
          <el-option
            v-for="item in dischargeStandardArr"
            :key="item.enumCode"
            :label="item.enumName"
            :value="item.enumCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="离线时长">
        <el-select v-model="formInline.offlineTimeType" placeholder="离线时长">
          <el-option
            v-for="item in offlineTimeTypeArr"
            :key="item.enumCode"
            :label="item.enumName"
            :value="item.enumCode"
          />
        </el-select>
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
            <span>行政区长期离线车辆分布</span>
          </div>
          <div id="myChart1" class="chart" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>长期离线车辆排名TOP10</span>
          </div>
          <div id="myChart2" class="chart" />
        </el-card>
      </el-col>
    </el-row>
        <el-table
        :data="tableData"
        border
        row-key="id"
        highlight-current-row
        style="width: 100%; margin: 10px 0"
      >
        <el-table-column type="index" width="80" label="序号" show-overflow-tooltip/>
        <el-table-column prop="orgName" width="180" label="行政区" show-overflow-tooltip/>
        <el-table-column prop="vehicleTypeName" width="180" label="车辆类型" show-overflow-tooltip/>
        <el-table-column prop="companyName" label="车企名称" show-overflow-tooltip />
        <el-table-column prop="statusName" width="120" label="车辆当前状态" show-overflow-tooltip/>
        <el-table-column prop="plateNo" width="150" label="车牌号" show-overflow-tooltip/>
        <el-table-column prop="vin" width="150" label="车架号" show-overflow-tooltip/>
        <el-table-column prop="opsName" width="180" label="运维公司" show-overflow-tooltip/>
        <el-table-column prop="revTimeStr"  width="180" label="更新时间" show-overflow-tooltip/>
        <el-table-column prop="offlineTime" width="120" label="离线时长" show-overflow-tooltip/>
        <el-table-column prop="dischargeStandardName" width="150" label="排放标准" show-overflow-tooltip/>
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
import analysis from '@/api/data/analysis.js'
import resize from '@/views/archives/resize'
export default {
  components: {
    Treeselect
  },
   mixins: [resize],
  data() {
    return {
       hidePage: true,
      clearable:false,
      token:"",
      tableData: [],
      formInline: {
        orgId: [],
        dischargeStandard: '-1',
        offlineTimeType: '-1'
      },
      dischargeStandardArr: [],
      offlineTimeTypeArr: [],
      limit: 5,
      page: 1,
      total: 0,
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
      this.getDeviceConnectByOrg()
      this.getDeviceConnectByVehicleType()
      this.getDeviceConnectPage()
    },
    getBase() {
      enumPublic.getOrgTree({}).then((response) => {
        this.areaTree.push(response.data)
         this.formInline.orgId.push(response.data.orgId)
         this.loadTable()
      })
      enumPublic.enumPublic({ groupCode: 'EmissionType' }).then((response) => {
        const arr = [{ enumName: '全部', enumCode: '-1' }, ...response.data]
        this.dischargeStandardArr = arr
      })
      enumPublic.enumPublic({ groupCode: 'OfflineTimeType' }).then((response) => {
        const arr = [{ enumName: '全部', enumCode: '-1' }, ...response.data]
        this.offlineTimeTypeArr = arr
      })
    },
    async getDeviceConnectByOrg() {
      this.formInline.orgId = this.formInline.orgId.toString();
      await analysis
        .getDeviceConnectByOrg({
          orgId: this.formInline.orgId,
          dischargeStandard: this.formInline.dischargeStandard,
          offlineTimeType: this.formInline.offlineTimeType
        })
        .then((response) => {
          const { data } = response
          this.initChart(data.data, data.xAxis)
        })
    },
    async getDeviceConnectByVehicleType() {
      this.formInline.orgId = this.formInline.orgId.toString();
      await analysis
        .getDeviceConnectByVehicleType({
          orgId: this.formInline.orgId,
          dischargeStandard: this.formInline.dischargeStandard,
          offlineTimeType: this.formInline.offlineTimeType
        })
        .then((response) => {
          const { data } = response
          this.initChart2(data.data, data.xAxis)
        })
    },
    async getDeviceConnectPage() {
      this.formInline.orgId = this.formInline.orgId.toString();
      await analysis
        .getDeviceConnectPage({
          limit: this.limit,
          page: this.page,
          orgId: this.formInline.orgId,
          dischargeStandard: this.formInline.dischargeStandard,
          offlineTimeType: this.formInline.offlineTimeType
        })
        .then((response) => {
          const { data } = response
          this.tableData = data.data
          this.total = data.count
        })
    },
    handleCurrentChange(page) {
      this.page = page
      this.getDeviceConnectPage(
        this.limit,
        page
      )
        .then((response) => {
          const { data } = response
          this.tableData = data.data
          this.total = data.count
        })
        .catch((error) => error)
    },
    initChart(data, xAxis) {
      this.chart1 = echarts.init(document.getElementById('myChart1'))
      this.chart1.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        color:['#0279F5'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: data,
          type: 'bar',
          barWidth: '50%',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)'
          }
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
       color:['#0279F5'],
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
            name: '2012年',
            type: 'bar',
            barWidth: '50%',
            data: data.reverse()
          }
        ]
      })
    },
      //导出
    exportt(data) {
       window.location.href=process.env.VUE_APP_BASE_API+"api-obdMonitor/deviceConnectionAnalysis/getDeviceConnectExport?access_token="+this.token+
       "&orgId="+this.formInline.orgId+
       "&dischargeStandard="+this.formInline.dischargeStandard+
       "&offlineTimeType="+this.formInline.offlineTimeType
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

