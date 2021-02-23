<template>
  <div class="container">
    <!-- 菜单 -->
    <div style="position: absolute; top: -4px; width: 100%">
      <el-row>
        <el-col :span="8">
          <div class="top-menu">
            <!-- <el-scrollbar class="scroll-container"> -->
            <el-menu
              background-color=""
              text-color=""
              :unique-opened="false"
              active-text-color=""
              mode="horizontal"
              @select="handleSelect"
            >
              <topbar-item
                v-for="route in topMenusLeft"
                :key="route.path"
                class="nav-item"
                :item="route"
                :base-path="route.path"
              />
            </el-menu>
            <!-- </el-scrollbar> -->
          </div>
        </el-col>
        <el-col :span="8">
          <div style="height: 50px"></div>
        </el-col>
        <el-col :span="8">
          <div class="top-menu">
            <!-- <el-scrollbar class="scroll-container"> -->
            <el-menu
              background-color=""
              text-color=""
              :unique-opened="false"
              active-text-color=""
              mode="horizontal"
              @select="handleSelect"
            >
              <topbar-item
                v-for="route in topMenusRight"
                :key="route.path"
                class="nav-item"
                :item="route"
                :base-path="route.path"
              />
            </el-menu>
            <!-- </el-scrollbar> -->
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 菜单结束 -->

    <el-row>
      <el-col :span="24">
        <el-image
          style="width: 100%; height: 100%"
          :src="bigTitleImg"
        ></el-image>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin: 15px 0">
      <el-col :xl="8" :lg="10">
        <div class="topLeftDiv">
          <div style="text-align: center; width: 15%" class="JRYJMedia">
            <div style="line-height: 50px">信用</div>
            <div style="line-height: 30px">评价</div>
          </div>

          <div
            style="
              background: #04fff9;
              display: flex;
              padding: 7px 10px;
              width: 48%;
              margin: 0 20px;
              border-radius: 10px;
            "
          >
            <div
              style="
                display: flex;
                width: 40%;
                text-align: center;
                justify-content: center;
              "
            >
              <el-image :src="dateUrl" fit="contain"></el-image>
            </div>

            <div
              style="
                color: #0a103e;
                font-size: 28px;
                width: 60%;
                text-align: center;
              "
            >
              <div style="font-size: 42px">
                <span style="font-weight: bold">{{ score.month }}</span
                ><span>月</span>
              </div>
              <div>评价得分</div>
            </div>
          </div>
          <div
            style="text-align: left; width: 37%"
            :style="{ color: scoreColor }"
          >
            <div>
              <span
                style="font-size: 42px; text-align: center; margin-bottom: 10px"
                >{{ score.score }}</span
              ><span>分</span>
            </div>
            <el-rate disabled v-model="score.score" :colors="score.color">
            </el-rate>
          </div>
        </div>
      </el-col>
      <el-col :xl="16" :lg="14">
        <div class="topRightDiv">
          <div style="width: 8%; text-align: right" class="JRYJMedia">
            <div style="line-height: 50px; padding-right: 20px">今日</div>
            <div style="line-height: 30px; padding-right: 20px">预警</div>
          </div>
          <div class="dayWarning" id="dayWarning1"></div>
          <div class="dayText">
            <div>
              <span>{{ dayWarning1 }}</span
              ><span style="font-size: 18px; margin-left: 5px">辆</span>
            </div>
            <div>NOX排放超标</div>
          </div>
          <div class="dayWarning" id="dayWarning2"></div>
          <div class="dayText">
            <div>
              <span>{{ dayWarning2 }}</span
              ><span style="font-size: 18px; margin-left: 5px">辆</span>
            </div>
            <div>尿素液位过低</div>
          </div>
          <div class="dayWarning" id="dayWarning3"></div>
          <div class="dayText">
            <div>
              <span>{{ dayWarning3 }}</span
              ><span style="font-size: 18px; margin-left: 5px">辆</span>
            </div>
            <div>行驶超速</div>
          </div>
          <div class="dayWarning" id="dayWarning4"></div>
          <div class="dayText">
            <div>
              <span>{{ dayWarning4 }}</span
              ><span style="font-size: 18px; margin-left: 5px">辆</span>
            </div>
            <div>进入限行区</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xl="12" :lg="10">
        <el-col :span="24">
          <div style="position: relative">
            <baidu-map
              id="mapDiv"
              :center="{ lng: 116.404, lat: 39.915 }"
              :zoom="15"
              ak="B2pMOlG01dR3mQSUrmPPBG13jx7YsxUC&s=1"
              :style="{ height: mapHeight }"
              :scroll-wheel-zoom="true"
              @ready="handler"
            >
              <bm-marker
                v-for="marker of markers"
                :key="marker.managedObjId"
                :position="{ lng: marker.longitude, lat: marker.latitude }"
                :icon="marker.icon"
                @click="lookDetail(marker)"
              >
              </bm-marker>
              <bm-info-window
                :position="{
                  lng: infoWindowData.longitude,
                  lat: infoWindowData.latitude,
                }"
                :show="infoWindowShow"
                @close="infoWindowClose"
                @open="infoWindowOpen"
              >
                <div class="infoDiv">
                  <div class="infoTitle">
                    <img :src="infoWindowData.icon" /><span
                      :style="{ color: infoWindowData.color }"
                      >{{ infoWindowData.plateNo }}</span
                    >
                  </div>

                  <div class="infoSubTitle">今日预警信息</div>
                  <div v-if="warningInfoShow">
                    <div
                      class="infoContent"
                      v-for="(item, index) in infoWindowData.alarmInfo"
                      :key="index"
                    >
                      <div>{{ item }}</div>
                    </div>
                  </div>
                  <div v-else class="infoContent">暂无预警信息</div>
                  <div class="infoSubTitle">实时监测数据</div>
                  <div
                    class="infoContent"
                    style="display: flex"
                    v-for="(item, index) in infoWindowData.realData"
                    :key="index"
                  >
                    <div>{{ item.matterName }}：</div>
                    <div>{{ item.value }} {{ item.unit }}</div>
                  </div>
                </div>
              </bm-info-window>
            </baidu-map>
            <img
              :src="mapImg"
              style="position: absolute; right: 10px; bottom: 10px"
            />
          </div>
          <el-card class="box-card" style="margin-top: 10px">
            <div slot="header" class="clearfix">
              <span class="cardIcon"></span><span>动态预警信息</span>
            </div>
            <vue-seamless-scroll
              :data="earlyWarningInfo"
              :class-option="classOption"
              class="seamless-warp"
            >
              <ul class="listItem">
                <li v-for="(item, index) in earlyWarningInfo" :key="index">
                  <span class="title" v-text="item"></span>
                </li>
              </ul>
            </vue-seamless-scroll>
          </el-card>
        </el-col>
      </el-col>
      <el-col :xl="6" :lg="7">
        <el-card class="box-card">
          <!-- <div slot="header" class="clearfix">
            <span class="cardIcon"></span><span>全年预警类型分布</span>
          </div>
          <div
            id="typeDistribution"
            :style="{ height: heightChart }"
            class="chart"
          ></div> -->
          <div slot="header" class="clearfix">
            <span class="cardIcon"></span><span>全年检测数据</span>
          </div>
          <div class="tabelDiv" :style="{ height: heightChart }">
            <el-table
              :data="tableData"
              border
              size="mini"
              style="width: 100%"
              :row-style="rowStyle"
              :header-cell-style="{ background: '#1B2B5E', color: '#CEE7E5' }"
            >
              <el-table-column prop="name" label="项目" show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="monthAccum"
                label="当月"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="yearAccum"
                label="累计"
                show-overflow-tooltip
              >
              </el-table-column>
            </el-table>
          </div>
        </el-card>

        <el-card class="box-card" style="margin: 10px 0">
          <div slot="header" class="clearfix">
            <span class="cardIcon"></span><span>全年NOX排放情况</span>
          </div>
          <div
            id="levelDistribution"
            :style="{ height: heightChart }"
            class="chart"
          ></div>
        </el-card>
      </el-col>
      <el-col :xl="6" :lg="7">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardIcon"></span><span>全年预警类型分布</span>
          </div>
          <div
            id="typeDistribution"
            :style="{ height: heightChart }"
            class="chart"
          ></div>
        </el-card>

        <el-card class="box-card" style="margin: 10px 0">
          <div slot="header" class="clearfix">
            <span class="cardIcon"></span><span>全年尿素使用情况</span>
          </div>
          <div
            id="NSChart"
            :style="{ height: heightChart }"
            class="chart"
          ></div>
        </el-card>
      </el-col>
      <el-col :span="12" :class="{ showOrhide: showOrhide }">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardIcon"></span><span>全年行驶里程情况</span
            ><span style="float: right">里程数(KM)</span>
          </div>
          <div id="connectedNumber" style="height: 150px" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import echarts from "echarts";
