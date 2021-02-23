import request from '@/utils/request'
// import request from '@/utils/request'
import { getToken } from '@/utils/auth'

const Token = getToken()
const carDetail = {
  // 表格列表

  getTableList(params) {
    return request({
      url: 'api-obdMonitor/carDetails/getCompanyPage',
      method: 'get',
      params
    })
  },


//车企名称
getCompany() {
  return request({
    url: 'api-obdMonitor/carDetails/getCompanySelect',
    method: 'get',
  })

},

// 新增
save(data) {
  return request({
    url: 'api-obdMonitor/carDetails/saveOrUpdate',
    method: 'post',
    data
  })
},


// 列表删除
del(data) {
  return request({
    url: 'api-obdMonitor/carDetails/deleteVehicle',
    method: 'delete',
    data
  })
},
//导出
export(data){
  return request({
    url: 'api-obdMonitor/carDetails/getCarDetailsExport',
    method: 'post',
    data
  })
},

}
export default carDetail
