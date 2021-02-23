import request from '@/utils/request'
//import request from '@/utils/request'
import { getToken } from '@/utils/auth'

const Token = getToken()
const equipmentbind={
  // 表格列表

  getTableList(params) {
    return request({
      url: 'api-obdMonitor/deviceSettingOper/getManageDevicePage',
      method: 'get',
      params
    })

},
//修改保存
save(data) {
  return request({
    url: 'api-obdMonitor/deviceSettingOper/saveOrUpdate',
    method: 'post',
    data
  })
},


// 列表删除
del(data) {
  return request({
    url: 'api-obdMonitor/deviceSettingOper/deleteDevice',
    method: 'delete',
    data
  })
},

//导出
export(data){
  return request({
    url: 'api-obdMonitor/deviceSettingOper/getManageDeviceListExport',
    method: 'post',
    data
  })
},


}

export default equipmentbind