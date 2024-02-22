
// store/modules/loginStore.js
import axiosIns from '@/plugins/axios'
import router from '@/router'
import axios from '@axios'

/*알림 test용 start*/
import { config, firebaseConfig, getGoogleKey } from '@/config'
import firebase from 'firebase/app'
import 'firebase/messaging'


//웹, 앱 알람 (서비스 워커 안에 파이어베이스 SDK 삽입)
const firebaseApp = firebase.initializeApp(firebaseConfig)
var messaging
if('serviceWorker' in navigator) {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      window.addEventListener('load', ()=>{
        return navigator.serviceWorker.register('sw.js') //포그라운드에서 실행될 파일
          .then(registration=>{
            console.log('등록 완료', registration)
            messaging = firebase.messaging()
            messaging = firebase.messaging(firebaseApp)
            
            return messaging.getToken(messaging, { vapidKey: config.vapidKey })
          })
          .then(token=>{console.log(token)})
          .catch(err=>console.error(err))
      })
    }
    else {console.log('알림이 차단됨')}
  })
}



/*알림 test용 end*/


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
      console.log('formdata:', formdata)
      await axios.post('http://localhost:4000/login', formdata, {
        headers: {
          'X-SKIP-INTERCEPTOR': true,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }) 
        .then(res => {
          console.log('여기까지는 들어옴?', res)
          console.log(formdata.get("id"))

          //FMC 토큰 등록용 코드 start (로그인 한 사용자의 브라우저가 받은 FMC 토큰 값 저장)
          messaging.getToken(messaging, { vapidKey: config.vapidKey })
            .then(token=>{
              console.log('사용자의 firebase토큰:', token)
              axios.post("http://localhost:4000/fmctoken", JSON.stringify({ 
                id: formdata.get("id"),
                token: token,
              }), { headers: { 'Content-Type': 'application/json' } })
            })
            .catch(err=>console.log("[firebase]이미 등록된 사용자입니다"))
          
          getGoogleKey()
          

          //FMC 토큰 등록용 코드 end
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

          router.push('/main')
        })
        .catch(error => {
          console.log(error)
          
          
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
      if (token) { // 토큰 값이 제공된 경우만 로컬 스토리지에 저장
        console.log('access_token', token)
        localStorage.setItem('access_token', token) // 토큰을 저장함
      }
          
      context.dispatch('getMemberInfo').catch(error => {
        console.log('회원 정보를 가져오는 데 실패했습니다:', error)
      })
    },

    getToken() {
      return axios.post('http://localhost:4000/user/getToken', null, {
        withCredentials: true,
      })
        .then(response => {
          const token = response.data

          localStorage.setItem('access_token', token) // 로컬 스토리지에 토큰 저장
          
          return token
        })
    },
    getMemberInfo( { commit, dispatch } ){
      const token = localStorage.getItem('access_token') // 로컬 스토리지에서 토큰을 가져옴

      axios.get('http://localhost:4000/user/getMemberInfo', { 
        headers: {
          'Authorization': `Bearer ${token}`, // 인증 헤더에 토큰을 포함함
        },
        withCredentials: true, 
      })
        .then( res => {
          const userInfo = {
            name: res.data.name,
            id: res.data.id,
            pro_filepath: res.data.pro_filepath,
          }
    
          dispatch('updateUserInfo', userInfo, { root: true })
          commit('loginSuccess', userInfo)
        })
        .catch(error => {
          console.log('회원 정보를 가져오는 데 실패했습니다:', error)
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
