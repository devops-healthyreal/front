

import axiosIns from '@/plugins/axios'
import router from '@/router'
import axios from '@axios'




const loginStore = {
  state: {
    userInfo: null,
    isLogin: false,
  },
  getters: {
    isLoggedIn: state => state.isLogin,
  },
  mutations: { // 로그인 상태를 변경해주는 코드
    loginSuccess: function (state, payload) {
      state.userInfo = payload
      state.isLogin = true
      
      
      

    },
    logoutTest: function (state) {
      state.userInfo = null
      state.isLogin = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('vuex')

      window.location.href="http://localhost:4000/logout"
    },


  },
  actions: {
    async login(context, loginObj) {
      const formdata = new FormData()
      
      formdata.append("id", loginObj['id'])
      formdata.append("pwd", loginObj['pwd'])
    
      await axiosIns.post('http://localhost:4000/login', formdata, {
        headers: {
          'X-SKIP-INTERCEPTOR': true,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }) 
        .then(res => {
          console.log(res)
        
          if(res.status === 200) { // 로그인 요청이 성공했을 때만 토큰을 가져오는 요청을 실행
            return context.dispatch('getToken')
          } else {
            throw new Error('Login failed')
          }
        })
        .then(getTokenResponse => {
          const token = getTokenResponse.data
    
          console.log(token)
          context.dispatch('saveToken', token)

          //router.push('/main')
        })
        .catch(error => {
          console.log(error)
          alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.')
          
        })
    },

    updateUserInfo({ commit }, newUserInfo) {
      commit('loginSuccess', newUserInfo)  // 'loginSuccess' 뮤테이션 커밋
    },


    socialLogin(context, url) {
      window.location.href = url
    },

   
  
    
    // isSocialLogin(context) {
    //   axios.get('http://localhost:4000/user/isSocialLogin', {
    //     withCredentials: true,
    //   })
    //     .then(res => {
    //       const token = res.data

    //       console.log("이거 실행되니?")
    //       context.dispatch('saveToken', token) // 토큰을 저장함
    //     })
    //     .catch(error => {
    //       console.log(error)
    //       alert('소셜 로그인에 실패했습니다. 다시 시도해주세요.')
    //     })
    // },


    saveToken(context, token){
      console.log('여기 와지니??')
      localStorage.setItem('access_token', token) // 토큰을 저장함
      console.log('소셜')
      context.dispatch('getMemberInfo').catch(error => {
        console.log('회원 정보를 가져오는 데 실패했습니다:', error)
      })
    },
    getToken() {
      
      return axios.post('http://localhost:4000/user/getToken', null, {
        withCredentials: true,
        
      })
      
    },
    getMemberInfo( { commit, dispatch } ){
      axios.get('http://localhost:4000/user/getMemberInfo', { withCredentials: true })
        .then( res => {
          console.log("이게 실행돼?")

          const userInfo = {
            name: res.data.name,
            id: res.data.id,
            pro_filepath: res.data.pro_filepath,
          }

          console.log('소셜2')
          console.log(res.data.pro_filepath)
          
          commit('loginSuccess', userInfo)


          dispatch('updateUserInfo', userInfo, { root: true })
        })
    },
    logout({ commit, dispatch }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axiosIns.post('http://localhost:4000/logout', null, { withCredentials: true })
    
          
          await dispatch('userStore/userlogout', null, { root: true }) // 'userStore'의 'logout' 액션 디스패치
          await commit('logoutTest')

          window.location.href = res.data.redirectUrl
          
          resolve()
        } catch (error) {
          console.log('로그아웃 요청 중 에러가 발생했습니다:', error)
          reject(error)
        }
      })
    },


  },

}

export default loginStore
