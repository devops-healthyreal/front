<script setup>
import ShareProjectDialogTemp from '@/components/dialogs/ShareProjectDialogTemp.vue'
import Pricingtest from '@/components/dialogs/pricingtest.vue'
import Chat from '@/pages/apps/challengeChat.vue'
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import UserProfileForChellenge from '@/views/apps/user/view/UserProfileForChellenge.vue'
import AppDateTimePicker from '@core/components/app-form-elements/AppDateTimePicker.vue'
import { getBarChartConfig } from '@core/libs/apex-chart/apexCharConfig' //차트 불러오기
import axios from "axios"
import { ref } from 'vue'
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

//차트 불러오기 용

const vuetifyTheme = useTheme()

const horizontalBarChartConfig = computed(() => getBarChartConfig(vuetifyTheme.current.value))

console.log('test:', vuetifyTheme.current.value)

const series = [{ data: [100] }]

const router = useRouter()

//차트 불러오기 용 end

userListStore.fetchUser(Number(route.params.id)).then(response => {
  userData.value = response.data
})

const deleteData = async () => {

  try {
    const response = await axios.delete('http://localhost:4000/croom/deleteRoom.do', { data: { id: connetId } })

    console.log("방 나가기 성공")
    router.push({ name: 'challengeList' }) //넘겨줄 Vue 경로 입력하기
  } catch (error) {
    console.error(error)
  }
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
              <VCol
                v-for="item in 8"
                :key="item"
                cols="3"
              >
                <UserProfileForChellenge :user-data="userData" />
              </VCol>
            </VRow>
            
            <!-- 유저 목록 -->
            <!-- 운동량 시작 -->
            <VRow>
              <VCol>
                <VCol>
                  📌 운동량 80% 달성하기
                </VCol>
                <VCol>
                  <AppDateTimePicker
                    v-model="dateRange"
                    label="목표 기간"
                    :config="{ mode: 'range' }"
                  />
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
