<template>
  <div>
    <el-form :inline="true"  id="topForm" size="small" :model="ruleForm" class="demo-form-inline">
      <el-form-item label="OBD设备编码">
        <el-input
          v-model="tableQuery.code"
          placeholder="请输入OBD设备编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="绑定车牌号">
        <el-input
          v-model="tableQuery.plateNo"
          placeholder="请输入车牌号"
        ></el-input>
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
        min-width="180"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="companyName"
        min-width="200"
        label="车企名称"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="vehicleTypeName"
        min-width="120"
        label="车辆类型"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="plateNo"
        min-width="120"
        label="车牌号"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="vin"
        min-width="120"
        label="车架号"
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
        prop="addr"
        min-width="180"
        label="设备通讯地址"
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
        prop="installationDateStr"
        min-width="120"
        label="设备安装日期"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column label="操作" header-align="left" align="right" width="180">
        <template slot-scope="scope">
          <el-button v-show="!scope.row.id"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="modalShow('bind',scope.row)"
            >绑定</el-button
          >
           <el-button v-show="scope.row.id"
            type="success"
            icon="el-icon-edit"
            size="mini"
            @click="modalShow('edit',scope.row)"
            >修改</el-button
          >
          <el-button v-show="scope.row.id"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="del(scope.row)"
            >解绑</el-button
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
     <el-dialog :visible.sync="dialogVisibleImg">
     <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog :title="modalText" :visible.sync="dialogVisible" width="800px">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
        :rules="rules"
        @close="modalClose"
      >
        <el-row>
        
         <el-col :span="12">
            <el-form-item label="行政区">
             <span>{{modalData.orgName}}</span>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="车企名称">
             <span>{{modalData.companyName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
         
         <el-col :span="12">
            <el-form-item label="车辆类型">
             <span>{{modalData.vehicleType}}</span>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="车架号">
             <span>{{modalData.vin}}</span>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
         
         <el-col :span="12">
            <el-form-item label="车牌号">
             <span>{{modalData.plateNo}}</span>
            </el-form-item>
          </el-col>
         
        </el-row>

        <el-row>
           <el-col :span="12">
            <el-form-item label="OBD设备编码" prop="code">
              <el-input
                v-model="ruleForm.code"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="OBD厂商">
              <el-select
                v-model="ruleForm.factory"
                clearable
                placeholder="请选择"
                style="width: 230px"
              >
                <el-option v-for="(item,index) in ObdFactoryType" :key="index" :label="item.enumName" :value="item.enumCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
         
        </el-row>
        <el-row>
           <el-col :span="12">
            <el-form-item label="OBD设备通讯地址" prop="addr">
              <el-input
                v-model="ruleForm.addr"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
         
           <el-col :span="12">
            <el-form-item label="OBD设备安装时间">
              <el-date-picker
            v-model="ruleForm.installationDate"
            type="date"
            placeholder="选择日期"
             value-format="yyyyMMdd"
            >
          </el-date-picker>
            </el-form-item>
        </el-col>
         
        </el-row>
        <el-row>
            
             <el-col :span="24">
                <el-form-item label="OBD设备安装图片">
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
          <el-button type="primary" size="small" @click="save('ruleForm')"
            >保存</el-button
          >
          <el-button size="small" @click="dialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import equipmentbind from "@/api/archives/equipmentManagement/equipmentbind.js";
import enumPublic from "@/api/enumPublic.js";
export default {
  // mixins: [resize],
  data() {
    return {
      token:"",
      hidePage: true,
      total:null,
      dialogVisible: false,
      dialogVisibleImg:false,
      tableData:[],
        modalText:"", 
         ObdFactoryType:[],//obd厂商下拉
      modalTitle: "",
      modalData:{
        orgName:"",
        companyName:'',
        vehicleTypeName:"",//车辆类型
        vin:"",//车架号
        plateNo:"",//车牌号
      },
      tableQuery: {
        limit:0,
        page:0,
        code:"",
        plateNo:""
      },
      ruleForm:{
        id:null,//主键id(新增为null,修改传值)
        code:"",//obd设备编码：
        objId:"",//被监管对象id：
        installationDate:"",//obd设备安装时间：
        factory:"",//obd厂商：
        addr:"",//obd设备通讯地址：
        fileId:[],
        bussType:"obd-equipmentInstall",//
      },
     // fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
       fileList:[],
      upLoadData:{bussId:"", bussType:"obd-equipmentInstall"},
      
       rules: {
          code: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          addr: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
       },
      uploadUrl:process.env.VUE_APP_BASE_API + "api-file/files/files/uploadAll",
      dialogImageUrl:"",
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
    this.getTableList();
  },

  methods: {
     //下拉
    getObdFactoryType() {
      enumPublic
        .enumPublic({ groupCode: "ObdFactoryType" })
        .then((response) => {
          this.ObdFactoryType = response.data;
        });
    },
    getTableList(){
       equipmentbind.getTableList(this.tableQuery).then((response) => {
          this.total = response.data.count;
          this.tableData = response.data.data;
       })
    },
    changePage(page) {
      this.tableQuery.page = page;
      this.getTableList();
    },
    modalShow(type,data) {
      if(this.ObdFactoryType.length<1){
        this.getObdFactoryType();
      }
      this.dialogVisible = true;
      this.modalData.orgName =data.orgName;
      this.modalData.companyName =data.companyName;
      this.modalData.vehicleTypeName =data.vehicleTypeName;//车辆类型
      this.modalData.vin =data.vin;//车架号
      this.modalData.plateNo =data.plateNo;//车牌号
      this.ruleForm.objId = data.objId;
       this.ruleForm.fileId = [];
      if(type=="bind"){
         this.modalText = "绑定";
         this.ruleForm.id = null;//主键id(新增为null,修改传值)
        this.ruleForm.code = "";//obd设备编码：
        this.ruleForm.installationDate = "";//obd设备安装时间：
        this.ruleForm.factory = "";//obd厂商：
        this.ruleForm. addr = "";//obd设备通讯地址：
        
      }else if(type=="edit"){
         this.modalText = "修改";
          this.ruleForm.id = data.id;//主键id(新增为null,修改传值)
        this.ruleForm.code = data.code;//obd设备编码：
        this.ruleForm.installationDate = data.installationDate;//obd设备安装时间：
        this.ruleForm.factory = data.factory;//obd厂商：
        this.ruleForm.addr = data.addr;//obd设备通讯地址：
        //this.ruleForm.fileId = data.fileId;
        this.getFile(data.id);
      }
    },
    // 修改时获取文件
    getFile(id){
        var params ={
          id:id,
          bussType:"obd-equipmentInstall"
        }
        enumPublic.getFile(params).then((response) => {
           this.fileList = response.data;
           var that = this;
           response.data.forEach(function(item,i){
              that.ruleForm.fileId.push(item.id)
           })
         
       })
    },
    //查看图片
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisibleImg = true;
      },
     uploadSuccess(response, file, fileList) {
      console.log(response);
      if (response.code == 200) {
        this.$message({
          message: "上传成功",
          type: "success",
        });
        this.ruleForm.fileId.push(response.data.id)
      } else {
        this.$message({
          message: "上传失败",
          type: "error",
        });
      }
    },
    //文件上传失败触发
    uploadFalse(response, file, fileList) {
      this.$message({
        message: "文件上传失败！",
        type: "error",
      });
    },
    // 上传前对文件的大小和类型的判断
    beforeAvatarUpload(file) {
      console.log(file.size);
      var fileSize = file.size;
      if (fileSize > 1048576) {
        this.$message({
          message: "上传文件不能超过1M!",
          type: "error",
        });
        return false;
      }
        if(this.modalText=="绑定"){
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
        var that = this;
        enumPublic.delFile({ id: fileId }).then((response) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          that.ruleForm.fileId.splice(that.ruleForm.fileId.findIndex(item => item === fileId), 1);
        });
      }
    },
    save(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
           this.$confirm("是否确认提交?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).then(() => {
                this.ruleForm.fileId = this.ruleForm.fileId.toString();
                equipmentbind.save(this.ruleForm).then((response) => {
                  this.$message({
                    type: "success",
                    message: "保存成功!",
                  });
                  this.dialogVisible = false;
                  this.getTableList();
                })
            })
          } else {
            return false;
          }
      
    })
    },
    del(data){
     
       this.$confirm("是否确认删除?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).then(() => {
                equipmentbind.del({id:data.id}).then((response) => {
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                  this.getTableList();
                })
            })
    },
    //导出
    exportt(){
      window.location.href=process.env.VUE_APP_BASE_API+"api-obdMonitor/companyDetails/getDeviceDetailsExport?access_token="+this.token+"&code="+this.tableQuery.code+"&plateNo="+this.tableQuery.plateNo;
    
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
   modalClose() {
      this.$refs.upload.clearFiles();
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
.auth-table {
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 5px 10px;
  }
}
</style>
