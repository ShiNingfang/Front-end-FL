// store/modules/attack_logger.js

const state = {
  logs: [] // 用于存储日志的数组
}

const mutations = {
  ADD_LOG: (state, log) => {
    state.logs.push(log)
  },
  CLEAR_LOGS: (state) => {
    state.logs.splice(0) // 清空日志
  }
}

const actions = {
  addLog({ commit }, log) {
    commit('ADD_LOG', log)
  },
  clearLogs({ commit }) {
    commit('CLEAR_LOGS')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
