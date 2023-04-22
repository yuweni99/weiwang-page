import request from '@/utils/request'

/**
 * 查询部门人员
 */
export function pageQuery(params) {
  return request({
    url: '/console/deptMember/pageQuery',
    method: 'get',
    params
  })
}

// 修改部门用户
export function updateDeptMember(params) {
  return request({
    url: '/console/deptMember/updateDeptMember',
    method: 'post',
    params
  })
}

// 删除部门
export function delDeptMember(id) {
  return request({
    url: '/console/deptMember/del',
    params: { id },
    method: 'get'
  })
}

// 邀请人员
export function inviteDeptMember(params) {
  return request({
    url: '/console/deptInviteMember/inviteMember',
    params,
    method: 'post'
  })
}
