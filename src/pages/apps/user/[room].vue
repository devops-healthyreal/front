<script setup>
import ShareProjectDialogTemp from '@/components/dialogs/ShareProjectDialogTemp.vue'
import AreaCrawlingresult from '@/components/dialogs/areaCrawling_result.vue'
import Chat from '@/pages/apps/mateChat.vue'
import VColmateRoomParticipants from '@/pages/apps/mateRoomParticipants.vue'
import axios from '@axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const isShareProjectDialogVisible = ref(false)
const chatflag = ref(false) // 채팅방 열기&닫기 flag
const openRoomYN = ref(true) // 방공개여부
const delayChat = ref(false)
const router = useRouter()
const route = useRoute() //route객체
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id
const participantsData = ref([])
const room= ref([])

const capitalizedLabel = label => {
  const convertLabelText = label.toString()
  
  return convertLabelText.charAt(0).toUpperCase() + convertLabelText.slice(1)
}

const isareaCrawlingResultDialogVisible = ref(false)

const RoomList = [
  {
    RoomNumber: 'MateRoom01',
  },
  {
    RoomNumber: 'MateRoom02',
  },
  {
    RoomNumber: 'MateRoom03',
  },
]

function togglechatFlag() {
  chatflag.value = !chatflag.value
  if(chatflag.value){
    setTimeout(() => {
      delayChat.value = chatflag.value
    }, 150)
  }
  else{
    delayChat.value = chatflag.value
  }
}

watch(() => chatflag.value, newValue => {
  const element = document.querySelector('.transition-effect')
  if (element) {
    if (newValue) {
      element.classList.add('active')
    } else {
      element.classList.remove('active')
    }
  }
})

//참가자 데이터 가져오기
const participants = async () => {

  console.log(' router.params.room---', route.params.room)

  const response = await axios.get('http://localhost:4000/mroom/participantsData.do', { params: { challNo: route.params.room } } )

  if (response.status === 200) {
    participantsData.value = response.data
    console.log(' 참여자 데이타는---', participantsData.value)
  } else {
    console.log('참여자 데이타 가져오기 실패')
  }

}

//방 데이터 가져오기
const roomData = async () => {

  console.log("challNo----", route.params.room)

  const response = await axios.post('http://localhost:4000/mroom/roomData.do', { challNo: route.params.room })


  if (response.status === 200) {
    room.value = response.data
    console.log(' 방의 데이타는---', room.value)
  } else {
    console.log('방의 데이타 가져오기 실패')
  }

}

const deleteData = async () => {
  if(room.value.manager === connetId && participantsData.value.length == 1){
    const response = await axios.delete('http://localhost:4000/mroom/deleteRoom.do', { data: { id: connetId } })

    console.log("방 나가기 성공")
    router.push({ name: 'mateList' }) //넘겨줄 Vue 경로 입력하기

  }else if(room.value.manager === connetId){
    const response = await axios.delete('http://localhost:4000/mroom/deleteManager.do', { data: { id: connetId } })

    console.log("방장 나가기 성공")
    router.push({ name: 'mateList' }) //넘겨줄 Vue 경로 입력하
  }

  else{
    const response = await axios.delete('http://localhost:4000/mroom/deletePeople.do', { data: { id: connetId } })

    console.log("일반사람 나가기 성공")
    router.push({ name: 'mateList' }) //넘겨줄 Vue 경로 입력하기

  }
}

const formatDate = dateString => {
  const date = new Date(dateString) // 날짜 문자열을 Date 객체로 변환

  date.setDate(date.getDate()) // 1일을 추가

  const year = date.getFullYear().toString().substring(2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // 월은 0부터 시작하므로 1을 더하고, 2자리로 맞춤
  const day = date.getDate().toString().padStart(2, '0') // 날짜를 2자리로 맞춤

  return `${year}/${month}/${day}`
}


onMounted(async () => { await participants(), await roomData() })
</script>



<template>
  <section>
    <VRow>
      <VCol
        :cols="chatflag ? '7' : '12'"
        class="transition-effect"
      >
        <VCard>
          <VCol>
            <VRow>
              <VCol cols="7">
                <VBtn @click="isShareProjectDialogVisible = !isShareProjectDialogVisible">
                  Invite
                </VBtn>
                <ShareProjectDialogTemp v-model:isDialogVisible="isShareProjectDialogVisible" />
                <VBtn
                  :style="{'margin-left':'10px'}"
                  @click="isareaCrawlingResultDialogVisible = !isareaCrawlingResultDialogVisible;"
                >
                  장소 찾기
                </VBtn>                        
                <AreaCrawlingresult v-model:isDialogVisible="isareaCrawlingResultDialogVisible" />
              </VCol>                        
              <!-- 아래 방공개는 방장에게만 보여주기 / 조건 추가 필요 -->
              <VCol
                v-if="room.manager==connetId"
                cols="5"
                class="d-flex justify-end align-center"
              >
                <strong style="margin-right: 1em;">방 공개 여부</strong>
                <VSwitch
                  v-model="openRoomYN"
                  :label="areaSet = capitalizedLabel(openRoomYN) === 'True' ? '공개' : '비공개'"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol>
            <span>종목 : {{ room.mateSport }}</span> &nbsp;&nbsp;
            <span>지역 : {{ room.mateArea }}</span> &nbsp;&nbsp;
            <span>정원 : {{ room.mateCapacity }}명</span> &nbsp;&nbsp;
            <span>시작날짜 : {{ formatDate(room.mateDate) }}</span>
            <VColmateRoomParticipants :participants-data=" participantsData" />
          </VCol>
          <VCol cols="2">
            <VBtn 
              size="large"
              @click="togglechatFlag"
            >
              <span v-if="!chatflag">채팅방 열기</span>
              <span v-else>채팅방 닫기</span>
            </VBtn>
            <VCol cols="2">
              <VBtn
                :style="{'margin-left':'10px'}"
                @click="deleteData"
              >
                나가기
              </VBtn>
            </VCol>
          </VCol>
        </VCard>
      </VCol>
      <VCol
        v-if="delayChat"
        cols="5"
      >
        <Chat />
      </VCol>
    </VRow>
  </section>
</template>

<style>
.transition-effect {
  transform: translateX(0%); /* 초기에 오른쪽으로 이동되어 숨겨진 상태로 시작 */
  transition: all 0.15s ease-out; /* 트랜지션 효과 설정 */
}

.transition-effect.active {
  transform: translateX(100%); /* 왼쪽으로 이동되어 나타나는 상태로 변환 */
}
</style>

