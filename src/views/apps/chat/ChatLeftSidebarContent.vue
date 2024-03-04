<script setup>
import ChatContact from '@/views/apps/chat/ChatContact.vue'
import useDatabase from '@/views/apps/chat/chatData.js'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useChat } from './useChat'
import { ref, computed, watch } from 'vue';

const props = defineProps({
  search: {
    type: String,
    required: true,
  },
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'openChatOfContact',
  'close',
  'update:search',
])

const online = {
  status: 'online',
}


const { database, chatsContacts, connetId } = useDatabase()


const { resolveAvatarBadgeVariant } = useChat()
const search = useVModel(props, 'search', emit)

// 필터링된 채팅 목록
const filteredChatsContacts = computed(() => {
  return chatsContacts.value.filter(contact => contact.fullName.includes(search.value))
})

// 필터링된 채팅 목록
const filteredContacts = computed(() => {
  return database.value.contacts.filter(contact => contact.fullName.includes(search.value))
})

watch(search, newVal => {
  console.log("데이터확인 ", database.value)  // 로그 출력
}, { immediate: true })
</script>

<template>
  <div
    v-if="database.profileUser"
    class="chat-list-header"
  >
    <VBadge
      dot
      location="bottom right"
      offset-x="3"
      offset-y="3"
      size="8"
      :color="resolveAvatarBadgeVariant(online.status)"
      bordered
    >
      <VAvatar
        size="40"
        class="cursor-pointer"
      >
        <VImg :src="database.profileUser.avatar" />
      </VAvatar>
    </VBadge>

    <VTextField
      :model-value="search"
      density="compact"
      placeholder="Search..."
      prepend-inner-icon="mdi-magnify"
      class="ms-4 me-1 chat-list-search"
      @update:model-value="$emit('update:search', $event)"
    />

    <IconBtn
      v-if="$vuetify.display.smAndDown"
      @click="$emit('close')"
    >
      <VIcon
        icon="mdi-close"
        class="text-medium-emphasis"
      />
    </IconBtn>
  </div>
  <VDivider />

  <PerfectScrollbar
    tag="ul"
    class="chat-contacts-list px-3"
    :options="{ wheelPropagation: false }"
  >
    <li>
      <span class="chat-contact-header d-block text-primary text-xl font-weight-medium">채팅 목록</span>
    </li>
    <ChatContact
      v-for="contact in filteredChatsContacts"
      :key="`chat-${contact.id}`"
      :user="contact"
      is-chat-contact
      @click="$emit('openChatOfContact', contact.id)"
    />
    <span
      v-show="!chatsContacts.length"
      class="no-chat-items-text text-disabled"
    >채팅중인 메세지가 없습니다</span>
    <li>
      <span class="chat-contact-header d-block text-primary text-xl font-weight-medium">친구 목록</span>
    </li>
    <ChatContact
      v-for="contact in filteredContacts"
      :key="`chat-${contact.id}`"
      :user="contact"
      @click="$emit('openChatOfContact', contact.id)"
    />
    <span
      v-show="!database.contacts.length && !database.isLoading"
      class="no-chat-items-text text-disabled"
    >친구 목록이 없습니다.</span>
  </PerfectScrollbar>
</template>

<style lang="scss">
.chat-contacts-list {
  --chat-content-spacing-x: 12px;

  padding-block-end: 0.75rem;

  .chat-contact-header {
    margin-block-end: 1rem;
    margin-block-start: 1.25rem;
  }

  .chat-contact-header,
  .no-chat-items-text {
    margin-inline: var(--chat-content-spacing-x);
  }
}
</style>
