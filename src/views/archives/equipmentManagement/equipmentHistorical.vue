<template>
  <div>
    <el-form :inline="true" :model="tableQuery" class="demo-form-inline" id="topForm">
      <el-form-item label="OBD厂商">
          <el-select v-model="tableQuery.factory" placeholder="请选择">
          <el-option
            v-for="item in ObdFactoryTypeList"
            :key="item.enumCode"
            :label="item.enumName"
            :value="item.enumCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备编码">
        <el-input v-model="tableQuery.code" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input v-model="tableQuery.plateNo" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="设备运维公司">
        <treeselect
                v-model="tableQuery.opsId"
                placeholder="请选择"
                :multiple="false"
                :options="OperaTree"
              />
      </el-form-item>
      <el-form-item style='float:right'>
        <el-button
          class=""
          size="small"
          type="success"
          icon="el-icon-search"
          @click="getTableList()"
        >
          查询
        </el-button>
        <el-button
          class="filter-item"
          size="small"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-download"
           @click="exportt()"
        >
          导出
        </el-button>
      </el-form-item>
    </el-form>
         <el-table
      ref="tableDiv"
      class="auth-table"
      :data="tableData"
      style="width: 100%; margin: 20px 0"
      border
      :cell-style="cellStyle"
      @cell-click="cellClick"
      >
       <el-table-column
       type='index'
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="factoryName"
        label="OBD厂商"
        min-width="150"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="code"
        min-width="120"
        label="OBD设备编码"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="opsName"
        min-width="120"
        label="OBD设备运维公司"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="plateNo"
        min-width="120"
        label="绑定车牌号"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="vin"
        min-width="120"
        label="绑定车架号"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="operateAtStr"
        min-width="120"
        label="操作时间"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="operateBy："
        min-width="80"
        label="操作人"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="dataInfo"
        min-width="200"
        label="备注"
        show-overflow-tooltip
        >
         <template slot-scope="scope">
           <div v-html="scope.row.dataInfo"></div>
        </template>
      </el-table-column>
         </el-table>
      <el-pagination
      background
      layout="total, prev, pager, next"
      :hide-on-single-page="hidePage"
      :total="total"
      :page-size="tableQuery.limit"
      @current-change="changePage"
    /> 
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import equipmentHistorical from "@/api/archives/equipmentManagement/equipmentHistorical.js";
import enumPublic from "@/api/enumPublic.js";
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
   components: { Treeselect },
  data() {
    return {
      token:"",
      total:0,
       hidePage: true,
      ObdFactoryTypeList:[],//obd厂商下拉
      OperaTree:[],//运维公司下拉
      tableQuery: {
        limit:0,
        page:0,
        factory:"",//obd厂商
        code: "",
        plateNo:"",
        opsId: [],
       
      },
      tableData: [],
    };
  },
  mounted() {
    this.token =getToken();
     this.tableQuery.limit = Math.floor(
      (document.documentElement.clientHeight -
        this.$refs.tableDiv.$el.getBoundingClientRect().top -
        93) /
        38
    );
    this.ObdFactoryType();
  },
  methods: {
      //OBD厂商下拉
    ObdFactoryType(){
       enumPublic.enumPublic({ groupCode: "ObdFactoryType" }).then((response) => {
         
          response.data.unshift({ enumName: "全部", enumCode: -1 });
         this.ObdFactoryTypeList = response.data;
        this.tableQuery.factory = -1;
        this.getManageOperaTree();
       })
    },
    //运维公司下拉数
    getManageOperaTree() {
      
      enumPublic.getManageOperaTree({}).then((response) => {
        var all = [];
        all.push({id:-1,label:'全部',children:response.data})

        this.OperaTree = all;
        this.tableQuery.opsId.push(-1);
         this.getTableList();
      });
    },
     getTableList(){
       this.tableQuery.opsId = this.tableQuery.opsId.toString();
        equipmentHistorical.getTableList(this.tableQuery).then((response) => {
          this.total = response.data.count;
          this.tableData = response.data.data;
       })
    },
    changePage(page) {
      this.tableQuery.page = page
      this.getTableList()
    },
      //导出
    exportt(data) {
         window.location.href=process.env.VUE_APP_BASE_API+"api-obdMonitor/companyDetails/getDeviceDetailsExport?access_token="+this.token+"&factory="+this.tableQuery.factory+"&code="+this.tableQuery.code+"&plateNo="+this.tableQuery.plateNo+"&opsId="+this.tableQuery.opsId
    
    },
    go(row, column, cell, event) {
      if (column.property === "carCode") {
        this.$router.push({
          path: "/archives/carArchivesInfo",
          // query: { orgId: data.orgId },
        });
      } else {
        return;
      }
    },
    cellClick(row, column, cell, event){
         if (column.property === "plateNo") {
          this.$router.push({
            path: "/archives/carArchivesInfo",
            query: { objId: row.objId },
          });
      } else {
        return;
      }
    },
    cellStyle(column) {
      if(column.columnIndex === 4) {
      return "color:#409EFF;cursor:pointer"
      }
   },
  },
};
</script>

<style lang='scss' scoped>
#topForm {
  height: 32px;
   .el-form-item {
      margin-bottom: 10px;
  }
}

#topForm ::v-deep .vue-treeselect {
  width: 184px;
   height: 32px;
}
#topForm ::v-deep .vue-treeselect__control {
  height: 0;
}
#topForm ::v-deep .el-form-item__content {
  line-height: 32px;
}

#topForm ::v-deep  .vue-treeselect .el-form-item__content{
    height: 30px !important;  
}
#topForm ::v-deep .vue-treeselect__placeholder{
  line-height:30px !important;
}
#topForm ::v-deep  .vue-treeselect__single-value{
  line-height:30px !important;
}
#topForm ::v-deep .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label {
   line-height: 30px 
}
.vue-treeselect {
  width: 200px !important;
}
::v-deep .el-tooltip{
  .deviceLogDate,.deviceLogCode,.deviceLogUser,.deviceLogOperateType,.deviceLogPlateNo{
    color:red;
  }
}


</style>
