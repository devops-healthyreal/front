<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  participantsData: {
    type: Object,
    required: true,
  },
})

const isdropout = member => {
  console.log('강퇴할 유저:', member.name)
  member.dropout = true

  const index = membersList.indexOf(member)
  if (index > -1) {
    membersList.splice(index, 1)
    console.log(membersList)
  }
}
</script>

<template>
  <VCol>
    <VCard class="share-project-dialog pa-5 pa-sm-8">
      <VCardText cols="3">
        <VCol
          class="text-h5 text-center mb-3"
          style="margin-bottom: 20px; font-weight: bold; opacity: 0.7;"
        >
          참여자
        </VCol>
        <VCol class="card-list">
          <VCol
            v-for="participant in participantsData"
            :key="participant.ID"
          >
            <VRow>
              <VAvatar :image="participant.PRO_FILEPATH" />
              <VCol style="font-weight: bold;">
                {{ participant.ID }}
              </VCol>
              <!-- 초대 버튼 -->
              <VBtn
                id="myButton"
                size="small"
                style="align-self: center;"
                @click="isdropout(member)"
              >
                강퇴하기
              </VBtn>
            </VRow>
          </VCol>
        </VCol>
      </VCardText>
    </VCard>
  </VCol>
</template>

<style lang="scss">
.share-project-dialog {
  .card-list {
    --v-card-list-gap: 1rem;
  }
}
</style>
