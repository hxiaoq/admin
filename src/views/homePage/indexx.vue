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
      <el-col  :xl="10" :lg="8">
        <div class="topLeftDiv">
          <div>
            <div style=" line-height: 50px; font-weight: bold" class="LJNumber">
              {{ netTotal }}
            </div>
            <div style="line-height: 50px" class='LJText'>累计联网车辆</div>
          </div>
          <div id="online"></div>
          <div id="offline"></div>
          <div id="fault"></div>
        </div>
      </el-col>
      <el-col  :xl="14" :lg="16">
        <div class="topRightDiv">
          <div style="width: 8%; text-align: right;" class="YJTitleText">
            <div style="line-height: 50px; padding-right: 20px">今日</div>
            <div style="line-height: 30px; padding-right: 20px">预警</div>
          </div>
          <div class="dayWarning" id="dayWarning1"></div>
          <div class="dayText">
            <div>
              <span class="YJNumber">{{ dayWarning1 }}</span
              ><span style="font-size: 18px; margin-left: 5px">辆</span>
            </div>
            <div class="YJText">NOX排放超标</div>
          </div>
          <div class="dayWarning" id="dayWarning2"></div>
          <div class="dayText">
            <div>
              <span class="YJNumber">{{ dayWarning2 }}</span
              ><span style="font-size: 18px; margin-left: 5px">辆</span>
            </div>
            <div class="YJText">尿素液位过低</div>
          </div>
          <div class="dayWarning" id="dayWarning3"></div>
          <div class="dayText">
            <div>
              <span class="YJNumber">{{ dayWarning3 }}</span
              ><span style="font-size: 18px; margin-left: 5px">辆</span>
            </div>
            <div class="YJText">行驶超速</div>
          </div>
          <div class="dayWarning" id="dayWarning4"></div>
          <div class="dayText">
            <div>
              <span class="YJNumber">{{ dayWarning4 }}</span
              ><span style="font-size: 18px; margin-left: 5px">辆</span>
            </div>
            <div class="YJText">进入限行区</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xl="12" :lg="10">
        <el-col :span="24">
          <div style="position: relative" class="mapDiv">
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
                  <span class="title" v-text="item" id="seamlessContent"></span>
                </li>
              </ul>
            </vue-seamless-scroll>
          </el-card>
        </el-col>
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
            <span class="cardIcon"></span><span>全年车辆预警等级分布</span>
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
            <span class="cardIcon"></span><span>预警车辆排名</span>
            <span style="float:right">（TOP5）</span>
          </div>
          <div
            id="carRanking"
            :style="{ height: heightChart }"
            class="chart"
          ></div>
        </el-card>

        <el-card class="box-card" style="margin: 10px 0">
          <div slot="header" class="clearfix">
            <span class="cardIcon"></span><span>全年检测数据</span>
          </div>
          <div class="tabelDiv" :style="{ height: heightChart }">
            <el-table
              :data="tableData"
              border
              stripe
              size="mini"
              style="width: 100%"
              :row-style="rowStyle"
              :cell-style="cellStyle"
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
                label="全年"
                show-overflow-tooltip
              >
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <!-- <el-col :span="12" :class="{ showOrhide: showOrhide }">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardIcon"></span><span>最近十个月联网车辆数</span>
          </div>
          <div id="connectedNumber" style="height: 150px" class="chart"></div>
        </el-card>
      </el-col> -->
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
import homePage from "@/api/homePage.js";

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
      polling:null//定时器
    };
  },
  mounted() {
    let clientHeight = document.documentElement.clientHeight - 78 - 130;
    let clientWidth = document.documentElement.clientWidth;
     // this.heightChart = (clientHeight - 122 - 20 - 211) / 2 + "px";
       this.heightChart = (clientHeight - 115 - 20) / 2 + "px";
      this.mapHeight = clientHeight - 165 - 10 + "px";
    

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
       this.getHomePageTop();// 车辆实时状态统计和今日预警统计
      this.getTodayEarlyWarningInfo(); //动态预警信息(滚动)
      this.getYearEarlyWarningByOrg(); //全年车辆预警等级分布
      this.getHomePageCenter();//全年预警类型分布和全年预警车辆排名
      this.getHomePageBottom();//最近十个月联网车辆数和表格数据
      this.getVehicleMapInfo(); //地图请求
       this.polling = setInterval(this.getVehicleMapInfo, 15000)
    });
  },

  methods: {
    handler({ BMap, map }) {

      //  var mapStyle ={
      //       features: ["road","building","water","land"],//隐藏地图上的"poi",
      //       style : "midnight",
      //   };
         //map.setMapStyle(mapStyle);
      map.setMapStyle({
      styleJson:[
          {
              "featureType": "land",
              "elementType": "geometry.fill",
              "stylers": {
                        "color": "#0a103fff"
              }
          }
      ]
});
     
      this.map = map;
    },
    /////////////////////////// echart请求开始//////////////////////////////////////////////////////

    //车辆实时状态统计和今日预警统计
    getHomePageTop() {
      homePage.getHomePageTop().then((response) => {
        var getVehiclesRealStatus = response.data.getVehiclesRealStatus;
        var getTodayEarlyWarningCount = response.data.getTodayEarlyWarningCount;
        this.netTotal = getVehiclesRealStatus.netTotal;
        this.getOnlineEchart("online", getVehiclesRealStatus.onlineCount); //在线chart
        this.getOnlineEchart("offline", getVehiclesRealStatus.offlineCount); //在线chart
        this.getOnlineEchart("fault", getVehiclesRealStatus.faultCount); //在线chart

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
    ///全年车辆预警等级分布行政区
    getYearEarlyWarningByOrg() {
      homePage.getYearEarlyWarningByOrg().then((response) => {
        this.getLevelDistribution(response.data);
      });
    },
    // 全年预警类型分布和全年预警车辆排名
    getHomePageCenter() {
      homePage.getHomePageCenter().then((response) => {
        this.getCarRanking(response.data.getYearEarlyWarningByVehicle);
        this.getTypeDistribution(response.data.getYearEarlyWarningByType);
      });
    },
      //最近十个月联网车辆数和//表格数据
    getHomePageBottom() {
      homePage.getHomePageBottom().then((response) => {
         this.tableData = response.data.getYearMonitorData;
       // this.getConnectedNumber(response.data.getNetVehicleCountByMonth);
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
              color: "rgba(33, 43, 114, 1)",
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
          
          right: 50,
          bottom: 5,
          data: legendData,
          textStyle: {
            // fontSize: 16, //字体大小
            color: "#ffffff", //字体颜色
          },
        },
    //      tooltip: {
    //     trigger: 'item',
    //     formatter: '{b} : {c} ({d}%)'
    // },
        series: [
          {
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex];
                },
                 borderColor:'#0a103f',
                    borderWidth:'5',
              },
            },
            type: "pie",
            radius: ["0%", "60%"],
            center: ["30%", "50%"],
            label: {
              normal: {
                color: "#ddd",
                position: "inner",
                formatter: (params) => {
                  return "{percent|" + params.percent + "%}";
                },
                rich: {
                  color: "#ddd",
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
    //全年车辆预警等级分布echart
    getLevelDistribution(data) {
      //等级分布echart
      this.chart = echarts.init(document.getElementById("levelDistribution"));
      var colorList = ["#FE0000", "#F45E23", "#FEEF00"];
      var legendData = data.levels;
      var XData = data.orgNames;
      var datas = [];
      data.data.map(function (item, i) {
        item.map(function (items, j) {
          if (i == 0) {
            datas[j] = [];
          }

          datas[j][i] = items;
        });
      });
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
           formatter: (params) => {
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              relVal +=
                "<br/>" + params[i].seriesName + " : " + params[i].value + "辆";
            }
            return relVal;
            
          },
        },
        
        legend: {
          top: "bottom",
          data: legendData,
          textStyle: {
            // fontSize: 16, //字体大小
            color: "#ffffff", //字体颜色
          },
          data: legendData,
        },
        color: colorList,
        grid: {
          top: "5%",
          left: "1%",
          right: "1%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: XData,
          axisLabel: {
            textStyle: {
              color: "#ffffff",
            },

            interval: 0,
            rotate: 20,
          },
        },
        yAxis: {
          show: false,
          type: "value",
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
            name: "一级预警",
            type: "bar",
            stack: "总量",
            barWidth: 20, //柱图宽度
            showBackground: true,
            backgroundStyle: {
              color: "#0A486A",
            },
            itemStyle:{
                normal:{
                  borderColor:"#0a103f",
                  borderWidth:2
                }
              },
            data: datas[0],
          },
          {
            name: "二级预警",
            type: "bar",
            stack: "总量",
            barWidth: 20, //柱图宽度
            data: datas[1],
            itemStyle:{
                normal:{
                  borderColor:"#0a103f",
                  borderWidth:2
                }
              }
          },
          {
            name: "三级预警",
            type: "bar",
            stack: "总量",
            barWidth: 20, //柱图宽度
            data: datas[2],
            itemStyle:{
                normal:{
                  borderColor:"#0a103f",
                  borderWidth:2
                }
              }
          },
        ],
      });
    },
    //全年预警车辆排名echart
    getCarRanking(data) {
      this.chart = echarts.init(document.getElementById("carRanking"));
      var colorList = ["#8D7FF0", "#00D98B", "#02D9DB", "#F45E23"];
      var legendData = data.types;
      var yValue = data.ehicles;
      var seriesData = [];
      var datas = [];

      if (data.data.length > 0) {
        data.data.map(function (item, i) {
          item.map(function (items, j) {
            if (i == 0) {
              datas[j] = [];
            }

            datas[j][i] = items;
          });
        });
      }
      datas.forEach(function (v, i) {
        v.reverse();
      });

      legendData.forEach(function(v,i){
           seriesData.push({
              name: v,
              type: "bar",
              stack: "总量",
              barWidth : 20,//柱图宽度
              data: datas[i],
              itemStyle:{
                normal:{
                  borderColor:"#0a103f",
                  borderWidth:2
                }
              }
              
        })
       
       
        
      })
      yValue.reverse();
      var legendStyle={};
      var a={
        orient: 'horizontal',
                   itemWidth: 25,
                   itemHeight: 14,
                    left: 80,
                   bottom: 5,
                   formatter:'{a|{name}}',
                   textStyle: {
                        rich:{
                            a: {
                                color: '#ddd',
                                fontSize: 12,
                                width: 140,
                                height: 15,
                                padding: [0,0,0,1]
                            },
                        }
                   },
                
      };
      var b={
          type: "scroll",
            bottom: 10,
            textStyle: {
              // fontSize: 16, //字体大小
              color: "#ddd", //字体颜色
            },
            data: legendData,
      }
      if(document.documentElement.clientWidth>1366){
        legendStyle= a
      }else{
        legendStyle= b
      }
      
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
            formatter: (params) => {
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              relVal +=
                "<br/>" + params[i].seriesName + " : " + params[i].value + "次";
            }
            return relVal;
            
          },
        },
        legend:legendStyle,
        color: colorList,
        grid: {
          top: "1%",
          left: "1%",
          right: "5%",
          bottom: "20%",
          containLabel: true,
        },
        xAxis: {
          show: false,
        },
        yAxis: {
          type: "category",
          data: yValue,
          axisLabel: {
            textStyle: {
              color: "#D5D5DA",
            },
          },
            axisLine:{       //y轴
          show:false

        },
        axisTick:{       //y轴刻度线
          show:false
        },
        splitLine: {     //网格线
          show: false
        }
        },
        series: seriesData
      });
    },
    //最近十个月联网车辆数
    getConnectedNumber(data) {
      //车辆排名echart
      this.chart = echarts.init(document.getElementById("connectedNumber"));
      var xValue = [];
      var seriesData = [];
      if (data.length > 0) {
        data.forEach(function (item, index) {
          seriesData.push(item.value);
          xValue.push(moment(item.name, "YYYYMMDD").format("YYYY-MM-DD"));
        });
      }
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
           formatter: (params) => {
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              relVal +=
                "<br/>" + params[i].value + "辆";
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
          background: "none",
          color: "#CEE7E5",
        };
      }
    },
     cellStyle(row) {
       
      if (row.column.property === "yearAccum") {
        return "color:#09B5BC;";
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

.mapDiv ::-webkit-scrollbar {
  width: 5px;
}

/*定义滚动条轨道 内阴影+圆角*/
.mapDiv  ::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.1);
}

