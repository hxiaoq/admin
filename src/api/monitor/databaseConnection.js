import request from '@/utils/request'
const databaseConnection={
  // 表格列表

  getTableList(params) {
    return request({
      url: 'back-center/dbs/getDbConnect',
      method: 'get',
      params
    })

    },

}
export default databaseConnection