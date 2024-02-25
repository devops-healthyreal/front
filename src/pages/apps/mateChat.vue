<script setup>
import axios from '@axios'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'
import { nextTick, onMounted } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useDisplay } from 'vuetify'
import { useStore } from 'vuex'

const props = defineProps({
  participantsData: {
    type: Object,
    required: true,
  },
  socket: {
    type: Object,
    required: true,
  },
  mateNo: {
    type: Object,
    required: true,
  },
})

const vuetifyDisplays = useDisplay()

const { isLeftSidebarOpen } = useResponsiveLeftSidebar(vuetifyDisplays.smAndDown)
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id
const connetAv = userInfo.value.pro_filepath

// Perfect scrollbar
const chatLogPS = ref()

const scrollToBottomInChatLog = () => {
  const scrollEl = chatLogPS.value.$el || chatLogPS.value

  scrollEl.scrollTop = scrollEl.scrollHeight
}


const msg = ref('')

// 메시지를 전송하는 함수
async function sendMessage() {
  if (msg.value.trim() !== "") {
    try {
      // 서버에 메시지 전송 요청
      const response = await axios.post("http://localhost:4000/chat/mateWrite.do", { content: msg.value, id: connetId, mateNo: props.mateNo, ruser: 'all'})
      
      if (response.data && response.data.success) {
        console.log('메시지 전송 성공')
        // 웹소켓을 통해 메시지 전송
        props.socket.send(JSON.stringify({ content: msg.value, id: connetId, mateNo: props.mateNo, ruser: 'all'}))
        // 입력 필드 초기화
        msg.value = "";
      } else {
        console.error('메시지 전송 실패')
      }
    } catch (error) {
      console.error(`메시지 전송 중 에러 발생: ${error}`)
    }
  }
}

async function allData(mateNo) {
  try {
    const response = await axios.post("http://localhost:4000/chat/allMateChating.do", { mateNo: mateNo })

    if (response.data && Array.isArray(response.data)) {
      response.data.forEach((item) => {
        chat.value.push({
          message: item.content,
          time: item.sendDate,
          senderId: item.id,
        })
      })
    }
  } catch (error) {
    console.error(`데이터를 가져오는데 실패했습니다: ${error}`)
  }
}

let chat = ref("")

const msgGroups = computed(() => {
  let messages = chat.value
  const _msgGroups = []

  if (messages.length > 0) {
    let msgSenderId = messages[0]?.senderId
    let msgGroup = {
      senderId: msgSenderId,
      messages: [],
    }

    messages.forEach((msg, index) => {
      if (msgSenderId === msg.senderId) {
        msgGroup.messages.push({
          message: msg.message,
          time: msg.time,
        })
      } else {
        msgSenderId = msg.senderId
        _msgGroups.push(msgGroup)
        msgGroup = {
          senderId: msg.senderId,
          messages: [{
            message: msg.message,
            time: msg.time,
          }],
        }
      }

      if (index === messages.length - 1)
        _msgGroups.push(msgGroup)
    })
  }

  return _msgGroups
})

onMounted(() => {
  console.log(props.socket)
  // 웹소켓 메시지 이벤트 리스너 등록
  props.socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    chat.value.push(message)
  }
})


const openChatOfContact = async()  => {
  await allData(props.mateNo)

  // Reset message input
  msg.value = ''
  
  // if smAndDown =>  Close Chat & Contacts left sidebar
  if (vuetifyDisplays.smAndDown.value)
    isLeftSidebarOpen.value = false

  // Scroll to bottom
  nextTick(() => {
    scrollToBottomInChatLog()
  })
}

openChatOfContact()
</script>

