import request from '@/utils/request'
import qs from 'qs'

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
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: qs.stringify(data)
  })
}

export function updateSchoolInfo(data) {
  return request({
    url: '/console/schoolInfo/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: qs.stringify(data)
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

