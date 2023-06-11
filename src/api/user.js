import request from '@/utils/request'
import qs from 'qs'

// 获取二维码登陆key
export function getQrCodeLoginKey(query) {
  return request({
    url: '/getQrCodeLoginKey',
    method: 'get',
    params: query
  })
}

// 获取扫码登录数据
export function getQRCodeLoginData(query) {
  return request({
    url: '/getQRCodeLoginData',
    method: 'get',
    params: query
  })
}

export function logout(query) {
  return request({
    url: '/console/logout',
    method: 'get',
    params: query
  })
}

export function findInfoByMobile(query) {
  return request({
    url: '/console/user/findInfoByMobile',
    method: 'get',
    params: query
  })
}

export function userList(query) {
  return request({
    url: '/console/userList',
    method: 'get',
    params: query
  })
}

export function updateUser(query) {
  return request({
    url: '/console/updateUser',
    method: 'get',
    params: query
  })
}

export function deleteUser(userId) {
  return request({
    url: '/console/deleteUser',
    method: 'get',
    params: { userId }
  })
}

export function updateUserPassword(query) {
  return request({
    url: '/console/updateUserPassword',
    method: 'get',
    params: query
  })
}

export function changeStatus(query) {
  return request({
    url: '/console/changeStatus',
    method: 'get',
    params: query
  })
}

export function cleanAuth(query) {
  return request({
    url: '/console/cleanAuthInfo',
    method: 'post',
    params: query
  })
}

export function recharge(query) {
  return request({
    url: '/console/Recharge',
    method: 'post',
    params: query
  })
}

export function withdrawalAmount(query) {
  return request({
    url: '/console/handCash',
    method: 'post',
    params: query
  })
}

export function findUserBill(query) {
  return request({
    url: '/console/userBill',
    method: 'get',
    params: query
  })
}

// 用户账单详情
export function findUserBillDesc(query) {
  return request({
    url: '/console/consumeRecordInfo',
    method: 'get',
    params: query
  })
}

// 好友列表
export function friendsList(query) {
  return request({
    url: '/console/friendsList',
    method: 'get',
    params: query
  })
}

export function deleteFriends(query) {
  return request({
    url: '/console/deleteFriends',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: qs.stringify(query)
  })
}

// 加入黑名单
export function joinBlackList(query) {
  return request({
    url: '/console/blacklist/operation',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: qs.stringify(query)
  })
}

// 查询聊天记录
export function friendsChatRecord(query) {
  return request({
    url: '/console/friendsChatRecord',
    method: 'GET',
    params: query
  })
}

export function delFriendsChatRecord(query) {
  return request({
    url: '/console/delFriendsChatRecord',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: qs.stringify(query)
  })
}

export function sendUserMsg(query) {
  return request({
    url: '/console/sendUserMsg',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: qs.stringify(query)
  })
}

export function getUserSetting(userId) {
  return request({
    url: '/console/user/getUserSetting',
    method: 'get',
    params: { userId }
  })
}

export function setUserSetting(data) {
  return request({
    url: '/console/user/setUserSetting',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: qs.stringify(data)
  })
}

export function getInfo(userId) {
  return request({
    url: '/console/user/getInfo',
    method: 'get',
    params: { userId }
  })
}
