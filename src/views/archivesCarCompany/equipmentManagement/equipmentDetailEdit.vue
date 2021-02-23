<template>
  <div class="app-container">
    <el-button type="primary" size="small" @click="dialogVisible = true">新增</el-button>

    <el-table
      ref="tableDiv"
      class="auth-table"
      :data="tableData"
      style="width: 100%; margin: 10px 0"
      border
    >
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column
        prop="factorName"
        label="数据项"
        min-width="150"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="unit"
        min-width="180"
        label="单位"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        min-width="150"
        label="标准上限"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
             <el-input v-model="scope.row.max" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        min-width="150"
        label="标准下限"
        show-overflow-tooltip
      >
      <template slot-scope="scope">
             <el-input v-model="scope.row.min" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="vin"
        min-width="120"
        label="量程上限"
        show-overflow-tooltip
      >
       <template slot-scope="scope">
             <el-input v-model="scope.row.rangeUpper" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="vin"
        min-width="120"
        label="量程下限"
        show-overflow-tooltip
      >
       <template slot-scope="scope">
             <el-input v-model="scope.row.rangeLower" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      

      <!-- <el-table-column
        label="操作"
        header-align="left"
        align="right"
        min-width="120"
      >
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="del(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
    <el-form>
      <el-form-item style="text-align: right">
        <el-button type="primary" size="small" @click="save('ruleForm')"
          >保存</el-button
        >
        <el-button size="small" @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="新增" :visible.sync="dialogVisible" width="800px">
      <el-transfer v-model="modalData" :data="modalDataArr"></el-transfer>
      <el-form>
        <el-form-item style="text-align: right">
          <el-button type="primary" size="small" @click="savefactorList"
            >保存</el-button
          >
          <el-button size="small" @click=" dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import equipmentDetailEdit from "@/api/archivesCarCompany/equipmentManagement/equipmentDetailEdit.js";
export default {
  // mixins: [resize],
  data() {
    return {
      id: "", //设备Id
      dialogVisible: false,
      tableQuery: {
        limit: 0,
        page: 0,
        code: "",
        plateNo: "",
      },
      // defalueRow: {
      //   factor: "", //因子
      //   factorName: "", //因子名称
      //   max: "", //标准上限
      //   min: "", //标准下限
      //   rangeUpper: "", //量程上限
      //   rangeLower: "", //量程下限
      //   unit: "", //单位
      // },
      tableData: [],
      modalData: [], //穿梭框因子确认的
      modalDataArr: [], //穿梭框因子
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getFactorList();
    this.getFactorListTable();//根据设备id获取已经绑定的因子
  },

  methods: {
    getFactorList() {
      equipmentDetailEdit.getFactorList().then((response) => {
        this.modalDataArr = response.data;
      });
    },
     // 根据设备id获取已经绑定的因子
    getFactorListTable() {
      var that = this;
      equipmentDetailEdit.getFactorListTable({ deviceId: this.id }).then((response) => {
          response.data.forEach(function(item,i){
            that.modalData.push(item.factory)
          })
          that.tableData = response.data;
        });
    },
    //穿梭框保存
    savefactorList() {
      var that = this;
      that.tableData = [];
      that.modalData.forEach(function (item, i) {
        that.modalDataArr.forEach(function (items, i) {
          if (item == items.key) {
            that.tableData.push(items)
          }
        });
      });
      this.dialogVisible = false;
    },
    save() {
      this.$confirm("是否确认提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let params = {
          id:this.id,
          factorList:this.tableData
        }
         equipmentDetailEdit.saveFactor(params).then((response) => {
             this.$message({
              type: "success",
              message: "保存成功!",
            });
            this.cancel();
        });
        
      });
    },
    cancel(){
       this.$router.push({
            path: "/archives/equipmentManagement/equipmentDetail",
          });
    }
  },
};
</script>

<style lang='scss' scoped>
</style>
