<template>
  <div class="container">
    <!-- 菜单 -->
    <div class="topMenuDiv">
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
    <!-- 标题 -->
    <div class="bigTitle">
     
        <el-image
          style="width: 100%; height: 100%"
          :src="bigTitleImg"
        ></el-image>
    
    </div>

    <el-row :gutter="10" ref='bottomDiv'>
      <el-col :xl="6" :lg="6" style='padding-left:15px'>
        <div :style="{ height: leftTopDivHeight }">
          <div class="leftTopTop">
            <div class="carNumberTitle">累计联网车辆</div>
            <div style="display: flex">
              <div class="carNumber">
                <div v-for="(item, index) in netTotal" :key="index">
                  {{ item }}
                </div>
              </div>
              <div class="carStatus">
                <div>
                  <p style="color: #ffffff">{{ data1.onlineCount }}</p>
                  <p><img :src="normalIcon" />在线</p>
                </div>
                <div>
                  <p style="color: #ffffff">{{ data1.offlineCount }}</p>
                  <p><img :src="offlineIcon" />离线</p>
                </div>
                <div>
                  <p style="color: #ffffff">{{ data1.faultCount }}</p>
                  <p><img :src="warnIcon" />故障</p>
                </div>
              </div>
            </div>
          </div>
          <el-card class="box-card leftTopBottom" style="margin: 1px 0;">
            <div slot="header" class="clearfix">
              <span>今日预警</span>
            </div>
            <div style="display: flex">
              <div class='YJImgDiv'><img :src="YJIcon" class="YJImg" /></div>
              <div class="YJDiv">
                <div v-for="(item, index) in data2" :key="index">
                  {{ item.name }}<span>{{ item.value }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </div>
        <el-card class="box-card " style="margin: 9px 0">
          <div slot="header" class="clearfix">
            <span>全年预警类型分布</span>
          </div>
          <div
            id="typeDistribution"
            :style="{ height: heightRightChart1 }"
            class="chart"
          ></div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>全年车辆预警等级分布</span>
          </div>
          <div
            id="levelDistribution"
            :style="{ height: heightRightChart1 }"
            class="chart"
          ></div>
        </el-card>
      </el-col>
      <el-col :xl="12" :lg="12">
        <el-col :span="24">
          <div class="mapDiv">
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
              <!-- <bm-info-window
                :position="{
                  lng: infoWindowData.longitude,
                  lat: infoWindowData.latitude,
                }"
                :show="infoWindowShow"
                @close="infoWindowClose"
                @open="infoWindowOpen"
              >
                <div class="infoDiv">
                 {{ infoWindowData.plateNo }}
                </div>
              </bm-info-window> -->
            </baidu-map>
            <!-- 地图info -->
            <el-card
              v-if="infoWindowShow"
              class="box-card mapInfoDiv"
              style="margin: 10px 0"
              :style="{ height: mapInfoHeight }"
            >
              <div slot="header" class="clearfix">
               <span>{{ infoWindowData.plateNo }}</span><span style='float:right;margin-right:10px;cursor:pointer' @click="infoWindowClose">X</span>
              </div>
           
                <div class="infoDiv">
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
                  <div>
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
                </div>
            </el-card>
            <img
              :src="mapImg"
              style="position: absolute; left: 10px; bottom: 10px"
            />
          </div>
        </el-col>
      </el-col>

      <el-col :xl="6" :lg="6" style='padding-right:15px'>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>预警车辆排名</span>
            <span style="float: right">（TOP5）</span>
          </div>
          <div
            id="carRanking"
            :style="{ height: heightRightChart1 }"
            class="chart"
          ></div>
        </el-card>

        <el-card class="box-card" style="margin: 9px 0">
          <div slot="header" class="clearfix">
           <span>全年检测数据</span>
          </div>
          <div class="tabelDiv" :style="{ height: heightRightChart2 }">
            <el-table
              :data="tableData"
              
              stripe
              size="mini"
              style="width: 100%"
              :row-style="rowStyle"
              :cell-style="cellStyle"
              :header-cell-style="{ background: '#1B2B5E', color: '#F3FAFF' }"
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
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>动态预警信息</span>
          </div>
          <vue-seamless-scroll
            :data="earlyWarningInfo"
            :class-option="classOption"
            class="seamless-warp"
            :style="{ height: heightRightChart3 }"
          >
            <ul class="listItem">
              <li v-for="(item, index) in earlyWarningInfo" :key="index">
                <span class="title" v-text="item" id="seamlessContent"></span>
              </li>
            </ul>
          </vue-seamless-scroll>
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
import homePage from "@/api/homePageYW.js";
import resize from '@/views/archives/resize'

