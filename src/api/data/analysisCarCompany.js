import request from '@/utils/request'

const analysis = {

  //车辆预警分析
  // 行政区预警次数排名
  getCarEarlyWarningCountByOrg(params) {
    return request({
      url: '/api-obdMonitor/carEarlyWarningCountEnt/getCarEarlyWarningCountByOrg',
      method: 'get',
      params
    })
  },
  // 行政区预警时长排名
  getCarEarlyWarningTimesByOrg(params) {
    return request({
      url: '/api-obdMonitor/carEarlyWarningCountEnt/getCarEarlyWarningTimesByOrg',
      method: 'get',
      params
    })
  },
  // 导出按照车辆统计异常次数数据（导出没做）
  getEarlyWarningTimesByCar(data) {
    return request({
      url: '/api-obdMonitor/carEarlyWarningCountEnt/getEarlyWarningTimesByCar',
      method: 'post',
      data
    })
  },
  // 按照车辆统计异常次数分页
  getEarlyWarningTimesPageByCar(params) {
    return request({
      url: '/api-obdMonitor/carEarlyWarningCountEnt/getEarlyWarningTimesPageByCar',
      method: 'get',
      params
    })
  },


  //OBD故障分析
  // 导出OBD故障分析（导出没做）
  getOBDFaultAnalysisExport(data) {
    return request({
      url: '/api-obdMonitor/obdMalfunctionAnalysisEnt/getOBDFaultAnalysisExport',
      method: 'post',
      data
    })
  },
  // 按照车辆统计异常次数分页
  getOBDFaultAnalysisPage(params) {
    return request({
      url: '/api-obdMonitor/obdMalfunctionAnalysisEnt/getOBDFaultAnalysisPage',
      method: 'get',
      params
    })
  },


  //设备离线分析
  // 导出设备离线监测（导出没做）
  getDeviceConnectExport(data) {
    return request({
      url: '/api-obdMonitor/deviceConnectionAnalysisEnt/getDeviceConnectExport',
      method: 'post',
      data
    })
  },
  // 行政区长期离线车辆分布
  getDeviceConnectByOrg(params) {
    return request({
      url: '/api-obdMonitor/deviceConnectionAnalysisEnt/getDeviceConnectByOrg',
      method: 'get',
      params
    })
  },
  // 长期离线车辆排名TOP10
  getDeviceConnectByVehicleType(params) {
    return request({
      url: '/api-obdMonitor/deviceConnectionAnalysisEnt/getDeviceConnectByVehicleType',
      method: 'get',
      params
    })
  },
  // 设备离线监测分页列表
  getDeviceConnectPage(params) {
    return request({
      url: '/api-obdMonitor/deviceConnectionAnalysisEnt/getDeviceConnectPage',
      method: 'get',
      params
    })
  },


  //行驶里程分析
  // 导出行驶里程（导出没做）
  getRoadHualListExport(data) {
    return request({
      url: '/api-obdMonitor/roadHualAnalysisEnt/getRoadHualListExport',
      method: 'post',
      data
    })
  },
  // 每日车辆里程情况
  getRoadHualDailyData(params) {
    return request({
      url: '/api-obdMonitor/roadHualAnalysisEnt/getRoadHualDailyData',
      method: 'get',
      params
    })
  },
  // 行政区车辆里程排名
  getRoadHualDataByOrg(params) {
    return request({
      url: '/api-obdMonitor/roadHualAnalysisEnt/getRoadHualDataByOrg',
      method: 'get',
      params
    })
  },
  // 行驶里程分析分页列表
  getRoadHualListPage(params) {
    return request({
      url: '/api-obdMonitor/roadHualAnalysisEnt/getRoadHualListPage',
      method: 'get',
      params
    })
  },



  //nox排放分布
  // 导出电子围栏内车辆监测数据日统计（导出没做）
  getNOXLetOutExport(data) {
    return request({
      url: '/api-obdMonitor/noxLetOutAnalysisEnt/getNOXLetOutExport',
      method: 'post',
      data
    })
  },
  // 行政区NOX排名
  getNOXLetOutByOrg(params) {
    return request({
      url: '/api-obdMonitor/noxLetOutAnalysisEnt/getNOXLetOutByOrg',
      method: 'get',
      params
    })
  },
  // 每日NOX排放情况
  getNOXLetOutDaily(params) {
    return request({
      url: '/api-obdMonitor/noxLetOutAnalysisEnt/getNOXLetOutDaily',
      method: 'get',
      params
    })
  },
  // 获取电子围栏内车辆监测数据日统计
  getNOXLetOutList(params) {
    return request({
      url: '/api-obdMonitor/noxLetOutAnalysisEnt/getNOXLetOutList',
      method: 'get',
      params
    })
  },


  //nox污染分析
  // 热力图
  getNOXPolluteAnalysisData(params) {
    return request({
      url: '/api-obdMonitor/noxPolluteAnalysisEnt/getNOXPolluteAnalysisData',
      method: 'get',
      params
    })
  },
  // 右边环比值
  getNOXPolluteCountData(params) {
    return request({
      url: '/api-obdMonitor/noxPolluteAnalysisEnt/getNOXPolluteCountData',
      method: 'get',
      params
    })
  },



  //百公里油耗比分析
  // 百公里油耗比分析导出（导出没做）
  getFuelConsumptionExport(data) {
    return request({
      url: '/api-obdMonitor/fuelConsumptionEnt/getFuelConsumptionExport',
      method: 'post',
      data
    })
  },
  // 百公里油耗比排名TOP5(排放类型)
  getFuelConsumptionByEmissionType(params) {
    return request({
      url: '/api-obdMonitor/fuelConsumptionEnt/getFuelConsumptionByEmissionType',
      method: 'get',
      params
    })
  },
  // 百公里油耗比排名TOP5(品牌型号)
  getFuelConsumptionByVehicleBrand(params) {
    return request({
      url: '/api-obdMonitor/fuelConsumptionEnt/getFuelConsumptionByVehicleBrand',
      method: 'get',
      params
    })
  },
  // 百公里油耗比排名TOP5(车辆类型)
  getFuelConsumptionByVehicleType(params) {
    return request({
      url: '/api-obdMonitor/fuelConsumptionEnt/getFuelConsumptionByVehicleType',
      method: 'get',
      params
    })
  },
  // 百公里油耗比分析
  getFuelConsumptionPage(params) {
    return request({
      url: '/api-obdMonitor/fuelConsumptionEnt/getFuelConsumptionPage',
      method: 'get',
      params
    })
  },



  //尿素油耗比分析
  // 尿素油耗比分析导出（导出没做）
  getUreaConsumptionExport(data) {
    return request({
      url: '/api-obdMonitor/ureaConsumptionEnt/getUreaConsumptionExport',
      method: 'post',
      data
    })
  },
  // 尿素油耗比排名TOP5(排放类型)
  getUreaConsumptionByEmissionType(params) {
    return request({
      url: '/api-obdMonitor/ureaConsumptionEnt/getUreaConsumptionByEmissionType',
      method: 'get',
      params
    })
  },
  // 尿素油耗比排名TOP5(品牌型号)
  getUreaConsumptionByVehicleBrand(params) {
    return request({
      url: '/api-obdMonitor/ureaConsumptionEnt/getUreaConsumptionByVehicleBrand',
      method: 'get',
      params
    })
  },
  // 尿素油耗比排名TOP5(车辆类型)
  getUreaConsumptionByVehicleType(params) {
    return request({
      url: '/api-obdMonitor/ureaConsumptionEnt/getUreaConsumptionByVehicleType',
      method: 'get',
      params
    })
  },
  // 尿素油耗比分析
  getUreaConsumptionPage(params) {
    return request({
      url: '/api-obdMonitor/ureaConsumptionEnt/getUreaConsumptionPage',
      method: 'get',
      params
    })
  },



  /////////////////////////////////////////////////////////////////////////重点监管车辆分析


  //重点监管车辆头部5个值
  getTopValue(params) {
    return request({
      url: '/api-obdMonitor/trustEnt/getTopValue',
      method: 'get',
      params
    })
  },
  //行政区重点监管车辆分布
  getTrustByOrg(params) {
    return request({
      url: '/api-obdMonitor/trustEnt/getTrustByOrg',
      method: 'get',
      params
    })
  },
  //重点监测车辆TOP10
  getTrustTop(params) {
    return request({
      url: '/api-obdMonitor/trustEnt/getTrustTop',
      method: 'get',
      params
    })
  },
  //  获取重点监管车辆列表
  getTableList(params) {
    return request({
      url: '/api-obdMonitor/trustEnt/getTrustPage',
      method: 'get',
      params
    })
  },
  //  评价得分
  getTrustDetailList(params) {
    return request({
      url: '/api-obdMonitor/trustEnt/getTrustDetailList',
      method: 'get',
      params
    })
  },
  // 评价得分变化趋势
  getTrustMainByDate(params) {
    return request({
      url: '/api-obdMonitor/trustEnt/getTrustMainByDate',
      method: 'get',
      params
    })
  },







}

export default analysis
