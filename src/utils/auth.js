import Cookies from 'js-cookie'

const TokenKey = 'userToken'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setData(key, value) {
  return Cookies.set(key, value)
}

export function getData(key) {
  return Cookies.get(key)
}

export function removeData(key) {
  return Cookies.remove(key)
}