import { BaiduMap, BmMarker, BmInfoWindow } from "vue-baidu-map";

import vueSeamlessScroll from "vue-seamless-scroll";
export default {
  mixins: [resize],
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
      chart1: null,
      chart2: null,
      chart3: null,
      map: null,
      showOrhide: true,
      bigTitleImg: require("./icon1/bigTitle.png"),
      normalIcon: require("./icon1/normalIcon.png"),
      offlineIcon: require("./icon1/offlineIcon.png"),
      warnIcon: require("./icon1/warnIcon.png"),
      YJIcon: require("./icon1/YJIcon.png"),
      data1: {
        onlineCount: "-",
        faultCount: "-",
        offlineCount: "-",
      },
      data2: null,
      heightRightChart1: 0,
      heightRightChart2: 0,
      heightRightChart3: 0,
      leftTopDivHeight:0,
      mapHeight: 0,
      mapInfoHeight: 0,
      show: false,
      netTotal: null, //车辆实时状态
      dayWarning1: 0,
      dayWarning2: 0,
      dayWarning3: 0,
      dayWarning4: 0,
      earlyWarningInfo: [], //动态预警信息（滚动）

      tableData: [],
      mapImg: require("./icon1/mapImg.png"),
      markers: [],
      infoWindowShow: false,
      warningInfoShow: false,
      infoWindowData: [],
      polling: null, //定时器
    };
  },
  mounted() {
    let clientWidth = document.documentElement.clientWidth;
    if (clientWidth > 1366) {
      let clientHeight =document.documentElement.clientHeight-this.$refs.bottomDiv.$el.getBoundingClientRect().top-10;//（-4是计算误差）
      this.heightRightChart1 = clientHeight/3 - 55-1-6 + "px";//(-1是card的下边框1px 6px是平分margin的值)
      this.heightRightChart2 =  clientHeight/3 - 55-1-6 + "px";
      this.heightRightChart3 =  clientHeight/3 - 55-1-6 + "px";
      this.mapHeight = clientHeight - 16 + "px";
      this.mapInfoHeight = clientHeight - 16 - 50 + "px";
      this.leftTopDivHeight = clientHeight/3 -6+"px"
    } else {
      let clientHeight =document.documentElement.clientHeight- this.$refs.bottomDiv.$el.getBoundingClientRect().top-10;
      console.log(this.$refs.bottomDiv.$el.getBoundingClientRect().top)
       console.log(clientHeight)
      this.heightRightChart1 = clientHeight/3 - 45-1-6 + "px";
      this.heightRightChart2 =  clientHeight/3 - 45-1-6 +40 + "px";
      this.heightRightChart3 =  clientHeight/3 - 45-1-6-40 + "px";
      this.mapHeight = clientHeight -16+ "px";
      this.mapInfoHeight = clientHeight +  - 100 + "px";
       this.leftTopDivHeight = clientHeight/3 -6+"px"
    }
    this.$nextTick(() => {
      this.getHomePageTop(); // 车辆实时状态统计和今日预警统计
      this.getTodayEarlyWarningInfo(); //动态预警信息(滚动)
      this.getYearEarlyWarningByOrg(); //全年车辆预警等级分布
      this.getHomePageCenter(); //全年预警类型分布和全年预警车辆排名
      this.getHomePageBottom(); //最近十个月联网车辆数和表格数据
      this.getVehicleMapInfo(); //地图请求
      this.polling = setInterval(this.getVehicleMapInfo, 15000);
    });
  },
  beforeDestroy(){
    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
    this.$once('hook:beforeDestroy', () => {            
        clearInterval(this.polling);                                    
    })
},
  methods: {
    
    handler({ BMap, map }) {
      map.setMapStyle({
        styleJson: [
          {
            featureType: "land",
            elementType: "geometry.fill",
            stylers: {
              color: "#00396B",
            },
          },
        ],
      });

      this.map = map;
    },
    /////////////////////////// echart请求开始//////////////////////////////////////////////////////

    //车辆实时状态统计和今日预警统计
    getHomePageTop() {
      homePage.getHomePageTop().then((response) => {
        this.data1 = response.data.getVehiclesRealStatus;
        this.data2 = response.data.getTodayEarlyWarningCount;
        // netTotal
        var total = String(response.data.getVehiclesRealStatus.netTotal).split(
          ""
        );
        for (var i = 0; i < 10; i++) {
          if (total.length < 5) {
            total.unshift("0");
          } else {
            break;
          }
        }

        this.netTotal = total;
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
                url: require("./icon1/normal.png"),
                size: { width: 22, height: 22 },
              };
            }
            if (item.status == "offline") {
              item.color = "#888888";
              item.icon = {
                url: require("./icon1/offline.png"),
                size: { width: 22, height: 22 },
              };
            }
            if (item.status == "alarm") {
              item.color = "#FF0E18";
              item.icon = {
                url: require("./icon1/warn.png"),
                size: { width: 22, height: 22 },
              };
            }
          });
          this.markers = mapData;
          var mapViewObj = this.map.getViewport(pointArr);
          this.map.centerAndZoom(mapViewObj.center, 10);
        }
      });
    },
    ////////////////////////// 地图请求开始开始////////////////////////////////////////////////////////////
    /////////////////////////// echart开始////////////////////////////////////////////////////////////

    //全年预警类型分布echart
    getTypeDistribution(data) {
      //类型分布echart
      this.chart1 = echarts.init(document.getElementById("typeDistribution"));
      var colorList = ["#8D7FF0", "#00D98B", "#02D9DB", "#F45E23"];
      var legendData = [];
      var seriesData = [];
      var bottom="";
       if (document.documentElement.clientWidth > 1366) {
        bottom="30%";
      } else {
        bottom="15%";
      }
      if (data.length > 0) {
        data.forEach(function (item, index) {
          legendData.push(item.name);
          seriesData.push({
            name: item.name,
            value: item.value,
          });
        });
      }
      this.chart1.setOption({
        tooltip: {
          trigger: "item",
        },

        legend: {
          orient: "vertical",
          type: "scroll",
          right: '10%',
          bottom: bottom,
          data: legendData,
          textStyle: {
            // fontSize: 16, //字体大小
            color: "#ffffff", //字体颜色
          },
        },
        series: [
          {
            type: "pie",
            radius: ["70%", "85%"],
            center: ["25%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex];
                },
                borderColor: "#0a103f",
              },
            },
            label: {
              show: false,
              position: "center",
            },
            // emphasis: {
            //   label: {
            //     show: true,
            //     fontSize: "20",
            //     fontWeight: "bold",
            //   },
            // },
            labelLine: {
              show: false,
            },
            data: seriesData,
          },
        ],
      });
    },
    //全年车辆预警等级分布echart
    getLevelDistribution(data) {
      //等级分布echart
      this.chart2 = echarts.init(document.getElementById("levelDistribution"));
      var colorList = ["#FE0000", "#F45E23", "#FEEF00"];
      var legendData = data.levels;
      var XData = data.orgNames;
      var datas = [];
      var isShow = true;
      var bottom = "15%";
      if (document.documentElement.clientWidth > 1366) {
        isShow = true;
        bottom = "15%";
      } else {
        isShow = false;
        bottom = "0%";
      }
      data.data.map(function (item, i) {
        item.map(function (items, j) {
          if (i == 0) {
            datas[j] = [];
          }

          datas[j][i] = items;
        });
      });
      this.chart2.setOption({
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
          bottom: bottom,
          containLabel: true,
        },
        xAxis: {
          show: isShow,
          type: "category",
          data: XData,
          axisLabel: {
            color: "#1F93F8",
            interval: 0,
            rotate: 20,
          },
           axisLine:{
            lineStyle: {
               color: "#1F93F8", //左边线的颜色
          },
           }
        },
        yAxis: {
          //show: false,
          type: "value",
          splitLine: {
            show: false,
          },
            
          axisLabel: {
              color: "#1F93F8",
          },
          axisLine:{
            lineStyle: {
               color: "#1F93F8", //左边线的颜色
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
            itemStyle: {
              normal: {
                borderColor: "#0a103f",
                borderWidth: 0,
              },
            },
            data: datas[0],
          },
          {
            name: "二级预警",
            type: "bar",
            stack: "总量",
            barWidth: 20, //柱图宽度
            data: datas[1],
            itemStyle: {
              normal: {
                borderColor: "#0a103f",
                borderWidth: 0,
              },
            },
          },
          {
            name: "三级预警",
            type: "bar",
            stack: "总量",
            barWidth: 20, //柱图宽度
            data: datas[2],
            itemStyle: {
              normal: {
                borderColor: "#0a103f",
                borderWidth: 0,
              },
            },
          },
        ],
      });
    },
    //全年预警车辆排名echart
    getCarRanking(data) {
      this.chart3 = echarts.init(document.getElementById("carRanking"));
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

      legendData.forEach(function (v, i) {
        seriesData.push({
          name: v,
          type: "bar",
          stack: "总量",
          barWidth: 20, //柱图宽度
          data: datas[i],
          itemStyle: {
            normal: {
              borderColor: "#fff",
              borderWidth: 0,
            },
          },
        });
      });
      yValue.reverse();
      var legendStyle = {};
      var a = {
        orient: "horizontal",
        itemWidth: 25,
        itemHeight: 14,
        left: 80,
        bottom: 5,
        formatter: "{a|{name}}",
        textStyle: {
          rich: {
            a: {
              color: "#ddd",
              fontSize: 12,
              width: 140,
              height: 15,
              padding: [0, 0, 0, 1],
            },
          },
        },
      };
      var b = {
        type: "scroll",
        bottom: 10,
        textStyle: {
          // fontSize: 16, //字体大小
          color: "#ddd", //字体颜色
        },
        data: legendData,
      };
      // if (document.documentElement.clientWidth > 1366) {
      //   legendStyle = a;
      // } else {
      //   legendStyle = b;
      // }
      legendStyle = b;

      this.chart3.setOption({
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
        legend: legendStyle,
        color: colorList,
        grid: {
          top: "1%",
          left: "1%",
          right: "5%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          // type: "value",
          // splitLine: { show: false }, //去除网格线
          // axisTick: {
          //   //y轴刻度线
          //   show: false,
          // },
          // splitArea: { show: false }, //保留网格区域
          // axisLine: {
          //   lineStyle: {
          //     type: "solid",
          //     color: "#1F93F8", //左边线的颜色
          //   },
          // },
          show: false,
        },
        yAxis: {
          type: "category",
          data: yValue,
          axisLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#1F93F8",
            },
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
        },
        series: seriesData,
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
              relVal += "<br/>" + params[i].value + "辆";
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
          var allOverlay = this.map.getOverlays();
          console.log(allOverlay)
            for(var i in allOverlay){
              if(i!=0){
                 if(!allOverlay[i].Eq && allOverlay[i].content!="点击可查看详情" && allOverlay[i].content){
                     this.map.removeOverlay(allOverlay[i]);
                  }
              }
             
            }
          var point = new BMap.Point( detailData.longitude,detailData.latitude);        //创建一个点
          var myLabel = new BMap.Label(
            response.data.plateNo, //为lable填写内容
            {
              offset: new BMap.Size(-60, -50), //label的偏移量，为了让label的中心显示在点上
              position: point,
            }
          ); //label的位置

          myLabel.setStyle({ 
            color : "#fff", 
            fontSize : "16px", 
            backgroundColor :"#89C8FF",
            border :"0", 
            fontWeight :"bold" ,
            padding:"10px 15px"
          });
          this.map.addOverlay(myLabel); //把label添加到地图上
           
         // this.deleteLabel()
          
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
      return "color:#1F93F8;";
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
.mapDiv {
  position: relative;
  border: 8px solid #006ac9;
}
.mapDiv ::-webkit-scrollbar {
  width: 5px;
}

/*定义滚动条轨道 内阴影+圆角*/
.mapDiv ::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.1);
}