/*定义滑块 内阴影+圆角*/
.mapDiv ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgba(0, 0, 0, 0.1);
}
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
  background:none;
  border: none;
  .el-card__header {
    border-bottom: none;
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
  background: none;
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
  border:none;
}

::v-deep .el-table td,
::v-deep.el-table th.is-leaf {
  border:none;;
}

::v-deep .el-table--border th,
::v-deep .el-table--border th.gutter:last-of-type {
  border:none;
}

::v-deep .el-table--border td,
::v-deep .el-table--border th {
  border:none;
}
::v-deep .el-table--mini td,
.el-table--mini th {
  padding: 12px 0 !important;
  background: none !important;
   @media screen and (max-width: 1366px) {
     padding:2px !important;
      background: none !important;
  }
}
::v-deep .el-table .has-gutter tr {
  background:none !important;
} 
::v-deep .is-leaf {
  padding: 12px 0 !important;
     @media screen and (max-width: 1366px) {
      padding:2px !important;
  }
}
::v-deep .el-table .el-table__row--striped{
  background:#1B2B5E !important;
}

::v-deep .anchorBL {
  display: none;
}
// 文字大小适配
 .LJNumber{
  font-size: 50px;
    @media screen and (max-width: 1366px) {
     font-size: 42px!important;
  }
} 
 .LJText{
  font-size: 18px;
  color:#efefef;
   @media screen and (max-width: 1366px) {
     font-size: 14px!important;
  }
} 
 .YJNumber{
   font-size: 36px
}
.YJText{
   font-size: 16px;
   color:#efefef;
    @media screen and (max-width: 1366px) {
     font-size: 14px!important;
  }
}
.YJTitleText{
   font-size: 32px;
   color:#efefef;
    @media screen and (max-width: 1366px) {
     font-size: 24px!important;
  }
}
.container {
 // background: #0a103f;
   background: url(./icon/grid.png) repeat;
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
  > div {
    width: 25%;
    text-align: center;
  }
}
.topRightDiv {
  display: flex;
  justify-content: flex-end;
  height: 100px;
  .dayWarning {
    width: 12.5%;
  }
  .dayText {
    width: 10%;
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
::v-deep .el-table--mini, .el-table--small, .el-table__expand-icon {
  font-size:16px !important;
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
#seamlessContent{
  display:block;/*内联对象需加*/ 
// width:100%; 
word-break:keep-all; /* 不换行 */ 
white-space:nowrap; /* 不换行 */ 
overflow:hidden; /* 内容超出宽度时隐藏超出部分的内容 */ 
text-overflow:ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/ 
}

</style>
