import request from '@/utils/request'
//import request from '@/utils/request'
import { getToken } from '@/utils/auth'

const Token = getToken()
const equipmentbind={
  // 表格列表

  getTableList(params) {
    return request({
      url: 'api-obdMonitor/deviceSetting/getManageDevicePage',
      method: 'get',
      params
    })

},
//修改保存
save(data) {
  return request({
    url: 'api-obdMonitor/deviceSetting/saveOrUpdate',
    method: 'post',
    data
  })
},


// 列表删除
del(data) {
  return request({
    url: 'api-obdMonitor/deviceSetting/deleteDevice',
    method: 'delete',
    data
  })
},

//导出
export(data){
  return request({
    url: 'api-obdMonitor/deviceSetting/getManageDeviceListExport',
    method: 'post',
    data
  })
},


}

export default equipmentbind