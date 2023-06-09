import request from '@/utils/request'

export function pageList(query) {
  return request({
    url: '/console/schoolInfo/pageList',
    method: 'get',
    params: query
  })
}

export function getInfo(id) {
  return request({
    url: '/console/schoolInfo/findInfo',
    method: 'get',
    params: { id }
  })
}

export function addSchoolInfo(data) {
  return request({
    url: '/console/schoolInfo/add',
    method: 'post',
    data
  })
}

export function updateSchoolInfo(data) {
  return request({
    url: '/console/schoolInfo/update',
    method: 'post',
    data
  })
}

export function deleteSchoolInfo(id) {
  return request({
    url: '/console/schoolInfo/delete',
    method: 'get',
    params: { id }
  })
}

export function bindCompanyDeptInfo(data) {
  return request({
    url: '/console/schoolInfo/bindCompanyDeptInfo',
    method: 'post',
    data
  })
}

export function updateBindCompanyDeptInfo(data) {
  return request({
    url: '/console/schoolInfo/updateBindCompanyDeptInfo',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/console/schoolInfo/updateStatus',
    method: 'get',
    params: data
  })
}

export function findHistoryNames(id) {
  return request({
    url: '/console/schoolInfo/findHistoryNames',
    method: 'get',
    params: { id }
  })
}

export function saveHistoryNames(data) {
  return request({
    url: '/console/schoolInfo/saveHistoryNames',
    method: 'post',
    data
  })
}

