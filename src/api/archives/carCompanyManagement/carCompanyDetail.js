import request from '@/utils/request'
//import request from '@/utils/request'
import { getToken } from '@/utils/auth'

const Token = getToken()
const carCompanyDetail={
  // 表格列表

  getTableList(params) {
    return request({
      url: 'api-obdMonitor/companyDetails/getCompanyPage',
      method: 'get',
      params
    })

},


// 新增添加
save(data) {
  return request({
    url: 'api-obdMonitor/companyDetails/saveOrUpdate',
    method: 'post',
    data
  })
},

// 列表删除
del(data) {
  return request({
    url: 'api-obdMonitor/companyDetails/deleteCompany',
    method: 'delete',
    data
  })
},
//导出
export(data){
  return request({
    url: 'api-obdMonitor/companyDetails/getDeviceDetailsExport',
    method: 'post',
    data
  })
},
}
export default carCompanyDetail