<template>
  <div style="height: 100%">
    <el-row :gutter="20" style="height: 100%">
      <el-col :xs="24" :sm="24" :lg="16" style="height: 100%">
        <el-row :gutter="10" style="height: 70%">
          <el-col :span="12" style="height: 100%">
            <div class="cardStyle">
              <div class="titleStyle">环境档案</div>
              <div class="DADiv">
                <div class="DAlist">
                  <div class="item">
                    <div style=""><img src="../../icons/png/noImg.png" /></div>
                    <div>
                      <div>水体</div>
                      <div><span>5</span>个</div>
                    </div>
                  </div>
                  <div class="item">
                    <div style=""><img src="../../icons/png/noImg.png" /></div>
                    <div>
                      <div>园区</div>
                      <div><span>5</span>个</div>
                    </div>
                  </div>
                  <div class="item">
                    <div style=""><img src="../../icons/png/noImg.png" /></div>
                    <div>
                      <div>空气监测站</div>
                      <div><span>5</span>个</div>
                    </div>
                  </div>
                  <div class="item" style="margin-bottom: 0px">
                    <div style=""><img src="../../icons/png/noImg.png" /></div>
                    <div>
                      <div>水质监测站</div>
                      <div><span>5</span>个</div>
                    </div>
                  </div>
                  <div class="item" style="margin-bottom: 0px">
                    <div style=""><img src="../../icons/png/noImg.png" /></div>
                    <div>
                      <div>噪声监测站</div>
                      <div><span>5</span>个</div>
                    </div>
                  </div>
                  <div class="item" style="margin-bottom: 0px">
                    <div style=""><img src="../../icons/png/noImg.png" /></div>
                    <div>
                      <div>加剧尾气</div>
                      <div><span>5</span>个</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12" style="height: 100%">
            <div style="height: 50%" class="cardStyle">
              <div class="titleStyle">空气质量趋势</div>
              <div id="airQuality" style="height: calc(100% - 39px)"></div>
            </div>
            <div style="height: 50%; padding-top: 10px">
              <div style="height: 100%" class="cardStyle">
                <div class="titleStyle">水环境质量状况</div>
                <div class="waterGroup" style="height: calc(100% - 39px)">
                  <div class='waterGroupItem'>
                    <div id="HLwater" style='height: calc(100% - 50px)"'></div>
                    <div class='waterIfo'>
                      <div>河流水</div>
                      <div>监测点<span>9</span>个</div>
                    </div>
                  </div>
                 <div class='waterGroupItem'>
                    <div id="YYwater" style='height: calc(100% - 50px)"'></div>
                     <div class='waterIfo'>
                        <div>河流水</div>
                      <div>监测点<span>9</span>个</div>
                     </div>
                  </div>
                 <div class='waterGroupItem'>
                    <div id="HCwater" style='height: calc(100% - 50px)"'></div>
                     <div class='waterIfo'>
                        <div>河流水</div>
                      <div>监测点<span>9</span>个</div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row style="height: 30%">
          <el-col :span="24" style="height: 100%; padding-top: 10px">
            <div style="height: 100%" class="cardStyle">
              <div class="titleStyle">环境视频监控</div>
              <div style="height: calc(100% - 39px)" id=""></div>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col ::xs="24" :sm="24" :lg="8" style="padding: 0" class="cardStyle">
        <div class="titleStyle"><div>实时监测站数据</div></div>
        <div style="height: calc(100% - 39px)" id=""></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import echarts from "echarts";
export default {
  data() {
    return {
      height: 0,
    };
  },
  mounted() {
    // const $chart = document.getElementById("www");
    // const height = window.getComputedStyle($chart).getPropertyValue("height");
    // this.height = parseInt(height) - 59 + "px";
    // console.log(this.height)

    this.getAirQualityEchart();
    this.getWaterEchart("HLwater");
    this.getWaterEchart("YYwater");
    this.getWaterEchart("HCwater");
  },
  methods: {
    getAirQualityEchart() {
      var myChart = echarts.init(document.getElementById("airQuality"));
      var base = +new Date(1968, 9, 3);
      var oneDay = 24 * 3600 * 1000;
      var date = [];

      var data = [Math.random() * 300];

      for (var i = 1; i < 20000; i++) {
        var now = new Date((base += oneDay));
        date.push(
          [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/")
        );
        data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
      }
      var option = {
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        title: {
          left: "center",
          text: "大数据量面积图",
        },

        xAxis: {
          type: "category",
          boundaryGap: false,
          data: date,
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 10,
          },
          {
            start: 0,
            end: 10,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
          },
        ],
        series: [
          {
            name: "模拟数据",
            type: "line",
            data: data,
          },
        ],
      };
      myChart.setOption(option);
    },
    getWaterEchart(div) {
      var myChart = echarts.init(document.getElementById(div));
      var color = ["#02afe7"];
      var dataStyle = {
        normal: {
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          shadowBlur: 40,
          borderWidth: 10,
          shadowColor: "rgba(0, 0, 0, 0)", //边框阴影
        },
      };
      var placeHolderStyle = {
        normal: {
          color: "transparent",
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
        },
        emphasis: {
          color: "#eee",
        },
      };
      var placeHolderStyle1 = {
        normal: {
          color: "#ddd",
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
        },
        emphasis: {
          color: "#eee",
        },
      };
      let option = {
        // backgroundColor: '#142058',
        title: {
          show: true,
          text: "匹配度",
          x: "center",
          y: "center",
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: "Line 1",
            type: "pie",
            clockWise: false,
            radius: ["50%", "60%"],
            center: ["50%", "50%"],
            itemStyle: dataStyle,
            hoverAnimation: false,
            label: {
              borderRadius: "10",
            },
            data: [
              {
                value: 44,
                name: "A业务",
                itemStyle: {
                  normal: {
                    color: color[0],
                  },
                },
              },
              {
                value: 56,
                name: "",
                tooltip: {
                  show: false,
                },
                itemStyle: placeHolderStyle1,
              },
            ],
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>
 <style lang="scss" scoped>
.cardStyle {
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 0px 6px #ddd;
  height: 100%;
}
.DADiv {
  width: 100%;
  height: 80%;
  display: flex;
  align-items: flex-end;

  .DAlist {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .item {
      width: 30%;
      line-height: 25px;
      text-align: center;
      display: flex;
      margin-bottom: 50px;
      img {
        position: relative;
        top: 20%;
        width: 30px;
        margin-right: 12px;
      }
    }
  }
}
.titleStyle {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.waterGroup {
  display: flex;
  flex-wrap: wrap;
  .waterGroupItem {
    width: 33%;
    height: 100%;
    .waterIfo{
      height:50px;
    }
  }
}
</style>
