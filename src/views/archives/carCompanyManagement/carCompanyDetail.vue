<template>
  <div>
    <el-form
      :inline="true"
      ref="form"
      class="demo-form-inline"
      size="small"
      id="topForm"
    >
     <el-form-item label="行政区">
        <treeselect
        v-model="tableQuery.orgId"
        placeholder="请选择"
        :multiple="false"
        :options="orgTree"
        :clearable="clearable"
        :normalizer="normalizer"
      />
      </el-form-item>
      <el-form-item label="车企名称">
        <el-input v-model="tableQuery.companyName" placeholder="请输入车企名称"></el-input>
      </el-form-item>
      <el-form-item label="统一组织机构代码">
        <el-input
          v-model="tableQuery.usci"
          placeholder="请输入统一组织机构代码"
        ></el-input>
      </el-form-item>
      <el-form-item  style="float:right">
        <el-button
          class=""
          size="small"
          type="success"
          icon="el-icon-search"
          @click="getTableList"
        >
          查询
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="modalShow('add')"
          >新增</el-button
        >
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
       <el-table-column
       type='index'
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="行政区"
        width="180"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="name"
        min-width="180"
        label="车企名称"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="propertyName"
        label="企业性质"
         width="180"
        show-overflow-tooltip
        >
      </el-table-column>
       <el-table-column
        prop="usci"
         width="180"
        label="统一组织机构代码"
        show-overflow-tooltip
        >
      </el-table-column>
       <el-table-column
        prop="address"
         min-width="180"
        label="车辆停放地"
        show-overflow-tooltip
        >
      </el-table-column>
       <el-table-column
        prop="legalPerson"
        label="法人代表"
         width="120"
        show-overflow-tooltip
        >
      </el-table-column>
       <el-table-column
        prop="linkMan"
        label="负责人"
         width="120"
        show-overflow-tooltip
        >
      </el-table-column>
       <el-table-column
        prop="linkPhone"
         width="180"
        label="联系电话"
        show-overflow-tooltip
        >
      </el-table-column>
       <el-table-column
        prop="vehicleNum"
         width="120"
        label="车辆数量"
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
            icon="el-icon-edit"
            type="success"
            size="mini"
            @click="modalShow('edit', scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="onDel(scope.row)"
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
      :page-size="tableQuery.pageSize"
      @current-change="changePage"
    /> 
    <el-dialog :title="modalText" :visible.sync="dialogVisible" width="800px" @close="modalClose">
      <el-form
      
        :model="ruleForm"
        ref="ruleForm"
        label-width="150px"
        :rules="rules"
        
      >
        <el-row>
           <el-col :span="12">
           <el-form-item label="行政区" id="formModal" prop="orgId">
               <treeselect
                v-model="ruleForm.orgId"
                placeholder="请选择"
                :multiple="false"
                :options="orgTree"
                :normalizer="normalizer"
                :disable-branch-nodes="true"
              />
            </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="车企名称" prop="name">
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="统一组织机构代码" prop="usci">
              <el-input
                v-model="ruleForm.usci"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业性质" prop="property">
              <el-select
                v-model="ruleForm.property"
                placeholder="请选择"
                style="width: 230px"
                clearable
              >
                <el-option
                  v-for="val in propertyData"
                  :key="val.enumCode"
                  :value="val.enumCode"
                  :label="val.enumName"
                />
              </el-select>
            </el-form-item>
          </el-col>
         
        </el-row>
        <el-row>
          
           <el-col :span="12">
            <el-form-item label="法人代表" prop="legalPerson">
              <el-input
                v-model="ruleForm.legalPerson"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆停放地" prop="address">
              <el-input
                v-model="ruleForm.address"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
         
        </el-row>
        <el-row>
           <el-col :span="12">
            <el-form-item label="联系电话" prop="linkPhone">
              <el-input
                v-model="ruleForm.linkPhone"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="linkMan">
              <el-input
                v-model="ruleForm.linkMan"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          
        </el-row>
        <el-row>
            <el-col :span="24">
              <el-form-item
                label="上传企业营业执照"
              >
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="uploadUrl"
                  :file-list="fileListZZ"
                  :data="upLoadDataZZ"
                  :on-error="uploadFalseZZ"
                  :on-success="uploadSuccessZZ"
                  :on-remove="removeFileZZ"
                  :before-upload="beforeAvatarUploadZZ"
                   :on-preview="handleGetFileId"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <!-- <div slot="tip" class="el-upload__tip" style="color: red">
                    上传文件只能是 xls、xlsx、txt 格式!
                  </div> -->
                </el-upload>
              </el-form-item>
            </el-col>
            
        </el-row>
        <el-row>
          <el-col :span="24">
              <el-form-item
                label="上传测试通过报告"
              >
                <el-upload
                  class="upload-demo"
                  ref="upload1"
                  :action="uploadUrl"
                  :file-list="fileListBG"
                  :data="upLoadDataBG"
                  :on-error="uploadFalseBG"
                  :on-success="uploadSuccessBG"
                  :on-remove="removeFileBG"
                  :before-upload="beforeAvatarUploadBG"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <!-- <div slot="tip" class="el-upload__tip" style="color: red">
                    上传文件只能是 xls、xlsx、txt 格式!
                  </div> -->
                </el-upload>
              </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="text-align: right">
          <el-button type="primary" size="small" @click="save()"
            >保存</el-button
          >
          <el-button size="small" @click="onCancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
 
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import enumPublic from "@/api/enumPublic.js";
import carCompanyDetail from "@/api/archives/carCompanyManagement/carCompanyDetail.js";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { Treeselect },
  data() {
    return {
      clearable:false,
      token:"",
     total:null,
      hidePage: true,
      modalText: "",
      propertyData: [], //企业性质list
      dialogVisible: false,
      fileListZZ: [],
      fileListBG: [],
      uploadUrl: process.env.VUE_APP_BASE_API + "api-file/files/files/uploadAll",
      downLoadUrl:process.env.VUE_APP_BASE_API + "api-file/files/files/downLoad",
       orgTree:[],
       rules: {
          orgId: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
       },
      normalizer(node) {
        return {
          id: node.orgId,
          label: node.orgName,
          children: node.childOrgs,
        };
      },
      tableQuery:{
          limit:null,
         page:1,
         orgId:[],
         companyName: "",
         usci: "",
      },
      orgIdMR:null,//orgId默认
      ruleForm: {
        id:null,
        orgId:[],//行政区
        name: "", //车企名称
        usci: "", //机构代码
        property: "", //企业性质代码
        legalPerson: "", //法人
        address: "", //车辆停放地
        linkMan: "", //负责人
        linkPhone: "", //电话
        fileId:[],//营业执照
        fileIdSec:[],//测试报告
        bussType:"obd-businessLicense",
        bussTypeSec:"obd-testReport"
      },
      // 表格数据
      tableData: [],
       upLoadDataZZ:{bussId:"", bussType:"obd-businessLicense"},//上传携带的bussTYpe（营业执照）
       upLoadDataBG:{bussId:"",bussType:"obd-testReport"},//上传携带的bussTYpe（测试报告）
    };
  },
  mounted() {
     this.tableQuery.limit = Math.floor(
      (document.documentElement.clientHeight -
        this.$refs.tableDiv.$el.getBoundingClientRect().top -
        93) /
        39
    );
   this.token =getToken();
     this.getOrgTree();
     
  },
  methods: {
    getOrgTree(){
      enumPublic.getOrgTree().then((response) => {
          this.orgTree.push(response.data);
          this.orgIdMR = this.orgTree[0].orgId;
          this.tableQuery.orgId.push(this.orgIdMR);
           this.ruleForm.orgId.push(this.orgIdMR);
            this.getTableList();
        });
    },
    getTableList() {          
      this.tableQuery.orgId = this.tableQuery.orgId.toString();
      carCompanyDetail.getTableList(this.tableQuery).then((response) => {
        this.total = response.data.count;
        this.tableData = response.data.data;
        
      });
    },
    //分页
    changePage(page) {
      this.tableQuery.page = page;
      this.getTableList();
    },
    //企业性质
    getCompanyNature() {
      enumPublic.enumPublic({ groupCode: "CompanyProperty" }).then((response) => {
          this.propertyData = response.data;
        });
    },
    modalShow(type, data) {
       this.ruleForm.orgId=[];
        if(this.propertyData.length<1){
            this.getCompanyNature();
        }
        this.dialogVisible = true;
        this.ruleForm.fileId = [];
        this.ruleForm.fileIdSec = []
        if (type == "add") {
          this.modalText = "新增";
          this.ruleForm.id = null;
          this.ruleForm.orgId.push(this.orgIdMR);
          this.ruleForm.name = "";//车企名称
          this.ruleForm.usci = ""; //机构代码
          this.ruleForm.property = "";//企业性质代码
          this.ruleForm.legalPerson =  ""; //法人
          this.ruleForm.address = ""; //车辆停放地
          this.ruleForm.linkMan = "";//负责人
          this.ruleForm.linkPhone = ""; //电话
        } else if (type == "edit") {
          this.modalText = "修改";
          this.ruleForm.id = data.id;
          this.ruleForm.orgId.push(data.orgId);
          this.ruleForm.name = data.name;//车企名称
          this.ruleForm.usci = data.usci; //机构代码
          this.ruleForm.property = data.property;//企业性质代码
          this.ruleForm.legalPerson =  data.legalPerson; //法人
          this.ruleForm.address = data.address; //车辆停放地
          this.ruleForm.linkMan = data.linkMan;//负责人
          this.ruleForm.linkPhone = data.linkPhone; //电话
          this.getFile(data.id,"obd-businessLicense");//营业执照获取
           this.getFile(data.id,"obd-testReport");//测试报告获取
        }
      
    },
      // 修改时获取文件
    getFile(id,bussType){
        var params ={
          id:id,
          bussType:bussType
        }
        enumPublic.getFile(params).then((response) => {
         if(bussType=="obd-businessLicense"){
           this.fileListZZ = response.data;
           var that = this;
           response.data.forEach(function(item,i){
              that.ruleForm.fileId.push(item.id)
           })
         }else{
             this.fileListBG = response.data;
           var that = this;
           response.data.forEach(function(item,i){
              that.ruleForm.fileIdSec.push(item.id)
           })
         }
       })
    },
    onDel(data) {
      this.$confirm("是否确认提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        var params = {
          id: data.id,
        };
        carCompanyDetail.del(params).then((response) => {
           this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getTableList();
          
        });
      });
    },
    //导出
    exportt(data) {

        window.location.href=process.env.VUE_APP_BASE_API+"api-obdMonitor/companyDetails/getDeviceDetailsExport?access_token="+this.token+"&companyName="+this.tableQuery.companyName+"&orgId="+this.tableQuery.orgId+"&usci="+this.tableQuery.usci
     
    },
       //下载文件
    handleGetFileId(file){
         if(file.response){
          var fileId = file.response.data.id;
        }else{
          var fileId = file.id;
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
    //文件上传成功触发
    uploadSuccessZZ(response, file, fileList) {
      if (response.code == 200) {
        this.$message({
          message: "上传成功",
          type: "success",
        });
        this.ruleForm.fileId.push(response.data.id);
      } else {
        this.$message({
          message: "上传失败",
          type: "error",
        });
      }
    },
    //文件上传失败触发
    uploadFalseZZ(response, file, fileList) {
      this.$message({
        message: "文件上传失败！",
        type: "error",
      });
    },
    // 上传前对文件的大小和类型的判断
    beforeAvatarUploadZZ(file) {
      var fileSize = file.size;
      if (fileSize > 1048576) {
        this.$message({
          message: "上传文件不能超过1M!",
          type: "error",
        });
        return false;
      }
      if(this.modalText=="新增"){
        this.upLoadDataZZ.bussId = "";
      }else{
        this.upLoadDataZZ.bussId = this.ruleForm.id;
      }
      // //this.form.fileName = file.name;
      // const extension = file.name.split(".")[1] === "jpg";
      // const extension2 = file.name.split(".")[1] === "jpeg";
      // const extension3 = file.name.split(".")[1] === "png";
      // if (!extension && !extension2 && !extension3) {
      //   this.$message({
      //     message: "上传文件只能是 jpg、jpeg、png 格式!",
      //     type: "error",
      //   });
      // }
      // // return extension || extension2 || extension3;
    },
    // 删除文件
    removeFileZZ(file, fileList) {
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
    //文件上传成功触发
    uploadSuccessBG(response, file, fileList) {
      if (response.code == 200) {
        this.$message({
          message: "上传成功",
          type: "success",
        });
        this.ruleForm.fileIdSec.push(response.data.id)
      } else {
        this.$message({
          message: "上传失败",
          type: "error",
        });
      }
    },
    //文件上传失败触发
    uploadFalseBG(response, file, fileList) {
      this.$message({
        message: "文件上传失败！",
        type: "error",
      });
    },
    // 上传前对文件的大小和类型的判断
    beforeAvatarUploadBG(file) {
      var fileSize = file.size;
      if (fileSize > 1048576) {
        this.$message({
          message: "上传文件不能超过1M!",
          type: "error",
        });
        return false;
      }
      if(this.modalText=="新增"){
        this.upLoadDataBG.bussId = "";
      }else{
        this.upLoadDataBG.bussId = this.ruleForm.id;
      }
      // //this.form.fileName = file.name;
      // const extension = file.name.split(".")[1] === "jpg";
      // const extension2 = file.name.split(".")[1] === "jpeg";
      // const extension3 = file.name.split(".")[1] === "png";
      // if (!extension && !extension2 && !extension3) {
      //   this.$message({
      //     message: "上传文件只能是 jpg、jpeg、png 格式!",
      //     type: "error",
      //   });
      // }
      // // return extension || extension2 || extension3;
    },
    // 删除文件
    removeFileBG(file, fileList) {
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
    //表单提交
    save() {
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
              this.$confirm("是否确认提交?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                this.ruleForm.orgId = this.ruleForm.orgId.toString();
                this.ruleForm.fileId = this.ruleForm.fileId.toString();
                this.ruleForm.fileIdSec = this.ruleForm.fileIdSec.toString();
                carCompanyDetail.save(this.ruleForm).then((response) => {
                      this.$message({
                        type: "success",
                        message: "保存成功!",
                      });
                      this.dialogVisible = false;
                      this.getTableList();
                    });
                })
          };
          })
    },

    modalClose(){
      this.$refs.upload.clearFiles();
      this.$refs.upload1.clearFiles();
    },
    //表单取消
    onCancel(form) {
      this.$refs.form.resetFields();
        this.dialogVisible = false;
    },
    // 清空表单数据
    resetForm(formName) {
     if (this.$refs[formName]!==undefined) {
        this.$refs[formName].resetFields();
      }
     
    },
    cellClick(row, column, cell, event){
      if(column.property == "vehicleNum")
        this.$router.push({
            path: "/archives/carManagement/carDetail",
            query:{
              //orgId:row.orgId,
              companyName:row.name
              },
          });
    },
    cellStyle(column) {
      if(column.columnIndex === 9) {
      return "color:#409EFF;cursor:pointer"
      }
   },
  }
};
</script>

<style lang='scss' scoped>
#topForm ::v-deep .vue-treeselect {
  width: 184px;
   height: 32px;
}

#topForm ::v-deep .el-form-item--small .el-form-item__content,
.el-form-item--small .el-form-item__label {
  line-height: 30px;
}
#topForm ::v-deep .vue-treeselect__control {
  height: 30px;
}

 #formModal ::v-deep .el-form-item__content{
    line-height: 30px !important;  
}
::v-deep .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
#topForm {
    height:32px;
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
::v-deep .vue-treeselect_menu{
  font-weight: normal;
}
</style>

