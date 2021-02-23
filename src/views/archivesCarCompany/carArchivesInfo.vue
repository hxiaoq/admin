<template>
  <div>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="block">
            <el-image :src="src" class="img"></el-image>
          </div>
        </el-col>
        <el-col :span="8" style='display:flex;justify-content:center'>
          <div>
             <div style="margin-bottom: 20px">
            <span style="inline-block;font-size:24px;margin-right:40px"
              >{{carData.plateNo}}</span
            ><span style="inline-block;background:#F79646;color:#fff;padding:10px;"
              >{{carData.vehicleStatusName==null ? "-" : carData.vehicleStatusName}}</span
            >
          </div>
          <div class="infoDiv">
            <img :src="vin" /><span>车架号：</span><span>{{carData.vin}}</span>
          </div>
          <div class="infoDiv"><img :src="owner"/><span>车主姓名：</span><span>{{carData.owner}}</span></div>
          <div class="infoDiv">
            <img :src="phone"/><span>车主联系电话：</span><span>{{carData.ownerPhone}}</span>
          </div>
          </div>
         
        </el-col>
        <el-col :span="8">
          <div style='text-align:center;font-size:24px;'>{{dateTime}}</div>
          <div id="myChart" style="height: 150px" class="chart"></div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix"><span>基础信息</span></div>
      <div>
        <el-row class="InfoDiv2">
          <el-col :span="12">
            <span>行政区：</span>
            <span>{{carData.orgName}}</span>
          </el-col>
          <el-col :span="12">
            <span>车辆类型：</span>
            <span>{{carData.vehicleType}}</span>
          </el-col>
        </el-row>
        <el-row class="InfoDiv2">
          <el-col :span="12">
            <span>车企名称：</span>
            <span>{{carData.companyName}}</span>
          </el-col>
          <el-col :span="12">
            <span>车牌号：</span>
            <span>{{carData.plateNo}}</span>
          </el-col>
        </el-row>
        <el-row class="InfoDiv2">
          <el-col :span="12">
            <span>机动车状态：</span>
            <span>{{carData.vehicleStatus}}</span>
          </el-col>
          <el-col :span="12">
            <span>车辆当前状态：</span>
            <span>{{carData.vehicleRunName}}</span>
          </el-col>
        </el-row>
        <el-row class="InfoDiv2"
          ><el-col :span="12">
            <span>车架号：</span>
            <span>{{carData.vin}}</span>
          </el-col>
           <el-col :span="12">
            <span>车主姓名：</span>
            <span>{{carData.owner}}</span>
          </el-col>
        </el-row>
        <el-row class="InfoDiv2"
          ><el-col :span="12">
            <span>车主联系电话：</span>
            <span>{{carData.ownerPhone}}</span>
          </el-col>
          <el-col :span="12">
            <span>品牌型号：</span>
            <span>{{carData.brandName}}</span>
          </el-col>
        </el-row>
        <el-row class="InfoDiv2"
          ><el-col :span="12">
            <span>排放标准：</span>
            <span>{{carData.dischargeStandardName}}</span>
          </el-col>
           <el-col :span="12">
            <span>发动机厂商：</span>
            <span>{{carData.engineFactoryName}}</span>
          </el-col>
        </el-row>
        <el-row class="InfoDiv2"
          ><el-col :span="12">
            <span>发动机号码：</span>
            <span>{{carData.engineNo}}</span>
          </el-col>
         <el-col :span="12">
            <span>注册登记日期：</span>
            <span>{{carData.registerDateStr}}</span>
          </el-col>
        </el-row>


        <el-row class="InfoDiv2"
          >
         <el-col :span="12">
            <span>是否安装OBD：</span>
            <span>{{carData.obdStatusName}}</span>
          </el-col>
          <el-col :span="12" v-show="isShowOBD">
            <span>OBD设备编码：</span>
            <span>{{carData.deviceCode}}</span>
          </el-col>
         
        </el-row>
        <el-row class="InfoDiv2" v-show="isShowOBD"
          >
           <el-col :span="12">
            <span>OBD厂商：</span>
            <span>{{carData.factoryName}}</span>
          </el-col>
          <el-col :span="12">
            <span>OBD设备安装时间：</span>
            <span>{{carData.installationDateStr}}</span>
          </el-col>
         
        </el-row>
        <el-row class="InfoDiv2" v-show="isShowOBD"
          ><el-col :span="12">
            <span>OBD设备运维公司：</span>
            <span>{{carData.opsName}}</span>
          </el-col>
        </el-row>
        <el-row class="InfoDiv2"
          ><el-col :span="24">
            <span>监测数据：</span>
            <el-button size="mini" round @click="goJCSJ('second')">实时</el-button>
            <el-button size="mini" round @click="goJCSJ('hour')">小时</el-button
            ><el-button size="mini" round @click="goJCSJ('day')">日</el-button
            ><el-button size="mini" round @click="goJCSJ('month')">月</el-button
            ><el-button size="mini" round @click="goJCSJ('year')">年</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix"><span>预警信息</span></div>
      <div>
         <el-table
      ref="tableDiv"
      class="auth-table"
      :data="warningInfoData"
      style="width: 100%; margin: 10px 0"
      border
      :cell-style="cellStyle"
      @cell-click="cellClick"
    >
      <el-table-column label="序号" width="70" type="index"></el-table-column>
      <el-table-column
        prop="alarmTypeName"
        label="预警类型"
        width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="beginTimeStr"
        label="预警发生时间"
         width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="endTimeStr"
        label="预警结束时间"
         width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="exceptionTime"
        label="预警时长"
        width="80"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="dataInfo"
        label="预警描述"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="levelName"
        label="预警等级"
        width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="操作"
        header-align="left"
        align="right"
        width="280"
      >
        <template slot-scope="scope">
           <el-button
            type="primary"
            size="mini"
            @click="goYJXQ(scope.row)"
            >预警详情</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="goGis(scope.row)"
            >轨迹回放</el-button
          >
           <el-button
            type="primary"
            size="mini"
            @click="goHistory(scope.row)"
            >历史数据</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :hide-on-single-page="hidePage"
      :total="YJtotal"
      :page-size="limit"
       @current-change="changePageYJ"
    />
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix"><span>检测信息</span>  <el-button style="float: right;"
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="modalShowJC('add')"
          >新增</el-button
        ></div>
       <div>
         <el-table
      ref="tableDiv"
      class="auth-table"
      :data="detectionInfoData"
      style="width: 100%; margin: 10px 0"
      border
    >
      <el-table-column label="序号" width="70" type="index"></el-table-column>
      <el-table-column
        prop="checkNo"
        label="车辆检测编号"
        width="150"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="checkDateStr"
        label="检测日期"
        width="150"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="checkInfoName"
        label="监测内容"
        min-width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="description"
        label="问题简述"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="checkUnit"
        label="车辆检测单位"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
     
      <el-table-column
        label="检测报告"
        min-width="200"
         show-overflow-tooltip
      >
         <template slot-scope="scope">
          <da-jcbg :id="scope.row.id" :bussType="'obd-detectionReport'" @downLoad="handleGetFileId"></da-jcbg>
         </template> 
      </el-table-column>
      <el-table-column
        label="操作"
        header-align="left"
        align="right"
        width="180"
      >
        <template slot-scope="scope">
           <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            @click="modalShowJC('edit', scope.row)"
            >修改</el-button
          >
           <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="onDelJC(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :hide-on-single-page="hidePage"
      :total="JCtotal"
      :page-size="limit"
       @current-change="changePageJC"
    />
      </div>
    </el-card>
     <el-card class="box-card">
      <div slot="header" class="clearfix"><span>行政处罚</span>  <el-button style="float: right;"
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="modalShowCF('add')"
          >新增</el-button
        ></div>
        <div>
          
         <el-table
      ref="tableDiv"
      class="auth-table"
      :data="punishmentInfoData"
      style="width: 100%; margin: 10px 0"
      border
    >
      <el-table-column label="序号" width="70" type="index"></el-table-column>
      <el-table-column
        prop="fileNo"
        label="行政处罚决定书编号"
        width="150"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="causes"
        label="主要违法行为或事由"
        min-width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="releaseDateStr"
        label="决定书下达日期"
         width="150"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="penaltyAmount"
        label="处罚金额（元）"
        width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="penaltyUnit"
        label="行政处罚单位"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
     
      <el-table-column
        label="行政处罚决定书"
         min-width="200"
         show-overflow-tooltip
      >
          <template slot-scope="scope">
          <da-jcbg :id="scope.row.id" :bussType="'obd-punishmentText'" @downLoad="handleGetFileId"></da-jcbg>
         </template> 
      </el-table-column>
      <el-table-column
        label="操作"
        header-align="left"
        align="right"
        width="180"
      >
        <template slot-scope="scope">
           <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            @click="modalShowCF('edit', scope.row)"
            >修改</el-button
          >
           <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="onDelCF(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :hide-on-single-page="hidePage"
      :total="CFtotal"
      :page-size="limit"
       @current-change="changePageCF"
    />
      </div>
    </el-card>
    <!-- 检测信息弹框 -->
     <el-dialog :title="modalTextJC" :visible.sync="dialogVisibleJC" width="800px" @close="clearFiles()">
      <el-form
        :model="ruleFormJC"
        ref="ruleFormJC"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-row>
             <el-col :span="12">
            <el-form-item label="车辆检测编号" prop="checkNo">
              <el-input
                v-model="ruleFormJC.checkNo"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆检测单位" prop="nacheckUnitme">
              <el-input
                v-model="ruleFormJC.checkUnit"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          
        </el-row>
    
        <el-row>
          
           <el-col :span="12">
            <el-form-item label="检测内容" prop="legalPerson">
             <el-select v-model="ruleFormJC.checkInfo" placeholder="请选择">
                <el-option
                  v-for="item in JCList"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                  
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测日期" prop="checkDate">
              <el-date-picker
                v-model="ruleFormJC.checkDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyyMMdd"
                >
              </el-date-picker>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="检测报告">
              <el-upload
                class="upload-demo"
                ref="uploadJC"
                :action="uploadUrl"
                :data="upLoadDataJC"
                :file-list="fileListJC"
                :on-error="uploadFalseJC"
                :on-success="uploadSuccessJC"
                :on-remove="removeFileJC"
                :before-upload="beforeAvatarUploadJC"
                  :on-preview="handleGetFileId"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload> 
            
            </el-form-item>
          </el-col>
         
        </el-row>
        <el-row>
           <el-col :span="24">
            <el-form-item label="问题简述" prop="description">
              <el-input
                v-model="ruleFormJC.description"
                placeholder="请输入"
                type="textarea"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="text-align: right">
          <el-button type="primary" size="small" @click="saveJC()"
            >保存</el-button
          >
          <el-button size="small"  @click="dialogVisibleJC = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
       <!-- 行政处罚信息弹框 -->
     <el-dialog :title="modalTextCF" :visible.sync="dialogVisibleCF" width="800px" @close="clearFiles()">
      <el-form
        :model="ruleFormCF"
        ref="ruleFormJC"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-row>
             <el-col :span="12">
            <el-form-item label="行政处罚决定书编号" prop="fileNo">
              <el-input
                v-model="ruleFormCF.fileNo"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行政处罚单位" prop="penaltyUnit">
              <el-input
                v-model="ruleFormCF.penaltyUnit"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="12">
            <el-form-item label="决定下达日期" prop="releaseDate">
                <el-date-picker
                  v-model="ruleFormCF.releaseDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyyMMdd"
                  >
                </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处罚金额" prop="penaltyAmount">
              <el-input
                v-model="ruleFormCF.penaltyAmount"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          
          <el-col :span="24">
            <el-form-item label="行政处罚决定书">
             <el-upload
                class="upload-demo"
                ref="uploadCF"
                :action="uploadUrl"
                :data="upLoadDataCF"
                :file-list="fileListCF"
                :on-error="uploadFalseCF"
                :on-success="uploadSuccessCF"
                :on-remove="removeFileCF"
                :before-upload="beforeAvatarUploadCF"
                  :on-preview="handleGetFileId"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload> 
            
            </el-form-item>
          </el-col>
         
        </el-row>
        <el-row>
           <el-col :span="24">
            <el-form-item label="主要违法行为或事由" prop="causes">
              <el-input
                v-model="ruleFormCF.causes"
                placeholder="请输入"
                type="textarea"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="text-align: right">
          <el-button type="primary" size="small" @click="saveCF()"
            >保存</el-button
          >
          <el-button size="small" @click="dialogVisibleCF = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
  
