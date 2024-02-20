<script setup>
import AddChallRoomSetting from '@/components/dialogs/AddChallRoomSetting.vue'
import AddMateRoomSetting from '@/components/dialogs/AddMateRoomSetting.vue'
import axios from '@axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const router = useRoute()
const projectData = ref([])
const isAddChallRoomSettingDialogVisible = ref(false)
const isAddMateRoomSettingDialogVisible = ref(false)
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id

const fetchProjectData = () => {
  axios.get('/pages/profile', { params: { tab: 'projects' } }).then(response => {
    projectData.value = response.data
  })
}

watch(router, fetchProjectData, { immediate: true })

const challenges = ref([])

const challenge = ref({
  challNo: null,
  goal: null,
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

const participantsData = ref([])

const participants = async () => {

  const response = await axios.get('http://localhost:4000/croom/participantsData.do' )

  if (response.status === 200) {
    participantsData.value = response.data
    console.log(' 참여자 데이타는---', participantsData.value)
  } else {
    console.log('참여자 데이타 가져오기 실패')
  }

}


const myData = ref([])

const my = async () => {
  console.log("connetId---", connetId)

  myData.value = await axios.get('http://localhost:4000/croom/myData.do', { params: { id: connetId } })

  if (myData.value.status === 200) {  // 수정된 부분
    console.log('내 데이타는---', myData.value.data)
  } else {
    console.log('내 데이타 가져오기 실패')
  }

}


const getData = async () => {
  try {
    const response = await axios.get('http://localhost:4000/croom/listChall.do')

    challenges.value = response.data

    console.log("challenges.value---", challenges.value)

    if (challenges.value.length > 0) {
      challenge.value = challenges.value[0]
      console.log("challenge.value---", challenge.value)
    }

  } catch (error) {
    console.error(error)
  }
}


onMounted(async () => { await getData(), await my(), await participants() })

const getHourDifference = (date1, date2) => {
  const diff = Math.abs(new Date(date1) - new Date(date2))
  
  return diff / (1000 * 60 * 60)
}

const currentDate = (() => {
  const today = new Date()
  const year = today.getFullYear().toString().slice(-2)
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  
  return `${year}/${month}/${day}`
})()

//천 단위 형식
const formatNumber = value => {
  if (!value) return ''
  
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const formatDate = dateString => {
  const date = new Date(dateString) // 날짜 문자열을 Date 객체로 변환

  date.setDate(date.getDate()) // 1일을 추가

  const year = date.getFullYear().toString().substring(2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // 월은 0부터 시작하므로 1을 더하고, 2자리로 맞춤
  const day = date.getDate().toString().padStart(2, '0') // 날짜를 2자리로 맞춤

  return `${year}/${month}/${day}`
}

defineExpose({ formatDate })

const calculateAge = birthdayString => {
  const birthday = new Date(birthdayString)
  const today = new Date()

  let age = today.getFullYear() - birthday.getFullYear()
  const monthDifference = today.getMonth() - birthday.getMonth()

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthday.getDate())) {
    age-- // 생일이 아직 안 지났으면, 나이에서 1을 빼줍니다.
  }

  return age
}

const getGenderCode = gender => {
  if (gender === 'M') {
    return 1
  } else if (gender === 'W') {
    return 2
  } else {
    return 0 // gender 값이 'M' 또는 'W'가 아닌 경우 0을 반환
  }
}

//참여 유효성 검사
const checkEntrance = () => {
  if (myData.value && calculateAge(myData.value.B_DAY) >= challenge.value.ageMin && calculateAge(myData.value.B_DAY) <= challenge.value.ageMax && (getGenderCode(myData.value.GENDER)===challenge.value.glimit || challenge.value.glimit===0)) {
  } else {
    alert('입장할 수 없습니다.')
  }
}
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
                  승환아 여기 이쁜 사진 넣어줘
                  <VAvatar
                  :image="data.avatar"
                  size="38"
                  />
                -->
              </template>

              <VCardTitle>{{ challenge.challNo }}. {{ challenge.challTitle }}</VCardTitle>
              <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-0">
                <span class="font-weight-medium me-1">방장: <span style="color: black;">{{ challenge.manager }}</span></span>
                <span class="font-weight-medium me-1">정원: <span style="color: black;">{{ challenge.challCapacity }}명</span></span>
              </div>
              <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-0">
                <span class="font-weight-medium me-1">목표: <span style="color: black;">{{ challenge.goal }}</span></span>
              </div>
              <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-0">
                <span class="font-weight-medium me-1">지역: <span style="color: black;">{{ challenge.challArea }}</span></span>
              </div>
            </VCardItem>

            <VCardText>
              <div class="d-flex align-center justify-space-between flex-wrap gap-x-2 gap-y-4">
                <div class="pa-2 bg-var-theme-background rounded">              
                  <span class="text-base font-weight-medium">
                    참가비 : <span class="text-body-1"> {{ formatNumber(challenge.pfee) }}원</span>
                  </span>
                </div>

                <div>
                  <h6 class="text-base font-weight-medium">
                    시작일: <span class="text-body-1">{{ formatDate(challenge.cstartDate) }}</span>
                  </h6>
                  <h6 class="text-base font-weight-medium mb-1">
                    종료일: <span class="text-body-1">{{ formatDate(challenge.cendDate) }}</span>
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
                    total : {{ getHourDifference(new Date(challenge.cendDate), new Date(challenge.cstartDate))/24 }}일                
                  </span>
                </VChip>
                <VChip
                  color="info"
                  density="compact"
                >
                  <span class="text-xs">
                    D-day : -{{ Math.floor((getHourDifference(new Date(challenge.cendDate), new Date())+9)/24) }}일
                  </span>
                </VChip>
                <VChip
                  v-if="challenge.ageMin && challenge.ageMax"
                  color="success"
                  density="compact"
                >
                  <span class="text-xs">
                    나이제한 : {{ challenge.ageMin }} ~ {{ challenge.ageMax }}세
                  </span>
                </VChip>
                <VChip
                  color="success"
                  density="compact"
                >
                  <span class="text-xs">
                    <span v-if="challenge.glimit === 0">모두 입장가능</span>
                    <span v-else-if="challenge.glimit === 1">남자만 입장가능</span>
                    <span v-else-if="challenge.glimit === 2">여자만 입장가능</span>
                  </span>
                </VChip>
              </div>
              <div class="d-flex align-center justify-space-between flex-wrap text-xs mt-4 mb-2">
                <span>달성 기준 : {{ challenge.implementation }}%</span>
                <span>{{ Math.round((challenge.implementation) * 100) }}% 완료</span>
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
                    <VAvatar
                      v-for="participant in participantsData"
                      :key="participant.ID"
                      :image="participant.PRO_FILEPATH"
                      :size="36"
                    />
                  </div>
                  <span class="text-xs">
                    {{ participantsData.length }}
                  </span>
                </div>
                <span>
                  <VBtn 
                    v-if="participantsData.length <= challenge.challCapacity"
                    @click="checkEntrance"
                  >
                    입장
                  </VBtn>                  
                  <strong v-else>참여불가</strong>
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
