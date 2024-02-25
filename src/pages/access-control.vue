<script setup lang="ts">
import UserList from '@/views/apps/roles/UserList.vue'

const currentTab = ref(0)
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      sm="4"
    >
      <VTabs
        v-model="currentTab"
        direction="vertical"
        class="v-tabs-pill"
      >
        <VTab>
          <VIcon
            start
            icon="mdi-account-cancel-outline"
          />
          신고 유저
        </VTab>

        <VTab>
          <VIcon
            start
            icon="mdi-account-eye-outline"
            :size="22"
          />
          유저 관리
        </VTab>

        <VTab>
          <VIcon
            start
            icon="mdi-chart-arc"
            :size="22"
          />
          페이지 통계
        </VTab>
        <VTab>
          <VIcon
            start
            icon="mdi-instagram"
            :size="22"
          />
          게시글 관리
        </VTab>
      </VTabs>
    </VCol>

    <VCol
      cols="12"
      sm="8"
    >
      <VWindow v-model="currentTab">
        <VWindowItem>
          <div class="d-flex align-center mb-6">
            <VAvatar
              rounded
              color="primary"
              variant="tonal"
              class="me-3"
              size="large"
            >
              <VIcon
                :size="30"
                icon="mdi-account-cancel-outline"
              />
            </VAvatar>

            <div>
              <h6 class="text-h6">
                신고 유저 관리
              </h6>
              <span class="text-sm">Report user management</span>
            </div>
          </div>
        </VWindowItem>

        <VWindowItem>
          <div class="d-flex align-center mb-6">
            <VAvatar
              rounded
              color="primary"
              variant="tonal"
              class="me-3"
              size="large"
            >
              <VIcon
                :size="30"
                icon="mdi-account-eye-outline"
              />
            </VAvatar>

            <div>
              <h6 class="text-h6">
                유저 관리
              </h6>
              <span class="text-sm">User Management</span>
            </div>
          </div>
          <VCol cols="12">
            <UserList />
          </VCol>
        </VWindowItem>

        <VWindowItem>
          <div class="d-flex align-center mb-6">
            <VAvatar
              rounded
              color="primary"
              variant="tonal"
              class="me-3"
              size="large"
            >
              <VIcon
                :size="30"
                icon="mdi-account-eye-outline"
              />
            </VAvatar>

            <div>
              <h6 class="text-h6">
                페이지 통계
              </h6>
              <span class="text-sm">page statistics</span>
            </div>
          </div>
        </VWindowItem>
        <VWindowItem>
          <div class="d-flex align-center mb-6">
            <VAvatar
              rounded
              color="primary"
              variant="tonal"
              class="me-3"
              size="large"
            >
              <VIcon
                :size="30"
                icon="mdi-account-eye-outline"
              />
            </VAvatar>

            <div>
              <h6 class="text-h6">
                게시글 관리
              </h6>
              <span class="text-sm">Post Management</span>
            </div>
          </div>
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>
