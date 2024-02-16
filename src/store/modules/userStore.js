const userStore = {
  state: {
    userInfo: null,
    searchuser: { userInfo: null },
  },
  mutations: {
    UPDATE_USER_INFO(state, newUserInfo) {
      state.userInfo = { ...state.userInfo, ...newUserInfo }
    },
    UPDATE_SEARCH_USER(state, newSearchUser) {
      state.searchuser = newSearchUser
    },
    UPDATE_PRO_FILEPATH(state, newProFilepath){
      state.userInfo.pro_filepath = newProFilepath
    },
    RESET_USER_INFO(state) { // 추가된 뮤테이션
      state.userInfo = null
    },
  },
  actions: {
    updateUserInfo({ commit }, newUserInfo) {
      commit('UPDATE_USER_INFO', newUserInfo)
    },
    updateSearchUser({ commit }, newSearchUser) { // 수정된 액션
      commit('UPDATE_SEARCH_USER', newSearchUser)
    },
    updateProFilepath({ commit }, newProFilepath){
      commit('UPDATE_PRO_FILEPATH', newProFilepath)
    },

    userlogout({ commit }) { // 추가된 액션
      commit('RESET_USER_INFO')
    },
  },
  getters: {
    userInfo: state => state.userInfo, // 수정된 게터
    searchuser: state => state.searchuser,
  },
}

export default userStore
