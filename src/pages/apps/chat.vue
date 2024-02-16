<script setup>
import ChatLeftSidebarContent from '@/views/apps/chat/ChatLeftSidebarContent.vue'
import ChatLog from '@/views/apps/chat/ChatLog.vue'
import useDatabase from '@/views/apps/chat/chatData.js'
import { useChat } from '@/views/apps/chat/useChat'
import axios from '@axios'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'
import { avatarText } from '@core/utils/formatters'
import { ref } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useDisplay } from 'vuetify'

const vuetifyDisplays = useDisplay()
const { isLeftSidebarOpen } = useResponsiveLeftSidebar(vuetifyDisplays.smAndDown)
const { resolveAvatarBadgeVariant } = useChat()

// 스크롤바
const chatLogPS = ref()

const scrollToBottomInChatLog = () => {
  if (chatLogPS.value) {
    const scrollEl = chatLogPS.value.$el || chatLogPS.value

    scrollEl.scrollTop = scrollEl.scrollHeight
  }
}

let { database, chatsContacts, connetId } = useDatabase()

let newchat = ref('')

// 검색
const q = ref('')

// 메세지
const msg = ref('')
let sendMessage = null
let messages = ref([]) // 메시지를 저장할 배열 변수 선언
let contactId = null 
let senderId = null  

// 웹소켓 연결 생성
const socket = new WebSocket('ws://localhost:4000/chat')

// 웹소켓 연결이 열렸을 때
socket.addEventListener('open', async function (event) {
  console.log('----웹소켓 연결되었습니다.--------')

  sendMessage = async () => {
    let message = ref(msg.value) // 여기서 message 변수 선언 및 초기화
    if (!message.value) // .value를 사용하여 message의 값을 확인
      return

    senderId = connetId
    contactId = newchat?.value.contact.id

    console.log("----------contactId---------", contactId)

    // 새 메시지 데이터를 생성
    const newMessageData = {
      message: message.value,
      time: String(new Date()),
      senderId,
      feedback: {
        isSent: true,
        isDelivered: socket.readyState === WebSocket.OPEN,
        isSeen: false,
      },
    }


    // 새 메시지를 messages 배열에 추가합니다.
    messages.value.push(newMessageData)
    console.log("메세지 잘 들어가고 있나??:", messages.value) // 배열 로그

    // 새로운 newchat 객체를 만듭니다.
    const newnewchat = {
      ...newchat.value,
      chat: {
        ...newchat.value.chat,
        messages: [...newchat.value.chat.messages, newMessageData],
      },
    }

    // 새로운 newchat 객체를 newchat.value에 할당합니다.
    newchat.value = newnewchat

    try {
      if (socket.readyState === WebSocket.OPEN) {
        // 웹소켓이 연결된 경우, 웹소켓을 통해 메시지 전송
        socket.send(JSON.stringify({
          senderId: senderId,
          message: message.value,
        }))

        // 데이터베이스에 메시지 저장
        const response = await axios.post("http://localhost:4000/chat/SoloWrite.do", {
          id: senderId,
          ruser: contactId,
          content: message.value,
        })
      } else {
        // 웹소켓이 연결되지 않은 경우, 데이터베이스에 메시지 저장
        const response = await axios.post("http://localhost:4000/chat/SoloWrite.do", {
          id: senderId,
          ruser: contactId,
          content: message.value,
        })
      }

      // 해당 연락처에 대한 채팅이 없으면 새로운 채팅을 생성 및 데이터베이스에 추가
      if (newchat.value === undefined) {
        database.value.chats.push({
          userId: contactId,
          unseenMsgs: 0,
          messages: [newMessageData],
        })

        // 새로운 채팅을 활성 채팅으로 설정합니다.
        newchat.value = database.value.chats[database.value.chats.length - 1]

        const newchatContact = chatsContacts.value.find(c => c.id === contactId)

        chatsContacts.push({
          ...newchatContact,
          chat: newchat,
        })
        if (newchat.value) {
          newchat.value.chat = newchat
        }
      }
      else {
        // 채팅이 이미 있다면, 새 메시지를 채팅에 추가합니다.
        if (newchat.value && newchat.value.messages) {
          newchat.value.messages.push(newMessageData)
        }
      }
     
      // 활성 연락처에 대한 마지막 메시지 설정
      const contact = chatsContacts.value.find(c => {
        if (newchat.value)
          return c.userId === newchat.value.contact.userId

        return false
      })

      if (contact && contact.chat) {
        contact.chat.lastMessage = newMessageData
      }

      // 메시지 보내는 란 초기화
      msg.value = ''

      // 스크롤을 아래로 내리기
      await nextTick()
      scrollToBottomInChatLog()

    } catch (error) {
      console.error(`데이터를 가져오는데 실패했습니다: ${error}`)
    }
  }

})


// 친구 클릭시 열리는 채팅방
const startConversation = () => {
  if (vuetifyDisplays.mdAndUp.value)
    return
  isLeftSidebarOpen.value = true
}


const openChatOfContact = async userId => {
  const chat = database.value.chats.find(c => c.userId === userId)

  console.log("userId----", userId)
  console.log("chat-----------------------------------------------", chat)

  if (chat) {
    chat.messages.forEach((msg, index) => {
      console.log(`Message ${index + 1}:`, msg.message)
    })
    chat.unseenMsgs = 0
  }

  newchat.value = {
    chat: chat ? chat : {
      userId: userId,
      unseenMsgs: 0,
      messages: [
        {
          message: '',
          time: '',
          senderId: connetId,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true,
          },
        },
      ],
    },
    contact: database.value.contacts.find(c => c.id === userId),
  }

  console.log("newchat", newchat.value)

  // 메세지 초기화
  msg.value = ''

  // 채팅 및 연락처 왼쪽 사이드바 닫기
  if (vuetifyDisplays.smAndDown.value)
    isLeftSidebarOpen.value = false

  // 스크롤바 아래로 내리기
  await nextTick()
  scrollToBottomInChatLog()
}

