<script setup>
import LoadingModal from '@/pages/LoadingModal.vue'
import Calendar from '@/pages/apps/calendar.vue'
import Timeline from '@/pages/components/timeline.vue'
import ResetPasswordDialog from '@/pages/resetPasswordDialog.vue'
import CrmActivityTimeline from '@/views/dashboards/crm/CrmActivityTimeline.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

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

/*
const getEatingRecord = async () => {
  if (!(userInfo.value && userInfo.value.id)) {
    router.go(0)
  }
  if (userInfo.value && userInfo.value.id) {

    const connetId = userInfo.value.id

    console.log('4차')
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
  
}*/

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

        // 다른 함수를 실행
        //getEatingRecord()
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
              >
                <VCard class="text-center">
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
                  <VCardText>
                    <span v-if="dietinfo.length > 0">{{ list.index == 0? '아침 메뉴': list.index == 1? '점심 메뉴' : '저녁 메뉴' }} 설명</span>
                  </VCardText>
                  <VCardText>
                    <span>
                      <div
                        v-for="(gro, index) in dietPlansList[list.index]"
                        :key="index"
                      >
                        <div v-if="index == 0 && gro.RECIPE_SEQ && gro.RECIPE_SEQ.length > 0">
                          <br><strong style="margin: 0 20px;">[조리순서]</strong>
                          <div
                            style="max-height: 200px; overflow-y: auto;"
                            class="scrollbar"
                          >
                            <p
                              v-for="(seq, seqIndex) in gro.RECIPE_SEQ.split('||')"
                              :key="seqIndex"
                              style="margin: 10px 20px;"
                            >
                              {{ seqIndex + 1 }} ) {{ seq }}
                            </p>
                          </div>
                          <br>
                          <strong style="margin: 10px 20px;">[재료]</strong>
                        </div>
                        <span v-if="gro.FOODNAME">
                          - {{ gro.INGREDIENT }} - {{ gro.RI_AMOUNT }}
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
          <VRow>
            <VCardText>
              <VBtn
                style="height: 40px;"
                variant="text"
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
                @click="$router.push('/tts')"
              >
                <VIcon
                  size="x-large"
                  icon="mdi-microphone-outline"
                  color="success"
                />
              </VBtn>
            </VCol>
            <VCol cols="12">
              <VBtn
                id="startBtn"
                class="btn-lg btn-dark"
                @click="$router.push('/voicechatbot')"
              >
                voicechatbot
              </VBtn>
            </VCol>

            <VCol cols="12">
              <VBtn
                id="startBtn"
                class="btn-lg btn-dark"
                @click="$router.push('/stt')"
              >
                stts
              </VBtn>
            </VCol>

            <VCol cols="12">
              <VBtn
                id="startBtn"
                class="btn-lg btn-dark"
                @click="$router.push('/stabilityVideoDifusiononlyfront')"
              >
                stable video defusion only front
              </VBtn>
            </VCol>
            <VCol cols="12">
              <VBtn
                id="startBtn"
                class="btn-lg btn-dark"
                @click="$router.push('/stabilityVideoDifusion')"
              >
                stable video defusion
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
