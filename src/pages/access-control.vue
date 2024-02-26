<script setup lang="ts">
import UserList from '@/views/apps/roles/UserList.vue'
import ChartJsLineChart from '@/views/charts/chartjs/ChartJsLineChart.vue'
import timelineCardHeader from '@images/cards/timeline-card-header.png'

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

const currentTab = ref(0)
</script>

<template>
  <VRow>
    <!--
      <VCol
      cols="2"
      sm="2"
      /> 
    -->
    <VCol
      cols="12"
      sm="12"
    >
      <VImg
        cover
        :src="timelineCardHeader"
        style=" height: 100px; margin-bottom: 20px;"
      />
      <VRow>
        <VCol
          cols="8"
          sm="4"
        >
          <VTabs
            v-model="currentTab"
            direction="vertical"
            class="v-tabs-pill"
          >
            <VTab>
              <VIcon
                start
                icon="mdi-account-cancel-outline"
              />
              신고 유저
            </VTab>

            <VTab>
              <VIcon
                start
                icon="mdi-account-eye-outline"
                :size="22"
              />
              유저 관리
            </VTab>

            <VTab>
              <VIcon
                start
                icon="mdi-chart-arc"
                :size="22"
              />
              페이지 통계
            </VTab>
            <VTab>
              <VIcon
                start
                icon="mdi-instagram"
                :size="22"
              />
              게시글 관리
            </VTab>
          </VTabs>
        </VCol>

        <VCol
          cols="12"
          sm="8"
        >
          <VWindow v-model="currentTab">
            <VWindowItem>
              <div class="d-flex align-center mb-6">
                <VAvatar
                  rounded
                  color="primary"
                  variant="tonal"
                  class="me-3"
                  size="large"
                >
                  <VIcon
                    :size="30"
                    icon="mdi-account-cancel-outline"
                  />
                </VAvatar>

                <div>
                  <h6 class="text-h6">
                    신고 유저 관리
                  </h6>
                  <span class="text-sm">Report user management</span>
                </div>
              </div>
            </VWindowItem>

            <VWindowItem>
              <div class="d-flex align-center mb-6">
                <VAvatar
                  rounded
                  color="primary"
                  variant="tonal"
                  class="me-3"
                  size="large"
                >
                  <VIcon
                    :size="30"
                    icon="mdi-account-eye-outline"
                  />
                </VAvatar>

                <div>
                  <h6 class="text-h6">
                    유저 관리
                  </h6>
                  <span class="text-sm">User Management</span>
                </div>
              </div>
              <VCol cols="12">
                <UserList />
              </VCol>
            </VWindowItem>

            <VWindowItem>
              <div class="d-flex align-center mb-6">
                <VAvatar
                  rounded
                  color="primary"
                  variant="tonal"
                  class="me-3"
                  size="large"
                >
                  <VIcon
                    :size="30"
                    icon="mdi-account-eye-outline"
                  />
                </VAvatar>

                <div>
                  <h6 class="text-h6">
                    페이지 통계
                  </h6>
                  <span class="text-sm">page statistics</span>
                </div>
              </div>
              <VCol cols="12">
                <VCard
                  title="Statistics"
                  subtitle="Commercial networks and enterprises"
                >
                  <VCardText>
                    <ChartJsLineChart :colors="chartJsCustomColors" />
                  </VCardText>
                </VCard>
              </VCol>
            </VWindowItem>
            <VWindowItem>
              <div class="d-flex align-center mb-6">
                <VAvatar
                  rounded
                  color="primary"
                  variant="tonal"
                  class="me-3"
                  size="large"
                >
                  <VIcon
                    :size="30"
                    icon="mdi-account-eye-outline"
                  />
                </VAvatar>

                <div>
                  <h6 class="text-h6">
                    게시글 관리
                  </h6>
                  <span class="text-sm">Post Management</span>
                </div>
              </div>
            </VWindowItem>
          </VWindow>
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>

<route lang="yaml">
  meta:
    action: bleak
    subject: bleak
    menuType: horizontal
    redirectIfLoggedIn: false
  </route>
