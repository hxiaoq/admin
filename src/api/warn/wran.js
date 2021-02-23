import request from '@/utils/request'
import { getToken } from '@/utils/auth'

const Token = getToken()
const wran = {
  // 预警列表
  getAnalysisList(params) {
    return request({
      url: '/api-obdMonitor/earlyWarning/getAnalysisList',
      method: 'get',
      params
    })
  },
  // 车辆预警类型趋势
  getEarlyWarningCountByAlarmType(params) {
    return request({
      url: '/api-obdMonitor/earlyWarning/getEarlyWarningCountByAlarmType',
      method: 'get',
      params
    })
  },
  // 车辆预警等级趋势
  getEarlyWarningCountByLevel(params) {
    return request({
      url: '/api-obdMonitor/earlyWarning/getEarlyWarningCountByLevel',
      method: 'get',
      params
    })
  },
  // 行政区车辆预警等级分布
  getEarlyWarningCountByOrg(params) {
    return request({
      url: '/api-obdMonitor/earlyWarning/getEarlyWarningCountByOrg',
      method: 'get',
      params
    })
  },
  // 预警统计头部4个值
  getTopEarlyWarningCount(params) {
    return request({
      url: '/api-obdMonitor/earlyWarning/getTopEarlyWarningCount',
      method: 'get',
      params
    })
  },
  // 车辆预警等级TOP10
  getTopEarlyWarningCountByLevel(params) {
    return request({
      url: '/api-obdMonitor/earlyWarning/getTopEarlyWarningCountByLevel',
      method: 'get',
      params
    })
  },
  getEarlyWarningDataByTime(params) {
    return request({
      url: '/api-obdMonitor/earlyWarning/getEarlyWarningDataByTime',
      method: 'get',
      params
    })
  }

}
export default wran
