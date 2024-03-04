<script setup>
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import pages7 from '@images/pages/7.jpg'
import defaultImg from '@images/userProfile/default.png'
import { defineProps, ref, onUpdated } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },

  // modalData: {
  //   type: Object,
  //   required: true,
  // },
  userid: {
    type: String,
    required: true,
  },
  userprofilePath: {
    type: String,
  },
  userproIntroduction: {
    type: String,
  },
  userFriendsList: {
    type: Array,
  },
})

const emit = defineEmits(['update:isDialogVisible'])
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)

const connectId = ref(userInfo.value.id) //접속 중인 유저 아이디
const isFriend = ref(false) //친구인지 여부 확인

console.log("connectId", connectId)

const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
]

const isCardDetailsVisible = ref(false)
const isRequested = ref(false)

const dialogVisibleUpdate = value => {
  emit('update:isDialogVisible', value)
  fetchData()
}

const fetchData = () => {
  console.log("fetchData", props.userFriendsList)
  if(props.userFriendsList.includes(connectId.value)) {
    isFriend.value = true
  }
  else{
    isFriend.value = false
  }
  console.log("isFriend?", isFriend.value)
}

//fetchData()

const controllInviteFunc = () => { //DB에 접근
  console.log('이벤트 발생')
  console.log(ans, id)
  isInvited[id] = ref(false)
  axios.post("http://localhost:4000/comm/request", JSON.stringify({
    userId: connetId,
    reqId: id,
    type: '1',
  }), { headers: { 'Content-Type': 'application/json' } })
    .catch(err => {
      console.log(err, '값을 받는 데 실패했습니다')
    })
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogVisibleUpdate"
  >
    <!-- 👉 dialog close btn -->
    <VBtn
      icon
      @click="$emit('update:isDialogVisible', false)"
    >
      <VIcon>mdi-close</VIcon>
    </VBtn>
    <VCol cols="12">
      <VCard>
        <!-- 대표사진 -->
        <VImg :src="pages7" />
        <!-- 대표사진이 없을 경우 뿌려주는 img -->
        <VImg 
          v-if="false"
          :src="defaultImg"
        />
        <VCardText class="position-relative">
          <!-- 유저 프로필 사진 -->
          <VAvatar
            size="75"
            class="avatar-center"
            :image="userprofilePath"
          />
          <div class="d-flex justify-space-between flex-wrap pt-8">
            <div class="me-2 mb-2">
              <!-- 클릭 이벤트 : 해당 유저가 올린 게시물 보기 -->
              <VCardTitle class="pa-0 pointer-cursor">
                {{ userid }}
              </VCardTitle>
              <VCardSubtitle class="text-caption pa-0">
                {{ userproIntroduction }}
              </VCardSubtitle>
            </div>
            <VBtn @click="fetchData">
              친구 요청
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VDialog>
</template>

<style lang="scss" scoped>
.avatar-center {
  position: absolute;
  border: 5px solid rgb(var(--v-theme-surface));
  inset-block-start: -2rem;
  inset-inline-start: 1rem;
}

.pointer-cursor {
  cursor: pointer;
}
</style>

