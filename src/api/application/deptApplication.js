import request from '@/utils/request'

export function pageList(params) {
  return request({
    url: '/console/deptApplication/pageList',
    method: 'get',
    params
  })
}

export function updateDeptApplication(query) {
  return request({
    url: '/console/deptApplication/update',
    method: 'post',
    params: query
  })
}

export function deleteDeptApplication(id) {
  return request({
    url: '/console/deptApplication/delete',
    method: 'get',
    params: { id }
  })
}

