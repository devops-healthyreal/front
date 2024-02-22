<script setup>
import LoadingModal from '@/pages/LoadingModal.vue'
import Calendar from '@/pages/apps/calendar.vue'
import Timeline from '@/pages/components/timeline.vue'
import ResetPasswordDialog from '@/pages/resetPasswordDialog.vue'
import CrmActivityTimeline from '@/views/dashboards/crm/CrmActivityTimeline.vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const route = useRoute()
const isDialogVisible = ref(false)
const isPDialogVisible = ref(!isDialogVisible.value)


onMounted(async () => {
  if (!store.state.isLogin) {
    await store.dispatch('getToken')
    store.dispatch('saveToken')

    // 토큰을 이용해 사용자 정보를 가져옴
    await store.dispatch('getMemberInfo')
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
    icon: 'mdi-account-outline',
    title: '항목에',
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
            가져올 페이지나 내용 작성
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