import Cookies from "js-cookie";
// import bigScreen from "@/api/bigScreen.js";
import TopbarItem from "./TopbarItem";
import moment from "moment";
import homePage from "@/api/homePageSoHo.js";

import { BaiduMap, BmMarker, BmInfoWindow } from "vue-baidu-map";

import vueSeamlessScroll from "vue-seamless-scroll";
export default {
  name: "Dashboard",
  components: {
    TopbarItem,
    vueSeamlessScroll,
    BaiduMap,
    BmMarker,
    BmInfoWindow,
  },
  data() {
    return {
      score: {}, //评分对象
      scoreColor: "",
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"], // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
      dateUrl: require("./icon/dateImg.png"),
      map: null,
      showOrhide: true,
      bigTitleImg: require("./icon/bigTitle.png"),
      heightChart: 0,
      mapHeight: 0,
      show: false,
      netTotal: null, //车辆实时状态
      dayWarning1: 0,
      dayWarning2: 0,
      dayWarning3: 0,
      dayWarning4: 0,
      earlyWarningInfo: [], //动态预警信息（滚动）

      tableData: [],
      mapImg: require("./icon/mapImg.png"),
      markers: [],
      infoWindowShow: false,
      warningInfoShow: false,
      infoWindowData: [],
    };
  },
  mounted() {
    let clientHeight = document.documentElement.clientHeight - 78 - 130;
    let clientWidth = document.documentElement.clientWidth;
    if (clientWidth > 1366) {
      this.showOrhide = false;
      this.heightChart = (clientHeight - 122 - 20 - 211) / 2 + "px";
      this.mapHeight = clientHeight - 161 - 10 + "px";
    } else {
      this.showOrhide = true;
      this.heightChart = (clientHeight - 105 - 20) / 2 + "px";
      this.mapHeight = clientHeight - 155 - 10 + "px";
    }

    // // if(clientWidth>1366){
    // let heightChart = clientHeight - 161 - 26;
    // this.heightChart = (clientHeight- 122 -20 - 161) / 2  + "px";

    //   }else{
    // let heightChart = clientHeight - 162 -20;
    //   let heightChartRight = clientHeight - 230-20;
    //   this.heightChart = heightChart / 2 - 46 + "px";
    //    this.heightChartRight = heightChartRight / 2 - 46 + "px";
    //    this.mapHeight = clientHeight - 241 + "px";
    //   }
    this.$nextTick(() => {
      this.getHomePageTop(); //评分/////今日预警统计
      this.getTodayEarlyWarningInfo(); //动态预警信息(滚动)
      this.getHomePageCenter_GTH(); //表格数据 //全年预警类型分布
     
      this.getHomePageBottom_GTH();
      this.getVehicleMapInfo(); //地图请求
    });
  },

  methods: {
    handler({ BMap, map }) {
      this.map = map;
    },
    /////////////////////////// echart请求开始//////////////////////////////////////////////////////

    //评分//////今日预警统计获取数据
    getHomePageTop() {
      homePage.getHomePageTop().then((response) => {
        var getImageScoreByCompanyId = response.data.getImageScoreByCompanyId;
        var getTodayEarlyWarningCount = response.data.getTodayEarlyWarningCount;
        this.scoreColor = getImageScoreByCompanyId.color;
        this.score = getImageScoreByCompanyId;
        var colors = [];
        for (var i = 0; i < 3; i++) {
          colors.push(this.scoreColor);
        }
        this.score.color = colors;

        this.dayWarning1 = getTodayEarlyWarningCount[0].value;
        this.dayWarning2 = getTodayEarlyWarningCount[1].value;
        this.dayWarning3 = getTodayEarlyWarningCount[2].value;
        this.dayWarning4 = getTodayEarlyWarningCount[3].value;
        this.getDayWarning("dayWarning1", getTodayEarlyWarningCount[0].value); //今日预警
        this.getDayWarning("dayWarning2", getTodayEarlyWarningCount[1].value); //今日预警
        this.getDayWarning("dayWarning3", getTodayEarlyWarningCount[2].value); //今日预警
        this.getDayWarning("dayWarning4", getTodayEarlyWarningCount[3].value); //今日预警
      });
    },
    //动态预警信息
    getTodayEarlyWarningInfo() {
      homePage.getTodayEarlyWarningInfo().then((response) => {
        if (response.data.length < 1) {
          this.earlyWarningInfo.push("暂无预警信息");
        } else {
          var alarmInfo = [];
          if (response.data.length > 0) {
            response.data.forEach(function (v, i) {
              alarmInfo.push(v.alarmInfo);
            });
          }
          this.earlyWarningInfo = alarmInfo;
        }
      });
    },
    //表格数据/////全年预警类型分布
    getHomePageCenter_GTH() {
      homePage.getHomePageCenter_GTH().then((response) => {
        this.tableData = response.data.getYearMonitorData;
        this.getTypeDistribution(response.data.getYearEarlyWarningByType);
      });
    },

    getHomePageBottom_GTH() {
      homePage.getHomePageBottom_GTH().then((response) => {
        this.getNoXChart(response.data.getYearNoxByMonth);
        this.getNSChart(response.data.getYearUreaByMonth);
        this.drivingChart(response.data.getYearOdoByMonth);
      });
    },
    /////////////////////////// echart请求结束////////////////////////////////////////////////////////
    ////////////////////////////地图请求开始///////////////////////////////////////////////////// /////
    //地图
    getVehicleMapInfo() {
      homePage.getVehicleMapInfo().then((response) => {
        var mapData = response.data;
        var pointArr = [];
        if (mapData.length > 0) {
          mapData.forEach(function (item, val) {
            pointArr.push({ lng: item.longitude, lat: item.latitude });
            if (item.status == "normal") {
              item.color = "#00C712";
              item.icon = {
                url: require("./icon/normal.png"),
                size: { width: 50, height: 50 },
              };
            }
            if (item.status == "offline") {
              item.color = "#888888";
              item.icon = {
                url: require("./icon/offline.png"),
                size: { width: 50, height: 50 },
              };
            }
            if (item.status == "alarm") {
              item.color = "#FF0E18";
              item.icon = {
                url: require("./icon/warning.png"),
                size: { width: 50, height: 50 },
              };
            }
          });
          this.markers = mapData;
          //  this.markers[3].latitude = 39.915
          //  this.markers[3].longitude = 116.404
          // this.markers[0].latitude = 37.915
          //  this.markers[0].longitude = 116.404
          //  pointArr[0].lat = 37.915
          //  pointArr[0].lng = 116.404
          //  pointArr[3].lat = 39.915
          //  pointArr[3].lat = 116.404
          var mapViewObj = this.map.getViewport(pointArr);
          console.log(mapViewObj);
          this.map.centerAndZoom(mapViewObj.center, 10);
        }
      });
    },
    ////////////////////////// 地图请求开始开始////////////////////////////////////////////////////////////
    /////////////////////////// echart开始////////////////////////////////////////////////////////////
    //在线echart
    getOnlineEchart(type, data) {
      var div = type;
      var color = "";
      var title = "";
      if (type == "online") {
        color = "#56ED56";
        title = "在线";
      } else if (type == "offline") {
        color = "#ECC233";
        title = "离线";
      } else if (type == "fault") {
        color = "#EB5151";
        title = "故障";
      }
      this.chart = echarts.init(document.getElementById(div));
      // var colorList = ["#8D7FF0", "#00D98B", "#02D9DB", "#F45E23"];

      this.chart.setOption({
        title: [
          {
            text: title,
            x: "center",
            top: "50%",
            textStyle: {
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: "100",
            },
          },
          {
            text: data,
            x: "center",
            top: "25%",
            textStyle: {
              fontSize: "20",
              color: "#04FFF9",
              foontWeight: "600",
            },
          },
        ],
        color: [color],
        polar: {
          radius: ["92%", "75%"],
          center: ["50%", "50%"],
        },
        angleAxis: {
          max: this.netTotal,
          show: false,
        },
        radiusAxis: {
          type: "category",
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: "",
            type: "bar",
            roundCap: true,
            showBackground: true,
            backgroundStyle: {
              color: "rgba(66, 66, 66, .3)",
            },
            data: [data],
            coordinateSystem: "polar",
          },
        ],
      });
    },
    //今日预警统计echart
    getDayWarning(type, data) {
      var div = type;

      this.chart = echarts.init(document.getElementById(div));

      this.chart.setOption({
        polar: {
          radius: ["70%", "89%"],
          center: ["50%", "50%"],
        },
        angleAxis: {
          max: this.netTotal,
          show: false,
        },
        radiusAxis: {
          type: "category",
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: "",
            type: "bar",
            roundCap: true,
            barWidth: 90,
            showBackground: true,
            backgroundStyle: {
              color: "rgba(66, 66, 66, .3)",
            },
            data: [data],
            coordinateSystem: "polar",

            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: "#16CEB9",
                  },
                  {
                    offset: 1,
                    color: "#6648FF",
                  },
                ]),
              },
            },
          },
          {
            name: "",
            type: "pie",
            startAngle: 80,
            radius: ["90%"],
            hoverAnimation: false,
            center: ["50%", "50%"],
            itemStyle: {
              color: "rgba(66, 66, 66, .1)",
              borderWidth: 1,
              borderColor: "#5269EE",
            },
            data: [100],
          },
          {
            name: "",
            type: "pie",
            startAngle: 80,
            radius: ["68%"],
            hoverAnimation: false,
            center: ["50%", "50%"],
            itemStyle: {
              color: "rgba(66, 66, 66, .1)",
              borderWidth: 1,
              borderColor: "#5269EE",
            },
            data: [100],
          },
        ],
      });
    },

    //全年预警类型分布echart
    getTypeDistribution(data) {
      //类型分布echart
      this.chart = echarts.init(document.getElementById("typeDistribution"));
      var colorList = ["#8D7FF0", "#00D98B", "#02D9DB", "#F45E23"];
      var legendData = [];
      var seriesData = [];
      if (data.length > 0) {
        data.forEach(function (item, index) {
          legendData.push(item.name);
          seriesData.push({
            name: item.name,
            value: item.value,
          });
        });
      }
      this.chart.setOption({
        legend: {
          orient: "vertical",
          right: "right",
          top: "bottom",
          data: legendData,
          textStyle: {
            // fontSize: 16, //字体大小
            color: "#ffffff", //字体颜色
          },
        },
        series: [
          {
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex];
                },
              },
            },
            type: "pie",
            radius: ["0%", "85%"],
            center: ["30%", "50%"],
            label: {
              normal: {
                color: "#D5D5DA",
                position: "inner",
                formatter: (params) => {
                  return "{percent|" + params.percent.toFixed(0) + "%}";
                },
                rich: {
                  color: "#D5D5DA",
                  align: "right",
                  fontSize: 15,
                  fontWeight: "500",
                  //padding: [0, 5]
                },
              },
            },
            data: seriesData,
          },
        ],
      });
    },
    //全年NOX排放情况
    getNoXChart(data) {
      this.chart = echarts.init(document.getElementById("levelDistribution"));
      var datas = data.values;
      var XValue = data.months;
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
          formatter: (params) => {
            var relVal = params[0].name + "月";
            for (var i = 0, l = params.length; i < l; i++) {
              relVal += "<br/>" + params[i].value;
            }
            return relVal;
          },
        },
        grid: {
          top: "15%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        color: ["#00FDCD"],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: XValue,
          axisLabel: {
            textStyle: {
              color: "#D5D5DA",
            },
          },
        },

        yAxis: {
          name: "排放量（kg）",
          type: "value",
          nameTextStyle: {
            color: "#D5D5DA",
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#D5D5DA",
            },
          },
        },
        series: [
          {
            data: datas,
            type: "line",
          },
        ],
      });
    },
    //全年尿素使用g
    getNSChart(data) {
      this.chart = echarts.init(document.getElementById("NSChart"));
      var datas = data.values;
      var XValue = data.months;
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
          formatter: (params) => {
            var relVal = params[0].name + "月";
            for (var i = 0, l = params.length; i < l; i++) {
              relVal += "<br/>" + params[i].value;
            }
            return relVal;
          },
        },
        grid: {
          top: "15%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        color: ["#00FDCD"],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: XValue,
          axisLabel: {
            textStyle: {
              color: "#D5D5DA",
            },
          },
        },

        yAxis: {
          name: "排放量（kg）",
          type: "value",
          nameTextStyle: {
            color: "#D5D5DA",
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#D5D5DA",
            },
          },
        },
        series: [
          {
            data: datas,
            type: "line",
          },
        ],
      });
    },
    //最近十个月联网车辆数
    drivingChart(data) {
      //车辆排名echart
      this.chart = echarts.init(document.getElementById("connectedNumber"));
      var xValue = data.months;
      var seriesData = data.values;

      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params) => {
            var relVal = params[0].name + "月";
            for (var i = 0, l = params.length; i < l; i++) {
              relVal += "<br/>" + params[i].value;
            }
            return relVal;
          },
        },
        grid: {
          top: "1%",
          left: "1%",
          right: "1%",
          bottom: "2%",
          containLabel: true,
        },

        xAxis: [
          {
            type: "category",
            color: "#59588D",
            data: xValue,
            axisLabel: {
              color: "#fff",
            },
            axisTick: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            show: false,
          },
        ],
        series: [
          {
            type: "bar",
            data: seriesData,
            barWidth: "25px",
            itemStyle: {
              normal: {
                color: function (params) {
                  //let colorArr =params.value > 0 ? ["#FF9A22", "#FFD56E"]: ["#FFD56E", "#FF9A22"];
                  let colorArr = ["#04E9CE", "#0FA8D7"];
                  return new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: colorArr[0], // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: colorArr[1], // 100% 处的颜色
                      },
                    ],
                    false
                  );
                },
                barBorderRadius: [30, 30],
              },
            },
          },
        ],
      });
    },
    /////////////////////////// echart结束//////////////////////////////////////////////////////
    //地图 查看详情
    lookDetail(detailData, target) {
      var that = this;
      homePage
        .getVehicleMapDetail({ managedObjId: detailData.managedObjId })
        .then((response) => {
          this.infoWindowShow = true;
          var alarmInfo = [];
          var infoWindow = response.data;
          infoWindow.latitude = detailData.latitude;
          infoWindow.longitude = detailData.longitude;
          infoWindow.icon = detailData.icon.url;
          infoWindow.color = detailData.color;
          if (infoWindow.alarmInfo.length > 0) {
            infoWindow.alarmInfo.forEach(function (v, i) {
              alarmInfo.push(v.alarmInfo);
            });
          }
          this.infoWindowData = infoWindow;
          this.infoWindowData.alarmInfo = alarmInfo;
          if (infoWindow.alarmInfo.length > 0) {
            this.warningInfoShow = true;
          } else {
            this.warningInfoShow = false;
          }
        });
    },
    infoWindowClose() {
      this.infoWindowShow = false;
    },
    infoWindowOpen() {
      this.infoWindowShow = true;
    },
    handleSelect(key, keyPath) {
      // let route = this.permission_routes.find(item => item.path === key)
      // if (!route) {
      //   route = []
      // }
      // this.setSidebarHide(route)
    },

    rowStyle(row) {
      if (row) {
        return {
          background: "#0D1448",
          color: "#CEE7E5",
        };
      }
    },
  },
  computed: {
    ...mapGetters(["top_menus"]),
    topMenusLeft() {
      var topMenus = this.top_menus;
      return topMenus.slice(0, 3);
    },
    topMenusRight() {
      var topMenus = this.top_menus;
      return topMenus.slice(3, 6);
    },
    classOption() {
      return {
        step: 0.5, // 数值越大速度滚动越快
        // limitMoveNum: this.winnersList.length, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.JRYJ ::v-deep .el-card__body {
  padding: 10px;
}
::v-deep .el-card__body {
  // @media screen and (max-width: 1366px) {
  //   //  padding:5px;
  // }
  padding: 10px;
}

::v-deep .el-card {
  background: #0d1448;
  border: none;
  .el-card__header {
    border-bottom: 1px solid #1d224c;
    padding: 8px 20px;
  }
  .clearfix {
    span {
      font-size: 18px;
      color: #d9f2ed;
    }
    .cardIcon {
      display: inline-block;
      width: 16px;
      height: 20px;
      position: relative;
      top: 4px;
      margin-right: 15px;
      background: url(./icon/titleIcon.png) no-repeat;
    }
  }
}
::v-deep .el-table {
  background: #0d1448;
}
::v-deep .el-table__body tr:hover > td {
  background-color: #1b2b5e !important;
}
// table边框颜色
::v-deep .el-table--border:after,
::v-deep .el-table--group:after,
::v-deep .el-table:before {
  background-color: #1d224c;
}

::v-deep .el-table--border,
::v-deep .el-table--group {
  border-color: #1d224c;
}

::v-deep .el-table td,
::v-deep.el-table th.is-leaf {
  border-bottom: 1px solid #1d224c;
}

::v-deep .el-table--border th,
::v-deep .el-table--border th.gutter:last-of-type {
  border-bottom: 1px solid #1d224c;
}

::v-deep .el-table--border td,
::v-deep .el-table--border th {
  border-right: 1px solid #1d224c;
}
::v-deep .el-table--mini td,
.el-table--mini th {
  padding: 2px 0 !important;
}
::v-deep .is-leaf {
  padding: 2px 0 !important;
}
::v-deep .anchorBL {
  display: none;
}
::v-deep .el-rate__icon {
  font-size: 35px;
  @media screen and (max-width: 1366px) {
    font-size: 30px;
  }
}
.JRYJMedia {
  font-size: 24px;
  @media screen and (max-width: 1366px) {
    font-size: 21px;
  }
}
.container {
  background: #0a103f;
  font-size: 14px;
  color: #fff;
  padding-top: 4px;
  height: 100%;
  @media screen and (max-width: 1366px) {
    padding-top: 17px;
  }
  // padding:0 10px;
  .carStatusItem span {
    font-size: 18px;
    color: #eca92b;
  }
}

.topLeftDiv {
  display: flex;
  height: 100px;
}
.topRightDiv {
  display: flex;
  justify-content: flex-end;
  height: 100px;
  .dayWarning {
    width: 11%;
  }
  .dayText {
    width: 11%;
    div:first-child {
      font-size: 24px;
      line-height: 50px;
      color: #04fff9;
    }
    div:last-child {
      line-height: 30px;
    }
  }
}

.elcol {
  text-align: center;
  background: #252d5b;
  padding: 10px;
  border-radius: 5px;
}
.topDiv {
  text-align: center;
  color: #ffffff;
  .numberD {
    margin-bottom: 10px;
  }
  .numberD span:first-child {
    font-size: 18px;
    margin-right: 5px;
  }
}
.JRYJ {
  background: #0d1448;
  padding: 10px 0;
}

.listItem {
  list-style-type: none;
  margin: 0;
  padding: 0;
  color: #ffff;
  li {
    padding-bottom: 10px;
  }
}
.baidumap {
  margin: 10px 0;
}
.seamless-warp {
  height: 100px;
  overflow: hidden;
}

.infoTitle {
  font-size: 22px;
  img {
    width: 22px;
    height: 33px;
    position: relative;
    top: 8px;
    margin-right: 10px;
  }
}
.infoSubTitle {
  font-size: 18px;
  color: #333;
  margin: 20px 0 10px 0;
}
.infoContent {
  color: #666;
  margin-bottom: 6px;
  line-height: 20px;
}

.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;

  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      // 56px +17px
      height: 73px;
    }
  }
}
.container {
  .top-menu {
    float: left;
    width: 100%;
    .el-menu {
      border: none !important;
      background-color: #0a103f;
      position: relative;
      z-index: 999;
      height: 50px !important;
      .svg-icon {
        margin-right: 10px;
        font-size: 16px;
        vertical-align: middle;
      }
      .nav-item {
        display: inline-block;
        width: 33%;
        text-align: center;
      }
    }
  }
}
::v-deep .el-menu-item {
  color: #ffffff !important;
  height: 50px !important;
  font-size: 18px !important;
  &:hover {
    background-color: #0a103f !important;
    color: #ffffff !important;
  }
}
::v-deep .el-submenu__title {
  color: #ffffff !important;
  height: 50px !important;
  font-size: 18px !important;
  &:hover {
    background-color: #0a103f !important;
    color: #ffffff !important;
  }
}

::v-deep .el-submenu__title {
  i {
    color: #ffffff !important;
    position: static;
    vertical-align: middle;
    margin-left: 8px;
    margin-top: -3px;
  }
}
.tabelDiv {
  overflow: auto;
}
.showOrhide {
  display: none;
}
::v-deep .BMap_pop {
  > img {
    left: 288px !important;
  }
  > div:nth-child(9) {
    display: block;
    overflow: auto !important;
    width: 270px !important;
    // height:300px  !important;
  }
  //  >.BMap_center{
  //    height:300px !important;
  //  }
}
::v-deep .el-menu .svg-icon {
  margin-right: 10px;
  font-size: 18px;
  vertical-align: middle;
}
</style>
