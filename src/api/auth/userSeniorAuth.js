import request from '@/utils/request'

export function pageList(query) {
  return request({
    url: '/console/userSeniorAuth/pageList',
    method: 'get',
    params: query
  })
}

export function audit(query) {
  return request({
    url: '/console/userSeniorAuth/audit',
    method: 'get',
    params: query
  })
}
