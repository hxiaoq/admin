import request from '@/utils/request'
const equStatistical = {
  // deviceManagement最近12月OBD设备安装情况
  getDeviceCountByDate(params) {
    return request({
      url: '/api-obdMonitor/deviceManagementOper/getDeviceCountByDate',
      method: 'get',
      params
    })
  },
  // OBD厂商设备安装TOP10
  getDeviceCountByFactory(params) {
    return request({
      url: '/api-obdMonitor/deviceManagementOper/getDeviceCountByFactory',
      method: 'get',
      params
    })
  },
  // OBD设备安装运维公司TOP5
  getDeviceCountByOper(params) {
    return request({
      url: '/api-obdMonitor/deviceManagementOper/getDeviceCountByOper',
      method: 'get',
      params
    })
  },
  // 行政区OBD设备安装分布
  getDeviceCountByOrg(params) {
    return request({
      url: '/api-obdMonitor/deviceManagementOper/getDeviceCountByOrg',
      method: 'get',
      params
    })
  },
  // 设备统计获取头部4个值
  getTopValue(params) {
    return request({
      url: '/api-obdMonitor/deviceManagementOper/getTopValue',
      method: 'get',
      params
    })
  }
}
export default equStatistical
