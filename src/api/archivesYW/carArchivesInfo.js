import request from '@/utils/request'
//import request from '@/utils/request'
import { getToken } from '@/utils/auth'

const Token = getToken()
const carArchiverInfo={
  // 表格列表

  getData(params) {
    return request({
      url: 'api-obdMonitor/carDetailsOper/getCarById',
      method: 'get',
      params
    })

},

// 预警信息
warningInfo(params) {
  return request({
    url: 'api-obdMonitor/earlyWarningOper/getAnalysisList',
    method: 'get',
    params
  })
},
// 检测信息
detectionInfo(params) {
    return request({
      url: 'api-obdMonitor/checkInfoOper/getPageResult',
      method: 'get',
      params
    })
  },
  // 行政处罚信息
  punishmentInfo(params) {
    return request({
      url: 'api-obdMonitor/punishInfoOper/getPageResult',
      method: 'get',
      params
    })
  },
//   检测信息模态框保存
saveJC(data) {
    return request({
      url: 'api-obdMonitor/checkInfoOper/saveCheckInfo',
      method: 'post',
      data
    })
  },
  // 行政处罚信息模态框保存
saveCF(data) {
    return request({
      url: 'api-obdMonitor/punishInfoOper/savePunishInfo',
      method: 'post',
      data
    })
  },

  //   检测信息删除
delJC(data) {
    return request({
      url: 'api-obdMonitor/checkInfoOper/deleteCheckInfo',
      method: 'delete',
      data
    })
  },
  // 行政处罚信息删除
delCF(data) {
    return request({
      url: 'api-obdMonitor/punishInfoOper/deletePunishInfo',
      method: 'delete',
      data
    })
  },
}
export default carArchiverInfo
