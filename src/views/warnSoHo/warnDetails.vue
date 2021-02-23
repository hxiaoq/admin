<template>
  <div>
    <el-form
      :inline="true"
      :model="formInline"
      size="small"
      class="demo-form-inline"
      id="topForm"
    >
      <el-form-item id="modalAreaId" label="行政区" label-width="100px">
        <treeselect
          v-model="formInline.orgId"
          :multiple="false"
          :normalizer="normalizer"
          :options="areaTree"
           :clearable="clearable"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="车企名称" label-width="100px">
        <el-input v-model="formInline.companyName" placeholder="车企名称" />
      </el-form-item>
      <el-form-item label="车牌号" label-width="100px">
        <el-input v-model="formInline.plateNo" placeholder="车牌号" />
      </el-form-item>

      <el-form-item label="预警类型" label-width="100px">
        <el-select
          v-model="formInline.alarmType"
          placeholder="预警类型"
          style="width: 171px"
        >
          <el-option
            v-for="item in warnType"
            :key="item.enumCode"
            :label="item.enumName"
            :value="item.enumCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="运维公司" label-width="100px">
      
          <treeselect
                v-model="formInline.opsId"
                placeholder="请选择"
                :multiple="false"
                :options="OperaTree"
              />
      </el-form-item>
      <el-form-item label="预警等级" label-width="100px">
        <el-select
          v-model="formInline.level"
          placeholder="预警等级"
          style="width: 171px"
        >
          <el-option
            v-for="item in wranLevel"
            :key="item.enumCode"
            :label="item.enumName"
            :value="item.enumCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="预警发生时间" label-width="100px">
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
      <el-form-item style="float:right">
        <el-button
          class=""
          size="small"
          type="success"
          icon="el-icon-search"
          @click="getAnalysisList"
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
      v-loading="listLoading"
      :data="tableData"
      border
      fit
       class="auth-table"
      ref="tableDiv"
      highlight-current-row
      style="width: 100%; margin-bottom: 10px"
      :cell-style="cellStyle"
    >
      <el-table-column type="index"  label="序号" width="80" />
      <el-table-column
        prop="orgName"
        show-overflow-tooltip
        label="行政区"
        width="120"
      />
      <el-table-column
        prop="plateNo"
        show-overflow-tooltip
        label="车牌号码"
        width="100"
      />
      <el-table-column
        prop="opsName"
        show-overflow-tooltip
        label="运维公司"
        width="100"
      />
      <el-table-column
        prop="alarmTypeName"
        show-overflow-tooltip
        label="预警类型"
        width="120"
      />
      <el-table-column
        prop="beginTimeStr"
        show-overflow-tooltip
        label="预警发生时间"
        width="180"
      />
      <el-table-column
        prop="endTimeStr"
        show-overflow-tooltip
        label="预警结束时间"
        width="180"
      />
      <el-table-column
        prop="exceptionTime"
        show-overflow-tooltip
        label="预警时长"
        width="80"
      />
      <el-table-column prop="dataInfo" show-overflow-tooltip label="预警简述" />
      <el-table-column
        prop="levelName"
        show-overflow-tooltip
        label="预警等级"
        width="100"
      />
      <el-table-column label="操作" width="300"  header-align="left"
        align="right">
        <template slot-scope="scope">
          <div>
              <el-button size="mini" type="primary" @click="openDialog(scope.row)">
            预警详情
          </el-button>
            <el-button size="mini" type="primary" @click="goDetail(scope.row)">
              轨迹回放
            </el-button>
            <el-button size="mini" type="primary" @click="goHistory(scope.row)">
              历史数据
            </el-button>
          </div>
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
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import echarts from 'echarts'
require('echarts/theme/macarons')
import wran from '@/api/warn/warnCarCompany.js'
import enumPublic from '@/api/enumPublic.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Moment from 'moment'
export default {
  components: {
    Treeselect
  },
  props: ['apprefs'],
  data() {
    return {
       hidePage: true,
      clearable:false,
      token:"",
      formInline: {
        alarmType: '-1',
        companyName: '',
        endDate: '',
        level: '-1',
        time: [
          this.$route.query.startDate || Moment().add(-1, 'y').format('YYYYMMDD'),
          this.$route.query.startDate || Moment().format('YYYYMMDD')
        ],
        orgId: [],
        opsId: '-1',
        plateNo: this.$route.query.plateNo || '',
        startDate: ''
      },
      limit: 5,
      page: 1,
      total: 0,
      areaTree: [],
      tableData: [],
      gridData: [],
      normalizer(node) {
        return {
          id: node.orgId,
          label: node.orgName,
          children: node.childOrgs
        }
      },
      warnType: [],
      wranLevel: [],
      OperaTree: [],

      listLoading: false
    }
  },
  mounted() {
    this.token =getToken();
    console.log(document.documentElement.clientHeight)
    console.log(this.$refs.tableDiv.$el.getBoundingClientRect().top)
    this.limit = Math.floor(
      (document.documentElement.clientHeight -
        this.$refs.tableDiv.$el.getBoundingClientRect().top -
        93) /
        37
    );
    this.getBase()
    
  },
  methods: {
    getBase() {
      enumPublic.getOrgTree({}).then((response) => {
         this.formInline.orgId.push(response.data.orgId)
        this.areaTree.push(response.data)
        this.getAnalysisList()
      })
      enumPublic
        .enumPublic({ groupCode: 'EarlyWarningType' })
        .then((response) => {
          const arr1 = [{ enumName: '全部', enumCode: '-1' }, ...response.data]
          this.warnType = arr1
        })
      enumPublic
        .enumPublic({ groupCode: 'EarlyWarningLevel' })
        .then((response) => {
          const arr1 = [{ enumName: '全部', enumCode: '-1' }, ...response.data]
          this.wranLevel = arr1
        })
      enumPublic.getManageOperaTree({}).then((response) => {
        const arr1 = [{ label: '全部', id: '-1' }, ...response.data]
        this.OperaTree = arr1
      })
    },

    async getAnalysisList() {
      this.formInline.orgId = this.formInline.orgId.toString();
      this.formInline.opsId = this.formInline.opsId.toString();
      await wran
        .getAnalysisList({
          limit: this.limit,
          page: this.page,
          alarmType: this.formInline.alarmType,
          companyName: this.formInline.companyName,
          endDate: this.formInline.time[1],
          level: this.formInline.level,
          opsId: this.formInline.opsId,
          orgId: this.formInline.orgId,
          plateNo: this.formInline.plateNo,
          startDate: this.formInline.time[0],
        })
        .then((response) => {
          const { data } = response
          this.tableData = data.data
          this.total = data.count
          this.listLoading = false
        })
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      this.getAnalysisList(
        this.limit, page
      )
    },
    openDialog(data) {
      this.$router.push({
        path: '/warnCarSoHo/warnDetailsPage',
        query: { data }
      })
    },
    // 跳转数据
    goDetail(data) {
      this.$router.push({
        path: '/gisCarCompany/map',
        query: { objId: data.id, plateNo: data.plateNo }
      })
    },
    goHistory(data) {
      this.$router.push({
        path: '/dynamicMonitorCarCompany/historyData',
        query: { companyName: data.companyName, orgId: data.orgId, plateNo: data.plateNo }
      })
    },
       //导出
    exportt(data) {
       window.location.href=process.env.VUE_APP_BASE_API+"api-obdMonitor/earlyWarningEnt/exportEarlyWarning?access_token="+this.token+
       "&alarmType="+this.formInline.alarmType+
       "&companyName="+this.formInline.companyName+
       "&endDate="+this.formInline.time[0]+
       "&level="+this.formInline.level+
       "&opsId="+this.formInline.opsId+
       "&orgId="+this.formInline.orgId+
       "&plateNo="+this.formInline.plateNo+
       "&startDate="+this.formInline.time[0]
     
    },
     cellStyle(row) {
      if (row.column.property === "levelName") {
        if (row.row.level == 1) {
          return "color:#FF0000;";
        } else if (row.row.level == 2) {
          return "color:#CC6600;";
        }else if (row.row.level == 3) {
          return "color:#FFCC33;";
        }
      }
    },
  }
}
</script>

<style lang='scss' scoped>
::v-deep .vue-treeselect {
  width: 171px !important;
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
#topForm {
    .el-form-item {
      margin-bottom: 10px;
    }
}

.auth-table {
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 5px 10px;
  }
}

</style>
