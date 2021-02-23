<template>
  <div>
    <el-form
      :inline="true"
      :model="formInline"
      size="small"
      id="topForm"
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
      <el-form-item label="车牌号">
        <el-input v-model="formInline.plateNo" placeholder="车牌号" />
      </el-form-item>

      <el-form-item label="OBD故障类型">
        <el-select v-model="formInline.faultCode" placeholder="OBD故障类型">
          <el-option
            v-for="item in faultArr"
            :key="item.enumCode"
            :label="item.enumName"
            :value="item.enumCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备编码">
        <el-input v-model="formInline.deviceCode" placeholder="设备编码" />
      </el-form-item>
      <el-form-item label="运维公司">
         <treeselect
          v-model="formInline.opsId"
          :multiple="false"
          size="small"
          :options="OperaTree"
          :clearable="clearable"
          placeholder="请选择"
        />

      </el-form-item>
      <el-form-item label="故障发生时间">
        <el-date-picker
          v-model="formInline.dateTime"
          style="width: 140px"
          type="date"
          placeholder="选择日期"
          value-format="yyyyMMdd"
          format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item style='float:right'>
        <el-button
          class=""
          size="small"
          type="success"
          icon="el-icon-search"
          @click="getOBDFaultAnalysisPage"
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
    <el-table
      :data="tableData"
      border
      fit
      ref="tableDiv"
      row-key="id"
      highlight-current-row
      style="width: 100%; margin: 10px 0"
    >
      <el-table-column type="index" label="序号" width="80" show-overflow-tooltip/>
      <el-table-column prop="orgName" label="行政区" width="120" show-overflow-tooltip />
      <el-table-column prop="companyName" label="车企名称"  show-overflow-tooltip />
      <el-table-column prop="plateNo" label="车牌号码" width="120" show-overflow-tooltip/>
      <el-table-column prop="carAddress" label="故障发生位置" width="180" show-overflow-tooltip/>
      <el-table-column prop="deviceCode" label="设备编码" width="150" show-overflow-tooltip/>
      <el-table-column prop="opsName" label="运维公司" width="180" show-overflow-tooltip/>
      <el-table-column prop="faultCode" label="OBD故障码" width="120" show-overflow-tooltip/>
      <el-table-column prop="faultCodeName" label="OBD故障类型" width="120" show-overflow-tooltip/>
      <el-table-column prop="happenTimeStr" label="故障发生时间" width="150" show-overflow-tooltip/>
      <el-table-column prop="endTimeStr" label="故障结束时间" width="150" show-overflow-tooltip/>
      <el-table-column prop="exceptionTime" label="故障时长" width="120" show-overflow-tooltip/>
      <el-table-column prop="faultDesc" label="故障描述" width="180" show-overflow-tooltip/>
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
import enumPublic from '@/api/enumPublic.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Moment from 'moment'
import analysis from '@/api/data/analysis.js'
export default {
  components: {
    Treeselect
  },
  data() {
    return {
      clearable:false,
      token:"",
      hidePage: true,
      formInline: {
        dateTime: Moment().add(-1, 'd').format('YYYYMMDD'),
        deviceCode: '',
        faultCode: '-1',
        opsId: ["-1"],
        orgId: [],
        plateNo: ''
      },
      limit: 5,
      page: 1,
      total: 0,
      tableData: [],
      areaTree: [],
      OperaTree: [],
      faultArr: [],
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
     this.limit = Math.floor(
      (document.documentElement.clientHeight -
        this.$refs.tableDiv.$el.getBoundingClientRect().top -
        93) /
        41
    );
    this.getBase()
   
  },
  methods: {
    getBase() {
      enumPublic.getOrgTree({}).then((response) => {
        this.formInline.orgId.push(response.data.orgId);
        this.areaTree.push(response.data)
         this.getOBDFaultAnalysisPage()
      })
      enumPublic.getManageOperaTree({}).then((response) => {
        const arr1 = [{ label: '全部', id: '-1' }, ...response.data]
        this.OperaTree = arr1
      })
      enumPublic.enumPublic({ groupCode: 'ObdFaultType' }).then((response) => {
        const arr = [{ enumName: '全部', enumCode: '-1' }, ...response.data]
        this.faultArr = arr
      })
    },
    async getOBDFaultAnalysisPage() {
      this.formInline.orgId = this.formInline.orgId.toString();
      this.formInline.opsId = this.formInline.opsId.toString();
      await analysis
        .getOBDFaultAnalysisPage({
          limit: this.limit,
          page: this.page,
          orgId: this.formInline.orgId,
          dateTime: this.formInline.dateTime,
          deviceCode: this.formInline.deviceCode,
          faultCode: this.formInline.faultCode,
          opsId: this.formInline.opsId,
          plateNo: this.formInline.plateNo
        })
        .then((response) => {
          const { data } = response
          this.tableData = data.data
          this.total = data.count
        })
    },
    handleCurrentChange(page) {
      this.page = page
      this.getOBDFaultAnalysisPage(
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
     //导出
    exportt(data) {
       window.location.href=process.env.VUE_APP_BASE_API+"api-obdMonitor/obdMalfunctionAnalysis/getOBDFaultAnalysisExport?access_token="+this.token+
       "&orgId="+this.formInline.orgId+
       "&dateTime="+this.formInline.dateTime+
       "&deviceCode="+this.formInline.deviceCode+
       "&faultCode="+this.formInline.faultCode+
       "&opsId="+this.formInline.opsId+
       "&plateNo="+this.formInline.plateNo
    },
  }
}
</script>
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
#topForm {
  height: 32px;
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
