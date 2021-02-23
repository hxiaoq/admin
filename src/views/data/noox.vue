<template>
  <div class="noox">
    <el-form
      :inline="true"
      :model="formInline"
      size="small"
      class="demo-form-inline noox-form"
    >
      <el-form-item id="modalAreaId" label="行政区">
        <treeselect
          v-model="formInline.orgId"
          :multiple="false"
          size="small"
          :normalizer="normalizer"
          :clearable="clearable"
          :options="areaTree"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="车辆类型">
        <el-select v-model="formInline.vehicleType" placeholder="车辆类型">
          <el-option
            v-for="item in vehicleTypeArr"
            :key="item.enumCode"
            :label="item.enumName"
            :value="item.enumCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排放标准">
        <el-select
          v-model="formInline.dischargeStandard"
          placeholder="排放标准"
        >
          <el-option
            v-for="item in dischargeStandardArr"
            :key="item.enumCode"
            :label="item.enumName"
            :value="item.enumCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          class=""
          size="small"
          type="success"
          icon="el-icon-search"
          @click="loadTable()"
        >
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="24">
        <baidu-map
          class="bm-view"
          ak="YOUR_APP_KEY"
          :center="center"
          :scroll-wheel-zoom="true"
          :zoom="zoom"
          :style="'height:' + Number(bodyHeight) + 'px'"
          @ready="handler"
        >
          <bml-heatmap :data="data" :max="100" :radius="20" />
        </baidu-map>
      </el-col>
    </el-row>
    <el-row class="noox-chart">
      <div class="chart-item">
        <div class="tit">NOX排放量</div>
        <ul>
          <li>
            <div class="nox-line">
              <div class="nox-line-item">
                <span class="num">{{ real.noxNumDay || '-' }}kg</span>
                <span class="sub-title">昨日累计</span>
              </div>
              <div class="nox-line-item">
                <span class="num">{{ real.noxNumDayDiff }}%</span>
                <span class="sub-title">环比</span>
              </div>
            </div>
            <el-progress
              :percentage="Number(real.noxNumDay / real.noxNumYear)"
              color="#01d5d3"
              :show-text="false"
            />
            <el-divider />
          </li>
          <li>
            <div class="nox-line">
              <div class="nox-line-item">
                <span class="num">{{ real.noxNumMonth || '-' }}kg</span>
                <span class="sub-title">当月累计</span>
              </div>
              <div class="nox-line-item">
                <span class="num">{{ real.noxNumMonthDiff }}%</span>
                <span class="sub-title">环比</span>
              </div>
            </div>
            <el-progress
              :percentage="Number(real.noxNumDay / real.noxNumYear)"
              color="#01d5d3"
              :show-text="false"
            />
            <el-divider />
          </li>
          <li>
            <div class="nox-line">
              <div class="nox-line-item">
                <span class="num">{{ real.noxNumYear || '-' }}kg</span>
                <span class="sub-title">全年累计</span>
              </div>
              <div class="nox-line-item">
                <span class="num">{{ real.noxNumYearDiff }}%</span>
                <span class="sub-title">环比</span>
              </div>
            </div>
            <el-progress
              :percentage="Number(real.noxNumYear / real.noxNumYear)"
              color="#01d5d3"
              :show-text="false"
            />
          </li>
        </ul>
      </div>
      <div class="chart-item" style="margin-top: 20px">
        <div class="tit">燃油消耗量</div>
        <ul>
          <li>
            <div class="nox-line">
              <div class="nox-line-item">
                <span class="num">{{ real.flowDay || '-' }}kg</span>
                <span class="sub-title">昨日累计</span>
              </div>
              <div class="nox-line-item">
                <span class="num">{{ real.flowDayDiff }}%</span>
                <span class="sub-title">环比</span>
              </div>
            </div>
            <el-progress
              :percentage="Number(real.flowDay / real.flowYear)"
              color="#01d5d3"
              :show-text="false"
            />
            <el-divider />
          </li>
          <li>
            <div class="nox-line">
              <div class="nox-line-item">
                <span class="num">{{ real.flowMonth || '-' }}kg</span>
                <span class="sub-title">当月累计</span>
              </div>
              <div class="nox-line-item">
                <span class="num">{{ real.flowMonthDiff }}%</span>
                <span class="sub-title">环比</span>
              </div>
            </div>
            <el-progress
              :percentage="Number(real.flowMonth / real.flowYear)"
              color="#01d5d3"
              :show-text="false"
            />
            <el-divider />
          </li>
          <li>
            <div class="nox-line">
              <div class="nox-line-item">
                <span class="num">{{ real.flowYear || '-' }}kg</span>
                <span class="sub-title">全年累计</span>
              </div>
              <div class="nox-line-item">
                <span class="num">{{ real.flowYearDiff }}%</span>
                <span class="sub-title">环比</span>
              </div>
            </div>
            <el-progress
              :percentage="Number(real.flowYear / real.flowYear)"
              color="#01d5d3"
              :show-text="false"
            />
          </li>
        </ul>
      </div>
      <div class="chart-item" style="margin-top: 20px">
        <div class="tit">尿素消耗量</div>
        <ul>
          <li>
            <div class="nox-line">
              <div class="nox-line-item">
                <span class="num">{{ real.ureaDay || '-' }}kg</span>
                <span class="sub-title">昨日累计</span>
              </div>
              <div class="nox-line-item">
                <span class="num">{{ real.ureaDayDiff }}%</span>
                <span class="sub-title">环比</span>
              </div>
            </div>
            <el-progress
              :percentage="Number(real.ureaDay / real.ureaYear)"
              color="#01d5d3"
              :show-text="false"
            />
            <el-divider />
          </li>
          <li>
            <div class="nox-line">
              <div class="nox-line-item">
                <span class="num">{{ real.ureaMonth || '-' }}kg</span>
                <span class="sub-title">当月累计</span>
              </div>
              <div class="nox-line-item">
                <span class="num">{{ real.ureaMonthDiff }}%</span>
                <span class="sub-title">环比</span>
              </div>
            </div>
            <el-progress
              :percentage="Number(real.ureaMonth / real.ureaYear)"
              color="#01d5d3"
              :show-text="false"
            />
            <el-divider />
          </li>
          <li>
            <div class="nox-line">
              <div class="nox-line-item">
                <span class="num">{{ real.ureaYear || '-' }}kg</span>
                <span class="sub-title">全年累计</span>
              </div>
              <div class="nox-line-item">
                <span class="num">{{ real.ureaYearDiff }}%</span>
                <span class="sub-title">环比</span>
              </div>
            </div>
            <el-progress
              :percentage="Number(real.ureaYear / real.ureaYear)"
              color="#01d5d3"
              :show-text="false"
            />
          </li>
        </ul>
      </div>
    </el-row>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmlHeatmap } from 'vue-baidu-map'
