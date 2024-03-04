<script setup>
import ExerciseMainVue from '@/components/ExerciseMain.vue'
import LoadingModal from '@/pages/LoadingModal.vue'
import Calendar from '@/pages/apps/calendar.vue'
import Timeline from '@/pages/components/timeline.vue'
import ResetPasswordDialog from '@/pages/resetPasswordDialog.vue'
import CrmActivityTimeline from '@/views/dashboards/crm/CrmActivityTimeline.vue'
import axios from '@axios'
import mainImg from "@images/cards/card-meetup_copy_1.jpg"
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import MainMap from './exercise/map/MainMap.vue'
import { startRecognition } from './stt.js'
import { startSynthesis } from './tts.js'


const router = useRouter()
const store = useStore()

// computed를 import합니다.
const userInfo = computed(() => store.state.userStore.userInfo)

// const userInfo = computed(() => store.state.userStore.userInfo)
// const connetId = userInfo.value.id


const route = useRoute()
const isDialogVisible = ref(false)
const isPDialogVisible = ref(!isDialogVisible.value)

const dietinfo = ref([])


const getEatingRecord = async () => {

  if (userInfo.value && userInfo.value.id) {

    const connetId = userInfo.value.id

    console.log('4차')
    console.log('체크해보자 : '+connetId)
    await axios.get('http://localhost:4000/Dietfood/DailyView.do', { params: { 'id': connetId } })
      .then(response => {
        if(response.data.length > 0){
          // 초기화
          console.log('여긴안돼')
          dietinfo.value = [[], [], []]

          response.data.forEach(data => {
            if (data.mealType === '아침') {
              dietinfo.value[0] = data
            } else if (data.mealType === '점심') {
              dietinfo.value[1] = data
            } else if (data.mealType === '저녁') {
              dietinfo.value[2] = data
            }
            
          })
        }
        else{
          axios.get("http://localhost:4000/dietfood/search.do", { params: { 'id': connetId } })
            .then(response => {
              console.log('응답받은 행:', response.data)
              if(response.data === 0){
                axios.get("http://localhost:5000/food_recommend", { params: { 'id': connetId } })
                  .then(response=>{

                    dietinfo.value = [[], [], []]
    
                    response.data.forEach(data => {
                      if (data.mealType === '아침') {
                        dietinfo.value[0] = data
                      } else if (data.mealType === '점심') {
                        dietinfo.value[1] = data
                      } else if (data.mealType === '저녁') {
                        dietinfo.value[2] = data
                      }
                    })
                  })
              }
            })
        }
        console.log('가져온 유저 Eating_Record', dietinfo.value)
      })
  }
  
}

onMounted(() => {
  if (!store.state.isLogin) {
    store.dispatch('getToken')
      .then(() => {
        store.dispatch('saveToken')
        console.log('1차')

        // 토큰을 이용해 사용자 정보를 가져옴
        return store.dispatch('getMemberInfo')
      })
      .then(() => {
        console.log('2차') // 2차 출력됨
        if(store.state.userStore.userInfo != null){
          console.log(store.state.userStore.userInfo.id)

          // 다른 함수를 실행
          getEatingRecord()
        }
        else{
          router.go(0)
        }
      })

  }
})



const isLoadingModalVisible = ref(false)
const isResetPasswordDialogVisible = ref(false)

watch(
  () => store.state.isResetPasswordDialogVisible,
  newVal => {
    isResetPasswordDialogVisible.value = newVal
  },
  { immediate: true },
)

watch(
  () => route.query.resetPassword,
  async (newValue, oldValue) => {
    if (newValue === 'true') {
      isLoadingModalVisible.value = true

      setTimeout(()=>{
        isLoadingModalVisible.value = false
        isResetPasswordDialogVisible.value = true
      }, 4000)

      await router.replace({ query: { ...route.query, resetPassword: null } })

      if (route.query.resetPassword == null) {
        store.dispatch('openResetPasswordDialogAction')
      }
    }
  },
  { immediate: true },
)


const userTab = ref(null)

const tabs = [
  {
    icon: 'mdi-silverware-fork-knife',
    title: '식단',
    color: 'warning',
  },
  {
    icon: 'mdi-dumbbell',
    title: '운동',
    color: 'success',
  },
  {
    icon: 'mdi-map-check',
    title: '경로',
    color: 'success',
  },

]

