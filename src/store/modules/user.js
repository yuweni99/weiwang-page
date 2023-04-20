import { getInfo, login, logout } from '@/api/user'
import { getData, getToken, removeData, removeToken, setData, setToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    deptId: getData('deptId'),
    deptName: getData('deptName'),
    userId: getData('userId'),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_LOGIN_INFO(state, loginInfo) {
    state.userId = loginInfo.userId
    state.deptName = loginInfo.deptName
    state.deptId = loginInfo.deptId
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // 自动登陆
  autoLogin({ commit }, data) {
    commit('SET_TOKEN', data.token)
    commit('SET_LOGIN_INFO', data)

    setToken(data.token)
    setData('deptId', data.deptId)
    setData('userId', data.userId)
    setData('deptName', data.deptName)
  },
  // user login
  login({ commit }, userInfo) {
    const { username, password, key, code } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, key: key, code: code }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        removeData('userId')
        removeData('deptName')
        removeData('deptId')
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

