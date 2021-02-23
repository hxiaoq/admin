import request from '@/utils/request'
//import request from '@/utils/request'
import { getToken } from '@/utils/auth'

const Token = getToken()
const carArchiverInfo={
  // 表格列表

  getData(params) {
    return request({
      url: 'api-obdMonitor/carDetails/getCarById',
      method: 'get',
      params
    })

},

// 预警信息
warningInfo(params) {
  return request({
    url: 'api-obdMonitor/earlyWarning/getAnalysisList',
    method: 'get',
    params
  })
},
// 检测信息
detectionInfo(params) {
    return request({
      url: 'api-obdMonitor/checkInfo/getPageResult',
      method: 'get',
      params
    })
  },
  // 行政处罚信息
  punishmentInfo(params) {
    return request({
      url: 'api-obdMonitor/punishInfo/getPageResult',
      method: 'get',
      params
    })
  },
//   检测信息模态框保存
saveJC(data) {
    return request({
      url: 'api-obdMonitor/checkInfo/saveCheckInfo',
      method: 'post',
      data
    })
  },
  // 行政处罚信息模态框保存
saveCF(data) {
    return request({
      url: 'api-obdMonitor/punishInfo/savePunishInfo',
      method: 'post',
      data
    })
  },

  //   检测信息删除
delJC(data) {
    return request({
      url: 'api-obdMonitor/checkInfo/deleteCheckInfo',
      method: 'delete',
      data
    })
  },
  // 行政处罚信息删除
delCF(data) {
    return request({
      url: 'api-obdMonitor/punishInfo/deletePunishInfo',
      method: 'delete',
      data
    })
  },
}
export default carArchiverInfo
