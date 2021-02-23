import request from '@/utils/request'


const equipmentDetailEdit = {
  // 表格列表

  getFactorListTable(params) {
    return request({
      url: 'api-obdMonitor/deviceDetailsEnt/getFactorListByDeviceId',
      method: 'get',
      params
    })
  },
  //因子list
  getFactorList() {
    return request({
      url: 'api-obdMonitor/deviceDetailsEnt/getFactorList',
      method: 'get',
    })
  },
   //保存
   saveFactor(data) {
    return request({
      url: 'api-obdMonitor/deviceDetailsEnt/saveFactor',
      method: 'post',
      data
    })
  },
  


}

export default equipmentDetailEdit
