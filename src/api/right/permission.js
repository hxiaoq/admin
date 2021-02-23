import request from '@/utils/request'

const permission = {
  getPermissionTableTree(params) {
    return request({
      url: '/api-user/permissions/getPermissionTableTree',
      method: 'get',
      params
    })
  },
  saveOrUpdate(data) {
    return request({
      url: '/api-user/permissions/saveOrUpdate',
      method: 'post',
      data
    })
  },

  // 删除
  deletePermissions(data) {
    return request({
      url: '/api-user/permissions/delete',
      method: 'delete',
      data
    })
  },
  // /api-system/dicBus/getPermissionType
  getPermissionType(params) {
    return request({
      url: '/api-system/dicSystem/getPermissionType',
      method: 'get',
      params
    })
  },
  // /api-user/permissions/getParentPermissionSelect
  getParentPermissionSelect(params) {
    return request({
      url: '/api-user/permissions/getParentPermissionSelect',
      method: 'get',
      params
    })
  }
}
export default permission
