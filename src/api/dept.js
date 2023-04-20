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

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
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
