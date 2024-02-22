<script setup>
import {
  avatarText,
} from '@core/utils/formatters'

const props = defineProps({
  participantGroup: {
    type: Object,
    required: true,
  },
  goal: {
    type: String,
    required: true,
  },
  cstartDate: {
    type: String,
    required: true,
  },
  cendDate: {
    type: String,
    required: true,
  },
})

const isUserInfoEditDialogVisible = ref(false)
const isUpgradePlanDialogVisible = ref(false)

const resolveUserStatusVariant = stat => {
  if (stat === 'pending')
    return 'warning'
  if (stat === 'active')
    return 'success'
  if (stat === 'inactive')
    return 'secondary'
  
  return 'primary'
}

const getHourDifference = (date1, date2) => {
  const diff = Math.abs(new Date(date1) - new Date(date2))
  
  return diff / (1000 * 60 * 60)
}
</script>

<template>
  <VCol>
    <VRow>
      <!-- SECTION User Details -->
      <VCol
        v-for="(participant, index) in participantGroup"
        :key="index"
        cols="3"
      >
        <VCard>
          <VCardText class="text-center mt-12 mt-sm-0 pa-0">
            <!-- 👉 Avatar -->
            <VAvatar
              rounded="sm"
              :size="120"
              :color="!participant.PRO_FILEPATH ? 'primary' : undefined"
              :variant="!participant.PRO_FILEPATH ? 'tonal' : undefined"
            >
              <VImg
                v-if="participant.PRO_FILEPATH"
                :src="participant.PRO_FILEPATH"
                style="margin-top: 15px;"
              />
              <span
                v-else
                class="text-5xl font-weight-medium"
              >
                {{ avatarText(participant.ID) }}
              </span>
            </VAvatar>

            <!-- 👉 User fullName -->
            <VChip
              v-if="participant.CHALL_MANAGER === 'Y'"
              color="success"
              density="compact"
              style="margin-bottom: -10%;"
            >
              방장
            </VChip>
            <VChip
              v-else
              color="info"
              density="compact"
              style="margin-bottom: -10%;"
            >
              참여자
            </VChip>
            <h6 class="text-h6 mt-4">
              {{ participant.ID }}
            </h6>

            <!-- 👉 이행률 -->
            <VChip
              density="comfortable"
              class="text-capitalize mt-4"
              style=" margin-top: -5%;margin-bottom: 15px;"
            >
              {{
                (goal=='감량' || goal == '식단') ?
                  (((participantGroup.reduce((total, participant) => total + participant.EATING.length, 0) / 3) /
                    (getHourDifference(new Date(cendDate), new Date(cstartDate)) / 24 * 3 * participantGroup.length) * 100).toFixed(0)) :
                  (goal=='증가' || goal=='강화') ?
                    (((participantGroup.reduce((total, participant) => total + participant.EXERCISE.length, 0) / 3) /
                      (getHourDifference(new Date(cendDate), new Date(cstartDate)) / 24 * 3 * participantGroup.length) * 100).toFixed(0)) :
                    ((((participantGroup.reduce((total, participant) => total + participant.EXERCISE.length, 0) / 3) +
                      (participantGroup.reduce((total, participant) => total + participant.EATING.length, 0) / 3)) /
                      (getHourDifference(new Date(cendDate), new Date(cstartDate)) / 24 * 6 * participantGroup.length) * 100).toFixed(0))
              }}%
            </VChip>
          </VCardText>
        </VCard>
      </VCol>
    <!-- !SECTION -->
    </VRow>
  

    <!-- 👉 Edit user info dialog -->
    <UserInfoEditDialog
      v-model:isDialogVisible="isUserInfoEditDialogVisible"
      :user-data="props.userData"
    />

    <!-- 👉 Upgrade plan dialog -->
    <UserUpgradePlanDialog v-model:isDialogVisible="isUpgradePlanDialogVisible" />
  </vcol>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.current-plan {
  border: 2px solid rgb(var(--v-theme-primary));
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