// file input
const refInputEl = ref()
</script>

<template>
  <VLayout class="chat-app-layout bg-surface">
    <!-- 👉 Left sidebar   -->
    <VNavigationDrawer
      v-model="isLeftSidebarOpen"
      absolute
      touchless
      location="start"
      width="370"
      :temporary="$vuetify.display.smAndDown"
      class="chat-list-sidebar"
      :permanent="$vuetify.display.mdAndUp"
    >
      <ChatLeftSidebarContent
        v-model:isDrawerOpen="isLeftSidebarOpen"
        v-model:search="q"
        @open-chat-of-contact="openChatOfContact"
        @close="isLeftSidebarOpen = false"
      />
    </VNavigationDrawer>

    <!-- 👉 Chat content -->
    <VMain class="chat-content-container">
      <!-- 👉 Right content: Active Chat -->
      <div
        v-if="newchat"
        class="d-flex flex-column h-100"
      >
        <!-- 👉 Active chat header -->
        <div class="active-chat-header d-flex align-center text-medium-emphasis">
          <!-- Sidebar toggler -->
          <IconBtn
            class="d-md-none me-3"
            @click="isLeftSidebarOpen = true"
          >
            <VIcon icon="mdi-menu" />
          </IconBtn>

          <!-- avatar -->
          <VBadge
            dot
            location="bottom right"
            offset-x="3"
            offset-y="3"
            :color="resolveAvatarBadgeVariant(newchat.contact.status)"
            bordered
          >
            <VAvatar
              size="40"
              :variant="!newchat.contact.avatar ? 'tonal' : undefined"
              :color="!newchat.contact.avatar ? resolveAvatarBadgeVariant(newchat.contact.status) : undefined"
              class="cursor-pointer"
            >
              <VImg
                v-if="newchat.contact.avatar"
                :src="newchat.contact.avatar"
                :alt="newchat.contact.fullName"
              />
              <span v-else>{{ avatarText(newchat.contact.fullName) }}</span>
            </VAvatar>
          </VBadge>

          <div class="flex-grow-1 ms-4 overflow-hidden">
            <h6 class="text-base font-weight-regular text-medium-emphasis">
              {{ newchat.contact.fullName }}
            </h6>
            <span class="d-block text-sm text-truncate text-disabled">{{ newchat.contact.role }}</span>
          </div>
        </div>

        <VDivider />

        <!-- Chat log -->
        <PerfectScrollbar
          ref="chatLogPS"
          tag="ul"
          :options="{ wheelPropagation: false }"
          class="flex-grow-1"
        >
          <ChatLog
            :new-chat="newchat"
            :socket="socket"
          />
        </PerfectScrollbar>

        <!-- Message form -->
        <VForm
          class="chat-log-message-form mb-5 mx-5"
          @submit.prevent="sendMessage"
        >
          <VTextField
            :key="newchat?.contact.id"
            v-model="msg"
            variant="solo"
            class="chat-message-input"
            placeholder="메세지를 입력해주세요"
            autofocus
          >
            <template #append-inner>
              <IconBtn>
                <VIcon
                  icon="mdi-microphone-outline"
                  size="22"
                />
              </IconBtn>

              <IconBtn
                class="me-4"
                @click="refInputEl?.click()"
              >
                <VIcon
                  icon="mdi-attachment"
                  size="22"
                />
              </IconBtn>

              <VBtn @click="sendMessage">
                보내기
              </VBtn>
            </template>
          </VTextField>

          <input
            ref="refInputEl"
            type="file"
            name="file"
            accept=".jpeg,.png,.jpg,GIF"
            hidden
          >
        </VForm>
      </div>

      <!-- 👉 Start conversation -->
      <div
        v-else
        class="d-flex h-100 align-center justify-center flex-column"
      >
        <VAvatar
          size="109"
          class="elevation-3 mb-6 bg-surface"
        >
          <VIcon
            size="50"
            class="rounded-0 text-high-emphasis"
            icon="mdi-message-outline"
          />
        </VAvatar>
        <p
          class="mb-0 px-6 py-1 font-weight-medium text-lg elevation-3 rounded-xl text-high-emphasis bg-surface"
          :class="[{ 'cursor-pointer': $vuetify.display.smAndDown }]"
          @click="startConversation"
        >
          채팅방을 선택해주세요!
        </p>
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

  .chat-list-header,
  .active-chat-header {
    @extend %chat-header;
  }

  .chat-list-search {
    .v-field__outline__start {
      flex-basis: 20px !important;
      border-radius: 28px 0 0 28px !important;
    }

    .v-field__outline__end {
      border-radius: 0 28px 28px 0 !important;
    }

    @include layoutsMixins.rtl {
      .v-field__outline__start {
        flex-basis: 20px !important;
        border-radius: 0 28px 28px 0 !important;
      }

      .v-field__outline__end {
        border-radius: 28px 0 0 28px !important;
      }
    }
  }

  .chat-list-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
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

.chat-user-profile-badge {
  .v-badge__badge {
    /* stylelint-disable liberty/use-logical-spec */
    min-width: 12px !important;
    height: 0.75rem;
    /* stylelint-enable liberty/use-logical-spec */
  }
}
</style>
