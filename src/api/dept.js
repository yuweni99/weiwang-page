import request from '@/utils/request'

// 查询部门列表
export function findInfo(id) {
  return request({
    url: '/console/dept/findInfo',
    method: 'get',
    params: { id }
  })
}

// 查询用户部门树形结构
export function findCompanyUserDeptTree(query) {
  return request({
    url: '/console/dept/findCompanyUserDeptTree',
    method: 'get',
    params: query
  })
}

// 分页查询部门
export function pageQueryDept(query) {
  return request({
    url: '/console/dept/pageQuery',
    method: 'get',
    params: query
  })
}

// 审批部门
export function approvalDept(query) {
  return request({
    url: '/console/dept/approvalDept',
    method: 'post',
    params: query
  })
}

// 新增部门
export function addDept(params) {
  return request({
    url: '/console/dept/addDept',
    method: 'post',
    params
  })
}

// 修改部门
export function updateDept(params) {
  return request({
    url: '/console/dept/updateDept',
    method: 'post',
    params
  })
}

// 删除部门
export function delDept(id) {
  return request({
    url: '/console/dept/del',
    params: { id },
    method: 'get'
  })
}
