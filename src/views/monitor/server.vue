<template>
  <div class="">
    <el-row class="tac">
      <el-col :span="5">
        <el-menu
          style="padding-right: 20px"
          :default-active="selectName"
          class="el-menu-vertical-demo"
          @select="handleOpen"
        >
          <el-menu-item v-for="(v, i) in serviceData" :key="i" :index="v.name">
            <svg-icon
              style="margin-right: 5px"
              icon-class="fwzl"
              class-name="icon"
            />
            <span slot="title">{{ v.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="19">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="序号" width="100">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            show-overflow-tooltip
            label="服务名称"
            width="180"
          >
          </el-table-column>
          <el-table-column prop="ipAddr" show-overflow-tooltip label="IP地址">
          </el-table-column>
          <el-table-column
            prop="homePageUrl"
            show-overflow-tooltip
            label="服务地址"
          >
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'UP'">有效</span>
              <span v-if="scope.row.status == 'DOWN'">无效</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" width="100">
            <template scope="scope">
              <el-switch
              :disabled="time"
                v-model="statuss"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="change(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import service from "@/api/monitor/server.js";
export default {
  data() {
    return {
      selectName: "",
      statuss: null,
      serviceData: [],
      tableData: [],
      time:false
    };
  },
  mounted() {
    this.getServiceData();
  },

  methods: {
    getServiceData() {
      service.getServiceData().then((response) => {
        this.serviceData = response.data;
        // if (name) {
        // this.selectName = name;
        // this.handleOpen(name);
        // } else {
        this.selectName = response.data[0].name;
        this.handleOpen(response.data[0].name);
        // }
      });
    },
    handleOpen(key, keyPath) {
      service.getServiceDetail({ applicationName: key }).then((response) => {
        this.tableData = [];
        this.tableData.push(response.data);
        if (this.tableData[0].status == "UP") {
          this.statuss = true;
        } else if (this.tableData[0].status == "DOWN") {
          this.statuss = false;
        }
      });
    },
    change(row) {
      
        var statusName = "";
        if (row.status == "UP") {
          statusName = "DOWN";
        } else if (row.status == "DOWN") {
          statusName = "UP";
        }
        var params = {
          instanceId: row.instanceId,
          name: row.name,
          status: statusName,
        };
        service.setUpDown(params).then((response) => {
          this.$message({
            type: "success",
            message: "保存成功!",
          });
          var that = this;
          that.time=true
          setTimeout(function () {
            that.handleOpen(row.name);
            that.time=false
          }, 3000);
        });
      }
  },
  cumputed: {},
};
</script>
<style lang="scss" scoped>
::v-deep .el-menu {
  border: none;
}
</style>

