import store from '@/store'
import axios from '@axios'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from 'vuex'
import routes from '~pages'

export const isfriendscreenchanged = ref(false)
export const isSubscribesscreenchanged = ref(false)
export const isMatescreenchanged = ref(false)


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/login.vue'),
      redirect: () => ({ name: 'login', params: { tab: 'profile' } }),
      meta: { requiresAuth: false }, // 이 라우트는 로그인이 필요함을 나타냅니다.
    },
    {
      beforeEnter: (to, from, next) => {
        if (store.state.loginStore.isLogin) {
          console.log('로그인 된 상태')

          
          next()
        } else {
          console.log('로그인 안 된 상태')
 
            .then(() => {
              if (store.state.loginStore.isLogin) {
                next() // 토큰이 유효하면 메인 페이지로 진행
              } else {
                next({ name: 'login' }) // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
              }
            })
        }
      },
    },

    {
      path: '/pages/user-profile',
      redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
      meta: { requiresAuth: true },
    },
    {
      path: '/apps/challengeList',
      name: 'challengeList',
      components: {
        default: () => import('@/pages/apps/challengeList.vue'),
        layout: () => import('@/layouts/components/DefaultLayoutWithVerticalNav.vue'),
      },
      beforeEnter: async (to, from, next) => {
        try {
          const store = useStore()
    
          // 로그인 상태 확인
          if (!store.state.loginStore.isLogin) {
            next({ name: 'login' })
            
            return
          }
    
          console.log("beforeEnter 가드 실행")
    
          const userInfo = computed(() => store.state.userStore.userInfo)
          const connetId = userInfo.value.id
          const response = await axios.post('http://localhost:4000/croom/myRoomNum.do', { id: connetId }) // POST 요청
          const data = response.data
    
          console.log("너의 방번호는?", data)
    
          if (data) { // 값이 있다면
            next({ 
              name: 'apps-user-id', 
              params: { id: data }, 
            })
          } else { // 값이 없다면
            next({ name: 'apps-challengeList' })
          }
        } catch (error) {
          console.error(error)
          next() // 예외가 발생하면 라우트 이동을 계속 진행
        }
      },
      meta: { requiresAuth: true },
    },
    {
      path: '/apps/mateList',
      name: 'mateList',
      components: {
        default: () => import('@/pages/apps/mateList.vue'),
        layout: () => import('@/layouts/components/DefaultLayoutWithVerticalNav.vue'),
      },
      beforeEnter: async (to, from, next) => {
        try {
          const store = useStore()
    
          // 로그인 상태 확인
          if (!store.state.loginStore.isLogin) {
            next({ name: 'login' })
            
            return
          }
    
          console.log("메이트 실행")
   
    
          const userInfo = computed(() => store.state.userStore.userInfo)
          const connetId = userInfo.value.id

          console.log("connetId------", connetId)

          const response = await axios.post('http://localhost:4000/mroom/myRoomNum.do', { id: connetId }) // POST 요청
          const data = response.data
    
          console.log("너의 방번호는?", data)
    
          if (data) { // 값이 있다면
            next({ 
              name: 'apps-user-room', 
              params: { room: data }, 
            })
          } else { // 값이 없다면
            next({ name: 'apps-mateList' })
          }
        } catch (error) {
          console.error(error)
          next() // 예외가 발생하면 라우트 이동을 계속 진행
        }
      },
      meta: { requiresAuth: true },
    },

    ...setupLayouts(routes),
  ],
})


// 이동 감지와 변경된 화면 체크
router.beforeEach((to, from, next) => {
  console.log(`화면 이동 감지: ${from.fullPath}에서 ${to.fullPath}로 이동`)

  if (from.fullPath=='/community/user/friend') {
    isfriendscreenchanged.value = true
    console.log('화면 변경됨')
  }
  if (from.fullPath=='/community/user/subscriber'){
    isSubscribesscreenchanged.value = true
  }
  if (from.fullPath=='/community/user/mate'){
    isMatescreenchanged.value = true
  }
  next()
})

// const publicPages = ['/login', '/main']  // 로그인이 필요하지 않은 페이지의 경로를 배열로 정의

// router.beforeEach((to, from, next) => {
//   // 로그인 상태를 확인하는 코드. 실제 환경에서는 적절한 로그인 확인 로직으로 대체하세요.
//   const isLoggedIn = !!localStorage.getItem('accessToken')

//   // 로그인이 필요하지 않은 페이지에 대한 접근은 항상 허용
//   if (publicPages.includes(to.path)) {
//     next()
//   } else {
//     // 그 외의 페이지에 대한 접근은 로그인 상태에 따라 결정
//     if (isLoggedIn) {
//       next()  // 로그인이 되어있으면 접근 허용
//     } else {
//       alert("로그인 후 이용가능합니다.")
//       next('/main')  // 로그인이 되어있지 않으면 메인 페이지로 리다이렉트
//     }
//   }
// })


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
// router.beforeEach(to => {
//   const isLoggedIn = isUserLoggedIn()
//   if (canNavigate(to)) {
//     if (to.meta.redirectIfLoggedIn && isLoggedIn)
//       return '/'
//   }
//   else {
//     if (isLoggedIn)
//       return { name: 'not-authorized' }
//     else
//       return { name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } }
//   }
// })
///community/user/friend


export default router
