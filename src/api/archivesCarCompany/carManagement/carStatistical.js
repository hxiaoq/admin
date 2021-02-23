import request from '@/utils/request'
const carStatistical = {
  // 车辆统计头部6个值 /carManagement
  getTopValue(params) {
    return request({
      url: '/api-obdMonitor/carManagementEnt/getTopValue',
      method: 'get',
      params
    })
  },
  // 车辆实时状态
  getCarCountByStatus(params) {
    return request({
      url: '/api-obdMonitor/carManagementEnt/getCarCountByStatus',
      method: 'get',
      params
    })
  },
  // 行政区车辆分布
  getCarByOrg(params) {
    return request({
      url: '/api-obdMonitor/carManagementEnt/getCarByOrg',
      method: 'get',
      params
    })
  },
  // 车辆排放标准分类
  getCarByDischargeStandard(params) {
    return request({
      url: '/api-obdMonitor/carManagementEnt/getCarByDischargeStandard',
      method: 'get',
      params
    })
  },
  // 车辆品牌型号TOP5
  getCarByBrandTop(params) {
    return request({
      url: '/api-obdMonitor/carManagementEnt/getCarByBrandTop',
      method: 'get',
      params
    })
  }
}
export default carStatistical
