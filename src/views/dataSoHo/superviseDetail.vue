<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div id="leftEchart" class="chart" style="height: 300px" />
      </el-col>
      <el-col :span="12">
        <el-table
          ref="tableDiv"
          class="auth-table"
          :data="tableData"
          style="width: 100%; margin: 10px 0"
          border
        >
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column
            prop="indexName"
            label="评价指标"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="entImageName"
            label="评价结果"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="score" label="得分" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="margin: 15px 0">
        <el-card class="box-card">
          <div slot="header" class="chart-card">
            <span class="chart-title"> 评价得分变化趋势 </span>
          </div>
          <div id="bottomEchart" class="chart" style="height: 300px" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import analysis from "@/api/data/analysisCarCompany.js";
import echarts from "echarts";
import resize from "@/views/archives/resize";
export default {
  mixins: [resize],
  data() {
    return {
      tableQuery: {
        objId: "",
        datetime: "",
      },
      tableData: [],
    };
  },
  mounted() {
    this.tableQuery.objId = this.$route.query.id;
    this.tableQuery.datetime = this.$route.query.dateTime;
    this.getTrustDetailList();
    this.getTrustMainByDate();
  },
  methods: {
    //  评价得分
    getTrustDetailList() {
      analysis.getTrustDetailList(this.tableQuery).then((response) => {
        this.tableData = response.data;
        var data = [];
        response.data.forEach(function (item, i) {
          data.push(item.score);
        });
        this.chart1 = echarts.init(document.getElementById("leftEchart"));
        this.chart1.setOption({
          tooltip: {},
          radar: {
            // shape: 'circle',
            name: {
              textStyle: {
                color: "#fff",
                backgroundColor: "#4D88BA",
                borderRadius: 3,
                padding: [3, 5],
              },
            },
            indicator: [
              { name: "NOX排放超标", max: 100 },
              { name: "尿素液位过低", max: 100 },
              { name: "行驶超速", max: 100 },
              { name: "预警总时长", max: 100 },
              { name: "评价周期月份里程", max: 100 },
              { name: "疑似黑加油站", max: 100 },
            ],
          },
          series: [
            {
              name:'评价得分',
              type: "radar",
              areaStyle: { normal: {} },
              data: [
                {
                  value: data,
                  //  name: "预算分配（Allocated Budget）",
                },
              ],
            },
          ],
        });
      });
    },
    // 评价得分变化趋势
    getTrustMainByDate() {
      analysis.getTrustMainByDate(this.tableQuery).then((response) => {
        this.chart2 = echarts.init(document.getElementById("bottomEchart"));
        this.chart2.setOption({
          tooltip: {
            trigger: "axis",
          },
          grid: {
            top: "10%",
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          color:["#4D88BA"],
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: response.data.xList,
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: response.data.yList,
              type: "line",
              areaStyle: {normal: {color:"#4D88BA"}},
            },
          ],
        });
      });
    },
  },
};
</script>
