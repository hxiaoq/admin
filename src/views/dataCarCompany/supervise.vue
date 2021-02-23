  
<template>
  <div>
    <el-form
      :inline="true"
      :model="tableQuery"
      size="small"
      id="topForm"
      class="demo-form-inline"
    >
      <el-form-item label="行政区">
        <treeselect
          v-model="tableQuery.orgId"
          placeholder="请选择"
          size="small"
          :clearable="clearable"
          :multiple="false"
          :options="orgTree"
          :normalizer="normalizer"
        />
      </el-form-item>
      <el-form-item label="车企名称">
        <el-input v-model="tableQuery.companyName" placeholder="车企名称" />
      </el-form-item>
      <el-form-item label="评价周期">
        <el-date-picker
          v-model="tableQuery.datetime"
          style="width: 140px"
          type="month"
          value-format="yyyyMM"
          format="yyyy-MM"
          placeholder="选择月"
        />
      </el-form-item>
      <el-form-item style='float:right'>
        <el-button
          class=""
          size="small"
          type="success"
          icon="el-icon-search"
          @click="getData"
        >
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <div class="dashboard-container">
      <el-row :gutter="30" v-loading="loading">
        <el-col style="width: 20%" v-for="(item,index) in topValue" :key="index">
          <el-card class="box-card" :style="{background:item.color}">
            <div class="topDiv">
              <div>{{item.name}}</div>
              <div><span class="title">{{item.value}}</span><span>家</span></div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="chartGroup no2">
        <el-col :span="12" style="margin: 15px 0">
          <el-card class="box-card">
            <div slot="header" class="chart-card">
              <span class="chart-title">
                行政区重点监管车辆分布 <em>(单位/辆)</em>
              </span>
            </div>
            <div id="topLeftEchart" v-loading="loading1" class="chart" />
          </el-card>
        </el-col>
        <el-col :span="12" style="margin: 15px 0">
          <el-card class="box-card">
            <div slot="header" class="chart-card">
              <span class="chart-title">
                重点监测车辆TOP10 <em>(单位/辆)</em>
              </span>
            </div>
            <div id="topRightEchart" v-loading="loading1" class="chart" />
          </el-card>
        </el-col>
      </el-row>
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
        width="150"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="vehicleTypeName"
        width="100"
        label="车辆类型"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="车企名称"
        show-overflow-tooltip
        >
      </el-table-column>
       <el-table-column
        prop="plateNo"
         width="120"
        label="车牌号"
        show-overflow-tooltip
        >
      </el-table-column>
       <el-table-column
        prop="brandName"
         width="100"
        label="品牌类型"
        show-overflow-tooltip
        >
      </el-table-column>
       <el-table-column
        prop="dischargeStandardName"
        label="排放标准"
         width="100"
        show-overflow-tooltip
        >
      </el-table-column>
       <el-table-column
        prop="datetimeStr"
        label="评价周期"
         width="120"
        show-overflow-tooltip
        >
      </el-table-column>
       <el-table-column
        prop="imageScore"
         width="100"
        label="评价得分"
        show-overflow-tooltip
        >
      </el-table-column>
       <el-table-column
        prop="lastImageScore"
         width="120"
        label="上月评价得分"
        show-overflow-tooltip
        >
      </el-table-column>
         <el-table-column
        label="操作"
        width="180"
        header-align="left"
        align="right"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="goDetail(scope.row)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>

    </el-table>
      <el-pagination
      background
      layout="total, prev, pager, next"
      :hide-on-single-page="hidePage"
      :total="total"
      :page-size=5
      @current-change="changePage"
    /> 
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import resize from "@/views/archives/resize";
import enumPublic from "@/api/enumPublic.js";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import analysis from "@/api/data/analysisCarCompany.js";
import Moment from 'moment'
export default {
   mixins: [resize],
  components: { Treeselect },
  data() {
    return {
      clearable: false,
      hidePage:true,
      chart1: null,
      chart2: null,

      loading: true,
      loading1: true,
      loading2: true,
      topValue:null,
      page:1,
      total:0,
      tableQuery: {
        orgId: [],
        datetime: Moment().add(-1, 'month').format('YYYYMM'),
        companyName: "",
      },
      orgTree: [],
      tableData: [],
      normalizer(node) {
        return {
          id: node.orgId,
          label: node.orgName,
          children: node.childOrgs,
        };
      },
    };
  },
  mounted() {
    this.getOrgTree();
  },
  methods: {
    getOrgTree() {
      enumPublic.getOrgTree().then((response) => {
        this.orgTree.push(response.data);
        this.tableQuery.orgId.push(this.orgTree[0].orgId);

       this.getData();
      });
    },
    getData(){
         this.getTopValue();
        this.getTrustByOrg();// //行政区重点监管车辆分布
        this.getTrustTop();//重点监测车辆TOP10
        this.getTableList();
    },
  getTopValue() {
    this.tableQuery.orgId = this.tableQuery.orgId.toString();
    analysis.getTopValue(this.tableQuery).then((response) => {
      this.topValue=response.data;
      this.loading=false
    });
  },
  //行政区重点监管车辆分布
  getTrustByOrg() {
    analysis.getTrustByOrg(this.tableQuery).then((response) => {
     
      this.initTopLeftEchart(response.data.series,response.data.xAxis,response.data.legend);
      this.loading1 = false;
    });
  },
  //重点监测车辆TOP10
  getTrustTop() {
    analysis.getTrustTop(this.tableQuery).then((response) => {
     
      this.initTopRightEchart(response.data.data,response.data.xAxis);
      this.loading2 = false;
    });
  },
  // 表格数据
  getTableList(page){
    var params={
      limit:5,
      page:this.page,...this.tableQuery
    }

     analysis.getTableList(params).then((response) => {
      this.tableData = response.data.data;
      this.total = response.data.count;
    });
  },
  initTopLeftEchart(data, xAxis, legend) {
    this.chart1 = echarts.init(document.getElementById("topLeftEchart"));
    this.chart1.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        top: "18%",
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      color:["#91BB5F","#00AFC8","#3682BD","#86639F","#D44945"],
       legend: {
          data: legend
      },
      xAxis: {
        type: "category",
        data: xAxis,
      },
      yAxis: {
        type: "value",
        name: "单位(辆)",
      },
      series: data
    });
  },
  initTopRightEchart(data, xAxis) {
    this.chart2 = echarts.init(document.getElementById("topRightEchart"));
    this.chart2.setOption({
  
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        top: "3%",
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      color: ["#4f81bd"],
      xAxis: {
        type: "value",
       // boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: "category",
        data: xAxis.reverse(),
        name: "单位(辆)",
      },
      series: [
        {
          // name: '2012年',
          type: "bar",
          data: data.reverse(),
          barWidth: "50%",
        },
      ],
    });
  },
  //分页
    changePage(page) {
      this.page = page;
      this.getTableList();
    },
    goDetail(row){
       this.$router.push({
            path: "/dataCarCompany/superviseDetail",
            query: {id:row.objId,dateTime:row.datetime},
          });
    },
    cellClick(row, column, cell, event){
         if (column.property === "plateNo") {
          this.$router.push({ 
            path: "/archivesCarCompany/carArchivesInfo",
            query: { objId: row.objId ,id:row.id},
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
  }
};
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
.box-card {
  ::v-deep .el-card__header {
    border: none;
    padding: 18px 15px 5px;
  }
  ::v-deep .el-card__body {
    padding: 10px;
  }
}
.topDiv {
  text-align: center;
  color:#ffffff;
  .title {
    font-size: 24px;
    font-weight: bold;
    margin-top: 10px;
    display: inline-block;
    //color: #2096e8;
  }
}
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
#topForm {
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