</template>

<script>
import echarts from "echarts";
import enumPublic from "@/api/enumPublic.js";
import carArchivesInfo  from "@/api/archivesCarCompany/carArchivesInfo.js";
import daJcbg from './JCBG'
export default {
   name: 'carArchiveInfo',
   components: {
    daJcbg,
   },
  data() {
    return {
      dateTime:"",
      vin:require("./icon/vin.png"),
      phone:require("./icon/phone.png"),
      owner:require("./icon/owner.png"),
      id:"",
      objId:"",
      carData:{},
      isShowOBD:true,
      hidePage: true,
      YJtotal:null,//预警信息的total
      JCtotal:null,//检测信息的total
      CFtotal:null,//行政处罚的total
      pageYJ:0,//预警的页数
      pageJC:0,//检测的页数
      pageCF:0,//行政处罚的页数
      warningInfoData:[],//预警信息表格
      detectionInfoData:[],//检测信息表格
      punishmentInfoData:[],//行政处罚的表格
      dialogVisibleJC:false,//检测信息
      dialogVisibleCF:false,//行政处罚
      modalTextJC:"",
      modalTextCF:"",
      limit:5,
      JCList:[],//检测内容下拉

      
      ruleFormJC:{//检测信息模态框请求数据
        id:"",
        objId:"",
        checkNo:"",//检测编号
        checkUnit:"",//检测单位
        description:"",//问题简述
        checkInfo:"",//检测内容
        checkDate:"",
        fileId:[],//文件id
         bussType:"obd-detectionReport",//业务类型
      },
      ruleFormCF:{
          id:"",
          objId:"",
          fileNo:"",//决定书编号
          penaltyUnit:"",//行政处罚单位
          releaseDate:"",//决定书下达日期          
          penaltyAmount:"",//处罚金额
          causes:"",//主要违法行为或事由
          fileId:[],//文件id
          bussType:"obd-punishmentText",//业务类型
      },
      src:"",
        // "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        uploadUrl:process.env.VUE_APP_BASE_API + "api-file/files/files/uploadAll",
        downLoadUrl: process.env.VUE_APP_BASE_API + "api-file/files/files/downLoad",
        upLoadDataJC:{ bussType:"obd-detectionReport"},
        upLoadDataCF:{ bussType:"obd-punishmentText"},
        fileListJC:[],
        fileListCF:[],
   
    };
  },
  mounted() {
    this.objId = this.$route.query.objId;
    this.id = this.$route.query.id;
     this.getData();
    this.warningInfo();
    this.detectionInfo();
    this.punishmentInfo();
    this.getFile(this.id,"obd-carImg");
   
  },
  methods: {
    getData(){
       carArchivesInfo.getData({objId:this.objId}).then((response) => {
        
         if(response.data!=null){
            this.carData = response.data;
            var dataTime=response.data.datetime.split("-");
             this.dateTime = dataTime[0]+"年"+dataTime[1]+"月"
              
              if(response.data.obdStatusName=="是"){
                this.isShowOBD = true
              }else{
                  this.isShowOBD = false
              }
         }
         this.getChart();
         
         
       })
    },
    //预警信息表格
    warningInfo(){
      var year = (new Date()).getFullYear();
      var params={
        limit:this.limit,
        page:this.pageYJ,
        startDate:year+"0101",
        endDate:year+"1231",
        objId:this.objId
      }
      carArchivesInfo.warningInfo(params).then((response) => {
          this.YJtotal = response.data.count;
            this.warningInfoData=response.data.data;
         })
    },
    
    //检测信息表格
    detectionInfo(){
      var year = (new Date()).getFullYear();
      var params={
       limit:this.limit,
        page:this.pageJC,
        startDate:year+"0101",
        endDate:year+"1231",
        objId:this.objId
      }
      carArchivesInfo.detectionInfo(params).then((response) => {
          this.JCtotal = response.data.count;
            this.detectionInfoData=response.data.data;
         })
    },
    //行政处罚信息表格
    punishmentInfo(){
      var year = (new Date()).getFullYear();
      var params={
        limit:this.limit,
        page:this.pageCF,
        startDate:year+"0101",
        endDate:year+"1231",
        objId:this.objId
      }
      carArchivesInfo.punishmentInfo(params).then((response) => {
          this.CFtotal = response.data.count;
            this.punishmentInfoData=response.data.data;
         })
    },
    
    getChart(value) {
      this.chart = echarts.init(document.getElementById("myChart"));
    
      var valueN="";
      if(!!value){
        valueN=value
      }else{
         valueN="-"
      }
      var datas = {
        title: "信任评价",
        company: "分",
        dataArr: [
          {
            value: valueN,
          },
        ],
      };
      var value = datas.dataArr[0].value=="-"?"0":datas.dataArr[0].value;
      var max = 100;
      // 蓝色背景
      var num = value / max;
      var colorSet = [
        [num, "#988bbe"],
        [1, "#e6e6e6"],
      ];
      var centerArr = ["50%", "95%"];
      this.chart.setOption({
        series: [
          {
            name: "紫色外圈", //刻度背景
            type: "gauge",
            radius: "180%",
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: max,
            center: centerArr, //整体的位置设置
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: colorSet,
                width: 10,
                opacity: 1, //刻度背景宽度
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            pointer: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            detail: {
              formatter: function (params) {
                //图表中间文字数据展示
                return (
                  "{white|" +
                  value +
                  "}  {company|" +
                  datas.company +
                  "}" +
                  "\n" +
                  "{gray|" +
                  datas.title +
                  "}"
                );
              },
              rich: {
                gray: {
                  fontSize: 20,
                  color: "#000",
                  padding: 20,
                },
                white: {
                  fontSize: 25,
                  fontWeight: 700,
                  color: "#000",
                },
                company: {
                  fontSize: 14,
                  color: "#000",
                },
              },
              offsetCenter: ["0", "-30%"],
            },
          },
        ],
      });
    },
    //预警信息的表格分页
     changePageYJ(page) {
      this.pageYJ = page;
      this.warningInfo();
    },
    //检测信息的表格分页C
     changePageJC(page) {
      this.pageJC = page;
      this.detectionInfo();
    },
    //处罚信息的表格分页
     changePageCF(page) {
      this.pageCF = page;
      this.punishmentInfo();
    },
    
     //企业性质
    CheckInfoType() {
      enumPublic.enumPublic({ groupCode: "CheckInfoType" }).then((response) => {
          this.JCList = response.data;
        });
    },
    //检测信息的弹框
    modalShowJC(type,data){
      if(this.JCList.length<1){
        this.CheckInfoType();
      }
      this.dialogVisibleJC = true;
      this.ruleFormJC.fileId = [];
      if(type=="add"){
         
        this.modalTextJC = "新增"
        this.ruleFormJC.id = "",
        this.ruleFormJC.objId = this.objId;
        this.ruleFormJC.checkNo=""//检测编号
        this.ruleFormJC.checkUnit="";//检测单位
        this.ruleFormJC.description="";//问题简述
        this.ruleFormJC.checkInfo="";//检测内容
        this.ruleFormJC.checkDate = "";//检测日期
        this.ruleFormJC.fileId = [];
      }else if(type=="edit"){
        this.modalTextJC = "修改"
        this.ruleFormJC.id = data.id,
        this.ruleFormJC.objId = this.objId;
        this.ruleFormJC.checkNo=data.checkNo//检测编号
        this.ruleFormJC.checkUnit=data.checkUnit;//检测单位
        this.ruleFormJC.description=data.description;//问题简述
        this.ruleFormJC.checkInfo=data.checkInfo;//检测内容
        this.ruleFormJC.checkDate = data.checkDate.toString();//检测日期
         this.getFile(data.id,"obd-detectionReport");//检测报告获取
      }
    },
    //检测信息模态框保存
    saveJC(){
         this.$confirm("是否确认提交?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            if(this.ruleFormJC.fileId.length>0){
              this.ruleFormJC.fileId = this.ruleFormJC.fileId.join(",")
            }
             carArchivesInfo.saveJC(this.ruleFormJC).then((response) => {
                this.$message({
                        type: "success",
                        message: "保存成功!",
                      });
                      this.dialogVisibleJC = false;
                      this.detectionInfo();
            })
          })
    },
     //行政处罚的弹框
    modalShowCF(type,data){
      this.dialogVisibleCF = true;
      
       this.ruleFormCF.fileId = [];
      if(type=="add"){
          this.modalTextCF = "新增"
          this.ruleFormCF.id ="";
          this.ruleFormCF.objId = this.objId;
          this.ruleFormCF.fileNo ="";//决定书编号
          this.ruleFormCF.penaltyUnit ="";//行政处罚单位
          this.ruleFormCF.releaseDate ="";//决定书下达日期          
          this.ruleFormCF.penaltyAmount ="";//处罚金额
          this.ruleFormCF.causes ="";//主要违法行为或事由
          this.ruleFormCF.fileId = [];
          
      }else if(type=="edit"){
          this.modalTextCF = "修改"
          this.ruleFormCF.id =data.id;
          this.ruleFormCF.objId =this.objId;
          this.ruleFormCF.fileNo =data.fileNo;//决定书编号
          this.ruleFormCF.penaltyUnit =data.penaltyUnit;//行政处罚单位
          this.ruleFormCF.releaseDate =data.releaseDate.toString();//决定书下达日期          
          this.ruleFormCF.penaltyAmount =data.penaltyAmount;//处罚金额
          this.ruleFormCF.causes =data.causes;//主要违法行为或事由
          this.getFile(data.id,"obd-punishmentText");//营业执照获取
      }
    },
    //行政处罚模态框保存
    saveCF(){
         this.$confirm("是否确认提交?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            if(this.ruleFormJC.fileId.length>0){
              this.ruleFormCF.fileId = this.ruleFormCF.fileId.join(",")
            }
               carArchivesInfo.saveCF(this.ruleFormCF).then((response) => {
            this.$message({
              type: "success",
              message: "保存成功!",
            });
          this.dialogVisibleCF = false;
          this.punishmentInfo();
    
         })
          })
    },
       // 修改时获取文件
    getFile(id,bussType){
        var params ={
          id:id,
          bussType:bussType
        }
        enumPublic.getFile(params).then((response) => {
          if(bussType=="obd-detectionReport"){//检测报告
              this.fileListJC = response.data;
              var that = this;
              response.data.forEach(function(item,i){
                  that.ruleFormJC.fileId.push(item.id)
              })
          }else if(bussType=="obd-punishmentText"){//行政处罚报告
              this.fileListCF = response.data;
              var that = this;
              response.data.forEach(function(item,i){
                  that.ruleFormCF.fileId.push(item.id)
              })
          }else if(bussType=="obd-carImg"){//行政处罚报告
              if(response.data.length>0){
                this.src = response.data[0].url;
              }
                
          }
       })
    },
    //检测信息删除
    onDelJC(data){
       this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
       carArchivesInfo.delJC({id:data.id}).then((response) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          this.dialogVisibleCF = false;
          this.detectionInfo();
    
         })
      })
    },
     //行政处罚信息删除
    onDelCF(data){
       this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
       carArchivesInfo.delCF({id:data.id}).then((response) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          this.dialogVisibleCF = false;
          this.punishmentInfo();
    
         })
      })
    },
    cellClick(row, column, cell, event){
      //    if (column.property === "plateNo") {
      //      console.log(row.objId)
      //     this.$router.push({
      //       path: "/archives/carArchivesInfo",
      //       query: { objId: row.objId },
      //     });
      // } else {
      //   return;
      // }
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
    //跳转数据查询页面
    goJCSJ(type){
      var params={
          dataType:type,
          id:this.objId,
          plateNo:this.carData.plateNo
      }
       this.$router.push({
            path: "/dynamicMonitorCarCompany/historyDataDetail",
            query:params,
          });
    },
    //跳转预警详情
    goYJXQ(data){      
       this.$router.push({
            path: "/warnCarCompany/warnDetailsPage",
            query:{data},
          });
    },
    //跳转轨迹回放GIS
    goGis(data){
       var params={
          objId:this.objId,
          plateNo:this.carData.plateNo
      }
       this.$router.push({
            path: '/gisCarCompany/map',
            query:params,
          });
    },
    //跳转历史记录
      goHistory(data) {
      this.$router.push({
        path: '/dynamicMonitorCarCompany/historyData',
        query: { companyName: data.companyName, orgId: data.orgId, plateNo: data.plateNo }
      })
    },
      //文件上传成功触发
    uploadSuccessJC(response, file, fileList) {
      if (response.code == 200) {
        this.$message({
          message: "上传成功",
          type: "success",
        });
        this.ruleFormJC.fileId.push(response.data.id);
      } else {
        this.$message({
          message: "上传失败",
          type: "error",
        });
      }
    },
    //文件上传失败触发
    uploadFalseJC(response, file, fileList) {
      this.$message({
        message: "文件上传失败！",
        type: "error",
      });
    },
    // 上传前对文件的大小和类型的判断
    beforeAvatarUploadJC(file) {
      console.log(file.size);
      var fileSize = file.size;
      if (fileSize > 1048576) {
        this.$message({
          message: "上传文件不能超过1M!",
          type: "error",
        });
        return false;
      }
      if(this.modalTextJC=="新增"){
        this.upLoadDataJC.bussId = "";
      }else{
        this.upLoadDataJC.bussId = this.ruleFormJC.id;
      }
    },
    // 删除文件
    removeFileJC(file, fileList) {
      if (file && file.status == "success") {
        if(file.response){
          var fileId = file.response.data.id;
        }else{
          var fileId = file.id;
        }
        var that = this
        enumPublic.delFile({ id: fileId }).then((response) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          that.ruleFormJC.fileId.splice(
            that.ruleFormJC.fileId.findIndex((item) => item === fileId),1
            
          );
        });
      }
    },
        //文件上传成功触发(行政处罚)
    uploadSuccessCF(response, file, fileList) {
      console.log(response);
      if (response.code == 200) {
        this.$message({
          message: "上传成功",
          type: "success",
        });
        this.ruleFormCF.fileId.push(response.data.id);
      } else {
        this.$message({
          message: "上传失败",
          type: "error",
        });
      }
    },
    //文件上传失败触发
    uploadFalseCF(response, file, fileList) {
      this.$message({
        message: "文件上传失败！",
        type: "error",
      });
    },
    // 上传前对文件的大小和类型的判断
    beforeAvatarUploadCF(file) {
      console.log(file.size);
      var fileSize = file.size;
      if (fileSize > 1048576) {
        this.$message({
          message: "上传文件不能超过1M!",
          type: "error",
        });
        return false;
      }
      if(this.modalTextCF=="新增"){
        this.upLoadDataCF.bussId = "";
      }else{
        this.upLoadDataCF.bussId = this.ruleFormCF.id;
      }
    },
    // 删除文件
    removeFileCF(file, fileList) {
      if (file && file.status == "success") {
        if(file.response){
          var fileId = file.response.data.id;
        }else{
          var fileId = file.id;
        }
        var that = this
        enumPublic.delFile({ id: fileId }).then((response) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          that.ruleFormCF.fileId.splice(
            that.ruleFormCF.fileId.findIndex((item) => item === fileId),1
            
          );
        });
      }
    },
     //下载文件
    handleGetFileId(file){
         if(file.response){
          var fileId = file.response.data.id;
        }else if(file.id){
          var fileId = file.id;
        }else{
          var fileId = file
        }
         const link = document.createElement('a')
          link.style.display = 'none'
          link.href = this.downLoadUrl+"?id="+fileId;
         link.click()
         this.$message({
           message: `正在下载,请稍后在本地查看`,
           type: 'success'
         })

         
    },
    clearFiles () {
            this.$refs.uploadJC.clearFiles();
    },
    clearFiles1 () {
      this.$refs.ruleFormCF.clearFiles();
    },
  },
  filters: {
    //获取表格图片
    async getFileInfo (row,bussType,type){
       var params ={
          id:row.id,
          bussType:bussType
        }
        await enumPublic.getFile(params).then((response) => {
          // if(type=="id"){
          //     return response.data[0].id
          // }
          if(bussType=="obd-detectionReport"){//检测报告
              // response.data.forEach(function(item,i){
              //      return "<a>"+item.name+"</a>"
              // })
              console.log(response.data[0].name)
              return response.data[0].name
              
          }
          // }else if(bussType=="obd-punishmentText"){//行政处罚报告
          //     this.fileListCF = response.data;
          //     var that = this;
          //     response.data.forEach(function(item,i){
          //         that.ruleFormCF.fileId.push(item.id)
          //     })
          // }else if(bussType=="obd-carImg"){//行政处罚报告
          //     if(response.data.length>0){
          //       this.src = response.data[0].url;
          //     }
                
          // }
       })
   
   
    },
   }
};
</script>

<style lang='scss' scoped>
::v-deep .el-card {
  margin-bottom: 15px;
}
.img {
  width: 80%;
  height: 150px;
}
.infoDiv {
  margin-bottom: 20px;
  img{
    position: relative;
    top:2px;
  }
}
.InfoDiv2 {
  margin-bottom: 15px;
}
.infoDiv span:first-child {
  display: inline-block;
  width: 120px;
  text-align: right;
}
.infoDiv2 el-col span:first-child {
  display: inline-block;
  width: 120px;
  text-align: right;
}
.auth-table {
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 5px 10px;
  }
}
</style>
