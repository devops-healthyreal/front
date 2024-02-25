<script setup>
import ShareProjectDialogTemp from '@/components/dialogs/ShareProjectDialogTemp.vue'
import AreaCrawlingresult from '@/components/dialogs/areaCrawling_result.vue'
import Chat from '@/pages/apps/mateChat.vue'
import VColmateRoomParticipants from '@/pages/apps/mateRoomParticipants.vue'
import axios from '@axios'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'


const isShareProjectDialogVisible = ref(false)
const chatflag = ref(false) // 채팅방 열기&닫기 flag
const room= ref([])
const delayChat = ref(false)
const router = useRouter()
const route = useRoute() //route객체
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id
const participantsData = ref([])
const openRoomYN = ref("") // 방공개여부
let intervalId = null


const capitalizedLabel = label => {
  const convertLabelText = label.toString()
  
  return convertLabelText.charAt(0).toUpperCase() + convertLabelText.slice(1)
}

const isareaCrawlingResultDialogVisible = ref(false)

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

const openClose = async () => {
  const response = await axios.post('http://localhost:4000/mroom/openClose.do', { mateNo: route.params.room, open: openRoomYN.value }   )
}

//참가자 데이터 가져오기
const participants = async () => {

  console.log(' router.params.room---', route.params.room)

  const response = await axios.get('http://localhost:4000/mroom/participantsData.do', { params: { challNo: route.params.room } } )

  if (response.status === 200) {
    participantsData.value = response.data
    await roomData()
    if (!room.value) {
      router.push({ name: 'mateList' })
    }
  } else {
    console.log('참여자 데이타 가져오기 실패')
  }

}

const crawlingData=ref("")
let isLoading = ref(true)  // 로딩 상태를 나타내는 데이터 추가

//방 데이터 가져오기
const roomData = async () => {

  console.log("challNo----", route.params.room)

  const response = await axios.post('http://localhost:4000/mroom/roomData.do', { challNo: route.params.room })


  if (response.status === 200) {
    room.value = response.data
    if (!room.value) {
      router.push({ name: 'mateList' })
    }
    console.log(' 방의 데이타는---', room.value)
    console.log(' 방의 데이타는---room', room)

    openRoomYN.value = room.value.ryn === 'Y'

    startCrawling()
    console.log("matearea", room.value.mateArea)
    console.log("getMonthFromDate(room.value.mateDate)", getMonthFromDate(room.value.mateDate))
    console.log("getdayFromDate(room.value.mateDate)", getdayFromDate(room.value.mateDate))
  } else {
    console.log('방의 데이타 가져오기 실패')
  }

}

