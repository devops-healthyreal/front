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

  const response = await axios.get('http://localhost:4000/croom/participantsData.do', { params: { challNo: route.params.id } } )

  if (response.status === 200) {
    participantsData.value = response.data
    console.log(' 참여자 데이타는---', participantsData.value)
  } else {
    console.log('참여자 데이타 가져오기 실패')
  }

}

//참여비 변수
const pay = ref('')
const challroomno = ref('')

//방 데이터 가져오기
const roomData = async () => {
  
  console.log("challNo----", route.params.id)

  const response = await axios.post('http://localhost:4000/croom/roomData.do', { challNo: route.params.id })


  if (response.status === 200) {
    room.value = response.data
    console.log('방의 데이타는---', room.value)
    pay.value = room.value.pfee
    challroomno.value = room.value.challNo
    console.log('참여비는?', pay.value, '방 번호는?', challroomno.value)

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
  if(room.value.manager === connetId && participantsData.value.length == 1){
    const response = await axios.delete('http://localhost:4000/croom/deleteRoom.do', { data: { id: connetId } })

    console.log("방 나가기 성공")
    router.push({ name: 'challengeList' }) //넘겨줄 Vue 경로 입력하기

  }else if(room.value.manager === connetId){
    const response = await axios.delete('http://localhost:4000/croom/deleteManager.do', { data: { id: connetId } })

    console.log("방장 나가기 성공")
    router.push({ name: 'challengeList' }) //넘겨줄 Vue 경로 입력하
  }

  else{
    const response = await axios.delete('http://localhost:4000/croom/deletePeople.do', { data: { id: connetId } })

    console.log("일반사람 나가기 성공")
    router.push({ name: 'challengeList' }) //넘겨줄 Vue 경로 입력하기

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
            <UserProfileForChellenge
              v-for="(participantGroup, index) in participantsData"
              :key="index"
              :participant-group="participantGroup"
              :goal="room.goal"
              :cstart-date="room.cstartDate"
              :cend-date="room.cendDate"
            />
          </VCol>
          <!-- 유저 목록 -->
          <!-- 운동량 시작 -->
          <VRow>
            <VCol>
              <VCol>
                <VIcon
                  start
                  size="20"
                  icon="mdi-calendar"
                  color="success"
                />
                <span style="font-weight: bold;">{{ formatDate(room.cstartDate) }} ~ 
                  {{ formatDate(room.cendDate) }}</span>
                  
                <div style=" margin-bottom: 8px; margin-top: 20px;">
                  <VIcon
                    start
                    size="20"
                    icon="mdi-location"
                    color="success"
                  />
                  {{ room.challArea }}
                </div>
                <div style=" margin-bottom: 4px;">
                  <VIcon
                    start
                    size="20"
                    icon="mdi-human-male-female"
                    color="success"
                  />
                  {{ participantsData.length }}/{{ room.challCapacity }}
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
          <VCol align="center">
            <VCol class="d-flex justify-end">
              <Pricingtest
                :pay="parseInt(pay)"
                :challroomno="challroomno"
              />
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
