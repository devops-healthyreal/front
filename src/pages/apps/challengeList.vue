<script setup>
import AddChallRoomSetting from '@/components/dialogs/AddChallRoomSetting.vue'
import AddMateRoomSetting from '@/components/dialogs/AddMateRoomSetting.vue'
import axios from '@axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const router = useRoute()
const projectData = ref([])
const isAddChallRoomSettingDialogVisible = ref(false)
const isAddMateRoomSettingDialogVisible = ref(false)

const fetchProjectData = () => {
  axios.get('/pages/profile', { params: { tab: 'projects' } }).then(response => {
    projectData.value = response.data
  })
}

watch(router, fetchProjectData, { immediate: true })

const challenges = ref([])

const challenge = ref({
  challNo: null,
  goalNo: null,
  challCapacity: null,
  implementation: null,
  gLimit: null,
  ageMin: null,
  ageMax: null,
  pFee: null,
  cYN: null,
  cCreateDate: null,
  cStartDate: null,
  cEndDate: null,
  challContent: null,
  challTitle: null,
  challArea: null,
  manager: null,
})

const getData = async () => {
  try {
    const response = await axios.get('http://localhost:4000/croom/listChall.do')

    challenges.value = response.data

    if (challenges.value.length > 0) {
      challenge.value = challenges.value[0]
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(getData)




const getHourDifference = (deadline, startDate) => {  

  // 두 날짜 간의 시간 차이 계산
  return Math.abs(deadline - startDate) / 36e5
}

const currentDate = (() => {
  const today = new Date()
  const year = today.getFullYear().toString().slice(-2)
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  
  return `${year}/${month}/${day}`
})()
</script>

<template>
  <section>
    <VCol>
      <VRow v-if="challenges.length > 0">
        <VCol
          v-for="challenge in challenges"
          :key="challenge.challNo"
          cols="12"
          sm="6"
          lg="4"
        >
          <VCard>
            <VCardItem>
              <template #prepend>
                <!--
                  <VAvatar
                  :image="data.avatar"
                  size="38"
                  />
                -->
              </template>

              <VCardTitle>{{ challenge.challTitle }}</VCardTitle>
              <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-0">
                <span class="font-weight-medium me-1">Host:{{ challenge.manager }}</span>
              </div>
            </VCardItem>

            <VCardText>
              <div class="d-flex align-center justify-space-between flex-wrap gap-x-2 gap-y-4">
                <div class="pa-2 bg-var-theme-background rounded">              
                  <span class="text-base font-weight-medium">
                    참가비 : <span class="text-body-1"> {{ challenge.pFee }}원</span>
                  </span>
                </div>

                <div>
                  <h6 class="text-base font-weight-medium">
                    시작일: <span class="text-body-1">{{ challenge.cStartDate }}</span>
                  </h6>
                  <h6 class="text-base font-weight-medium mb-1">
                    종료일: <span class="text-body-1">{{ challenge.cEndDate }}</span>
                  </h6>
                </div>
              </div>

              <p class="mt-4 mb-0 clamp-text">
                {{ challenge.challContent }}
              </p>
            </VCardText>

            <VDivider />

            <VCardText>
              <div class="d-flex align-center justify-end flex-wrap gap-2">
                <VChip
                  color="info"
                  density="compact"
                >
                  <span class="text-xs">
                    total : {{ getHourDifference(challenge.cEndDate, challenge.cStartDate)/24 }}일                
                  </span>
                </VChip>
              </div>
              <div class="d-flex align-center justify-end flex-wrap gap-2 mt-2">
                <VChip
                  color="success"
                  density="compact"
                >
                  <span class="text-xs">
                    D-day : -{{ (getHourDifference(challenge.cEndDate, cCreateDate)+9)/24 }}일
                  </span>
                </VChip>
              </div>

              <div class="d-flex align-center justify-space-between flex-wrap text-xs mt-4 mb-2">
                <span>Goal achiv : {{ challenge.goalNo }}%</span>
                <span>{{ Math.round((challenge.implementation) * 100) }}% Completed</span>
              </div>
              <!--
                <VProgressLinear
                rounded
                rounded-bar
                height="8"
                :model-value="data.completedTask"
                :max="data.totalTask"
                color="primary"
                />
              -->

              <div class="d-flex align-center justify-space-between flex-wrap gap-2 mt-3">
                <div class="d-flex align-center">
                  <div class="v-avatar-group me-2">
                    <!--
                      <VAvatar
                      v-for="avatar in data.avatarGroup"
                      :key="avatar.name"
                      :image="avatar.avatar"
                      :size="36"
                      /> 
                    -->
                  </div>
                  <span class="text-xs">
                    <!-- {{ data.members }} -->
                  </span>
                </div>
                <span>
                  <VBtn v-if="challenge.cStartDate > currentDate">입장</VBtn>                          
                  <strong v-else>진행중</strong>
                </span>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCol>
    <VRow style="margin-top: 50px;">
      <VCol cols="4" />
      <VCol
        cols="4"
        class="align-self-center"
      >    
        <VBtn @click="isAddChallRoomSettingDialogVisible = !isAddChallRoomSettingDialogVisible">
          챌린지방 생성
        </VBtn>
        <AddChallRoomSetting v-model:isDialogVisible="isAddChallRoomSettingDialogVisible" />
        <VBtn
          :style="{'margin-left':'10px'}"
          @click="isAddMateRoomSettingDialogVisible = !isAddMateRoomSettingDialogVisible"
        >
          Mate
        </VBtn>
        <AddMateRoomSetting v-model:isDialogVisible="isAddMateRoomSettingDialogVisible" />
      </VCol>
    </VRow>
  </section>
</template>
