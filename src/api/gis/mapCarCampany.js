import request from "@/utils/request"

const map = {
    // 根据被监管对象id获取实时运行数据
    getCarRunTimeData(params) {
        return request({
            url: '/api-obdMonitor/gisEnt/getCarRunTimeData',
            method: 'get',
            params
        })
    },
    // 查询电子围栏经纬度位置
    getElectronicFence(params) {
        return request({
            url: '/api-obdMonitor/gisEnt/getElectronicFence',
            method: 'get',
            params
        })
    },
    // 获取车辆过去一个小时轨迹经纬度
    getTrackHistoryList(params) {
        return request({
            url: '/api-obdMonitor/gisEnt/getTrackHistoryList',
            method: 'get',
            params
        })
    },
}

export default map