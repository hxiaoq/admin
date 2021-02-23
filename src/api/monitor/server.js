import request from '@/utils/request'
const server={
  // 服务列表
  getServiceData(params) {
    return request({
        url: 'api-back/serGovernment/getServiceCatalog',
        method: 'get',
        params
    })
},
 // 服务详情
 getServiceDetail(params) {
    return request({
        url: 'api-back/serGovernment/getServiceDetails',
        method: 'get',
        params
    })
},
//状态修改
setUpDown(params) {
    return request({
        url: 'api-back/serGovernment/setUpDown',
        method: 'get',
        params
    })
},

}
export default server