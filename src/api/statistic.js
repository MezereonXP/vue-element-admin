import request from '@/utils/request'

export function getStatistic() {
  return request({
    url: '/statistic/statistic',
    method: 'get'
  })
}