const deleteData = async () => {
  if(room.value.manager === connetId && participantsData.value.length == 1){
    const response = await axios.delete('http://localhost:4000/mroom/deleteRoom.do', { data: { id: connetId } })

    stopMatching()
    console.log("방 나가기 성공")
    router.push({ name: 'mateList' }) //넘겨줄 Vue 경로 입력하기

  }else if(room.value.manager === connetId){
    const response = await axios.delete('http://localhost:4000/mroom/deleteManager.do', { data: { id: connetId } })

    stopMatching()
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

const getMonthFromDate = data => {
  const date = new Date(data)

  // 월을 가져옵니다. getMonth()는 0부터 11까지의 값을 반환하므로 1을 더합니다.
  return Number(date.getMonth() + 1)
}

const getdayFromDate = data => {
  const date = new Date(data)

  // 일을 가져옵니다.
  return Number(date.getDate())
}


// 크롤링 함수
function startCrawling(){
  crawlingData.value=""
  isLoading.value = true
  try{        
    axios.post('http://127.0.0.1:5000/areaCrawling', { matearea: room.value.mateArea.split(' ')[0].trim(), matemonth: getMonthFromDate(room.value.mateDate), matedate: getdayFromDate(room.value.mateDate) })
      .then(response => {
        // 서버로부터의 응답 처리
        console.log(response.data)//JSON.parse()
        crawlingData.value = response.data
      })
      .catch(error => { 
        // 에러 처리
        console.error(error)
      },
      )
  }catch (e) {
    console.error(e)
  }
  finally {
    isLoading.value = false  // 요청 완료 후에 로딩 상태를 false로 설정
  }
}

// WebSocket 연결 생성
const socket = new WebSocket(`ws://localhost:4000/chat/${route.params.room}`)


// WebSocket 연결이 열린 경우
socket.addEventListener("open", event => {
  console.log("WebSocket 연결 성공")
})

// WebSocket에서 메시지를 받은 경우
socket.addEventListener("message", async event => {
  console.log("WebSocket 메시지 수신:", event.data)

  // 참가자가 들어오거나 나간 경우 참가자 데이터 갱신
  if (event.data.includes("연결 되었습니다") || event.data.includes("연결이 끊어졌어요")) {
    await participants()
    await roomData()
  }
})

socket.addEventListener("close", async event => {
  await roomData()
  await participants()
})

// 컴포넌트 해제 시 WebSocket 연결 종료
onUnmounted(() => {
  socket.close()
})


onMounted(async () => { await participants(), await roomData()})

// 매칭 시작 함수
const startMatching = async () => {
  try {
    // 서버에 매칭 요청
    const response = await axios.post("http://localhost:4000/mroom/start.do", { roomNo: route.params.room, people: participantsData.value.length  })

    if (response.status === 200) {
      console.log('매칭이 시작되었습니다.')

      // 로딩 시작
      isLoading1.value = true
      
      // 매칭이 시작되면 1초마다 participants()와 roomData() 함수를 호출
      intervalId = setInterval(async () => {
        await participants()
        await roomData()
        if (!room.value) {
          router.push({ name: 'mateList' })
        }
        if (room.value.mateCapacity === participantsData.value.length) {
          stopMatching()
        }
      }, 1000)
    } else {
      console.log('매칭 시작에 실패하였습니다.')
    }
  } catch (error) {
    console.error(`매칭 시작 중 에러 발생: ${error}`)
  }
}

let isLoading1 = ref(false)  // 매칭 로딩 상태

// 매칭 종료 함수
const stopMatching = () => {
  // 매칭이 종료되면 setInterval을 멈춤
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
    
    // 로딩 종료
    isLoading1.value = false
  }
}
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
            <VRow style="display: flex; justify-content: space-between;">
              <VCol cols="7">
                <VBtn
                  style=" width: 90px;"
                  @click="isShareProjectDialogVisible = !isShareProjectDialogVisible"
                >
                  초대하기
                </VBtn>
                <ShareProjectDialogTemp v-model:isDialogVisible="isShareProjectDialogVisible" />
                <VBtn
                  style=" width: 90px;margin-left: 10px;"
                  @click="isareaCrawlingResultDialogVisible = !isareaCrawlingResultDialogVisible;"
                >
                  장소 찾기
                </VBtn>
                <VBtn
                  style=" width: 90px;margin-left: 10px;"
                  @click="togglechatFlag"
                >
                  <span v-if="!chatflag">채팅방 열기</span>
                  <span v-else>채팅방 닫기</span>
                </VBtn>                     
                <AreaCrawlingresult v-model:isDialogVisible="isareaCrawlingResultDialogVisible" />
              </VCol>                        
              <!-- 아래 방공개는 방장에게만 보여주기 / 조건 추가 필요 -->
              <VCol
                v-if="room.manager==connetId"
                cols="3"
                class="d-flex justify-end align-center"
              >
                <VSwitch
                  v-model="openRoomYN"
                  :label="areaSet = capitalizedLabel(openRoomYN) === 'True' ? '공개' : '비공개'"
                  @change="openClose"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol style="margin-left: 10px;">
            <VIcon icon="mdi-whistle" /><span> : {{ room.mateSport }}</span> &nbsp;&nbsp;
            <VIcon icon="mdi-map-marker" /><span> : {{ room.mateArea }}</span> &nbsp;&nbsp;
            <VIcon icon="mdi-human-female-female" /><span> : {{ room.mateCapacity }}명</span> &nbsp;&nbsp;
            <VIcon icon="mdi-calendar-range" /><span> : 시작날짜 : {{ formatDate(room.mateDate) }}</span>
          </VCol>
          <div class="image-container">
            <VRow v-if="!crawlingData">
              <VProgressCircular
                v-if="!isLoading"
                class="loading"
                indeterminate
                color="primary"
              />
            </VRow>
            <VRow v-else>
              <VCol
                v-for="data in crawlingData"
                :key="data.index"
                cols="4"
              >
                <VCard cols="12">
                  <VCol
                    cols="12"
                    style=" display: flex;flex-wrap: wrap; align-items: center; justify-content: center;"
                  >
                    <img
                      :src="data.src"
                      alt="이미지"
                      style="width: 300px;height: 200px;object-fit: cover;"
                    >
                  </VCol>
                  <VCol
                    cols="12"
                    style="height: 50px;"
                  >
                    <a
                      :href="data.link"
                      class="my-custom-button"
                    >{{ data.title }}</a>
                  </VCol>
                  <VCol cols="12">
                    요금 : {{ data.pay }}         
                  </VCol>
                  <!-- 금액 : {{data.pay}}  -->
                  <!-- </VCardItem> -->
                </VCard>
              </VCol>
            </VRow>
          </div>
          <VColmateRoomParticipants :participants-data=" participantsData" />
          <VCol
            cols="12"
            style="display: flex; justify-content: space-between;"
          >
            <VBtn @click="deleteData">
              나가기
            </VBtn>
            
            <!-- 매칭잡기 버튼 방장만 가능하게 -->
            <VBtn
              v-if="room.manager === connetId && room.mateCapacity != participantsData.length"
              :loading="isLoading1"
              @click="startMatching"
            >
              매칭잡기
            </VBtn>
          </VCol>
        </VCard>
      </VCol>
      <VCol
        v-if="delayChat"
        cols="5"
      >
        <Chat
          :participants-data=" participantsData"
          :socket="socket"
          :mate-no="route.params.room"
        />
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

