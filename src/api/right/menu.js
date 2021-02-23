import request from '@/utils/request'

const menu = {
  getSysMenuTableTree(params) {
    return request({
      url: '/api-user/menus/getSysMenuTableTree',
      method: 'get',
      params
    })
  },
  // 菜单类型
  getMenuType(params) {
    return request({
      url: '/api-system/dicSystem/getMenuType',
      method: 'get',
      params
    })
  },
  // 所属应用
  getClientSelect(params) {
    return request({
      url: '/api-auth/client/getClientSelect',
      method: 'get',
      params
    })
  },
  // 上级菜单
  getParentMenuTree(params) {
    return request({
      url: '/api-user/menus/getParentMenuTree',
      method: 'get',
      params
    })
  },
  saveOrUpdate(data) {
    return request({
      url: '/api-user/menus/saveOrUpdate',
      method: 'post',
      data
    })
  },

  // 删除
  deleteMenu(data) {
    return request({
      url: '/api-user/menus/delete',
      method: 'delete',
      data
    })
  }
}
export default menu
