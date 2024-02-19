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

userListStore.fetchUser(Number(route.params.id)).then(response => {
  userData.value = response.data
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
          제목에 맞는
        </VWindowItem>

        <VWindowItem>
          <UserHistory />
        </VWindowItem>

        <VWindowItem>
          <VCard style="margin-bottom: 50px;">
            <ApexChartStatistics style="margin: 50px 0;" /> <!-- 차트 -->
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
              <TimelineBasic />
            </VWindowItem>
            <!-- 운동쪽 이행률 체크 타임라인 -->
            <VWindowItem value="tab-2">
              <TimelineBasicExercise />
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
