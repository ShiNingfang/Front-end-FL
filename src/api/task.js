import request from '@/utils/request'

export function getFlowChartData(id) {
  return request({
    url: '/taskboard/getAllinfo',
    method: 'get'
  })
}
export function getMenuData(id) {
  return request({
    url: '/api/getMenuData',
    method: 'get'
  })
}
export function getMenuAttack(id) {
  return request({
    url: '/api/getMenuAttack',
    method: 'get'
  })
}
