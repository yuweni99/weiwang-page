import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/console/application/list',
    method: 'get',
    params
  })
}

export function addApplication(query) {
  return request({
    url: '/console/application/add',
    method: 'post',
    params: query
  })
}

export function updateApplication(query) {
  return request({
    url: '/console/application/update',
    method: 'post',
    params: query
  })
}

export function deleteApplication(id) {
  return request({
    url: '/console/application/delete',
    method: 'get',
    params: { id }
  })
}

