import request from '@/utils/request'


const equipmentDetailEdit = {
  // 表格列表

  getFactorListTable(params) {
    return request({
      url: 'api-obdMonitor/deviceDetails/getFactorListByDeviceId',
      method: 'get',
      params
    })
  },
  //因子list
  getFactorList() {
    return request({
      url: 'api-obdMonitor/deviceDetails/getFactorList',
      method: 'get',
    })
  },
   //保存
   saveFactor(data) {
    return request({
      url: 'api-obdMonitor/deviceDetails/saveFactor',
      method: 'post',
      data
    })
  },
  


}

export default equipmentDetailEdit
