import request from '@/utils/request'


const equipmentDetail={
  // 表格列表

  getTableList(params) {
    return request({
      url: 'api-obdMonitor/deviceDetailsEnt/getDeviceDetailsPage',
      method: 'get',
      params
    })

},


// 列表删除
del(data) {
  return request({
    url: 'api-obdMonitor/deviceDetailsEnt/deleteById',
    method: 'delete',
    data
  })
},

//导出
export(data){
  return request({
    url: 'api-obdMonitor/deviceDetailsEnt/getDeviceDetailsExport',
    method: 'post',
    data
  })
}
}

export default equipmentDetail