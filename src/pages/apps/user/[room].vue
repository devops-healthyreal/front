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

const response = await axios.get('http://localhost:4000/mroom/participantsData.do', { params: { challNo: router.params.id } } )

if (response.status === 200) {
  participantsData.value = response.data
  console.log(' 참여자 데이타는---', participantsData.value)
} else {
  console.log('참여자 데이타 가져오기 실패')
}

}

//방 데이터 가져오기
const roomData = async () => {

console.log("challNo----", router.params.room)

const response = await axios.post('http://localhost:4000/mroom/roomData.do', { challNo: router.params.room })


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
    router.push({ name: 'challengeList' }) //넘겨줄 Vue 경로 입력하기

  }else if(room.value.manager === connetId){
    const response = await axios.delete('http://localhost:4000/mroom/deleteManager.do', { data: { id: connetId } })

    console.log("방장 나가기 성공")
    router.push({ name: 'challengeList' }) //넘겨줄 Vue 경로 입력하
  }

  else{
    const response = await axios.delete('http://localhost:4000/mroom/deletePeople.do', { data: { id: connetId } })

    console.log("일반사람 나가기 성공")
    router.push({ name: 'challengeList' }) //넘겨줄 Vue 경로 입력하기

  }
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
          <VCol class="d-flex">
            <VCol cols="10">
              <VAutocomplete
                :items="RoomList"
                item-title="RoomNumber"
                item-value="RoomNumber"
                placeholder="방 번호를 검색하세요"
                density="compact"
              >
                <template #item="{ props: listItemProp, item }">
                  <VListItem v-bind="listItemProp">
                    <template #prepend>
                      <VAvatar size="30" />
                    </template>
                  </VListItem>
                </template>
              </VAutocomplete>
            </VCol>
            <VCol
              cols="2"
              class="d-flex justify-end"
            >
              <VBtn>참가</VBtn>
            </VCol>
          </VCol>
          <!-- <VCol cols="10">3. 채팅방 열기</VCol> -->
          <VCol>
            <VColmateRoomParticipants />
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

