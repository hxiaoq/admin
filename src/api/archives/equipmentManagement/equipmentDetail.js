import request from '@/utils/request'


const equipmentDetail={
  // 表格列表

  getTableList(params) {
    return request({
      url: 'api-obdMonitor/deviceDetails/getDeviceDetailsPage',
      method: 'get',
      params
    })

},


// 列表删除
del(data) {
  return request({
    url: 'api-obdMonitor/deviceDetails/deleteById',
    method: 'delete',
    data
  })
},

//导出
export(data){
  return request({
    url: 'api-obdMonitor/deviceDetails/getDeviceDetailsExport',
    method: 'post',
    data
  })
}
}

export default equipmentDetail