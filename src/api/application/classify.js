import request from '@/utils/request'

export function pageList(params) {
  return request({
    url: '/console/applicationClassify/pageList',
    method: 'get',
    params
  })
}

export function list(params) {
  return request({
    url: '/console/applicationClassify/list',
    method: 'get',
    params
  })
}

export function addClassify(query) {
  return request({
    url: '/console/applicationClassify/add',
    method: 'post',
    params: query
  })
}

export function updateClassify(query) {
  return request({
    url: '/console/applicationClassify/update',
    method: 'post',
    params: query
  })
}

export function deleteClassify(id) {
  return request({
    url: '/console/applicationClassify/delete',
    method: 'get',
    params: { id }
  })
}

