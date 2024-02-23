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
  <VCard class="share-project-dialog pa-5 pa-sm-8">
    <VCardText>
      <h5 class="text-h5 text-center mb-3">
        참여자
      </h5>
      <br>
      <VList class="card-list">
        <VListItem
          v-for="participant in participantsData"
          :key="participant.ID"
        >
          <template #prepend>
            <VAvatar :image="participant.PRO_FILEPATH" />
          </template>

          <VListItemTitle class="text-sm">
            {{ participant.ID }}
          </VListItemTitle>
          
          <!-- 초대 버튼 -->
          <template #append>
            <VBtn
              id="myButton"
              @click="isdropout(member)"
            >
              강퇴하기
            </VBtn>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.share-project-dialog {
  .card-list {
    --v-card-list-gap: 1rem;
  }
}
</style>
