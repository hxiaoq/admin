<template>
  <div>
    <el-form
      :inline="true"
      :model="formInline"
      size="small"
      class="demo-form-inline"
    >
      <el-form-item label="行政区">
        <el-select v-model="formInline.region" placeholder="输入行政区">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="车企名称">
        <el-input v-model="formInline.user" placeholder="车企名称" />
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input v-model="formInline.user" placeholder="车牌号" />
      </el-form-item>
      <el-form-item label="加油日期">
        <el-date-picker
          v-model="formInline.time"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="疑似黑加油站">
        <el-select v-model="formInline.region" placeholder="疑似黑加油站">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          class=""
          size="small"
          type="success"
          icon="el-icon-search"
          @click="loadTable()"
        >
          查询
        </el-button>
        <el-button
          class="filter-item"
          size="small"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-download"
          @click="openNew"
        >
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" max-height="250">
      <el-table-column type="index" width="50" />
      <el-table-column fixed prop="date" label="行政区" width="150" />
      <el-table-column prop="name" label="车辆类型" width="120" />
      <el-table-column prop="province" label="车企名称" width="120" />
      <el-table-column prop="city" label="车牌号" width="120" />
      <el-table-column prop="address" label="排放标准" width="300" />
      <el-table-column prop="zip" label="加油前油箱液位" width="120" />
      <el-table-column prop="address" label="加油后油箱液位" width="300" />
      <el-table-column prop="zip" label="加油日期" width="120" />
      <el-table-column prop="zip" label="加油站经纬度" width="120" />
      <el-table-column prop="zip" label="加油站位置" width="120" />
      <el-table-column prop="zip" label="疑似黑加油站" width="120" />
      <el-table-column prop="zip" label="GIS一张图" width="120" />
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formInline: {},
      tableData: []
    }
  }
}
</script>
<style lang='scss' scoped>
::v-deep .vue-treeselect {
  width: 200px !important;
}
::v-deep .el-form-item--small .el-form-item__content,
.el-form-item--small .el-form-item__label {
  line-height: 30px;
}
::v-deep .vue-treeselect__control {
  height: 30px;
}
::v-deep .el-card__header {
  border: none;
  padding: 18px 15px 5px;
}
::v-deep .el-card__body {
  padding: 10px;
}
</style>
