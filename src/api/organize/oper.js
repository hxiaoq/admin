import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import qs from 'qs'
const Token = getToken()
const oper={
  // 表格列表

  getTableList(params) {
    return request({
      url: 'api-user/operaComs/getOperaComListById',
      method: 'get',
      params
    })

},
getOperaComListByName(params) {
  return request({
    url: 'api-user/operaComs/getOperaComListByName',
    method: 'get',
    params
  })

},

// 上级机构类型列表
getOrgTopList() {
  return request({
    url: 'api-user/operaComs/getOperaComTreeByComId',
    method: 'get',
    params:{"access_token":Token}
  })
},

// 列表删除
del(params) {
  return request({
    url: 'api-user/operaComs/delOperaComByComId/'+params.comId,
    method: 'post',
    //data:params
  })
},
// 编辑获取数据
getEditData(params) {
  return request({
    url: 'api-user/operaComs/getOperaComInfoByComId',
    method: 'get',
    params
  })
},
// 保存修改新增添加
save(params) {
  return request({
    url: 'api-user/operaComs/saveOperaComInfo',
    method: 'post',
    data: params
  })
},
// 设置接口//////////////////////////////////////////////
getSetOrgTree(params){
    return request({
        url: 'api-user/orgs/getAllOrgTree',
        method: 'get',
        params
     })

},
getSetUserTree(params){
    return request({
        url: 'api-user/operaComs/getOperaComUserList',
        method: 'get',
        params
        })

},
//保存机构
saveOrg(params){
    return request({
        url: 'api-user/operaComs/saveComOrg',
        method: 'post',
        data:params
        })

},
//保存账号
saveUser(params){
    return request({
        url: 'api-user/operaComs/saveComUser',
        method: 'post',
        data:params
        })

},


}
export default oper