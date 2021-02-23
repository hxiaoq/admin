<template>
  <div>
    <el-form id="topForm" :inline="true" size="small" class="demo-form-inline">
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
      <el-form-item label="车牌号">
        <el-input v-model="tableQuery.plateNo" placeholder="请输入车牌号" />
      </el-form-item>
      <el-form-item label="排放标准">
        <el-select v-model="tableQuery.dischargeStandard" placeholder="请选择">
          <el-option
            v-for="item in PFList"
            :key="item.enumCode"
            :label="item.enumName"
            :value="item.enumCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆当前状态">
        <el-select v-model="tableQuery.vehicleStatus" placeholder="请选择">
          <el-option
            v-for="item in RealtimeStatus"
            :key="item.enumCode"
            :label="item.enumName"
            :value="item.enumCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否安装OBD">
        <el-select v-model="tableQuery.obdStatus" placeholder="请选择">
          <el-option
            v-for="item in YesNo"
            :key="item.enumCode"
            :label="item.enumName"
            :value="item.enumCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车企名称">
        <el-input placeholder="请输入" v-model="tableQuery.companyName"></el-input>
      </el-form-item>
      <el-form-item style="float: right">
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
          type="primary"
          icon="el-icon-plus"
          @click="modalShow('add', '')"
        >
          新增
        </el-button>
        <el-button
          class="filter-item"
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
      <el-table-column label="序号" width="70" type="index" />
      <el-table-column
        prop="orgName"
        label="行政区"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="车企名称"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="vehicleTypeName"
        label="车辆类型"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="plateNo"
        label="车牌号"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="vehicleStatusName"
        label="机动车状态"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="vin"
        label="车架号"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="displacement"
        label="车辆排量"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="vehicleRunName"
        label="车辆实时状态"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="owner"
        label="车主姓名"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="ownerPhone"
        label="车主联系电话"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="dischargeStandardName"
        label="排放标准"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="registerDateStr"
        label="注册登记日期"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="obdStatusName"
        label="是否安装OBD"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="punishCount"
        label="处罚次数"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="analysisCount"
        label="预警次数"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="opsName"
        label="运维公司"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        header-align="left"
        align="right"
        width="180"
      >
        <template slot-scope="scope">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            @click="modalShow('edit', scope.row)"
          >
          编辑
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="onDel(scope.row)"
          >
            删除
          </el-button>
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
    <el-dialog :visible.sync="dialogVisibleImg">
     <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog
      :title="modalTitle"
      :visible.sync="dialogVisible"
      width="800px"
      @close="modalClose"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-row>
           <el-col :span="12">
           <el-form-item label="车企名称" prop="">
             <el-select v-model="ruleForm.companyId" placeholder="请选择" @change="companyChange">
                <el-option
                  v-for="item in companyList"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                  
                />
              </el-select>
            </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="行政区" id="formModal">
              <treeselect
                v-model="ruleForm.orgId"
                placeholder="请选择"
                size="small"
                :multiple="false"
                :options="orgTeeModal"
                :normalizer="normalizer"
                :disable-branch-nodes="true"
              />
            </el-form-item>
          </el-col>
        
        </el-row>
        <el-row>
         
           
            <el-col :span="12">
            <el-form-item label="车辆类型" prop="vehicleType">
              <el-select v-model="ruleForm.vehicleType" placeholder="请选择">
                <el-option
                  v-for="item in vehicleTypeList"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号" prop="plateNo">
              <el-input v-model="ruleForm.plateNo" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车架号" prop="vin">
              <el-input
                v-model="ruleForm.vin"
                placeholder="请输入车架号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车主名称" prop="owner">
              <el-input v-model="ruleForm.owner" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车主联系电话" prop="ownerPhone">
              <el-input v-model="ruleForm.ownerPhone" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌型号" prop="brand">
              <el-select v-model="ruleForm.brand" placeholder="请选择">
                <el-option
                  v-for="item in VehicleBrandList"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排放标准" prop="dischargeStandard">
              <el-select
                v-model="ruleForm.dischargeStandard"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in PFListModel"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发动机厂商" prop="engineFactory">
              <el-select v-model="ruleForm.engineFactory" placeholder="请选择">
                <el-option
                  v-for="item in VehicleEngineFactoryList"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="发动机号码" prop="engineNo">
              <el-input
                v-model="ruleForm.engineNo"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册登记日期" prop="registerDate">
              <div class="block">
                <el-date-picker
                  v-model="ruleForm.registerDate"
                  type="date"
                  value-format="yyyyMMdd"
                  placeholder="选择日期"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="总质量" prop="grossMass">
              <el-input
                v-model="ruleForm.grossMass"
                placeholder="请输入"
                class='inputDW'
              ></el-input>
               <!-- <text :span="1" class="line">KG</text> -->
               <el-button type="text" style='cursor:default;color:#000'>KG</el-button>
            </el-form-item>
           
          </el-col>
          

          <el-col :span="12">
            <el-form-item label="整备质量" prop="unladenMass">
              <el-input
                v-model="ruleForm.unladenMass"
                placeholder="请输入"
                 class='inputDW'
              ></el-input>
               <el-button type="text" style='cursor:default;color:#000'>KG</el-button>
            </el-form-item>
          </el-col>
           
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="核定载重量" prop="approvedLoad">
              <el-input
                v-model="ruleForm.approvedLoad"
                placeholder="请输入"
                 class='inputDW'
              />
                <el-button type="text" style='cursor:default;color:#000'>KG</el-button>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="准牵引总质量" prop="tractionMass">
              <el-input
                v-model="ruleForm.tractionMass"
                placeholder="请输入"
                 class='inputDW'
              ></el-input>
               <el-button type="text" style='cursor:default;color:#000'>KG</el-button>
            </el-form-item>
          </el-col>
         
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="尿素罐容量" prop="ureatankCapacity">
              <el-input
                v-model="ruleForm.ureatankCapacity"
                placeholder="请输入尿素罐容量"
                 class='inputDW'
              ></el-input>
                 <el-button type="text" style='cursor:default;color:#000'>L</el-button>
            </el-form-item>
          </el-col>
        
          <el-col :span="12">
            <el-form-item label="邮箱容量" prop="fueltankCapacity">
              <el-input
                v-model="ruleForm.fueltankCapacity"
                placeholder="请输入邮箱容量"
                 class='inputDW'
              ></el-input>
                <el-button type="text" style='cursor:default;color:#000'>L</el-button>
            </el-form-item>

          </el-col>
         
        </el-row>
          <el-row>
          <el-col :span="12">
            <el-form-item label="车辆排量" prop="displacement">
              <el-input
                v-model="ruleForm.displacement"
                placeholder="请输入"
                  class='inputDW'
              ></el-input>
               <el-button type="text" style='cursor:default;color:#000'>L</el-button>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="长度" prop="length">
              <el-input
                v-model="ruleForm.length"
                placeholder="请输入"
                 class='inputDW'
              ></el-input>
               <el-button type="text" style='cursor:default;color:#000'>CM</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="宽度" prop="width">
              <el-input
                v-model="ruleForm.width"
                placeholder="请输入"
                class='inputDW'
              ></el-input>
              <el-button type="text" style='cursor:default;color:#000'>CM</el-button>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="高度" prop="height">
              <el-input
                v-model="ruleForm.height"
                placeholder="请输入"
                class='inputDW'
              ></el-input>
              <el-button type="text" style='cursor:default;color:#000'>CM</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="运维公司" prop="opsId" class="parent-tree">
              <treeselect
                v-model="ruleForm.opsId"
                placeholder="请选择"
                :multiple="false"
                :options="OperaTree"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌颜色" prop="plateColor">
              <el-select v-model="ruleForm.plateColor" placeholder="请选择">
                <el-option
                  v-for="item in plateColorList"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      
        <el-row>
           <el-col :span="12">
            <el-form-item label="燃料类型" prop="fuelType">
              <el-select v-model="ruleForm.fuelType" placeholder="请选择">
                <el-option
                  v-for="item in fuelTypeList"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
            <el-col :span="12">
            <el-form-item label="机动车状态" prop="vehicleStatus">
              <el-select v-model="ruleForm.vehicleStatus" placeholder="请选择">
                <el-option
                  v-for="item in vehicleStatusList"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="车辆图片">
              <el-upload
                ref="upload"
                class="upload-demo"
                 list-type="picture-card"
                :action="uploadUrl"
                :file-list="fileList"
                :data="upLoadData"
                :on-error="uploadFalse"
                :on-success="uploadSuccess"
                :on-remove="removeFile"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePictureCardPreview"
              >
                 <i class="el-icon-plus"></i>
              </el-upload>
              
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="text-align: right">
          <el-button type="primary" size="small" @click="save()">
            保存
          </el-button>
          <el-button size="small" @click="onCancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import enumPublic from '@/api/enumPublic.js'
