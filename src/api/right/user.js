import request from '@/utils/request'
import { getToken } from '@/utils/auth'
const Token = getToken()
// 用户管理
const user = {
  // 列表
  findUsers(params) {
    return request({
      url: '/api-user/users/findUsers',
      method: 'get',
      params
    })
  },
  // 新增修改
  saveOrUpdate(data) {
    return request({
      url: '/api-user/users/saveOrUpdate',
      method: 'post',
      data
    })
  },
  // 用户类型
  getGroupIdType() {
    return request({
      url: '/api-system/dicSystem/getGroupIdType',
      method: 'get',
      params: { 'access_token': Token }
    })
  },
  // 根据用户Id获取单条数据
  findById(params) {
    return request({
      url: '/api-user/users/findById',
      method: 'get',
      params
    })
  },
  // 删除用户
  delete(data) {
    return request({
      url: 'api-user/users/delete',
      method: 'delete',
      data
    })
  },
  // 黑白名单菜单树 /api-user/users/getWhiteAndBlackLists
  getWhiteAndBlackLists(params) {
    return request({
      url: '/api-user/users/getWhiteAndBlackLists',
      method: 'get',
      params
    })
  },
  // 菜单树
  getSysMenuTree() {
    return request({
      url: '/api-user/menus/getSysMenuTree',
      method: 'get'
    })
  },
  // 权限树
  getPermissionTree() {
    return request({
      url: 'api-user/permissions/getPermissionTree',
      method: 'get'
    })
  },
  // 设置黑白名单
  setWhiteAndBlackLists(data) {
    return request({
      url: '/api-user/users/setWhiteAndBlackLists',
      method: 'post',
      data
    })
  },
  // 修改用户状态
  updateEnabled(data) {
    return request({
      url: '/api-user/users/updateEnabled',
      method: 'post',
      data
    })
  },
  // 修改密码
  updatePassword(data) {
    return request({
      url: '/api-user/users/updatePassword',
      method: 'post',
      data
    })
  },
  // 重置密码
  resetPassword(data) {
    return request({
      url: '/api-user/users/resetPassword',
      method: 'post',
      data
    })
  }
}

export default user
