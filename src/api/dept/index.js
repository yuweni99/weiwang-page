import request from '@/utils/request'

/**
 * 查询公司一级部门列表
 * @param query
 * @returns {*}
 */
export function findCompanyFirstLevelDepts(query) {
  return request({
    url: '/console/dept/findCompanyFirstLevelDepts',
    method: 'get',
    params: query
  })
}