import carDetail from '@/api/archivesYW/carManagement/carDetail.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  data() {
    return {
      clearable:false,
      token:"",
      total: null,
      hidePage: true,
      PFList: [], //排放类型下拉
      PFListModel: [], //排放类型下拉model
      YesNo: [], //是否下拉
      RealtimeStatus: [], //当前状态下拉
      vehicleTypeList: [], //车辆类型
      fuelTypeList: [], //（模态框）燃料类型下拉
      VehicleEngineFactoryList: [], //发动机厂商
      VehicleBrandList: [], //品牌型号
      plateColorList:[],//车身颜色
      vehicleStatusList:[],//机动车状态
      OperaTree: [],
      orgIdMR:"",
      opsId:'',
      dialogVisible: false,
      dialogVisibleImg: false,
      dialogImageUrl:"",
      orgTree: [],
      orgTeeModal:[],
      companyList:[],//车企下拉
      normalizer(node) {
        return {
          id: node.orgId,
          label: node.orgName,
          children: node.childOrgs,
        };
      },
      modalTitle: '',
      //表格数据
      tableData: [],
      tableQuery: {
        limit: null,
        page: 1,
        orgId: [],
        dischargeStandard: "", //排放标准
        vehicleStatus: "", //当前状态
        obdStatus: "",
        plateNo: "", //车牌号
        companyName:"",
      },
      ruleForm: {
        id:"",
        objId:"",
        orgId: [],
        vehicleType: "", //车辆类型，
        companyId: "", //车企名称
        plateNo: "", //车牌号
        vin: "", //车架号
        owner: "", //车主名称
        ownerPhone: "", //车主联系电话
        brand: "", //品牌型号
        dischargeStandard: "", //排放标准
        engineFactory: "", //发动机厂商
        engineNo: "", //发动机号码
        registerDate: "", //注册登记日期
        approvedLoad: "", //载重量
        tractionMass:"",//准牵引总质量
        grossMass:"",//总质量
        unladenMass:"",//整备质量
        length:"",//长度
        width:"",//宽度
        height:"",//高度
        displacement: "", //车辆排量
        ureatankCapacity: "", //尿素罐容量
        fueltankCapacity: "", //邮箱容量
        fuelType: "", //燃料类型
        opsId: [], //运维公司
        plateColor:"",//车身颜色
        vehicleStatus:"",//机动车状态
        fileId: [], //车辆照片
         bussType:"obd-carImg",
      },
      uploadUrl:process.env.VUE_APP_BASE_API + "api-file/files/files/uploadAll",
      fileList: [],
      upLoadData:{bussId:"", bussType:"obd-carImg"},//上传携带的bussTYpe
      
    };
  },
  mounted() {
    this.token =getToken();
    if(this.$route.query.companyName){
       // this.tableQuery.orgId = this.$route.query.orgId;
        this.tableQuery.companyName = this.$route.query.companyName;
    }
    this.tableQuery.limit = Math.floor(
      (document.documentElement.clientHeight -
        this.$refs.tableDiv.$el.getBoundingClientRect().top -
        93) /39
    );
    
    this.getOrgTree(null);
    this.getManageOperaTree(); //运维公司下拉
  },
  methods: {
    getOrgTree(changeVal) {
      if(!changeVal){
         enumPublic.getOrgTree().then((response) => {
        this.orgTree.push(response.data);
        this.orgTeeModal.push(response.data);
        if(!this.$route.query.orgId){
            this.tableQuery.orgId.push(this.orgTree[0].orgId);
        }
        this.orgIdMR = this.orgTree[0].orgId;
       
         this.getPFList();
   
      });
      }else{
         enumPublic.getOrgTreeChange({companyId:changeVal}).then((response) => {
            this.orgTeeModal=[];
        this.orgTeeModal.push(response.data);
        this.ruleForm.orgId=[];
        this.ruleForm.orgId.push(this.orgTeeModal[0].orgId);
      });
      }
     
    },
    getPFList() {
      //排放标准下拉
      enumPublic.enumPublic({ groupCode: "EmissionType" }).then((response) => {
        this.PFList = response.data;
       
        this.PFList.unshift({ enumName: "全部", enumCode: -1 });
        this.tableQuery.dischargeStandard = -1;
       
         this.getRealtimeStatus();
      });
    },
    //车牌颜色
    getPlateColorList(){
      enumPublic.enumPublic({ groupCode: "PlateColor" }).then((response) => {
        this.plateColorList = response.data;
      });
    },
    getYesNo() {
      enumPublic.enumPublic({ groupCode: "getYesNo" }).then((response) => {
        response.data.unshift({ enumName: "全部", enumCode: -1 });
        this.YesNo = response.data;
        this.tableQuery.obdStatus = -1;
        
    this.getTableList();
      });
    },
    //车辆当前状态下拉
    getRealtimeStatus() {
      enumPublic
        .enumPublic({ groupCode: 'VehicleRealtimeStatus' })
        .then((response) => {
          response.data.unshift({ enumName: "全部", enumCode: -1 });
          this.RealtimeStatus = response.data;
          this.tableQuery.vehicleStatus = -1;
          
      this.getYesNo();
        });
    },
    getTableList() {
    this.tableQuery.orgId = this.tableQuery.orgId.toString();
      carDetail.getTableList(this.tableQuery).then((response) => {
        this.total = response.data.count;
        this.tableData = response.data.data;
      });
    },
    changePage(page) {
      this.tableQuery.page = page
      this.getTableList()
    },
    modalShow(type, data) {
      if(this.vehicleTypeList.length<1){
        
          this.VehicleType(); //车辆类型
          this.VehicleBrand(); //品牌型号
          this.VehicleEngineFactory(); //发动机品牌
          this.FuelType(); //燃料类型
         
          this.getPlateColorList();//车身颜色
          this.getCompany();//企业下拉
          this.getPFListModal();//排放标准
          this.vehicleStatus();//j机动车状态下拉
      }
      this.dialogVisible = true;
      this.ruleForm.orgId=[];
      this.ruleForm.opsId=[];
     this.ruleForm.fileId = [];
      this.$nextTick(() => {
        if (type == "add") {
          this.modalTitle = "新增";
          this.ruleForm.id = "";
          this.ruleForm.objId = "";
          this.ruleForm.orgId.push(this.orgIdMR );
          this.ruleForm.vehicleType= ""; //车辆类型，
          this.ruleForm.companyId= ""; //车企名称
          this.ruleForm.plateNo= ""; //车牌号
          this.ruleForm.vin= ""; //车架号
          this.ruleForm.owner= ""; //车主名称
          this.ruleForm.ownerPhone= ""; //车主联系电话
          this.ruleForm.brand= ""; //品牌型号
          this.ruleForm.dischargeStandard= ""; //排放标准
          this.ruleForm.engineFactory= ""; //发动机厂商
          this.ruleForm.engineNo= ""; //发动机号码
          this.ruleForm.registerDate= ""; //注册登记日期
          this.ruleForm.approvedLoad= ""; //载重量
          this.ruleForm.tractionMass="";//准牵引总质量
          this.ruleForm.grossMass="";//总质量
          this.ruleForm.unladenMass="";//整备质量
          this.ruleForm.length="";//长度
          this.ruleForm.width="";//宽度
          this.ruleForm.height="";//高度
          this.ruleForm.displacement= ""; //车辆排量
          this.ruleForm.ureatankCapacity= ""; //尿素罐容量
          this.ruleForm.fueltankCapacity= ""; //邮箱容量
          this.ruleForm.fuelType= ""; //燃料类型
          this.ruleForm.opsId.push(this.opsId); //运维公司
          this.ruleForm.plateColor="";//车身颜色
          this.ruleForm.vehicleStatus="";//机动车状态

        } else if (type == "edit") {
          this.modalTitle = "修改";
          this.ruleForm.id = data.id;
          this.ruleForm.objId = data.objId
          this.ruleForm.orgId.push(data.orgId);
          this.ruleForm.vehicleType= data.vehicleType //车辆类型，
          this.ruleForm.companyId= parseInt(data.companyId) //车企名称
          this.ruleForm.plateNo= data.plateNo //车牌号
          this.ruleForm.vin= data.vin //车架号
          this.ruleForm.owner= data.owner //车主名称
          this.ruleForm.ownerPhone= data.ownerPhone //车主联系电话
          this.ruleForm.brand= data.brand //品牌型号
          this.ruleForm.dischargeStandard= data.dischargeStandard //排放标准
          this.ruleForm.engineFactory= data.engineFactory //发动机厂商
          this.ruleForm.engineNo= data.engineNo //发动机号码
          this.ruleForm.registerDate= data.registerDate.toString();//注册登记日期
          this.ruleForm.approvedLoad= data.approvedLoad //载重量
          this.ruleForm.tractionMass=data.tractionMass//准牵引总质量
          this.ruleForm.grossMass=data.grossMass//总质量
          this.ruleForm.unladenMass=data.unladenMass//整备质量
          this.ruleForm.length=data.length//长度
          this.ruleForm.width=data.width//宽度
          this.ruleForm.height=data.height;//高度
          this.ruleForm.displacement= data.displacement //车辆排量
          this.ruleForm.ureatankCapacity= data.ureatankCapacity //尿素罐容量
          this.ruleForm.fueltankCapacity= data.fueltankCapacity //邮箱容量
          this.ruleForm.fuelType= data.fuelType //燃料类型
          this.ruleForm.opsId.push(data.opsId) //运维公司
          this.ruleForm.plateColor=data.plateColor//车身颜色
          this.ruleForm.vehicleStatus=data.vehicleStatus//机动车状态
          this.getFile(data.id);//营业执照获取
          }
      })
      
    },
    
      // 修改时获取文件
    getFile(id,bussType){
        var params ={
          id:id,
          bussType:"obd-carImg"
        }
        enumPublic.getFile(params).then((response) => {
           this.fileList = response.data;
           var that = this;
           response.data.forEach(function(item,i){
              that.ruleForm.fileId.push(item.id)
           })
       })
    },
  //企业名称下拉
   getCompany() {
      carDetail.getCompany().then((response) => {
        this.companyList = response.data;
      });
    },
    //企业名称下拉change
    companyChange(val){
      this.getOrgTree(val)
    },
    //车辆类型
    VehicleType() {
      enumPublic.enumPublic({ groupCode: "VehicleType" }).then((response) => {
        this.vehicleTypeList = response.data;
      });
    },
     getPFListModal() {
      //排放标准下拉
      enumPublic.enumPublic({ groupCode: "EmissionType" }).then((response) => {
         this.PFListModel = response.data;
      });
    },
    //品牌型号
    VehicleBrand() {
      enumPublic.enumPublic({ groupCode: "VehicleBrand" }).then((response) => {
        this.VehicleBrandList = response.data;
      });
    },
    //发动机品牌
    VehicleEngineFactory() {
      enumPublic
        .enumPublic({ groupCode: "VehicleEngineFactory" })
        .then((response) => {
          this.VehicleEngineFactoryList = response.data;
        });
    },
    //r燃料类型
    FuelType() {
      enumPublic.enumPublic({ groupCode: "FuelType" }).then((response) => {
        this.fuelTypeList = response.data;
      });
    },
//运维公司下拉数
    getManageOperaTree() {
      
      enumPublic.getManageOperaTree({}).then((response) => {
        this.OperaTree = response.data;
        this.ruleForm.opsId = [];
        this.opsId = response.data[0].id
        
      });
    },
      //机动车状态
    vehicleStatus() {
      enumPublic.enumPublic({ groupCode: "vehicleStatus" }).then((response) => {
        this.vehicleStatusList = response.data;
      });
    },
    onDel(data) {
      this.$confirm('是否确认提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          id: data.id,
          objId:data.objId
        };
        carDetail.del(params).then((response) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
           this.getTableList();
        });
      });
    },
    //查看图片
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisibleImg = true;
      },
    //文件上传成功触发
    uploadSuccess(response, file, fileList) {
      console.log(response)
      if (response.code === 200) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this.ruleForm.fileId.push(response.data.id);
      } else {
        this.$message({
          message: '上传失败',
          type: 'error'
        })
      }
    },
    // 文件上传失败触发
    uploadFalse(response, file, fileList) {
      this.$message({
        message: '文件上传失败！',
        type: 'error'
      })
    },
    // 上传前对文件的大小和类型的判断
    beforeAvatarUpload(file) {
      console.log(file.size)
      var fileSize = file.size
      if (fileSize > 1048576) {
        this.$message({
          message: '上传文件不能超过1M!',
          type: 'error'
        })
        return false
      }
       if(this.modalText=="新增"){
        this.upLoadData.bussId = "";
      }else{
        this.upLoadData.bussId = this.ruleForm.id;
      }
    },
    // 删除文件
    removeFile(file, fileList) {
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
          that.ruleForm.fileId.splice(
            that.ruleForm.fileId.findIndex((item) => item === fileId),
            
          );
        });
      }
    },
    // 表单提交
    save(form) {
      this.$confirm('是否确认提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ruleForm.orgId = this.ruleForm.orgId.toString()
       this.ruleForm.opsId = this.ruleForm.opsId.toString()
         this.ruleForm.fileId = this.ruleForm.fileId.toString();
        
          carDetail.save(this.ruleForm).then((response) => {
            this.$message({
              type: "success",
              message: "保存成功!",
            });
            this.dialogVisible = false;
            this.getTableList();
          });
      });
    },
    modalClose() {
      this.$refs.upload.clearFiles();
    },
     //导出
    exportt(data) {
       window.location.href=process.env.VUE_APP_BASE_API+"api-obdMonitor/carDetailsOper/getCarDetailsExport?access_token="+this.token+"&companyName="+this.tableQuery.companyName+"&orgId="+this.tableQuery.orgId+"&dischargeStandard="+this.tableQuery.dischargeStandard+"&obdStatus="+this.tableQuery.obdStatus+"&plateNo="+this.tableQuery.plateNo+"&vehicleStatus="+this.tableQuery.vehicleStatus
     
    },
     cellClick(row, column, cell, event){
         if (column.property === "plateNo") {
          this.$router.push({
            path: "/archivesYW/carArchivesInfo",
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
    //表单取消
    onCancel(form) {
      this.dialogVisible = false;
    },
    // 清空表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep .el-dialog__body .el-input__inner{
  width:200px !important;
}
::v-deep .el-dialog__body .inputDW{
  display: inline;
  .el-input__inner{
     width:175px !important;
     margin-right: 5px;
  }
}
::v-deep .el-date-editor.el-input, .el-date-editor.el-input__inner{
  width:200px !important;
}
#formModal ::v-deep .el-form-item__content{
    line-height: 32px !important;  
}
#topForm {
  height: 32px;
  .el-form-item {
    margin-bottom: 10px;
  }
}
::v-deep .el-form-item--small .el-form-item__content,
.el-form-item--small .el-form-item__label {
  line-height: 30px;
}
::v-deep .vue-treeselect__control {
  height: 30px;
}
.auth-table {
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 5px 10px;
  }
}
.vue-treeselect {
  width: 200px !important;
}
</style>

