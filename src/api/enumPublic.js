import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { parseComponent } from 'vue-template-compiler'

const Token = getToken()
const enumPublic = {
  // 行政区树/orgs/getAllOrgTree

  getOrgTree(params) {
    return request({
      url: 'api-user/orgs/getOrgTreeMapByToken',
      method: 'get',
      params
    })

  },
  // 根据车企请求行政区
  getOrgTreeChange(params) {
    return request({
      url: 'api-user/orgs/getOrgTreeMapByCompanyId',
      method: 'get',
      params
    })

  },
  // 运维公司机构树
  getManageOperaTree(params) {
    return request({
      url: 'api-user/manageOpera/getManageOperaTree',
      method: 'get',
      params
    })

  },
 
  //枚举
  enumPublic(params) {
    return request({
      url: '/api-system/dicSystem/getDic',
      method: 'get',
      params
    })
  },  
  //获取文件信息
getFile(params){
  return request({
    url: process.env.VUE_APP_BASE_API + "api-file/files/files/getFileByBussId?bussId=" + params.id+"&bussType="+params.bussType,
    method: 'get',
  })
},

// 文件删除
delFile(params) {
  return request({
    url: process.env.VUE_APP_BASE_API +"api-file/files/files/deleteById",
    method: 'delete',
    params
  })
},
}
export default enumPublic