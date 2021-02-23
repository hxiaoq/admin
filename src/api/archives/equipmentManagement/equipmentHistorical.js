import request from '@/utils/request'


const equipmentDetail={
  // 表格列表

  getTableList(params) {
    return request({
      url: 'api-obdMonitor/deviceLog/getDeviceLogPage',
      method: 'get',
      params
    })

},


//导出
export(data){
  return request({
    url: 'api-obdMonitor/deviceLog/getDeviceLogExport',
    method: 'post',
    data
  })
}
}

export default equipmentDetail