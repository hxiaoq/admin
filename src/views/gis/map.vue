<template>
  <div style='position:relative'>
  
     <div class='leftDiv'>
      <el-input
        v-model="filterText"
        placeholder="请输入单位名称/企业名称/车牌"
        style="margin-bottom: 20px"
      />
      <div>
      <el-tree
        ref="tree"
        class="filter-tree"
        :data="data"
        show-checkbox
        style="overflow: auto;padding:10px;min-width:260px;"
        :style="{height:treeHeight}"
        :props="defaultProps"
        default-expand-all
        highlight-current
        node-key="id"
        :filter-node-method="filterNode"
        @check-change="handleNodeClick"
      />
      </div>
    </div>
      <baidu-map
        class="bm-view"
        ak="B2pMOlG01dR3mQSUrmPPBG13jx7YsxUC"
        :center="center"
        :zoom="zoom"
        :scroll-wheel-zoom="true"
        :style="'height:' + bodyHeight + 'px'"
        @ready="handler"
      >
        <!-- 插入自定义控件 -->
        <bm-control anchor="BMAP_ANCHOR_BOTTOM_RIGHT">
          <img :src="mapImg" style="height: 36px" />
        </bm-control>
        <bm-control anchor="BMAP_ANCHOR_TOP_RIGHT">
          <div class="weiLan" style="padding: 4px 15px">
            <el-switch
              v-model="switchValue"
              active-text="15秒自动刷新"
              inactive-text=""
              @change="pollData"
            />
            <el-switch
              v-model="checked"
              active-text="电子围栏"
              inactive-text=""
              style="margin-left: 20px"
              @change="handleChecked"
            />
          </div>
          <div v-show="showTip" class="weiLan">
            <div>
              <el-row
                style="background: rgb(2 121 245); margin: 0; padding: 5px 15px"
              >
                <el-col :span="16">
                  <p class="carCard">{{ real.plateNo }}</p>
                  <div class="caRealTime">更新时间:{{ real.dateTime }}</div>
                </el-col>
                <el-col :span="8" style="text-align: right">
                  <div>
                    <i
                      class="el-icon-close"
                      style="color: #fff; cursor: pointer"
                      title="关闭"
                      @click="cloceBox(this)"
                    />
                  </div>
                  <a class="aButton" @click="getTrackHistoryList(real.id)">
                    轨迹回放
                  </a>
                </el-col>
              </el-row>
              <div style='display:flex;justify-content:space-between;padding:5px 40px 0 15px;'>
                <div>
                     <el-image :src="imgSrc" class="img"></el-image>
                </div>
                <div style="display:flex;flex-direction:column;justify-content:center">
                  <div style='font-size:20px;margin-bottom:5px;text-align:right'>{{real.owner}}</div>
                  <div style='text-align:right'>{{real.ownerPhone}}</div>
                   <div class="content" id='company' :title="real.companyName">{{ real.companyName }}</div>
                </div>
              </div>
                  <div class="des">
              <div>
                <span class="label">车架号:</span>
                <span class="content" id="company">{{real.vin}}</span>

                <span class="label right">状态:</span>
                <span class="content content1">{{ real.status }}</span>
              </div>
              <div>
                <span class="label">车辆状态:</span>
                <span class="content">{{ real.carStatus }}</span>
                <span class="label right">排放标准:</span>
                <span class="content content1">{{
                  real.dischargeStandardName
                }}</span>
              </div>
              <div>
                <span class="label">设备编码:</span>
                <span class="content">{{ real.deviceCode }}</span>
                <span class="label right">速度:</span>
                <span
                  class="content content1"
                  :style="{ color: real.SpeedStatus ? '#ff0000' : '' }"
                >
                  {{ real.Speed }}{{ real.SpeedUnit }}
                </span>
              </div>
              <div>
                <span class="label">大气压强:</span>
                <span
                  class="content"
                  :style="{ color: real.AtmosStatus ? '#ff0000' : '' }"
                >
                  {{ real.Atmos }}{{ real.AtmosUnit }}
                </span>
                <span class="label right">是否安装OBD:</span>
                <span class="content content1">{{ real.obdStatus }}</span>
              </div>

              <div>
                <span class="label">设备编码:</span>
                <span
                  class="content"
                  :style="{ color: real.AtmosStatus ? '#ff0000' : '' }"
                >
                  {{ real.deviceCode }}
                </span>
                <span class="label right">发动机扭矩:</span>
                <span
                  class="content content1"
                  :style="{ color: real.EngineTorqueStatus ? '#ff0000' : '' }"
                >
                  {{ real.EngineTorque }}{{ real.EngineTorqueUnit }}</span
                >
              </div>

              <div>
                <span class="label">摩擦扭矩:</span>
                <span
                  class="content"
                  :style="{ color: real.AtmosStatus ? '#ff0000' : '' }"
                >
                  {{ real.FrictionTorque }}{{ real.FrictionTorqueUnit }}
                </span>
                <span class="label right">发动机转速:</span>
                <span
                  class="content content1"
                  :style="{ color: real.EngineSpeedStatus ? '#ff0000' : '' }"
                >
                  {{ real.EngineSpeed }}{{ real.EngineSpeedUnit }}</span
                >
              </div>

              <div>
                <span class="label">燃料流量:</span>
                <span
                  class="content"
                  :style="{ color: real.EngineFuelFlowStatus ? '#ff0000' : '' }"
                >
                  {{ real.EngineFuelFlow }}{{ real.EngineFuelFlowUnit }}
                </span>
                <span class="label right">SCR上游NOX:</span>
                <span
                  class="content content1"
                  :style="{ color: real.ScrUpOutStatus ? '#ff0000' : '' }"
                >
                  {{ real.ScrUpOut }}{{ real.ScrUpOutUnit }}</span
                >
              </div>
              <div>
                <span class="label">SCR下游NOX:</span>
                <span
                  class="content"
                  :style="{ color: real.ScrDownOutStatus ? '#ff0000' : '' }"
                >
                  {{ real.ScrDownOut }}{{ real.ScrDownOutUnit }}
                </span>
                <span class="label right">反应剂余量:</span>
                <span
                  class="content content1"
                  :style="{ color: real.ScrUpOutStatus ? '#ff0000' : '' }"
                >
                  {{ real.ScrDownOut }}{{ real.ScrDownOutUnit }}</span
                >
              </div>

              <div>
                <span class="label">进气量:</span>
                <span
                  class="content"
                  :style="{ color: real.AirIntakeStatus ? '#ff0000' : '' }"
                >
                  {{ real.AirIntake }}{{ real.AirIntakeUnit }}
                </span>
                <span class="label right">SCR出口温度:</span>
                <span
                  class="content content1"
                  :style="{ color: real.OutletTempStatus ? '#ff0000' : '' }"
                >
                  {{ real.OutletTemp }}{{ real.OutletTempUnit }}</span
                >
              </div>

              <div>
                <span class="label">DPF压差:</span>
                <span
                  class="content"
                  :style="{
                    color: real.DpfPressureDiffStatus ? '#ff0000' : '',
                  }"
                >
                  {{ real.DpfPressureDiff }}{{ real.DpfPressureDiffUnit }}
                </span>
                <span class="label right">SCR入口温度:</span>
                <span
                  class="content content1"
                  :style="{ color: real.InletTempStatus ? '#ff0000' : '' }"
                >
                  {{ real.InletTemp }}{{ real.InletTempUnit }}</span
                >
              </div>
              <div>
                <span class="label">油箱液位:</span>
                <span
                  class="content"
                  :style="{ color: real.TankLevelStatus ? '#ff0000' : '' }"
                >
                  {{ real.TankLevel }}{{ real.TankLevelUnit }}
                </span>
                <span class="label right">冷却液温度:</span>
                <span
                  class="content content1"
                  :style="{
                    color: real.EngineCoolantTempStatus ? '#ff0000' : '',
                  }"
                >
                  {{ real.EngineCoolantTemp
                  }}{{ real.EngineCoolantTempUnit }}</span
                >
              </div>
              <div>
                <span class="label">经度:</span>
                <span class="content">  {{ real.Latitude }} </span>
                <span class="label right">纬度:</span>
                <span class="content content1"> {{ real.Longitude }}</span>
              </div>
              <div>
                <span class="label">位置:</span>
                <span style="color:##6E6E6E"> {{ real.carAddress }} </span>
              </div>
            </div>
              
            </div>
          </div>
        </bm-control>

        <bm-marker
          v-for="(marker, index) of markers"
          :key="index"
          :position="{ lng: marker.longitude, lat: marker.latitude }"
          :icon="marker.icon"
          :title="marker.plateNo ? marker.plateNo : ''"
          @click="lookDetail(marker)"
        />

        <!-- 电子围栏 -->
        <bm-circle
          v-for="(nearby, index) of nearbys"
          :key="index"
          :center="nearby.circlePath.center"
          :radius="nearby.circlePath.radius"
          stroke-color="blue"
          :stroke-opacity="0.5"
          :stroke-weight="2"
        />
        <bm-boundary
          v-for="(boundaryName, index) of boundaryNames"
          :key="index"
          :name="boundaryName.name"
          :stroke-weight="2"
          stroke-color="blue"
        />
        <bm-polygon
          v-for="(polygonPath, index) of polygonPaths"
          :key="index"
          :path="polygonPath.polygonPath"
          stroke-color="blue"
          :stroke-opacity="0.5"
          :stroke-weight="2"
        />

        <!-- 路书 -->
        <bm-driving
            v-for="(item) of pointArrs"
            :key="item.id"
          :start="item.start"
          :end="item.end"
          :panel="false"
         
        >
          <bml-lushu
           
            :path="item.point"
            :rotation="rotation"
            :content="content"
            :info-window="true"
            :speed="speed"
            :play="item.play"
            
          />
        </bm-driving>
      </baidu-map>
  </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmMarker from 'vue-baidu-map/components/overlays/Marker'
