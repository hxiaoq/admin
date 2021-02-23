<template>
  <div>
    <el-row style="padding-bottom: 20px">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>行政区车企分布</span>
          </div>
          <div
            id="myChart1"
            v-loading="loading1"
            :style="{ height: heightChart }"
            class="chart"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>车企车辆排名TOP10</span>
          </div>
          <div
            id="myChart2"
            v-loading="loading2"
            :style="{ height: heightChart }"
            class="chart"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>车企性质分布</span>
          </div>
          <div
            id="myChart3"
            v-loading="loading3"
            :style="{ height: heightChart }"
            class="chart"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from "echarts";
import api from "@/api/archives/carCompanyManagement/carCompanyStatistical";
// require('echarts/theme/macarons')
// import resize from './dashboard/components/mixins/resize'
export default {
  // mixins: [resize],
  props: ["apprefs"],
  data() {
    return {
      heightChart: 0,
      loading1: true,
      loading2: true,
      loading3: true,
    };
  },
  created() {
    window.addEventListener("resize", () => {
      this.chart.resize();
      this.chart1.resize();
      this.chart2.resize();
    });
  },
  mounted() {
    // const appContainerHeight =
    //   parseInt(
    //     window
    //       .getComputedStyle(this.apprefs.appBasicContainer)
    //       .getPropertyValue("height")
    //   ) - 20;
    // this.heightChart = appContainerHeight / 2 - 80 + "px";
this.heightChart = 300+"px"
    this.$nextTick(() => {
      this.loadChartData();
      this.loadChartData2();
      this.loadChartData3();
    });
  },
  methods: {
    loadChartData(pageSize, page) {
      api
        .getCarCompanyByOrg()
        .then((response) => {
          const { data, xAxis } = response.data;
          this.initChart(data, xAxis);
          this.loading1 = false;
        })
        .catch((error) => error);
    },
    initChart(data, xAxis) {
      this.chart = echarts.init(document.getElementById("myChart1"));
      this.chart.setOption({
        // title: {
        //   text: "行政区车企分布",
        //   left: "center",
        //   align: "center",
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        // legend: {
        //     data: ['2011年', '2012年']
        // },
        grid: {
          top: "3%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        yAxis: {
          type: "value",
          name: "单位(辆)",
        },
        xAxis: {
          type: "category",
          data: xAxis,
        },
        series: [
          {
            // name: '2012年',
            type: "bar",
            barWidth: "50%",
            data: data,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 1,
                color: "#41d6f3",
              },
              {
                offset: 0,
                color: "#3da0ff",
              },
            ]),
            itemStyle: {
              // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [5, 5, 0, 0],
              },
            },
          },
        ],
      });
    },
    loadChartData2(pageSize, page) {
      api
        .getCarCompanyTop()
        .then((response) => {
          const { data, xAxis } = response.data;
          this.initChart2(data, xAxis);
          this.loading2 = false;
        })
        .catch((error) => error);
    },
    initChart2(data, xAxis) {
      this.chart1 = echarts.init(document.getElementById("myChart2"));
      this.chart1.setOption({
        // title: {
        //   text: "车企车辆排名TOP10",
        //   left: "center",
        //   align: "center",
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        // legend: {
        //     data: ['2011年', '2012年']
        // },
        grid: {
          top: "3%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        color: ["#4f81bd"],
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: xAxis.reverse(),
          name: "单位(辆)",
        },
        series: [
          {
            // name: '2012年',
            type: "bar",
            barWidth: "70%",
            data: data.reverse(),
          },
        ],
      });
    },
    loadChartData3(pageSize, page) {
      api
        .getCarCompanyByProperty()
        .then((response) => {
          const { data, xAxis, warningCountList } = response.data;
          const pieData = warningCountList.map((item) => {
            return { name: item.id, value: item.count };
          });
          this.initChart3(data, xAxis, pieData);
          this.loading3 = false;
        })
        .catch((error) => error);
    },
    initChart3(data, xAxis, pieData) {
      this.chart2 = echarts.init(document.getElementById("myChart3"));
      this.chart2.setOption({
        // title: {
        //   text: "车企性质分布",
        //   left: "center",
        //   align: "center",
        // },
        tooltip: {
          trigger: "item",
          // formatter: "{a} <br/>{b}: {c} ({d}%)",
        },

        legend: {
          left: "center",
          top: "bottom",
          data: xAxis,
        },
        // color: ["#4f81bd", "#c0504d", "9bbb59", "8064a2"],

        series: [
          {
            // name: '面积模式',
            type: "pie",
            radius: [10, 120],
            center: ["50%", "50%"],
            roseType: "area",
            data: pieData,
          },
        ],
      });
    },
  },
};
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
