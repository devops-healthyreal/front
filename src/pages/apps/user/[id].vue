<script setup>
import ShareProjectDialogTemp from '@/components/dialogs/ShareProjectDialogTemp.vue'
import Pricingtest from '@/components/dialogs/pricingtest.vue'
import Chat from '@/pages/apps/challengeChat.vue'
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import UserProfileForChellenge from '@/views/apps/user/view/UserProfileForChellenge.vue'
import { getBarChartConfig } from '@core/libs/apex-chart/apexCharConfig' //차트 불러오기
import axios from "axios"
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts' //차트 불러오기
import { useTheme } from 'vuetify' //차트 불러오기
import { useStore } from 'vuex'

const isShareProjectDialogVisible = ref(false)
const userListStore = useUserListStore()
const route = useRoute() //route객체
const userData = ref()
const userTab = ref(null)
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id
const router = useRouter()


const participantsData = ref([])
const room= ref([])

//참가자 데이터 가져오기
const participants = async () => {

  const response = await axios.get('http://localhost:4000/croom/participantsData.do' )

  if (response.status === 200) {
    participantsData.value = response.data
    console.log(' 참여자 데이타는---', participantsData.value)
  } else {
    console.log('참여자 데이타 가져오기 실패')
  }

}

//방 데이터 가져오기
const roomData = async () => {
  
  console.log("challNo----", route.params.id)

  const response = await axios.post('http://localhost:4000/croom/roomData.do', { challNo: route.params.id })


  if (response.status === 200) {
    room.value = response.data
    console.log(' 방의 데이타는---', room.value)
  } else {
    console.log('방의 데이타 가져오기 실패')
  }

}

onMounted(async () => { await participants(), await roomData() })

//차트 불러오기 용

const vuetifyTheme = useTheme()

const horizontalBarChartConfig = computed(() => getBarChartConfig(vuetifyTheme.current.value))

console.log('test:', vuetifyTheme.current.value)

const series = [{ data: [100] }]


//차트 불러오기 용 end
/*
userListStore.fetchUser(Number(route.params.id)).then(response => {
  userData.value = response.data
})*/

const deleteData = async () => {

  try {
    const response = await axios.delete('http://localhost:4000/croom/deleteRoom.do', { data: { id: connetId } })

    console.log("방 나가기 성공")
    router.push({ name: 'challengeList' }) //넘겨줄 Vue 경로 입력하기
  } catch (error) {
    console.error(error)
  }
}

const formatDate = dateString => {
  const date = new Date(dateString) // 날짜 문자열을 Date 객체로 변환

  date.setDate(date.getDate()) // 1일을 추가

  const year = date.getFullYear().toString().substring(2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // 월은 0부터 시작하므로 1을 더하고, 2자리로 맞춤
  const day = date.getDate().toString().padStart(2, '0') // 날짜를 2자리로 맞춤

  return `${year}/${month}/${day}`
}

//참여비 변수
const pay = ref("10000")
</script>

<template>
  <section>
    <VRow>
      <VCol
        cols="7"
        class="dll"
      >
        <!-- 전체 화면의 왼쪽 -->
        <VCard>
          <!-- 참가비 시작 -->
          <VCol>
            <VAlert type="warning">
              참가비는 하루 전 <strong>자동 결제</strong> 됩니다
            </VAlert>
          </VCol>
          <!-- 참가비 끝 -->
          <!-- 유저 목록 -->
          <VCol>
            <VRow style="padding: 80px 0px;">
              <VCol cols="3">
                <UserProfileForChellenge :participants-data="participantsData" />
              </VCol>
            </VRow>
            
            <!-- 유저 목록 -->
            <!-- 운동량 시작 -->
            <VRow>
              <VCol>
                <VCol>
                  📌 {{ room.goal }} {{ room.implementation }}%
                </VCol>
                <VCol>
                  <div style=" margin-bottom: 4px;">
                    목표 기간
                  </div>
                  <div style=" margin-bottom: 4px;">
                    <span style="font-weight: bold;">{{ formatDate(room.cstartDate) }} ~ 
                      {{ formatDate(room.cendDate) }}</span>
                  </div>
                  <div style=" margin-bottom: 4px;">
                    지역 : {{ room.challArea }}
                  </div>
                  <div style=" margin-bottom: 4px;">
                    정원 : {{ participantsData.length }}/{{ room.challCapacity }}
                  </div>
                </VCol>
              </VCol>
              <!-- 운동량 끝 -->
              <!-- 목표 달성률 시작 -->
              <VCol>
                <VueApexCharts
                  type="bar"
                  height="130"
                  :options="horizontalBarChartConfig"
                  :series="series"
                  style="width:'100%'; margin-top':30px;"
                />
              </VCol>
            </VRow>
        
          <!-- 목표 달성률 끝 -->
          </VCol>
          <VCol align="center">
            <VCol class="d-flex justify-end">
              <Pricingtest :pay="parseInt(pay)" />
            </VCol>
            <VBtn @click="isShareProjectDialogVisible = !isShareProjectDialogVisible">
              초대하기
            </VBtn>
            <ShareProjectDialogTemp v-model:isDialogVisible="isShareProjectDialogVisible" />
            <VBtn
              :style="{'margin-left':'10px'}"
              @click="deleteData"
            >
              나가기
            </VBtn>
          </VCol>
        </VCard>
      </VCol> <!-- 전체 화면의 왼쪽 end -->
      <VCol cols="5">
        <Chat />
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
  .card-list {
    --v-card-list-gap: 0.75rem;
  }
</style>
