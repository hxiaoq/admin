import request from '@/utils/request'

const api = {
  // 总体预览头部
  getTopCount(params) {
    return request({
      url: '/api-back/general/getTopCount',
      method: 'get',
      params
    })
  },
  // 用户类型人数统计
  getTotalUserCountByType(params) {
    return request({
      url: '/api-back/general/getTotalUserCountByType',
      method: 'get',
      params
    })
  },
  // 授权方式
  getTotalCountByGrantType(params) {
    return request({
      url: '/api-back/general/getTotalCountByGrantType',
      method: 'get',
      params
    })
  },
  // 用户登录次数
  getTotalCountByUser(params) {
    return request({
      url: '/api-back/general/getTotalCountByUser',
      method: 'get',
      params
    })
  }

}
// 引用使用.xxx方法调用
export default api
