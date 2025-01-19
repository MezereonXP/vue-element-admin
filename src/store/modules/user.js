import { login, logout, getInfo, updateProfile } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  email: '',
  phone_number: '',
  sex: '',
  age: null,
  address: '',
  id: null
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_PHONE: (state, phone_number) => {
    state.phone_number = phone_number
  },
  SET_SEX: (state, sex) => {
    state.sex = sex
  },
  SET_AGE: (state, age) => {
    state.age = age
  },
  SET_ADDRESS: (state, address) => {
    state.address = address
  },
  SET_ID: (state, id) => {
    state.id = id
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        commit('SET_TOKEN', response.token)
        setToken(response.token)
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
        // roles must be a non-empty array
        if (!response.roles || response.roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', response.roles)
        commit('SET_NAME', response.username)
        commit('SET_AVATAR', response.avatar)
        commit('SET_INTRODUCTION', response.introduction)
        commit('SET_EMAIL', response.email)
        commit('SET_PHONE', response.phone_number)
        commit('SET_SEX', response.sex)
        commit('SET_AGE', response.age)
        commit('SET_ADDRESS', response.address)
        commit('SET_ID', response.id)

        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        commit('SET_EMAIL', '')
        commit('SET_PHONE', '')
        commit('SET_SEX', '')
        commit('SET_AGE', null)
        commit('SET_ID', null)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  },

  // update user profile
  updateProfile({ commit }, profileData) {
    return new Promise((resolve, reject) => {
      updateProfile(profileData)
        .then(response => {
          const { email, phone_number, sex, age, address, introduction } = response
          commit('SET_EMAIL', email)
          commit('SET_PHONE', phone_number)
          commit('SET_SEX', sex)
          commit('SET_AGE', age)
          commit('SET_ADDRESS', address)
          commit('SET_INTRODUCTION', introduction)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
