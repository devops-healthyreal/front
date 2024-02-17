<script setup>
import BlockMateConfirmFinal from '@/pages/community/BlockMateConfirmFinal.vue'
import BlockMateConfirmModal from '@/pages/community/BlockMateConfirmModal.vue'
import { isMatescreenchanged } from '@/router/index'
import axios from '@axios'
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()

const userInfo = computed(() => store.state.userStore.userInfo)
const connetId=computed(() => userInfo.value.id)

const router = useRoute()
const connectionData = ref([])
const isMateExist = ref(true)

const userId = ref(connetId) //접속한 유저 아이디

const rating = reactive({}) //호감도 뿌려주기 위한 변수
const beforeRating = {}

const ratingColors = [
  'warning',
]

const isConnected = {}
const isWarning = {}

const fetchProjectData = () => { //유저 값 가져오기
  if (router.params.tab === 'mate') {
    axios.get('http://127.0.0.1:4000/comm/mate', {
      params: {
        id: userId.value,
      },
    })
      .then(response => {
        console.log(response.data)
        connectionData.value = response.data
        if (Object.keys(response.data).length == 0) isMateExist.value = true
        else {
          isMateExist.value = false

          //호감도 Vrating에 설정해줄 값
          connectionData.value.forEach(user => {
            rating[user.mate_id] = ref(user.favorable_rating)
            isConnected[user.mate_id] = ref(true)
            isWarning[user.mate_id] = ref(false)
          })}
      })
      .catch(()=>{console.log('서버가 꺼져있습니다.')})
  }
}

console.log('mate의 isConnected:', isConnected)

const connectionController = (temp, id) => {
  temp.value = !temp.value
  console.log(id)
}

const modalControll = ref(false)
const username = ref('')

const blockingController = (temp, id) => {
  modalControll.value = true
  username.value = id
}

const isWarningComplete = ref(false)

//메이트 신고용
const blockMate = (warningReason, id) => {
  console.log(warningReason.value, id) //axios로 처리
  isWarningComplete.value = true
  axios.post("http://127.0.0.1:4000/comm/mate/reportwarning", JSON.stringify({
    userId: userId.value,
    id: id,
    warningReason: warningReason.value,
  }), { headers: { 'Content-Type': 'application/json' } })
    .then(()=>{
      fetchProjectData()
    })
    .catch(err=>console.log(err))
}

watch(router, fetchProjectData, { immediate: true })

watch(rating, ()=>{ //호감도 관련 기능
  if(beforeRating != {}){
    for(const key in rating){
      if (beforeRating[key] != rating[key]){
        axios.put('http://127.0.0.1:4000/comm/mate/changefavorable', JSON.stringify({
          mate_id: key,
          favorable_rating: rating[key],
        }), { headers: { "Content-Type": `application/json` } })
          .catch(error=>{console.log(error)})
      }
    }
  }
  for(const key in rating){
    beforeRating[key] = rating[key]
  }
}, { immediate: true })

window.addEventListener('click', ()=>{ //beforeunload
  if(isMatescreenchanged.value) {
    console.log('메이트 url변경감지', isConnected)
    for(const userid in isConnected) {
      console.log('메이트 url변경감지 및 반복문')
      console.log(userid, isConnected[userid].value)

      if (!isConnected[userid].value){
        console.log('axios delete 안으로 들어옴', userid)
        axios.delete("http://127.0.0.1:4000/comm/mate/delete", { //메이트 취소하기
          data: {
            userId: userId.value,
            id: userid,
          },
        }, { headers: { "Content-Type": `application/json` } })
          .then(()=>{
            fetchProjectData()
          })
      }
    }

    isMatescreenchanged.value = false
  }
})
</script>

<template>
  <VCardText>
    <h5
      class="text-h5"
      style="font-weight: bold;"
    >
      메이트 목록
    </h5>
  </VCardText>
  <VAlert
    v-show="isMateExist"
    density="default"
    color="secondary"
    variant="tonal"
    :style="{'margin-bottom':'200px'}"
  >
    메이트 목록이 없습니다
  </VAlert>
  <VRow>
    <VCol
      v-for="data in connectionData"
      :key="data.mate_id"
      sm="6"
      lg="4"
      cols="12"
    >
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex flex-column align-center justify-center">
            <VAvatar
              size="100"
              :image="data.profilePath" 
              class="mt-3"
            />
            <p class="mt-6 mb-0">
              {{ data.mate_id }}
            </p>
            <span class="text-body-1">{{ data.name }}</span>

            <div class="d-flex align-center flex-wrap gap-2 mt-6">
              <div class="d-flex flex-column">
                <VRating
                  v-for="color in ratingColors"
                  :key="color"
                  v-model="rating[data.mate_id]"
                  :color="color"
                />
              </div>
            </div>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <div class="d-flex justify-space-around mt-1">
            <div class="text-center">
              <h6 class="text-h6">
                {{ data.fnum }}
              </h6>
              <span class="text-body-1">친구</span>
            </div>
            <div class="text-center">
              <h6 class="text-h6">
                {{ data.mnum }}
              </h6>
              <span class="text-body-1">메이트</span>
            </div>
            <div class="text-center">
              <h6 class="text-h6">
                {{ data.snum }}
              </h6>
              <span class="text-body-1">구독자</span>
            </div>
          </div>

          <div class="d-flex justify-center gap-4 mt-6">
            <VBtn
              :prepend-icon="isConnected[data.mate_id].value ? 'mdi-account-cancel-outline' : 'mdi-account-check-outline'"
              :variant="isConnected[data.mate_id].value ? 'tonal' : 'elevated'"
              @click="connectionController(isConnected[data.mate_id], data.mate_id)"
            >
              {{ isConnected[data.mate_id].value ? '메이트취소' : '취소 되돌리기' }}
            </VBtn>
            <VBtn
              prepend-icon="mdi-alert"
              variant="outlined"
              color="error"
              @click="blockingController(isWarning[data.mate_id], data.mate_id)"
            >
              신고하기
            </VBtn>
            <BlockMateConfirmModal 
              v-model:isDialogVisible="modalControll"
              :message="username"
              @check-confirm="blockMate"
            />
            <BlockMateConfirmFinal v-model:isDialogVisible="isWarningComplete" />
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.vertical-more {
  position: absolute;
  inset-block-start: 1rem;
  inset-inline-end: 0.5rem;
}
</style>
