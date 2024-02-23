<script setup>
import LoadingModal from '@/pages/LoadingModal.vue'
import Calendar from '@/pages/apps/calendar.vue'
import Timeline from '@/pages/components/timeline.vue'
import ResetPasswordDialog from '@/pages/resetPasswordDialog.vue'
import CrmActivityTimeline from '@/views/dashboards/crm/CrmActivityTimeline.vue'
import axios from '@axios'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id

const route = useRoute()
const isDialogVisible = ref(false)
const isPDialogVisible = ref(!isDialogVisible.value)

const dietinfo = ref([])

const getEatingRecord = async () => {
  console.log('체크해보자 : ')
  await axios.get('http://localhost:4000/Dietfood/DailyView.do', { params: { 'id': connetId } })
    .then(response => {
      if(response.data.length > 0){
        // 초기화
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
      console.log('가져온 유저 Eating_Record', dietinfo.value)
    })
}

onMounted(async () => {
  if (!store.state.isLogin) {
    await store.dispatch('getToken')
    store.dispatch('saveToken')

    // 토큰을 이용해 사용자 정보를 가져옴
    await store.dispatch('getMemberInfo')    
  }
  getEatingRecord()
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
  },
  {
    icon: 'mdi-lock-outline',
    title: '원하는',
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
    desc: 'Standard - $99/month',
    title: '아침 메뉴',
    content: '아침 메뉴 설명',
    index: 0,
  },
  {
    desc: 'Basic - $0/month',
    title: '점심 메뉴',
    content: '점심 메뉴 설명',
    index: 1,
  },
  {
    desc: 'Enterprise - $499/month',
    title: '저녁 메뉴',
    content: '저녁 메뉴 설명',
    index: 2,
  },
]
</script>

<template>
  <section>
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
              >
                <VCard class="text-center">
                  <VCardItem class="d-flex flex-column justify-center align-center">
                    <VAvatar
                      color="primary"
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
                  <VCardText>
                    <span>{{ list.index == 0? '아침 메뉴': list.index == 1? '점심 메뉴' : '저녁 메뉴' }} 설명</span>
                  </VCardText>
                  <VCardText>
                    <span style="height: 450px;">
                      <div>
                        <div>
                          <!--
                            <br><strong style="margin: 0 20px;">[조리순서]</strong>
                            <span>{{ dietinfo[list.index]?.recipe_seq }}</span>
                            <div
                            style="max-height: 200px; overflow-y: auto;"
                            class="scrollbar"
                            >
                            <p style="margin: 10px 20px;">
                            첫번째 조리순서 내용
                            </p>
                            </div>
                            <br> 
                          -->
                          <strong style="margin: 10px 20px;">[재료]</strong>
                        </div>
                        <span>
                          - 재료명 - 투입량
                        </span>
                      </div>
                    </span>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VWindowItem>
          <VWindowItem>
            <CrmActivityTimeline />
          </VWindowItem>
        </VWindow>
        <VCol cols="12" />
        <VCard>
          <VCol cols="12">
            <VBtn
              id="startBtn"
              class="btn-lg btn-dark"
              @click="$router.push('/tts')"
            >
              SpeechToText Start
            </VBtn>
          </VCol>
          <VCardText>
            <VTab
              v-for="icons in iconss"
              :key="icons.icon"
            >
              <VIcon
                start
                :icon="icons.icon"
              />
              <span>{{ icons.title }}</span>
            </VTab>
          </VCardText>
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
