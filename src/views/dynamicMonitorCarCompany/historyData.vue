<template>
  <div>
    <el-form
      id="topForm"
      :inline="true"
      :model="ruleForm"
      size="small"
      class="demo-form-inline"
    >
      <el-form-item id="modalAreaId" label="行政区">
        <treeselect
          v-model="ruleForm.orgId"
          :multiple="false"
          :clearable="clearable"
          :normalizer="normalizer"
          :options="areaTree"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="车企名称">
        <el-input v-model="ruleForm.companyName" placeholder="请输入车企名称" />
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input v-model="ruleForm.plateNo" placeholder="请输入车牌号" />
      </el-form-item>
      <el-form-item label="设备运维公司">
         <treeselect
                v-model="ruleForm.opsId"
                placeholder="请选择"
                :multiple="false"
                :options="OperaTree"
              />
      </el-form-item>

      <el-form-item>
        <el-button
          class=""
          size="small"
          type="success"
          icon="el-icon-search"
          @click="getCarHistoryList(5, 1)"
        >
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="tableDiv"
      class="auth-table"
      :data="tableData"
      :cell-style="cellStyle"
      style="width: 100%; margin: 10px 0"
      border
       @cell-click="cellClick"
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
          <a v-if="item.prop === 'carCode'" v-html="scope.row[item.prop]" />
          <span v-else v-html="scope.row[item.prop]" />
        </template>
      </el-table-column>
      <el-table-column
        label="监测数据"
        width="320"
        header-align="left"
        align="right"
      >
        <template slot-scope="scope">
          <el-button round size="mini" @click="goDetail('second', scope.row)"
            >实时</el-button
          >
          <el-button size="mini" round @click="goDetail('hour', scope.row)"
            >小时</el-button
          >
          <el-button size="mini" round @click="goDetail('day', scope.row)"
            >日</el-button
          >
          <el-button size="mini" round @click="goDetail('month', scope.row)"
            >月</el-button
          >
          <el-button size="mini" round @click="goDetail('year', scope.row)"
            >年</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="total"
      :page-size="limit"
      :hide-on-single-page= "hidePage"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import enumPublic from '@/api/enumPublic.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import monitor from '@/api/dynamicMonitorCarCompany/monitor.js'
export default {
  components: {
    Treeselect
  },
  data() {
    return {
      clearable:false,
       hidePage: true,
      tableData: [],
      // 子组件的表头数据
      tableLabel: [
        { label: '行政区', width: '', prop: 'orgName' },
        { label: '车企名称', width: '', prop: 'companyName' },
        { label: '车牌号', width: '', prop: 'plateNo' },
        { label: '车架号', width: '', prop: 'vin' },
        { label: '排放标准', width: '', prop: 'dischargeStandardName' },
        { label: '设备编码', width: '', prop: 'code' },
        { label: '设备运维公司', width: '', prop: 'opsName' }
      ],
      limit: 5,
      page: 1,
      total: 0,
      ruleForm: {
        companyName: this.$route.query.companyName || '',
        orgId: [],
        plateNo: this.$route.query.plateNo || '',
        opsId: []
      },
      areaTree: [],
      normalizer(node) {
        return {
          id: node.orgId,
          label: node.orgName,
          children: node.childOrgs
        }
      },
      OperaTree: []
    }
  },
  mounted() {
      this.limit = Math.floor(
      (document.documentElement.clientHeight -
        this.$refs.tableDiv.$el.getBoundingClientRect().top -
        93) /
        38
    );
    this.getOrgTree()
    
  },
  methods: {
    getOrgTree() {
      enumPublic.getOrgTree({}).then((response) => {
        this.areaTree.push(response.data);
        this.ruleForm.orgId.push(response.data.orgId);
      enumPublic.getManageOperaTree({}).then((response) => {
        this.OperaTree = response.data
        this.ruleForm.opsId.push(response.data[0].id);
        this.getCarHistoryList(this.limit, this.page)
      })
      })
     
    },
   getCarHistoryList(limit, page) {
      var that = this
      this.ruleForm.orgId = this.ruleForm.orgId.toString();
      this.ruleForm.opsId= this.ruleForm.opsId.toString();
      monitor
        .getCarHistoryList({
          limit: limit,
          page: page,
          companyName: this.ruleForm.companyName,
          plateNo: this.ruleForm.plateNo,
          opsId: this.ruleForm.opsId,
          orgId: this.ruleForm.orgId
        })
        .then((response) => {
          const { data } = response
          this.tableData = data.data
          this.total = data.count
        })
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      this.getCarHistoryList(this.limit, page)
        .then((response) => {
          const { data } = response
          this.tableData = data.data
          this.total = data.count
          this.listLoading = false
        })
        .catch((error) => error)
    },
    go(row, column, cell, event) {
      if (column.property === 'carCode') {
        console.log(row)
      } else {
        return
      }
    },
    cellStyle(column) {
      if (column.columnIndex === 3) {
        return "color:#409EFF;cursor:pointer"
      }
    },
    cellClick(row, column, cell, event){
         if (column.property === "plateNo") {
          this.$router.push({
            path: "/archivesCarCompany/carArchivesInfo",
            query: { objId: row.id },
          });
      } else {
        return;
      }
    },
    // 跳转数据
    goDetail(type, data) {
      this.$router.push({
        path: '/dynamicMonitorCarCompany/historyDataDetail',
        query: { dataType: type, id: data.id, plateNo: data.plateNo }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.line {
  line-height: 40px;
  text-align: center;
}
#topForm .el-form-item {
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
</style>

