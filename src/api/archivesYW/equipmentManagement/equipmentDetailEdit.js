import request from '@/utils/request'


const equipmentDetailEdit = {
  // 表格列表

  getFactorListTable(params) {
    return request({
      url: 'api-obdMonitor/deviceDetailsOper/getFactorListByDeviceId',
      method: 'get',
      params
    })
  },
  //因子list
  getFactorList() {
    return request({
      url: 'api-obdMonitor/deviceDetailsOper/getFactorList',
      method: 'get',
    })
  },
   //保存
   saveFactor(data) {
    return request({
      url: 'api-obdMonitor/deviceDetailsOper/saveFactor',
      method: 'post',
      data
    })
  },
  


}

export default equipmentDetailEdit
