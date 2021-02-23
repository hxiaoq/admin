<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-input
          v-model="filterText"
          placeholder="请输入车牌号或车架号查询"
          style="margin-bottom: 20px"
        >
          <!-- <el-button slot="append" icon="el-icon-search" @click="getOrgAndCarTree" ></el-button> -->
        </el-input>

        <el-tree
          ref="tree"
          class="filter-tree"
          :data="data"
          style="overflow: auto"
          :style="{ height: treeHeight }"
          :props="defaultProps"
          default-expand-all
          highlight-current
          node-key="id"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="20">
        <el-table
          ref="tableDiv"
          class="auth-table"
          :data="tableData"
          style="width: 100%; margin: 10px 0"
          border
          :height="height"
        >
          <el-table-column
            label="序号"
            width="80"
            type="index"
          />
          <el-table-column
            v-for="(item, index) in tableLabel"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            show-overflow-tooltip
          />
          <el-table-column label="数据状态">
            <template slot-scope="scope">
              <span v-if="scope.row.dataStatus === '1'">正常</span>
              <span v-else-if="scope.row.dataStatus === '2'">离线</span>
              <span v-else-if="scope.row.dataStatus === '3'">预警</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import monitor from '@/api/dynamicMonitorCarCompany/monitor.js'
export default {
  data() {
    return {
      filterText: '',
      treeHeight: '',
      height: '',
      firstqq: '',
      data: [],
      // 子组件的表格数据
      tableData: [
      ],
      // 子组件的表头数据
      tableLabel: [
        { label: '监测时间', prop: 'dataTime' },
        { label: '数据项', prop: 'dataName' },
        { label: '标准范围', prop: 'dataStandard' },
        { label: '监测值', prop: 'dataValue' },
        { label: '排放值', prop: 'letValue' }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    const divTop = Cookies.get('appContainerHeight') - 60
    this.treeHeight = divTop + 'px'
    this.height = divTop
    this.getOrgAndCarTree()
  },
  methods: {
    async getCarRunTimeList(objId) {
      await monitor.getCarRunTimeList({
        objId: objId
      })
        .then((response) => {
          const { data } = response
          this.tableData = data
        })
    },
    async getOrgAndCarTree() {
      await monitor.getOrgAndCarTree({
        plateNo: this.filterText
      })
        .then((response) => {
          const { data } = response
          this.data = data
          this.firstqq = this.getOne(data)
          this.getCarRunTimeList(this.firstqq)
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      console.log(data)
      if (data.type == 2) this.getCarRunTimeList(data.id)
    },
    getOne(arr) {
      let firster
      const first = function first(arr) {
        if (arr.length > 0) {
          arr.forEach(item => {
            if (item.type == 2) {
              firster = item.id
            } else {
              if (item.children && item.children.length > 0) {
                first(item.children)
              }
            }
          })
        }
      }
      first(arr)
      return firster
    }
  }
}
</script>

<style lang='scss' scoped>
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
  background-color: #8eafd1;
}
</style>