import enumPublic from '@/api/enumPublic.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import analysis from '@/api/data/analysis.js'
export default {
  name: 'PmDistribution',
  components: {
    BaiduMap,
    BmlHeatmap,
    Treeselect
  },
  props: ['apprefs'],
  data() {
    return {
      clearable:false,
      formInline: {
        orgId: [],
        vehicleType: '-1',
        dischargeStandard: '-1'
      },
      vehicleTypeArr: [],
      dischargeStandardArr: [],
      areaTree: [],
      normalizer(node) {
        return {
          id: node.orgId,
          label: node.orgName,
          children: node.childOrgs
        }
      },
      center: { lng: 0, lat: 0 },
      zoom: 3,
      data: [
        { lng: 116.418261, lat: 39.921984, count: 99 },
        { lng: 116.423332, lat: 39.916532, count: 5555 },
        { lng: 116.419787, lat: 39.930658, count: 15 }
      ],
      real: {
        flowDay: '-',
        flowDayDiff: '-',
        flowMonth: '-',
        flowMonthDiff: '-',
        flowYear: '-',
        flowYearDiff: '-',
        noxNumDay: '-',
        noxNumDayDiff: '-',
        noxNumMonth: '-',
        noxNumMonthDiff: '-',
        noxNumYear: '-',
        noxNumYearDiff: '-',
        ureaDay: '-',
        ureaDayDiff: '-',
        ureaMonth: '-',
        ureaMonthDiff: '-',
        ureaYear: '-',
        ureaYearDiff: '-'
      }
    }
  },
  computed: {
    bodyHeight() {
      const appContainerHeight = parseInt(window.getComputedStyle(this.apprefs.appBasicContainer).getPropertyValue('height'))
      return appContainerHeight
    }
  },
  mounted() {
    this.getBase()
    
  },
  methods: {
    handler({ BMap, map }) {
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = 15
    },
    getBase() {
      enumPublic.getOrgTree({}).then((response) => {
         this.formInline.orgId.push(response.data.orgId)
        this.areaTree.push(response.data)
          enumPublic.enumPublic({ groupCode: 'EmissionType' }).then((response) => {
        const arr = [{ enumName: '全部', enumCode: '-1' }, ...response.data]
        this.dischargeStandardArr = arr
         enumPublic.enumPublic({ groupCode: 'vehicleType' }).then((response) => {
        const arr = [{ enumName: '全部', enumCode: '-1' }, ...response.data]
        this.vehicleTypeArr = arr
        this.loadTable()
      })
      })
      })
    
     
    },
    loadTable() {
      this.formInline.orgId = this.formInline.orgId.toString();
      this.getNOXPolluteCountData()
      this.getNOXPolluteAnalysisData()
    },
    async getNOXPolluteCountData() {
      await analysis
        .getNOXPolluteCountData({
          orgId: this.formInline.orgId,
          dischargeStandard: this.formInline.dischargeStandard,
          vehicleType: this.formInline.vehicleType
        })
        .then((response) => {
          const { data } = response
          this.real = data
        })
    },
    async getNOXPolluteAnalysisData() {
      await analysis
        .getNOXPolluteAnalysisData({
          orgId: this.formInline.orgId,
          dischargeStandard: this.formInline.dischargeStandard,
          vehicleType: this.formInline.vehicleType
        })
        .then((response) => {
          const { data } = response
          this.data = data
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.noox {
  position: relative;
  margin: -10px -10px 0;
  .noox-form {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
    background: #ffffff;
    padding: 15px 15px 5px;
    border-radius: 5px;
  }
  .noox-chart {
    position: absolute;
    top: 0px;
    right: 0px;
    background: #ffffff;
    padding: 10px 20px;
    border-radius: 5px;
    width: 250px;
    height: calc(100% + 10px);
    overflow: auto;
    .chart-item {
      ul,
      li {
        list-style: none;
        margin: 0;
        padding: 0;
        .el-divider--horizontal {
          margin: 10px 0px;
          margin-top: 15px;
        }
        .el-progress {
          padding: 0 10px;
        }
      }
    }
    .nox-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1px 11px;
      margin-bottom: 3px;
      .nox-line-item {
        span {
          display: block;
          margin-top: 2px;
        }
        .sub-title {
          color: #999;
          font-size: 12px;
        }
        .num {
          color: #333;
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
  }
  .bm-view {
    margin-bottom: -10px;
  }
}
.bm-view {
  width: 100%;
}
.el-form-item {
  margin-bottom: 10px;
}
.tit {
  padding: 6px 10px;
  background: #f5f5f5;
  color: #333;
  margin-bottom: 5px;
  border-radius: 3px;
  font-size: 14px;
  margin-left: -10px;
}
.titname {
  font-size: 12px;
  color: #666;
  padding: 2px 5px;
}
.titNum {
  padding: 15px 1px;
  text-align: center;
  font-size: 18px;
  color: #0279f5;
  font-weight: 600;
}
.titHb {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #111;
  margin-bottom: 10px;
  padding: 2px 5px;
}
.color1 {
  background: #e0f995;
}
.color2 {
  background: #eac4e0;
}
.color3 {
  background: #bbdee4;
}
</style>

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
</style>

