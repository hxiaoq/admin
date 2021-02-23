import request from '@/utils/request'
// import request from '@/utils/request'
import { getToken } from '@/utils/auth'

const Token = getToken()
const carDetail = {
  // 表格列表

  getTableList(params) {
    return request({
      url: 'api-obdMonitor/carDetailsOper/getCompanyPage',
      method: 'get',
      params
    })
  },


//车企名称
getCompany() {
  return request({
    url: 'api-obdMonitor/carDetailsOper/getCompanySelect',
    method: 'get',
  })

},

// 新增
save(data) {
  return request({
    url: 'api-obdMonitor/carDetailsOper/saveOrUpdate',
    method: 'post',
    data
  })
},


// 列表删除
del(data) {
  return request({
    url: 'api-obdMonitor/carDetailsOper/deleteVehicle',
    method: 'delete',
    data
  })
},
//导出
export(data){
  return request({
    url: 'api-obdMonitor/carDetailsOper/getCarDetailsExport',
    method: 'post',
    data
  })
},

}
export default carDetail
