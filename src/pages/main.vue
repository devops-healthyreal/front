<script setup>
import Calendar from '@/pages/apps/calendar.vue'
import Timeline from '@/pages/components/timeline.vue'
import CrmActivityTimeline from '@/views/dashboards/crm/CrmActivityTimeline.vue'
import { onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

onMounted(async () => {
  store.dispatch('saveToken')
  await store.dispatch('getToken')


  // 토큰을 이용해 사용자 정보를 가져옴
  store.dispatch('getMemberInfo')
})



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
  </section>
</template>

<style lang="scss">
  @use "@core/scss/template/libs/apex-chart.scss";
</style>