const iconss = [
  {
    icon: 'mdi-contactless-payment-circle-outline',
    title: '오늘의 스케쥴',
  },
]

const dietPlansList = [
  {
    title: '아침 메뉴',
    index: 0,
  },
  {
    title: '점심 메뉴',
    index: 1,
  },
  {
    title: '저녁 메뉴',
    index: 2,
  },
]

const moveRecipe = () => {
  router.push({ path: "/dietfood" })
}
</script>

<template>
  <section>
    <VImg
      :src="mainImg"
      style="width: auto; margin-bottom: 30px;"
    />
    <VRow class="fill-height">
      <VCol
        cols="12"
        md="8"
      >
        <VExpansionPanels variant="accordion">
          <VExpansionPanel
            v-for="item in 1"
            :key="item"
          >
            <VExpansionPanelTitle>
              <h6 class="text-h6">
                Calendar
              </h6>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <Calendar />
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
        <VCol cols="12" />
        <!-- -->
        <VTabs
          v-model="userTab"
          class="v-tabs-pill"
        >
          <VTab
            v-for="tab in tabs"
            :key="tab.icon"
            :color="tab.color"
            block
          >
            <VIcon
              start
              :icon="tab.icon"
            />
            <span>{{ tab.title }}</span>
          </VTab>
        </VTabs>   
        
        <VWindow
          v-model="userTab"
          class="mt-6 disable-tab-transition"
          :touch="false"
        >
          <VWindowItem>
            <VRow>
              <VCol
                v-for="list in dietPlansList"
                :key="list.index"
                cols="12"
                md="4"
                style="height: 400px;"
              >
                <VCard
                  class="text-center"
                  @click="moveRecipe"
                >
                  <VCardItem class="d-flex flex-column justify-center align-center">
                    <VAvatar
                      variant="tonal"
                      size="160"
                      class="mb-2"
                    >
                      <VImg 
                        v-if="!dietinfo[list.index]"
                        size="160px"
                      />
                      <VImg 
                        v-else
                        style="height: 160px;" 
                        :src="dietinfo[list.index]?.recipe_img"
                      />
                    </VAvatar>
                    <h6 class="text-h6">
                      <span v-if="dietinfo.length > 0 && dietinfo[list.index] != ''">{{ dietinfo[list.index]?.eating_foodname }}</span>

                      <span v-else>{{ list.index == 0? '아침': list.index == 1? '점심' : '저녁' }} 메뉴</span>
                    </h6>
                  </VCardItem>
                  <VCardText style="height: 100px;">
                    <span v-if="dietinfo.length > 0">{{ dietinfo[list.index].recipe_title }}</span>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VWindowItem>
          <!-- ------------------ 운동 ---------------------- -->
          <VWindowItem>
            <ExerciseMainVue />
          </VWindowItem>

          <!-- ------------------경로-------------------- -->
          <VWindowItem>
            <MainMap />
          </VWindowItem>
        </VWindow>
        <VCol cols="12" />
        <VCard>
          <VRow>
            <VCardText>
              <VBtn
                style="height: 40px;"
                variant="text"
                @click="startSynthesis('오늘의 스케줄을 시작합니다.')"
              >
                <VIcon
                  start
                  icon="mdi-contactless-payment-circle-outline"
                />
                오늘의 스케쥴
              </VBtn>
            </VCardText>
            <VCol cols="2">
              <VBtn
                id="startBtn"
                style=" height: 45px; margin-top: 4px;margin-left: 48px;"
                variant="text"
                class="btn-lg btn-dark"
                @click="startRecognition"
              >
                <VIcon
                  size="x-large"
                  icon="mdi-microphone-outline"
                  color="success"
                />
              </VBtn>
            </VCol>
          </VRow>
        </VCard>
        <!-- -->
      </VCol>

      <VCol
        cols="12"
        md="4"
      >
        <CrmActivityTimeline />
        <Timeline />
      </VCol>
    </VRow>
    <LoadingModal v-model="isLoadingModalVisible" />
    <ResetPasswordDialog
      :is-dialog-visible="isResetPasswordDialogVisible"
      @update:isDialogVisible="val => isResetPasswordDialogVisible = val"
    />
  </section>
</template>

<style lang="scss">
  @use "@core/scss/template/libs/apex-chart.scss";
</style>
