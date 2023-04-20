import request from '@/utils/request'

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
