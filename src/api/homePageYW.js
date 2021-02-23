import request from '@/utils/request'
//import request from '@/utils/request'
import {
  getToken
} from '@/utils/auth'

const Token = getToken()
const homePage = {
  
  getHomePageTop() {// 车辆实时状态统计和今日预警统计
    return request({
      url: 'api-obdMonitor/operHomePage/getHomePageTop',
      method: 'get',
    })

  },
  getTodayEarlyWarningInfo() {//动态预警信息
    return request({
      url: 'api-obdMonitor/operHomePage/getTodayEarlyWarningInfo',
      method: 'get',
    })

  },
  
  getHomePageCenter() {//全年车辆预警等级分布和全年预警车辆排名
    return request({
      url: 'api-obdMonitor/operHomePage/getHomePageCenter',
      method: 'get',
    })

  },
  getYearEarlyWarningByOrg() {//全年车辆预警等级分布
    return request({
      url: 'api-obdMonitor/operHomePage/getYearEarlyWarningByOrg',
      method: 'get',
    })

  },
getHomePageBottom() {//最近十个月联网车辆数和表格数据
    return request({
      url: 'api-obdMonitor/operHomePage/getHomePageBottom',
      method: 'get',
    })
  },
  getVehicleMapInfo(params) {//地图
    return request({
      url: 'api-obdMonitor/operHomePage/getVehicleMapInfo',
      method: 'get',
      params
    })
  },
  getVehicleMapDetail(params) {//地图弹框
    return request({
      url: 'api-obdMonitor/operHomePage/getVehicleMapDetail',
      method: 'get',
      params
    })
  },

}
export default homePage