<template>
  <VLayout class="chat-app-layout bg-surface">
    <!-- 👉 Chat content -->
    <VMain class="chat-content-container ">
      <!-- 👉 Right content: Active Chat -->
      <!-- 아래의 class 속성의 h-100을 h-50으로 바꿔 길이 조정 -->
      <div
        class="d-flex flex-column h-100"
      >
        <!-- 👉 Active chat header -->
        <div class="active-chat-header d-flex align-center text-medium-emphasis">
          <!-- avatar -->

          <div
            v-for="(participant, index) in props.participantsData"
            :key="index"
          >
            <VAvatar
              size="40"
              :variant="!participant.PRO_FILEPATH ? 'tonal' : undefined"
              class="cursor-pointer"
            >
              <VImg
                v-if="participant.PRO_FILEPATH"
                :src="participant.PRO_FILEPATH"
              />
            </VAvatar>
          </div>

          <VSpacer />
        </div>

        <VDivider />

        <!-- Chat log -->
        <PerfectScrollbar
          ref="chatLogPS"
          tag="ul"
          :options="{ wheelPropagation: false }"
          class="flex-grow-6"
        >
        <div class="chat-log pa-5">
          <div
            v-for="(msgGrp, index) in msgGroups"
            :key="'msgGrp-' + index"
            class="chat-group d-flex align-start"
            :class="[
              msgGrp.senderId !== connetId ? 'flex-row' : 'flex-row-reverse',
              { 'mb-8': msgGroups.length - 1 !== index }
            ]"
          >
            <div
              class="chat-avatar"
              :class="msgGrp.senderId !== connetId ? 'me-4' : 'ms-4'"
            >
              <VAvatar size="32">
                <VImg :src="msgGrp.senderId === connetId ? connetAv : ''" />
              </VAvatar>
            </div>
            <div
              class="chat-body d-inline-flex flex-column"
              :class="msgGrp.senderId !== connetId ? 'align-start' : 'align-end'"
            >
              <p
                v-for="(msgData, msgIndex) in msgGrp.messages"
                :key="'msgData-' + msgIndex"
                class="chat-content text-sm py-3 px-4 elevation-1"
                :class="[
                  msgGrp.senderId === connetId ? 'bg-primary text-white chat-right' : 'bg-surface chat-left',
                  { 'mb-3': msgGrp.messages.length - 1 !== msgIndex },
                ]"
              >
                {{ msgData.message }}
              </p>
              <div :class="{ 'text-right': msgGrp.senderId === connetId }">
                <span class="text-xs me-1 text-disabled">{{ formatDate(msgData.time, { hour: 'numeric', minute: 'numeric' }) }}</span>
              </div>
            </div>
          </div>
        </div>

        </PerfectScrollbar>

        <!-- Message form -->
        <VForm
          class="chat-log-message-form mb-5 mx-5"
          @submit.prevent="sendMessage"
        >
          <VTextField
            v-model="msg"
            variant="solo"
            class="chat-message-input"
            placeholder="메세지를 입력하세요"
            autofocus
          >
            <template #append-inner>
              <IconBtn>
                <VIcon
                  icon="mdi-microphone-outline"
                  size="22"
                />
              </IconBtn>
              <VBtn type="submit">
                보내기
              </VBtn>
            </template>
          </VTextField>
        </VForm>
      </div>
    </VMain>
  </VLayout>
</template>

<route lang="yaml">
meta:
  layoutWrapperClasses: layout-content-height-fixed
</route>

<style lang="scss">
@use "@styles/variables/_vuetify.scss";
@use "@core/scss/base/_mixins.scss";
@use "@layouts/styles/mixins" as layoutsMixins;

// Variables
$chat-app-header-height: 68px;

// Placeholders
%chat-header {
  display: flex;
  align-items: center;
  min-block-size: $chat-app-header-height;
  padding-inline: 1rem;
}

.chat-app-layout {
  border-radius: vuetify.$card-border-radius;

  @include mixins.elevation(vuetify.$card-elevation);

  $sel-chat-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-chat-app-layout);
    }
  }

  .active-chat-user-profile-sidebar,
  .user-profile-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }

  .active-chat-header {
    @extend %chat-header;
  }
}

.chat-content-container {
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));

  // Adjust the padding so text field height stays 48px
  .chat-message-input {
    .v-field__append-inner {
      align-items: center;
      padding-block-start: 0;
    }

    .v-field--appended {
      padding-inline-end: 6px;
    }
  }
}

.chat-log {
  .chat-content {
    border-end-end-radius: 6px;
    border-end-start-radius: 6px;

    &.chat-left {
      border-start-end-radius: 6px;
    }

    &.chat-right {
      border-start-start-radius: 6px;
    }
  }
}
</style>
