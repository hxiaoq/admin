import request from '@/utils/request'
const carCompanyStatistical = {

  getCarCompanyByOrg(params) {
    return request({
      url: '/api-obdMonitor/companyManagement/getCarCompanyByOrg',
      method: 'get',
      params
    })
  },
  getCarCompanyByProperty(params) {
    return request({
      url: '/api-obdMonitor/companyManagement/getCarCompanyByProperty',
      method: 'get',
      params
    })
  },
  getCarCompanyTop(params) {
    return request({
      url: '/api-obdMonitor/companyManagement/getCarCompanyTop',
      method: 'get',
      params
    })
  }
}
export default carCompanyStatistical
