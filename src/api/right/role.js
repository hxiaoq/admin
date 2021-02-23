import request from '@/utils/request'

const role = {
  findRoles(params) {
    return request({
      url: '/api-user/roles/findRoles',
      method: 'get',
      params
    })
  },
  // 角色类型
  getClientSelect(params) {
    return request({
      url: '/api-auth/client/getClientSelect',
      method: 'get',
      params
    })
  },
  // 类型
  getRoleType(params) {
    return request({
      url: '/api-system/dicSystem/getRoleType',
      method: 'get',
      params
    })
  },
  // 新增修改
  saveOrUpdate(data) {
    return request({
      url: '/api-user/roles/saveOrUpdate',
      method: 'post',
      data
    })
  },
  // 删除
  deleteRole(data) {
    return request({
      url: '/api-user/roles/deleteRole',
      method: 'delete',
      data
    })
  },
  getSysMenuTree(params) {
    return request({
      url: '/api-user/menus/getSysMenuTree',
      method: 'get',
      params
    })
  },
  getSysRoleTree(params) {
    return request({
      url: '/api-user/permissions/getPermissionTree',
      method: 'get',
      params
    })
  },
  getSysServiceTree(params) {
    return request({
      url: '/api-user/users/getSysUserTree',
      method: 'get',
      params
    })
  },
  setAllToRole(data) {
    return request({
      url: '/api-user/roles/setAllToRole',
      method: 'post',
      data
    })
  },
  findByRoleId(params) {
    return request({
      url: '/api-user/roles/findByRoleId',
      method: 'get',
      params
    })
  }

}
export default role
