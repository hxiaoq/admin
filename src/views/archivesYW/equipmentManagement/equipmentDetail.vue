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
         <el-input
          v-model="tableQuery.code"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="设备安装日期">
         <el-date-picker
          v-model="time"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyyMMdd"
          @change="timeChange"
        />
      </el-form-item>
       <el-form-item label="运维公司">
           <treeselect
                v-model="tableQuery.opsId"
                placeholder="请选择"
                :multiple="false"
                :clearable="clearable"
                :options="OperaTree"
              />
      </el-form-item>
        <el-form-item label="OBD设备状态">
        <el-select v-model="tableQuery.status" placeholder="请选择">
          <el-option
            v-for="item in ObdDeviceStatusList"
            :key="item.enumCode"
            :label="item.enumName"
            :value="item.enumCode"
          />
        </el-select>
      </el-form-item>
       <el-form-item style="float:right">
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
          @click="exportt"
        >
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="tableDiv"
      class="auth-table"
      :data="tableData"
      style="width: 100%; margin: 10px 0"
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
        prop="orgName"
        label="行政区"
        min-width="150"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="companyName"
        min-width="180"
        label="车企名称"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="plateNo"
        min-width="150"
        label="绑定车牌号"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="vin"
        min-width="150"
        label="绑定车架号"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="dischargeStandardName"
        min-width="120"
        label="排放标准"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="opsName"
        min-width="180"
        label="OBD设备运维公司"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="installationDateStr"
        min-width="180"
        label="OBD设备安装日期"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="factoryName"
        min-width="120"
        label="OBD厂商"
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
        prop="statusName"
        min-width="180"
        label="OBD设备实时状态"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column label="数据项配置" header-align="left" align="right"  min-width="180">
        <template slot-scope="scope">
         
           <el-button v-show="scope.row.id"
            type="success"
            icon="el-icon-edit"
            size="mini"
             @click="goSBEdit(scope.row)"
            >修改</el-button
          >
          <el-button v-show="scope.row.id"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="del(scope.row)"
            >删除</el-button
          >
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
import equipmentDetail from "@/api/archivesYW/equipmentManagement/equipmentDetail.js";
import enumPublic from "@/api/enumPublic.js";
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  data() {
    return {
      clearable:false,
      token:"",
      total:0,
       hidePage: true,
      tableData: [],
      ObdFactoryTypeList:[],//obd厂商下拉
      OperaTree:[],//运维公司下拉
      ObdDeviceStatusList:[],//设备状态
      time:"",
      tableQuery: {
        page:0,
        limit:0,
        factory:"",//obd厂商
        code:"",//编码
        startDate:null,//开始时间
        endDate:null,//结束时间
        opsId:[],//运维公司
        status:"",//设备状态
      },
      
    };
  },
  mounted() {
    this.token =getToken();
     this.tableQuery.limit = Math.floor(
      (document.documentElement.clientHeight -
        this.$refs.tableDiv.$el.getBoundingClientRect().top -
        93) /
        39
    );
    this.ObdFactoryType();
  },
  methods: {
    getTableList(){
       this.tableQuery.opsId = this.tableQuery.opsId.toString();
        equipmentDetail.getTableList(this.tableQuery).then((response) => {
          this.total = response.data.count;
          this.tableData = response.data.data;
       })
    },
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
         this.ObdDeviceStatus();
      });
    },
    //设备状态	

    ObdDeviceStatus() {
      enumPublic.enumPublic({ groupCode: "ObdDeviceStatus" }).then((response) => {
        response.data.unshift({ enumName: "全部", enumCode: -1 });
          this.ObdDeviceStatusList = response.data;
          this.tableQuery.status=-1;
           this.getTableList();
        });
    },
    
    changePage(page) {
      this.tableQuery.page = page
      this.getTableList()
    },
    timeChange() {
				 //console.log(this.PayTime)
				if (this.time != null) {
					this.tableQuery.startDate = this.time[0]
					this.tableQuery.endDate = this.time[1]
				}
      },
      //导出
    exportt(data) {
        window.location.href=process.env.VUE_APP_BASE_API+"api-obdMonitor/deviceDetailsOper/getDeviceDetailsExport?access_token="+this.token+"&cofactoryde="+this.tableQuery.factory+"&code="+this.tableQuery.code+"&startDate="+this.tableQuery.startDate+"&endDate="+this.tableQuery.endDate+"&opsId="+this.tableQuery.opsId+"&status="+this.tableQuery.status;
    
    },
    del(data){
        this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        equipmentDetail.del({id:data.id}).then((response) => {
             this.$message({
              type: "success",
              message: "删除成功!",
            });
             this.getTableList()
        })
      })
    },
      cellClick(row, column, cell, event){
         if (column.property === "plateNo") {
          this.$router.push({
            path: "/archivesYW/carArchivesInfo",
            query: { objId: row.id },
          });
      } else {
        return;
      }
    },
    cellStyle(column) {
      if(column.columnIndex === 3) {
      return "color:#409EFF;cursor:pointer"
      }
   },
   goSBEdit(data){
     if(data){
        this.$router.push({
            path: "/archivesYW/equipmentManagement/equipmentDetailEdit",
            query: { id: data.id},
          });
     }
      
   }

  }
}
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



#topForm ::v-deep .el-date-editor .el-range-separator{
 line-height: 26px 
}
#topForm ::v-deep .el-input__icon{
  line-height:28px;
}
.vue-treeselect {
  width: 200px !important;
}

.auth-table {
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 5px 10px;
  }
}
</style>
