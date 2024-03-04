<script setup>
import axios from '@axios'
import { useRouter } from 'vue-router'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useStore } from 'vuex'

const props = defineProps({
  location: {
    type: null,
    required: false,
    default: 'bottom end',
  },
  noticlists: {
    type: Array,
    required: true,
  },
  noticflag: {
    type: Boolean,
    required: true,
  },
  getNoticList: {
    type: Function,
    required: true,
  },
  openViewPostMoadl: {
    type: Function,
    required: true,
  },
  submitEdit: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits([
  'read',
  'unread',
  'remove',
  'click:notification',
])

const router = useRouter()

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId=computed(() => userInfo.value.id)
const name = computed(() => store.state.userStore.userInfo ? store.state.userStore.userInfo.name : null)

function getTimeDiffString(triggerDate) {
  const triggerDateObj = new Date(triggerDate)
  const currentDate = new Date()
  const timeDiff = currentDate - triggerDateObj
  const minutes = Math.floor(timeDiff / (1000 * 60))

  if (minutes < 60) {
    return `${minutes}분 전`
  } else if (minutes < 24 * 60) {
    const hours = Math.floor(minutes / 60)
    
    return `${hours}시간 전`
  } else {
    const days = Math.floor(minutes / (24 * 60))
    
    return `${days}일 전`
  }
}

const updatenotic = async (notification, trigger_pk, index) => {
  if(notification.notic_type == 1){
    console.log('알림이 발생된 게시물', notification.bbs_no)

    // router.push({ name: 'ViewPostPage', params: { bno: notification.bbs_no }  })
  }else if(notification.notic_type == 2){
    console.log('알림이 발생된 게시물', notification.trigger_no)

    // router.push({ path: "/community_post", query: { bno: notification.trigger_no }  })
  }
  await axios.get('http://localhost:4000/Notic/Update.do', { params: { trigger_pk: trigger_pk } })
    .then(response => {
      console.log('성공')

      // checked_time 값을 업데이트하고 화면 갱신
      notification.checked_time = new Date()//사실상 DB에 들어간 값과 같은 값이다.
    })
    .catch(error => {
      console.log('실패', error)
    })
}

const removenotic = async trigger_pk => {
  console.log('지울 trigger_pk:', trigger_pk)
  await axios.get('http://localhost:4000/Notic/Delete.do', { params: { trigger_pk: trigger_pk } })
    .then(response => {
      console.log('응답 받음 - ', response.data)

      // 알림 목록에서 해당 알림을 제거합니다.
      props.noticlists.splice(
        props.noticlists.findIndex(notification => notification.trigger_pk === trigger_pk),
        1,
      )
    })  
}
</script>

<template>
  <IconBtn id="notification-btn">
    <VBadge
      v-show="noticflag"
      dot
      color="error"
      bordered
      offset-x="1"
      offset-y="1"
    >
      <VIcon icon="mdi-bell-outline" />
    </VBadge>
    <VIcon
      v-show="!noticflag"
      icon="mdi-bell-outline"
    />
    <VMenu
      activator="parent"
      width="380px"
      :location="props.location"
      offset="14px"
      :close-on-content-click="false"
    >
      <VCard class="d-flex flex-column">
        <!-- 👉 Header -->
        <VCardItem class="notification-section">
          <VCardTitle class="text-lg">
            '{{ name }}'님 알림 현황
          </VCardTitle>

          <template #append>
            <!--
              <IconBtn
              v-show="props.noticlists.length"
              @click="markAllReadOrUnread"
              > 
            -->
            <VIcon :icon="!isAllMarkRead ? 'mdi-email-outline' : 'mdi-email-open-outline' " />

            <!--
              <VTooltip
              activator="parent"
              location="start"
              >
              {{ !isAllMarkRead ? 'Mark all as unread' : 'Mark all as read' }}
              </VTooltip> 
            -->
            <!-- </IconBtn> -->
          </template>
        </VCardItem>

        <VDivider />

        <!-- 👉 Notifications list -->
        <PerfectScrollbar
          :options="{ wheelPropagation: false }"
          style="max-block-size: 23.75rem;"
        >
          <VList class="py-0">
            <template
              v-for="(notification, index) in noticlists"
              :key="index"
            >
              <VDivider v-if="index > 0" />
              <VListItem
                link
                lines="one"
                min-height="66px"
                class="list-item-hover-class"
                @click="updatenotic(notification, notification.trigger_pk, index)"
              >
                <!-- Slot: Prepend -->
                <!-- Handles Avatar: Image, Icon, Text -->
                <template #prepend>
                  <VListItemAction start>
                    <VAvatar
                      size="40"
                      :image="notification.pro_filepath"
                    />
                  </VListItemAction>
                </template>

                <VListItemTitle>
                  <VChip color="error">
                    {{ notification.notic_trigger_user }}
                  </VChip>
                  <small @click="openViewPostMoadl(notification.notic_type===1? notification.bbs_no : notification.trigger_no); submitEdit(notification.notic_type===1? notification.bbs_no : notification.trigger_no)">{{ notification.notic_type===1? '님께서 댓글을 달았습니다.': '님께서 좋아요를 눌렀습니다.' }}</small>
                </VListItemTitle>
                
                <!-- <VListItemSubtitle>{{ notification.ccomment }}</VListItemSubtitle> -->
                <span class="text-xs text-disabled">{{ getTimeDiffString(notification.notic_trigger_date) }}</span>

                <!-- Slot: Append -->
                <template #append>
                  <div class="d-flex flex-column align-center gap-4">
                    <VBadge
                      dot
                      :color="notification.checked_time == null ? 'primary' : '#a8aaae'"
                      :class="`${notification.checked_time !== null ? 'visible-in-hover' : ''} ms-1`"
                      @click.stop="updatenotic(notification,notification.trigger_pk, index)"
                    />

                    <div style="block-size: 28px; inline-size: 28px;">
                      <IconBtn
                        size="x-small"
                        class="visible-in-hover"
                        @click="removenotic(notification.trigger_pk)"
                      >
                        <VIcon
                          size="20"
                          icon="mdi-close"
                        />
                      </IconBtn>
                    </div>
                  </div>
                </template>
              </VListItem>
            </template>

            <VListItem
              v-show="!props.noticlists.length"
              class="text-center text-medium-emphasis"
              style="block-size: 56px;"
            >
              <VListItemTitle>No Notification Found!</VListItemTitle>
            </VListItem>
          </VList>
        </PerfectScrollbar>

        <VDivider />

        <!-- 👉 Footer -->
        <VCardText
          v-show="props.noticlists.length"
          class="notification-footer"   
          style="text-align: right;"       
        >
          <!-- <VBtn block> -->
          HealthyReal
          <!-- </VBtn> -->
        </VCardText>
      </VCard>
    </VMenu>
  </IconBtn>
</template>


<style lang="scss">
.notification-section {
  padding: 14px !important;
}

.notification-footer {
  padding-block: 0.9375rem !important;
}

.list-item-hover-class {
  .visible-in-hover {
    display: none;
  }

  &:hover {
    .visible-in-hover {
      display: block;
    }
  }
}
</style>
