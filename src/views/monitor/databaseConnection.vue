<template>
  <div>
    
     <div>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="getTableData"
          >查询</el-button
        >
     </div>
    <el-table :data="tableData" border style="width: 100%;margin:10px 0"  ref="tabelDiv" :height="tableHeight">
      <el-table-column prop="id" label="序号" width="80" show-overflow-tooltip>
         <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
       <el-table-column prop="id" label="标识" min-width="120" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="db" label="数据库"  min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="user" label="连接用户"  min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="host" label="访问主机" min-width="180" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="command" label="执行命令" show-overflow-tooltip  min-width="120">
      </el-table-column>
      <el-table-column prop="state" label="状态"  min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="time" label="状态持续时间" show-overflow-tooltip  min-width="120">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import databaseConnection from "@/api/monitor/databaseConnection.js";
export default {

  data() {
    return {
      tableHeight:null,
      tableData:[], 
    }
  },
  mounted() {
    this.tableHeight = Math.floor(document.documentElement.clientHeight - this.$refs.tabelDiv.$el.getBoundingClientRect().top)-30
    this.getTableData()
  },
  methods: {
    getTableData() {
      databaseConnection.getTableList().then((response) => {
        this.tableData = response.data;
        console.log(this.$refs.newConBox.getBoundingClientRect().top)
      });
  }
}
}
</script>

