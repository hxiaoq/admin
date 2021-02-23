import request from '@/utils/request'
//import request from '@/utils/request'
import {
  getToken
} from '@/utils/auth'

const Token = getToken()
const homePageSoHo = {
  // getImageScoreByCompanyId() {
  //   return request({
  //     url: 'api-obdMonitor/entHomePage/getImageScoreByCompanyId',
  //     method: 'get',
  //   })

  // },
  // /
  // 企业端首页（上）
  
  // getTopEarlyWarningCount() {//今日预警统计
  //   return request({
  //     url: 'api-obdMonitor/entHomePage/getTopEarlyWarningCount',
  //     method: 'get',
  //   })

  // },

  getHomePageTop() {//评分//////今日预警统计
    return request({
      url: 'api-obdMonitor/entHomePage/getHomePageTop_GTH',
      method: 'get',
    })

  },
  getTodayEarlyWarningInfo() {//动态预警信息
    return request({
      url: 'api-obdMonitor/entHomePage/getTodayEarlyWarningInfo',
      method: 'get',
    })

  },

  getHomePageCenter_GTH() {//全年预警类型分布////表格数据
    return request({
      url: 'api-obdMonitor/entHomePage/getHomePageCenter_GTH',
      method: 'get',
    })

  },

  
  
  getHomePageBottom_GTH() {//获取全年NoX排放情况(个体户)
    return request({
      url: 'api-obdMonitor/entHomePage/getHomePageBottom_GTH',
      method: 'get',
    })
  },
  // getYearNoxByMonth() {//获取全年NoX排放情况(个体户)
  //   return request({
  //     url: 'api-obdMonitor/entHomePage/getYearNoxByMonth',
  //     method: 'get',
  //   })
  // },
  

  // getYearUreaByMonth() {// 获取全年尿素使用情况(个体户)
  //   return request({
  //     url: 'api-obdMonitor/entHomePage/getYearUreaByMonth',
  //     method: 'get',
  //   })
  // },

  
  // getYearOdoByMonth() {// 获取全年行驶里程情况(个体户)
  //   return request({
  //     url: 'api-obdMonitor/entHomePage/getYearOdoByMonth',
  //     method: 'get',
  //   })
  // },
  getVehicleMapInfo() {//地图
    return request({
      url: 'api-obdMonitor/entHomePage/getVehicleMapInfo',
      method: 'get',
    })
  },
  getVehicleMapDetail(params) {//地图弹框
    return request({
      url: 'api-obdMonitor/entHomePage/getVehicleMapDetail',
      method: 'get',
      params
    })
  },

}
export default homePageSoHo