/*定义滑块 内阴影+圆角*/
.mapDiv ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgba(0, 0, 0, 0.1);
}
::v-deep .el-card{
  overflow: visible;
}
::v-deep .el-card__body {
  padding: 0px 10px;
  background: #00325e;
  border-bottom: 1px solid #006ac9;
}

::v-deep .el-card {
  background: none;
  border: none;
  .el-card__header {
    border-bottom: none;
    padding: 0 0 0 10px;
    height: 55px;
    line-height: 41px;
    background: url(./icon1/titleImg.png) no-repeat;
    background-size: 100% 100%;
    @media screen and (max-width: 1366px) {
      height: 45px;
      line-height: 30px;
    }
  }
  .clearfix {
    span {
      font-size: 18px;
      color: #d9f2ed;
      @media screen and (max-width: 1366px) {
        font-size: 16px;
      }
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
  background: none !important;;
}

::v-deep .el-table--border,
::v-deep .el-table--group {
  border: none;
}

::v-deep .el-table td,
::v-deep.el-table th.is-leaf {
  border: none;
  padding: 5px 0;
}

::v-deep .el-table--border th,
::v-deep .el-table--border th.gutter:last-of-type {
  border: none;
}

::v-deep .el-table--border td,
::v-deep .el-table--border th {
  border: none;
}
::v-deep .el-table--mini td,
.el-table--mini th {
  //padding: 12px 0 !important;
  background: none !important;
  @media screen and (max-width: 1366px) {
    padding: 2px !important;
    background: none !important;
  }
}
::v-deep .el-table .has-gutter tr {
  background: none !important;
}
::v-deep .is-leaf {
  //padding: 12px 0 !important;
  @media screen and (max-width: 1366px) {
    padding: 2px !important;
  }
}
::v-deep .el-table .el-table__row--striped {
  background: #1b2b5e !important;
}
::v-deep .el-table__header-wrapper{
  border-bottom:1px solid #006ac9;
}

::v-deep .anchorBL {
  display: none;
}
.container {
  // background: #0a103f;
  background: url(./icon1/bg.png) no-repeat;
  background-size: 100% 100%;
  font-size: 14px;
  color: #fff;
  padding-top: 15px;
  height: 100%;
  @media screen and (max-width: 1366px) {
    padding-top: 10px;
  }
  .top-menu {
    float: left;
    width: 100%;
    .el-menu {
      border: none !important;
      background: none !important;
      position: relative;
      z-index: 9;
      height: 50px !important;
      .svg-icon {
        margin-right: 10px;
        font-size: 16px;
        vertical-align: middle;
        @media screen and (max-width: 1366px) {
          font-size: 14px;
        }
      }
      .nav-item {
        display: inline-block;
        width: 33%;
        text-align: center;
      }
    }
  }
}
.bigTitle {
  margin-bottom: 20px;
  height:52px;
  @media screen and (max-width: 1366px) {
    margin-bottom: 15px;
    height:40px;
  }
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
  color: #48a8fa;
  background: #0d4e88;
  padding: 5px 10px;
  margin: 10px 0;
}
.infoContent {
  color: #155388;
  margin-bottom: 6px;
  line-height: 20px;
}

.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;

  ::v-deep .el-scrollbar__bar {
    bottom: 0px;
  }
  ::v-deep .el-scrollbar__wrap {
    // 56px +17px
    height: 73px;
  }
}
::v-deep .el-menu-item:focus,
.el-menu-item:hover {
  background: none !important;
}
::v-deep .el-menu-item {
  color: #ffffff !important;
  height: 50px !important;
  font-size: 18px !important;
  @media screen and (max-width: 1366px) {
    font-size: 16px !important;
  }
  &:hover {
    background: none !important;
    color: #ffffff !important;
  }
}
::v-deep .el-submenu__title {
  color: #ffffff !important;
  height: 50px !important;
  font-size: 18px !important;
  &:hover {
    background: none !important;
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
::v-deep .el-table--mini,
.el-table--small,
.el-table__expand-icon {
  font-size: 16px !important;
   @media screen and (max-width: 1366px) {
    font-size: 14px !important;
  }
}
.tabelDiv {
  overflow: auto;
}
.showOrhide {
  display: none;
}

::v-deep .el-menu .svg-icon {
  margin-right: 10px;
  font-size: 18px;
  vertical-align: middle;
}
#seamlessContent {
  color: #1f93f8;
  display: block; /*内联对象需加*/
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
  font-size: 16px;
   @media screen and (max-width: 1366px) {
     font-size: 14px;
  }
}
.carNumberTitle {
  color: #6091bd;
  margin-bottom: 10px;
  @media screen and (max-width: 1366px) {
    margin-bottom: 5px;
  }
}
.topMenuDiv {
  position: absolute;
  top: 17px;
  width: 100%;
  @media screen and (max-width: 1366px) {
    top: 9px;
  }
}
.leftTopTop{
  height:36%;
  @media screen and (max-width: 1366px) {
    height:33%;
  }
}
.carNumber {
  display: flex;
  width: 50%;
  div {
    font-size: 24px;
    color: #57b1ff;
    width: 20%;
    padding: 15px 10px;
    background: #0066cd;
    margin-right: 5px;
    text-align: center;
    @media screen and (max-width: 1366px) {
      padding: 0;
      line-height: 30px;
    }
  }
}

.carStatus {
  display: flex;
  width: 50%;
  div {
    width: 33%;
    text-align: center;
    p {
      margin: 0;
      font-size: 16px;
      height: 30px;
      line-height: 30px;
      color: #6f9fcd;
      @media screen and (max-width: 1366px) {
        height: 15px;
        line-height: 15px;
      }
      img {
        margin-right: 5px;
      }
    }
  }
}
.YJImgDiv{
  margin-right:35px;
   @media screen and (max-width: 1366px) {
      margin-right:10px;
    }
}
.YJImg {
  height: 100px;
  width: auto;
  @media screen and (max-width: 1366px) {
    height: 69px;
  }
}
.YJDiv {
  color: #ffffff;
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  @media screen and (max-width: 1366px) {
     font-size: 14px;
  }
  div {
    width: 50%;
    height: 60px;
    line-height: 45px;
    color: #6f9fcd;
    @media screen and (max-width: 1366px) {
      height: 0px;
      line-height: 30px;
    }
    span {
      color: #ffffff;
      text-align: right;
      margin-left: 10px;
    }
  }
}
.mapInfoDiv {
  position: absolute;
  right: 10px;
  top: 0;
  width:280px;
  background: #3ea5ff !important;
  overflow: auto;
  ::v-deep .el-card__header {
    border-bottom: none;
    padding: 0 0 0 10px;
    height: 55px;
    line-height: 41px;
    background: url(./icon1/titleImg1.png) no-repeat;
    background-size: 100% 100%;
    @media screen and (max-width: 1366px) {
      height: 45px;
      line-height: 30px;
    }
  }
  ::v-deep .el-card__body {
    background: #3ea5ff !important;
    border-bottom: none;
  }
}
</style>





