<script setup>
import Notifications from '@/@core/components/Notifications.vue'


import axios from '@axios'
import { useStore } from 'vuex'

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = computed(() => userInfo.value ? userInfo.value.id : null)

const name = computed(() => store.state.userStore.userInfo ? store.state.userStore.userInfo.name : null)

let noticlists = ref([])

const getNoticList = async id => {
  if (!id) {
    console.log('id is null')
    
    return
  }

  await axios.get('http://localhost:4000/Notic/View.do', { params: { id: id } })
    .then(response => {
      console.log('가져오기 성공')
      console.log('내 알림', response.data)
      noticlists.value = response.data
    }).catch(error => {
      // 업데이트 중 오류가 발생했을 때의 처리
      console.log('실패')
    })
}


// 특정 시간마다 실행할 함수
const executePeriodically = () => {
  getNoticList(connetId.value)
}

// 초기 실행
onMounted(() => {
  if (connetId.value) {
    getNoticList(connetId.value)

    // 1분마다 실행
    setInterval(() => {
      executePeriodically()
    }, 60000) // 1분은 60000밀리초입니다.
  }
})
</script>

<template>
  <Notifications
    :noticlists="noticlists"
    :noticflag="false"
    :get-notic-list="getNoticList"
    @click="getNoticList(connetId)"   
  />
</template>
