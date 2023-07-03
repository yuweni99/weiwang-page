import request from '@/utils/request'

export function getCompanyList(query) {
  return request({
    url: '/console/company/list',
    method: 'get',
    params: query
  })
}
