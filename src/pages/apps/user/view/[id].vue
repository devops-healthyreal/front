<script setup>
import TimelineBasicExercise from '@/components/dialogs/TimelineBasicExercise.vue'
import ApexChartStatistics from '@/pages/components/ApexChartStatistics.vue'
import TimelineBasic from '@/pages/components/TimelineBasic.vue'
import MyList from '@/pages/myList.vue'
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import UserBioPanel from '@/views/apps/user/view/UserBioPanel.vue'
import UserEdit from '@/views/apps/user/view/UserEdit.vue'
import UserHistory from '@/views/apps/user/view/UserHistory.vue'
import UserPaymentList from '@/views/apps/user/view/UserPaymentList.vue'
import ApexChartAreaChart from '@/views/charts/apex-chart/ApexChartAreaChart.vue'
import ChartJsPolarAreaChart from '@/views/charts/chartjs/ChartJsPolarAreaChart.vue'
import ChartJsRadarChart from '@/views/charts/chartjs/ChartJsRadarChart.vue'
import { ref, watchEffect } from 'vue'
import { useStore } from 'vuex'

const currentTab = ref('tab-1')

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId=userInfo.value.id

const userListStore = useUserListStore()
const route = useRoute()
const userData = ref()
const userTab = ref(null)

const checkedItems = ref([])
const checkedExerciseItems = ref([])

function handleDataFromChild(data) {
  checkedItems.value = data
  console.log(checkedItems.value)
  console.log('여기다')
}

function handleDataFromChildExer (data) {
  checkedExerciseItems.value = data
  console.log(checkedExerciseItems.value)
  console.log('여기다운동')
}

const tabs = [
  {
    icon: 'mdi-account-edit',
    title: '회원정보 수정',
  },
  {
    icon: 'mdi-text-box-edit',
    title: '게시글 수정',
  },
  {
    icon: 'mdi-chart-bar',
    title: '분석',
  },
  {
    icon: 'mdi-history',
    title: '히스토리',
  },
  {
    icon: 'mdi-poll',
    title: '이행률',
  },
  {
    icon: 'mdi-credit-card-plus',
    title: '결제내역',
  },
]

const chartJsCustomColors = {
  white: '#fff',
  yellow: '#ffe802',
  primary: '#836af9',
  areaChartBlue: '#2c9aff',
  barChartYellow: '#ffcf5c',
  polarChartGrey: '#4f5d70',
  polarChartInfo: '#299aff',
  lineChartYellow: '#d4e157',
  polarChartGreen: '#28dac6',
  lineChartPrimary: '#9e69fd',
  lineChartWarning: '#ff9800',
  horizontalBarInfo: '#26c6da',
  polarChartWarning: '#ff8131',
  scatterChartGreen: '#28c76f',
  warningShade: '#ffbd1f',
  areaChartBlueLight: '#84d0ff',
  areaChartGreyLight: '#edf1f4',
  scatterChartWarning: '#ff9f43',
}

userListStore.fetchUser(Number(route.params.id)).then(response => {
  userData.value = response.data
})

// checkedItems의 변화를 감지하여 변경 사항을 업데이트합니다.
watchEffect(() => {
  console.log('checkedItems가 변경되었습니다:', checkedItems.value)
  console.log('checkedItems가 변경되었습니다:', checkedExerciseItems.value)
})
</script>

<template>
  <VRow v-if="userData">
    <VCol cols="4">
      <UserBioPanel :user-data="userData" />
    </VCol>
    <VCol
      cols="12"
      md="8"
    >
      <VTabs
        v-model="userTab"
        class="v-tabs-pill"
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.icon"
        >
          <VIcon
            start
            :icon="tab.icon"
          />
          {{ tab.title }}
        </VTab>
      </VTabs>  
      <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <UserEdit />
        </VWindowItem>

        <VWindowItem>
          <MyList :id="connetId" />
        </VWindowItem>

        <VWindowItem>
          <VCard>
            <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
              <VCardTitle>Area Chart</VCardTitle>
              <VCardSubtitle>Commercial networks</VCardSubtitle>

              <template #append>
                <div class="date-picker-wrapper">
                  <AppDateTimePicker
                    style="width: 150px;"
                    model-value="2022-06-09"
                    prepend-inner-icon="mdi-calendar-blank-outline"
                    density="compact"
                    :config="{ position: 'auto right' }"
                  />
                </div>
              </template>
            </VCardItem>

            <VCardText>
              <ApexChartAreaChart />
            </VCardText>
          </VCard>
          <VRow style="margin-top: 20px;">
            <VCol
              cols="12"
              md="6"
            >
              <VCard title="Radar Chart">
                <VCardText>
                  <ChartJsRadarChart />
                </VCardText>
              </VCard>
            </VCol>

            <!-- 👉 Average Skills Polar Area Chart -->
            <VCol
              cols="12"
              md="6"
            >
              <VCard title="Average Skills">
                <VCardText>
                  <ChartJsPolarAreaChart :colors="chartJsCustomColors" />
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VWindowItem>

        <VWindowItem>
          <UserHistory />
        </VWindowItem>

        <VWindowItem>
          <VCard style="margin-bottom: 50px;">
            <ApexChartStatistics
              :checked-items="checkedItems"
              :checked-exercise-items="checkedExerciseItems"
              style="margin: 50px 0;"
            /> <!-- 차트 -->
          </VCard>
          <VTabs
            v-model="currentTab"
            grow
            stacked
          >
            <!-- 탭 목록 -->
            <VTab value="tab-1"> 
              <VIcon
                icon="mdi-food-fork-drink"
                class="mb-2"
              />
              <span>식단</span>
            </VTab>

            <VTab value="tab-2">
              <VIcon
                icon="mdi-dumbbell"
                class="mb-2"
              />
              <span>운동</span>
            </VTab>
          </VTabs>
          <VWindow
            v-model="currentTab"
            class="mt-5"
          >
            <!-- 식단쪽 이행률 체크 타임라인 -->
            <VWindowItem value="tab-1">
              <TimelineBasic @sendData="handleDataFromChild" />
            </VWindowItem>
            <!-- 운동쪽 이행률 체크 타임라인 -->
            <VWindowItem value="tab-2">
              <TimelineBasicExercise @sendDataExer="handleDataFromChildExer" />
            </VWindowItem>
          </VWindow>
        </VWindowItem>

        <VWindowItem>
          <UserPaymentList />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>
