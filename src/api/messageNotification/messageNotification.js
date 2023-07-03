import request from '@/utils/request'

export function pageList(query) {
  return request({
    url: '/console/alumniCardMessageNotification/pageList',
    method: 'get',
    params: query
  })
}

export function markRead(id) {
  return request({
    url: '/console/alumniCardMessageNotification/markRead',
    method: 'get',
    params: { id }
  })
}

