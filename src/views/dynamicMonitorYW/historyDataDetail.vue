<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-tree
          ref="tree"
          class="filter-tree"
          style="overflow: auto"
          :data="data"
          :props="defaultProps"
          :style="{ height: treeHeight }"
          default-expand-all
          highlight-current
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="20">
        <el-form :inline="true" size="small" class="demo-form-inline">
          <el-form-item v-show="dateShow" label="日期">
            <el-date-picker
              v-model="dataTime"
              :type="elDateType"
              :value-format="DataValueFormat"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              v-show="dateShow"
              type="success"
              icon="el-icon-search"
              @click="getList(5, 1, checkNode, dataTime)"
            >
              查询
            </el-button>
            <el-button
              class="filter-item"
              size="small"
              style="margin-left: 10px"
              type="primary"
              icon="el-icon-download"
            >
              导出
            </el-button>
          </el-form-item>
        </el-form>

        <el-table
          style="margin-bottom:10px;"
          ref="tableDiv"
          class="auth-table"
          :data="tableData"
          border
          stripe
        >
          <el-table-column
             label="序号"
            width="80"
            type="index"
          >
          </el-table-column>
           <el-table-column
          prop="dateNum"
          label="监测时间"
          width="150"
          show-overflow-tooltip
          >
          </el-table-column>
           <el-table-column
          prop="Speed"
          label="车速"
          width="120"
          show-overflow-tooltip
          >
           <template slot-scope="scope">
            
              <el-button
                type="text"
                 @click="goDetail(scope.column.property, scope.row, scope.column.label)"
              >{{ scope.row.Speed }}</el-button>
            </template>
          </el-table-column>
             <el-table-column
          prop="Atmos"
          label="大气压强"
          width="120"
          show-overflow-tooltip
          >
           <template slot-scope="scope">
            
              <el-button
                type="text"
                 @click="goDetail(scope.column.property, scope.row, scope.column.label)"
              >{{ scope.row.Atmos }}</el-button>
            </template>
          </el-table-column>
             <el-table-column
          prop="EngineTorque"
          label="发动机扭矩"
          width="150"
          show-overflow-tooltip
          >
           <template slot-scope="scope">
            
              <el-button
                type="text"
                @click="goDetail(scope.column.property, scope.row, scope.column.label)"
              >{{ scope.row.EngineTorque }}</el-button>
            </template>
          </el-table-column>
             <el-table-column
          prop="ScrUpOut"
          label="SCR上游NOX"
          width="180"
          show-overflow-tooltip
          >
           <template slot-scope="scope">
            
              <el-button
                type="text"
                @click="goDetail(scope.column.property, scope.row, scope.column.label)"
              >{{ scope.row.ScrUpOut }}</el-button>
            </template>
          </el-table-column>
               <el-table-column
          prop="ScrUpOutNum"
          label="SCR上游NOX排放量"
          width="180"
          show-overflow-tooltip
          >
           <template slot-scope="scope">
            
              <el-button
                type="text"
                @click="goDetail(scope.column.property, scope.row, scope.column.label)"
              >{{ scope.row.ScrUpOutNum }}</el-button>
            </template>
          </el-table-column>
               <el-table-column
          prop="ScrDownOut"
          label="SCR下游NOX"
          width="180"
          show-overflow-tooltip
          >
           <template slot-scope="scope">
            
              <el-button
                type="text"
                @click="goDetail(scope.column.property, scope.row, scope.column.label)"
              >{{ scope.row.ScrDownOut }}</el-button>
            </template>
          </el-table-column>
               <el-table-column
          prop="ScrDownOutNum"
          label="SCR下游NOX排放量"
          width="180"
          show-overflow-tooltip
          >
           <template slot-scope="scope">
            
              <el-button
                type="text"
                @click="goDetail(scope.column.property, scope.row, scope.column.label)"
              >{{ scope.row.ScrDownOutNum }}</el-button>
            </template>
          </el-table-column>
               <el-table-column
          prop="OutletTemp"
          label="SCR出口温度"
          width="150"
          show-overflow-tooltip
          >
           <template slot-scope="scope">
            
              <el-button
                type="text"
                @click="goDetail(scope.column.property, scope.row, scope.column.label)"
              >{{ scope.row.OutletTemp }}</el-button>
            </template>
          </el-table-column>
            <el-table-column
          prop="DpfPressureDiff"
          label="DPF压差"
          width="120"
          show-overflow-tooltip
          >
           <template slot-scope="scope">
            
              <el-button
                type="text"
                 @click="goDetail(scope.column.property, scope.row, scope.column.label)"
              >{{ scope.row.DpfPressureDiff }}</el-button>
            </template>
          </el-table-column>
            <el-table-column
          prop="InletTemp"
          label="SCR出口温度"
        width="150"
          show-overflow-tooltip
          >
           <template slot-scope="scope">
            
              <el-button
                type="text"
                 @click="goDetail(scope.column.property, scope.row, scope.column.label)"
              >{{ scope.row.InletTemp }}</el-button>
            </template>
          </el-table-column>
            <el-table-column
          prop="TankLevel"
          label="油箱液位"
          width="120"
          show-overflow-tooltip
          >
           <template slot-scope="scope">
            
              <el-button
                type="text"
                 @click="goDetail(scope.column.property, scope.row, scope.column.label)"
              >{{ scope.row.TankLevel }}</el-button>
            </template>
          </el-table-column>
            <el-table-column
          prop="EngineCoolantTemp"
          label="冷却液温度"
          width="120"
          show-overflow-tooltip
          >
           <template slot-scope="scope">
            
              <el-button
                type="text"
                 @click="goDetail(scope.column.property, scope.row, scope.column.label)"
              >{{ scope.row.EngineCoolantTemp }}</el-button>
            </template>
          </el-table-column>
            <el-table-column
          prop="Latitude"
          label="经度"
          width="100"
          show-overflow-tooltip
          >
           <template slot-scope="scope">
            
              <el-button
                type="text"
                 @click="goDetail(scope.column.property, scope.row, scope.column.label)"
              >{{ scope.row.Latitude }}</el-button>
            </template>
          </el-table-column>
            <el-table-column
          prop="Longitude"
          label="纬度"
          width="100"
          show-overflow-tooltip
          >
           <template slot-scope="scope">
            
              <el-button
                type="text"
                 @click="goDetail(scope.column.property, scope.row, scope.column.label)"
              >{{ scope.row.Longitude }}</el-button>
            </template>
          </el-table-column>
            <el-table-column
          prop="Odo"
          label="累计里程"
          width="100"
          show-overflow-tooltip
          >
           <template slot-scope="scope">
            
              <el-button
                type="text"
                 @click="goDetail(scope.column.property, scope.row, scope.column.label)"
              >{{ scope.row.Odo }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="total"
          :page-size="limit"
          :hide-on-single-page="hidePage"
          @current-change="handleCurrentChange"
        />
        <div v-if="isShow"> 
        <el-divider
          content-position="left"
        >{{ factorLabel }}检测值变化情况</el-divider>
        <div>
          <el-button
            v-show="dateShow"
            type="primary"
            icon="el-icon-arrow-left"
            size="small"
            @click="prevDate"
          />
          <el-date-picker
            v-show="dateShow"
            v-model="value1"

            :type="elDateType1"
            :value-format="DataValueFormat1"
            placeholder="选择日期时间"
            style="margin: 10px"
            @change="getOBDHistoryDataChart(factor, value1)"
          />
          <el-button
            v-show="dateShow"
            type="primary"
            size="small"
            @click="nextDate"
          ><i class="el-icon-arrow-right el-icon--right" /></el-button>
          <div id="myChart" class="chart" style="height: 300px" />
          <table class="freeTable" cellspacing="0">
            <tr style='line-height:40px'>
              <td style="background: #eee">最大值</td>
              <td>{{ maxValue }}</td>
              <td style="background: #eee">发生时间</td>
              <td>{{ maxDate }}</td>
            </tr>
            <tr style='line-height:40px'>
              <td style="background: #eee">最小值</td>
              <td>{{ minValue }}</td>
              <td style="background: #eee">发生时间</td>
              <td>{{ minDate }}</td>
            </tr>
          </table>
        </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import Cookies from 'js-cookie'
import monitor from '@/api/dynamicMonitorYW/monitor.js'
import Monent from 'moment'
import resize from '@/views/archives/resize'
export default {
  mixins: [resize],
  data() {
    return {
      chart1:null,
       hidePage: true,
      isShow:false,
      treeHeight: '',
      dataTime: Monent().format('YYYYMMDD'),
      DataValueFormat: 'yyyyMMdd',
      elDateType: 'date',
      dateShow: true,
      checkNode: this.$route.query.dataType,
      elDateType1: 'datetime',
      value1: Monent().format('YYYYMMDD'),
      DataValueFormat1: 'yyyyMMddHHmmss',
      data: [
        {
          id: 1,
          label: '',
          children: [
            {
              id: 'second',
              label: '实时数据'
            },
            {
              id: 'hour',
              label: '小时数据'
            },
            {
              id: 'day',
              label: '日数据'
            },
            {
              id: 'month',
              label: '月数据'
            },
            {
              id: 'year',
              label: '年数据'
            }
          ]
        }
      ],
      // 子组件的表格数据
      tableData: [],
      // 子组件的表头数据
    
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      limit: 6,
      page: 1,
      total: 0,
      maxValue: 0,
      minDate: '',
      minValue: 0,
      maxDate: '',
      factor: 'Speed',
      factorLabel: '车速'
    }
  },
  mounted() {
    const divTop = Cookies.get('appContainerHeight')
    this.treeHeight = divTop + 'px'
    this.data[0].label = this.$route.query.plateNo
    this.getList(this.limit, this.page)
    //this.getOBDHistoryDataChart(this.factor, this.value1)
  },
  methods: {
    async getList(limit, page, dataType, dateNum) {
      await monitor
        .getOBDHistoryDataTable({
          limit: limit,
          page: page,
          dataType: dataType || this.$route.query.dataType,
          dateNum: dateNum || this.getData(dataType),
          id: this.$route.query.id
        })
        .then((response) => {
          const { data } = response
          this.tableData = data.data
          this.total = data.count
        })
    },
    async getOBDHistoryDataChart(factor, dateNum) {
      await monitor
        .getOBDHistoryDataChart({
          dataType: this.checkNode,
          dateNum: dateNum,
          factor: factor,
          id: this.$route.query.id
        })
        .then((response) => {
          const { data } = response
          this.maxValue = data.maxValue
          this.minDate = data.minDate
          this.minValue = data.minValue
          this.maxDate = data.maxDate
          this.initChart(data.data, data.low, data.top, data.xAxis)
        })
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      this.getList(
        this.limit,
        page,
        this.checkNode,
        this.dataTime
      )
        .then((response) => {
          const { data } = response
          this.tableData = data.data
          this.total = data.count
          this.listLoading = false
        })
        .catch((error) => error)
    },
    getData(dataType) {
      let data
      let value1Data
      const type = dataType || this.$route.query.dataType
      if (type === 'second') {
        data = ''
        value1Data = ''
        this.dateShow = false
        this.elDateType = 'second'
        this.elDateType1 = 'second'
      } else if (type === 'hour') {
        data = Monent().format('YYYYMMDD')
        this.dateShow = true
        this.elDateType = 'date'
        this.DataValueFormat = 'yyyyMMdd'
        this.elDateType1 = 'datetime'
        this.DataValueFormat1 = 'yyyyMMddHHmmss'
        value1Data = Monent().format('YYYYMMDDHHmmss')
      } else if (type === 'day') {
        data = Monent().format('yyyyMM')
        this.elDateType = 'month'
        this.dateShow = true
        this.DataValueFormat = 'yyyyMM'
        this.elDateType1 = 'date'
        this.DataValueFormat1 = 'yyyyMMdd'
        value1Data = Monent().format('YYYYMMDD')
      } else if (type === 'month') {
        data = Monent().format('yyyy')
        this.dateShow = true
        this.elDateType = 'year'
        this.DataValueFormat = 'yyyy'
        this.elDateType1 = 'month'
        this.DataValueFormat1 = 'yyyyMM'
        value1Data = Monent().format('YYYYMM')
      } else if (type === 'year') {
        data = Monent().format('YYYY')
        this.dateShow = true
        this.elDateType = 'year'
        this.DataValueFormat = 'yyyy'
        this.elDateType1 = 'year'
        this.DataValueFormat1 = 'yyyy'
        value1Data = Monent().format('YYYY')
      } else {
        data = ''
        this.dateShow = false
      }
      this.dataTime = data
      this.value1 = value1Data
      return data
    },
    handleNodeClick(data) {
      this.isShow = false;
      this.checkNode = data.id
      this.getList(this.limit, this.page, data.id)
      this.getOBDHistoryDataChart(this.factor, this.value1)
    },
    goDetail(prop, data, label) {
      this.isShow=true;
      const factorDate = data.dateNum
        .replace(/-/g, '')
        .replace(/\s*/g, '')
        .replace(/:/g, '')
      this.factorLabel = label
      this.value1 = factorDate
      this.factor = prop
      this.getOBDHistoryDataChart(prop, factorDate)
    },
    initChart(data, low, top, xAxis) {
      this.chart1 = echarts.init(document.getElementById('myChart'))
      this.chart1.setOption({
        tooltip: {
          trigger: 'axis'
        },
        // legend: {
        // data: ["监测值", "上限阈值", "下限阈值"],
        // },
        xAxis: {
          type: 'category',
          data: xAxis
        },
           grid: {
          top: '15%',
          left: '3%',
          right: '3%',
          bottom: '10%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '监测值',
            data: data,
            type: 'line'
          },
          {
            name: '上限阈值',
            data: low,
            type: 'line',
            lineStyle: {
              type: 'dashed',
              color: '#bcbf0b'
            }
          },
          {
            name: '下限阈值',
            data: top,
            type: 'line',
            lineStyle: {
              type: 'dashed',
              color: '#bcbf0b'
            }
          }
        ]
      })
    },
    prevDate() {
      let odata
      const factorDate = this.value1
        .replace(/-/g, '')
        .replace(/\s*/g, '')
        .replace(/:/g, '')
      if (this.checkNode === 'year') {
        odata = Monent(factorDate, 'YYYY').add(-1, 'y').format('YYYY')
      } else if (this.checkNode === 'month') {
        odata = Monent(factorDate, 'YYYYMM').add(-1, 'm').format('YYYYMM')
      } else if (this.checkNode === 'day') {
        odata = Monent(factorDate, 'YYYYMMDD').add(-1, 'd').format('YYYYMMDD')
      } else if (this.checkNode === 'hour') {
        odata = Monent(factorDate, 'YYYYMMDDHHmm')
          .add(-1, 'h')
          .format('YYYYMMDDHHmmss')
      } else if (this.checkNode === 'second') {
        odata = Monent().format('YYYYMMDDHHmmss')
      }
      this.value1 = odata
      this.getOBDHistoryDataChart(this.factor, this.value1)
    },
    nextDate() {
      let odata
      const factorDate = this.value1
        .replace(/-/g, '')
        .replace(/\s*/g, '')
        .replace(/:/g, '')
      if (this.checkNode === 'year') {
        odata = Monent(factorDate, 'YYYY').add(1, 'y').format('YYYY')
      } else if (this.checkNode === 'month') {
        odata = Monent(factorDate, 'YYYYMM').add(1, 'm').format('YYYYMM')
      } else if (this.checkNode === 'day') {
        odata = Monent(factorDate, 'YYYYMMDD').add(1, 'd').format('YYYYMMDD')
      } else if (this.checkNode === 'hour') {
        odata = Monent(factorDate, 'YYYYMMDDHHmm')
          .add(1, 'h')
          .format('YYYYMMDDHHmmss')
      } else if (this.checkNode === 'second') {
        odata = Monent().format('YYYYMMDDHHmmss')
      }
      this.value1 = odata
      this.getOBDHistoryDataChart(this.factor, this.value1)
    }
  }
}
</script>

<style lang='scss' scoped>
.freeTable {
  width: 100%;
  border: 1px solid #ddd;
}
.freeTable td {
  text-align: center;
  width: 25%;
  border: 1px solid #ddd;
  color: #999;
}
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
  background-color: #8eafd1;
}
::v-deep .el-table__row .el-button{
  padding:0 !important;
}
::v-deep .el-divider__text{
  font-size:18px;
}
</style>
