<template>
  <div>
    <div v-if="false">
      <el-button icon="el-icon-arrow-left" type="primary" @click="goBack()">
        返回
      </el-button>
    </div>
    <div class="main-y">
      <div class="title">
        <svg-icon icon-class="yujing" class-name="icon-y" />
        <span class="name-y">预警信息</span>
        <span>{{ diaDataInfo }}</span>
      </div>
      <div id="charts" style="width: 100%; height: 300px" />
      <el-table :data="diaTableData" border>
        <el-table-column type="index" width="80" label="序号" />
        <el-table-column property="beginTimeStr" label="预警发生时间" />
        <el-table-column property="endTimeStr" label="预警结束时间" />
        <el-table-column property="alarmTypeName" label="预警类型" />
        <el-table-column property="standardRange" label="标准范围" />
        <el-table-column
          property="beginValue"
          label="预警发生时间检测值"
          width="180"
        />
      </el-table>
    </div>
  </div>
</template>
<script>
import resize from '@/views/archives/resize'
import echarts from 'echarts'
import wran from '@/api/warn/wran.js'
export default {
mixins: [resize],
  data() {
    return {
      chart1:null,
      diaDataInfo: '',
      diaTableData: [{
        max: '-',
        min: '-',
        beginTimeStr: '-',
        endTimeStr: '-',
        alarmTypeName: '-',
        standardRange: '-',
        beginValue: '-'
      }]
    }
  },
  mounted() {
    const { data } = this.$route.query
    // console.log('%c 🥨 data: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', data, JSON.stringify(this.$route.query.data))
    this.getEarlyWarningDataByTime(data.alarmType, data.id, data.beginTime, data.endTime)
    this.diaDataInfo = data.dataInfo
    this.diaTableData = [data]
  },
  methods: {
    async getEarlyWarningDataByTime(alarmType, objId, startDate, endDate) {
      await wran.getEarlyWarningDataByTime({ alarmType: alarmType, startDate: startDate, endDate: endDate, objId: objId }).then((response) => {
        const { data } = response
        this.initChart(data.series, data.xAxis, startDate, endDate)
      })
    },
    initChart(data, xAxis, startDate, endDate) {
      this.chart1 = echarts.init(document.getElementById('charts'))
      this.chart1.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
           grid: {
          top: '15%',
          left: '4%',
          right: '0%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis
        },
        yAxis: {
          type: 'value',
          name: '毫克/升',
          axisPointer: {
            snap: true
          }
        },
        series: [
          {
            name: '用电量',
            type: 'line',
            smooth: true,
            data: data,
            markArea: {
              data: [
                [
                  {
                    xAxis: startDate
                  },
                  {
                    xAxis: endDate
                  }
                ]
              ]
            }
          },
          {
            // name: "最大值最小值",
            type: 'line',
            smooth: true,
            data: []
          }
        ]
      })
    },
    goBack() {
      // 首先获取当前路由
      const view = this.$router.currentRoute

      // 跳转页面
      this.$router.push({ path: '/warn/warnDetails' })

      // 从标签栏中关闭当前标签
      this.$store.dispatch('tagsView/delView', view)
    }
  }
}
</script>

<style lang='scss' scoped>
.main-y {
  margin: 15px;
  padding: 0 25px;
}
.title {
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 50px;
  line-height: 50px;
  padding: 0 10px;
  border-radius: 3px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  color: #303133;
  .icon-y {
    color: red;
    font-size: 20px;
    font-weight: 600;
    margin-right: 10px;
  }
  .name-y {
    background: rgb(245, 153, 168);
    display: inline-block;
    padding: 0 10px;
    margin-right: 10px;
    height: 40px;
    line-height: 40px;
    border-radius: 3px;
  }
}
</style>