import BmBoundary from 'vue-baidu-map/components/others/Boundary'
import BmCircle from 'vue-baidu-map/components/overlays/Circle'
import BmPolygon from 'vue-baidu-map/components/overlays/Polygon'
import BmControl from 'vue-baidu-map/components/controls/Control'
import bmlLushu from 'vue-baidu-map/components/extra/Lushu'
import bmDriving from 'vue-baidu-map/components/search/Driving'
import enumPublic from '@/api/enumPublic.js'
import monitor from '@/api/dynamicMonitor/monitor.js'
import homePage from '@/api/homePage.js'
import map from '@/api/gis/map.js'
import Cookies from 'js-cookie'
export default {
  name: 'PmDistribution',
  components: {
    BaiduMap,
    BmMarker,
    BmBoundary,
    BmCircle,
    BmPolygon,
    BmControl,
    bmlLushu,
    bmDriving
  },
  props: ['apprefs'],
  data() {
    return {
      pointArrs:[],
      filterText: this.$route.query.plateNo,
      treeHeight: '',
      bodyHeight:"",
      checked: false,
      switchValue: false,
      data: [],
      firstqq: '',
      imgSrc:"",
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      showTip: false,
      map: null,
      mapImg: require('@/views/homePage/icon/mapImg.png'),
      center: { lng: 0, lat: 0 },
      zoom: 15,
      markers: [],
      nearbys: [],
      boundaryNames: [],
      polygonPaths: [],

      play: false,
      icon: {
        url: 'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
        size: { width: 52, height: 26 },
        opts: {
          anchor: { width: 27, height: 13 }
        }
      },
      content: '',
      speed: 5000,
      rotation: true,
      start: '',
      end: '',
      real: {
        id: '', // 被监管对象id
        status: '-', //
        plateNo: '-', // 车牌号
        vin: '-', // 车架号
        dateTime: '-', // 时间
        owner: '-', // 车主
        ownerPhone: '-', // 车主号码
        deviceId: '-', // 设备id
        deviceCode: '-', // 设备编码
        companyName: '-', // 车企名称
        dischargeStandardName: '-', // 排放标准
        Speed: '-', // 车速
        SpeedUnit: '', // 车速
        speedStatus: 0,
        carStatus: '-', // 车辆状态
        obdStatus: '-', // 是否安装OBD
        Atmos: '-', // 大气压
        AtmosStatus: 0,
        AtmosUnit: '', // 大气压
        FrictionTorque: '-', // 摩擦扭矩
        FrictionTorqueStatus: 0,
        FrictionTorqueUnit: '', // 摩擦扭矩
        EngineFuelFlow: '-', // 燃料流量
        EngineFuelFlowStatus: 0,
        EngineFuelFlowUnit: '', // 燃料流量
        EngineTorque: '-', // 发动机扭矩
        EngineTorqueStatus: 0,
        EngineTorqueUnit: '', // 发动机扭矩
        EngineSpeed: '-', // 发动机转速
        EngineSpeedStatus: 0,
        EngineSpeedUnit: '', // 发动机转速
        ScrUpOut: '-', // SCR上游NOX
        ScrUpOutStatus: 0,
        ScrUpOutUnit: '', // SCR上游NOX
        ScrDownOut: '-', // SCR下游NOX
        ScrDownOutStatus: 0,
        ScrDownOutUnit: '', // SCR下游NOX
        AirIntake: '-', // 进气量
        AirIntakeStatus: 0,
        AirIntakeUnit: '', // 进气量
        ReagentResidue: '-', // 反应剂余量
        ReagentResidueStatus: 0,
        ReagentResidueUnit: '', // 反应剂余量
        OutletTemp: '-', // scr出口温度
        OutletTempStatus: 0,
        OutletTempUnit: '', // scr出口温度
        InletTemp: '-', // scr入口温度
        InletTempStatus: 0,
        InletTempUnit: '', // scr入口温度
        DpfPressureDiff: '-', // DPF压差
        DpfPressureDiffStatus: 0,
        DpfPressureDiffUnit: '', // DPF压差
        TankLevel: '-', // 油箱液位
        TankLevelStatus: 0,
        TankLevelUnit: '', // 油箱液位
        EngineCoolantTemp: '-', // 冷却液温度
        EngineCoolantTempStatus: 0,
        EngineCoolantTempUnit: '', // 冷却液温度
        Latitude: '-', // 纬度
        Longitude: '-', // 经度
        carAddress: '-' // 实时位置
      },
      path: [
        // {
        //   'lng': 116.297611,
        //   'lat': 40.047363
        // },{
        //   'lng': 116.404,
        //   'lat': 39.915
        // }
      ],
      polling: null
    }
  },
  // computed: {
  //   bodyHeight() {
  //     const appContainerHeight = parseInt(window.getComputedStyle(this.apprefs.appBasicContainer).getPropertyValue('height')) - 20
  //     return appContainerHeight
  //   }
  // },
  watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
  mounted() {
    const divTop = document.documentElement.clientHeight
    this.treeHeight = divTop - 56 - 64 -60 + 'px'
    this.bodyHeight = document.documentElement.clientHeight -56-30
    this.getOrgAndCarTree()
    this.getVehicleMapInfo(this.$route.query.objId) // 地图请求
    if (this.$route.query.objId) this.getTrackHistoryList(this.$route.query.objId)
  },
  beforeDestroy() {
    clearInterval(this.polling)
  },
  methods: {
    pollData(val) { // 定时
      if (val) {
        this.polling = setInterval(this.getVehicleMapInfo, 15000)
      } else {
        clearInterval(this.polling)
      }
    },
    handler({ BMap, map }) {
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = 15
      this.map = map
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    async getOrgAndCarTree() {
      await monitor
        .getOrgAndCarTree({
          plateNo: this.filterText
        })
        .then((response) => {
          const { data } = response
          this.data = data
        })
    },
    async getCarRunTimeData(objId, realStatus,deviceId) {
      // 根据被监管对象id获取实时运行数据
      await map
        .getCarRunTimeData({
          objId: objId
        })
        .then((response) => {
          const { data } = response
          this.real = data
          this.real.status = realStatus
          this.showTip = true
          this.getFile(deviceId)
        })
    },
    async getElectronicFence() {
      // 查询电子围栏经纬度位置
      await map.getElectronicFence().then((response) => {
        const { data } = response
        this.nearbys = data.circle
        this.boundaryNames = data.area
        this.polygonPaths = data.polygon
      })
    },
    async getTrackHistoryList(objId) {
      //联动待用
      // this.$refs.tree.setCheckedKeys([objId]);
      var isReturn=true;
       this.pointArrs.forEach(function(item,i){
          if(item.id ==objId){
            isReturn =false;
          }
        })
        if(isReturn){
           // 获取车辆过去一个小时轨迹经纬度
          await map.getTrackHistoryList({ objId: objId }).then((response) => {
            const { data } = response
          
            const pointArr = []
            data.forEach((item, index) => {
              pointArr.push({ lng: item.Longitude, lat: item.Latitude })
            })
            this.pointArrs.push({point:pointArr,start:pointArr[0],end:pointArr[pointArr.length - 1],play:true,id:objId})
          })
        }
     
    },
    //tree选中事件
    handleNodeClick(data,checked) {
      if(data.type=="2" && checked==true){
      //this.getVehicleMapInfo(data.id)
      this.getTrackHistoryList(data.id);
      }else if(data.type=="2" && checked==false){
        var that = this
        that.pointArrs.forEach(function(item,i){
          if(item.id == data.id){
              that.pointArrs.splice(i, 1)
          }
          
        }) 
      }
    
    },
    // 查看详情
    lookDetail(data, target) {
      console.log(data)
      const realStatus =
        data.status === 'offline'
          ? '离线'
          : data.status === 'alarm'
            ? '预警'
            : '正常'
      this.getCarRunTimeData(data.managedObjId, realStatus,data.deviceId)
    },
    //关闭信息窗口
    cloceBox(e) {
      this.showTip = false
      this.path = []
      this.play = false
      this.start = ''
      this.end = ''
    },
    //电子围栏
    handleChecked(val) {
      if (val) {
        this.getElectronicFence()
      } else {
        this.nearbys = []
        this.boundaryNames = []
        this.polygonPaths = []
      }
    },
    // handleSearchComplete(res) {
    //   this.path = res.getPlan(0).getRoute(0).getPath();
    // },
    
    getVehicleMapInfo(objId) {
      const _this = this
      homePage.getVehicleMapInfo({ objIdList: objId }).then((response) => {
        var mapData = response.data
        var pointArr = []
        var realStatus = '-'
        if (mapData.length > 0) {
          mapData.forEach((item, index) => {
            pointArr.push({ lng: item.longitude, lat: item.latitude })
            if (item.status === 'normal') {
              item.color = '#00C712'
              item.icon = {
                url: require('@/views/homePage/icon/normal.png'),
                size: { width: 30, height: 41 }
              }
            }
            if (item.status === 'offline') {
              item.color = '#888888'
              item.icon = {
                url: require('@/views/homePage/icon/offline.png'),
                size: { width: 30, height: 41 }
              }
            }
            if (item.status === 'alarm') {
              item.color = '#FF0E18'
              item.icon = {
                url: require('@/views/homePage/icon/warning.png'),
                size: { width: 30, height: 41 }
              }
            }
            if (mapData.length === 1) {
              realStatus =
                item.status === 'offline'
                  ? '离线'
                  : item.status === 'alarm'
                    ? '预警'
                    : '正常'
            }
          })

          _this.markers = mapData
          var mapViewObj = _this.map.getViewport(pointArr)
          _this.map.centerAndZoom(mapViewObj.center, mapViewObj.zoom)
          if (objId) this.getCarRunTimeData(objId, realStatus)
        }
      })
    },
    getFile(id){
       var params ={
          id:id,
          bussType:"obd-carImg"
        }
        enumPublic.getFile(params).then((response) => {
           if(response.data.length>0){
                this.src = response.data[0].url;
              }
      
       })
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep .anchorBL {
  display: none;
}
.leftDiv{
  position: absolute;
  z-index: 999;
  top:20px;
  left:20px;
}
.el-divider--horizontal {
  margin: 2px 0 10px 0;
}
.des {
  padding: 10px;
 
}
.des>div{
   display:flex;
  flex-wrap: wrap;
  margin-bottom:15px;
}
.des>div>.content{
  width:115px;
  color:#6E6E6E;
}
.des>div>.content1{
 // width:40px;
}
.des>div>.label{
  margin-left:10px;
  text-align:right;
  width:105px;
  color:#9D9D9D
}
.des>div>.right{
  margin-left:30px;
  color:#9D9D9D
}
.img {
  width: 100px;
  height: 100px;
}
// .des .el-col-7 {
//   font-size: 16px;
//   color: #000;
//   text-align: left;
// }
.weiLan {
  background: #fff;
  margin: 10px;
  // width: 442px;
}
.carCard {
  color: #fff;
  font-size: 16px;
  margin:10px 0; 
}
.caRealTime {
  font-size: 16px;
  color: #fff;
}
.aButton {
  color: #fff;
  padding: 5px 10px;
  border-radius: 12px;
  border: 1px solid #fff;
  line-height: 50px;
  font-size: 14px;
}

.el-row {
  display: flex;
  flex-wrap: wrap;
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #8eafd1 !important;
}
#company{
  display:block;/*内联对象需加*/ 
// width:100%; 
word-break:keep-all; /* 不换行 */ 
white-space:nowrap; /* 不换行 */ 
overflow:hidden; /* 内容超出宽度时隐藏超出部分的内容 */ 
text-overflow:ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/ 
}
</style>
