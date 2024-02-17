<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()

const login =()=> {
  router.push('/login')
}


const store = useStore()

const userInfo = computed(() => store.state.userStore.userInfo)


const isLoggedIn = computed(() => store.state.loginStore.isLogin)

const username = computed(() => {
  const userInfo = store.state.userStore.userInfo
  
  return userInfo ? userInfo.name : "로그인 필요"
})

const userId = computed(() => {
  const userInfo = store.state.userStore.userInfo
  
  return userInfo ? userInfo.id : "로그인 필요"
})

const loginPro_filepath = computed(() => {
  const userInfo = store.state.loginStore.userInfo
  
  return userInfo ? userInfo.pro_filepath : null
})

const pro_filepath = computed(() => {
  const userInfo = store.state.userStore.userInfo
  
  return userInfo ? userInfo.pro_filepath : null
})




const userPro_filepath = computed(() => store.state.userStore.userInfo?.pro_filepath)

const activePro_filepath = ref(null)

watch(userPro_filepath, newVal => {
  if (newVal) {
    activePro_filepath.value = newVal
  }
}, { immediate: true })

watch(userPro_filepath, newVal => {
  if (newVal) { // userStore의 pro_filepath가 존재하면
    activePro_filepath.value = newVal // activePro_filepath를 업데이트
  }
}, { immediate: true })

// watch(() => store.state.userStore.userInfo, newUserInfo => {

// }, { immediate: true }) // 초기화 시에도 watch 콜백 실행
watch(() => store.state.userStore.userInfo, newUserInfo => {
  if (newUserInfo && newUserInfo.pro_filepath !== activePro_filepath.value) {
    activePro_filepath.value = newUserInfo.pro_filepath
  }
}, { immediate: true })

// watch(() => store.state.userStore.userInfo, newUserInfo => {
//   console.log('User info updated:', newUserInfo)

//   //필요한 로직을 여기에 추가하세요.
// }, { immediate: true }) // 초기화 시에도 watch 콜백 실행




const logout = async () => {
  try {
    console.log("이게 실행 안되는거지?")
    localStorage.removeItem('User-Token')
    await store.dispatch('logout') // 'loginStore/logout' 액션 디스패치
    await store.dispatch('userlogout')
  } catch (error) {
    console.log('')
    console.error(error)
  }
}
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="pro_filepath" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="pro_filepath" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-medium">
              {{ username }}
            </VListItemTitle>
            <VListItemSubtitle>{{ userId }}</VListItemSubtitle>
          </VListItem>
          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-account-outline"
                size="22"
              />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-cog-outline"
                size="22"
              />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem>

          <!-- 👉 Pricing -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-currency-usd"
                size="22"
              />
            </template>

            <VListItemTitle>Pricing</VListItemTitle>
          </VListItem>

          <!-- 👉 FAQ -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-help-circle-outline"
                size="22"
              />
            </template>

            <VListItemTitle>FAQ</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem
            v-if="isLoggedIn"
            @click.prevent="logout"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-logout"
                size="22"
              />
            </template>

            <VListItemTitle>로그아웃</VListItemTitle>
          </VListItem>

          <!-- 👉 Login -->
          <VListItem
            v-else
            @click.prevent="login"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-login"
                size="22"
              />
            </template>

            <VListItemTitle>로그인</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
