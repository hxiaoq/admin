import request from '@/utils/request'

const monitor ={
     // 获取机构车辆树
     getOrgAndCarTree(params) {
        return request({
            url: '/api-obdMonitor/carRunTimeEnt/getOrgAndCarTree',
            method: 'get',
            params
        })
    },
    // 获取实时运行数据
    getCarRunTimeList(params) {
        return request({
            url: '/api-obdMonitor/carRunTimeEnt/getCarRunTimeList',
            method: 'get',
            params
        })
    },
     // 历史数据监管对象查询
     getCarHistoryList(params) {
        return request({
            url: '/api-obdMonitor/carRunTimeEnt/getCarHistoryList',
            method: 'get',
            params
        })
    },
     // 根据被监管对象id和时间、因子查询历史数据形成图表
     getOBDHistoryDataChart(params) {
        return request({
            url: '/api-obdMonitor/carRunTimeEnt/getOBDHistoryDataChart',
            method: 'get',
            params
        })
    },
     // 根据被监管对象id和时间查询历史数据形成表格
     getOBDHistoryDataTable(params) {
        return request({
            url: '/api-obdMonitor/carRunTimeEnt/getOBDHistoryDataTable',
            method: 'get',
            params
        })
    }
}
export default monitor