<script setup>
import UpdateExercise from '@/components/dialogs/UpdateExercise.vue'

const isUpgradeExercisePlan = ref(false)
const isCheckedRecipe = ref(false)
const isCheckedRestaurant = ref(false)
const isCategory = ref(false)

const router = useRoute()
const connectionData = ref([])



const fetchProjectData = () => {
  if (router.params.tab === 'connections') {
    axios.get('/pages/profile', { params: { tab: router.params.tab } }).then(response => {
      connectionData.value = response.data
    })
  }
}
</script>

<template>
  <section>
    <VRow class="fill-height">
      <VCol
        cols="7"
        class="dll"
      >
        <!-- 전체 화면의 왼쪽 -->
        <VCard 
          class="custom-scrollbar"
          style="height: 925px; overflow-y: auto;"
        >
          <!-- 참가비 시작 -->
          <VCol>
            <VBtn
              icon="mdi-text-box-edit-outline"
              color="success"
              variant="text"
            />
            <VCard
              v-for="data in 20"
              :key="data.index"
              cols="12"
              style="margin: 20px 10px;"
            >
              <!-- 👉 Collapsible -->
              <AppCardActions
                action-collapsed
                title="지식인 질문삭제 어떻게 하나요?"
              >
                <!-- VCard부분에 포인트 커서 해놨어요 click 이벤트로 이동시키면 됩니다 -->
                <VCard
                  style="margin: 10px;"
                  class="pointer-cursor"
                >
                  <!-- 답변해주는 유저의 사진 VAvatar에 넣어주시고 color 삭제해주세요. -->
                  <VCol>
                    <VAvatar
                      size="small"
                      color="success"
                    />
                    유저 이름
                  </VCol>

                  <!-- props로 지식인 내용 먼저 좀 뿌려주시면 될 것 같습니다 -->
                  <VCol
                    class="vcol-ellipsis"
                    style="height: 75px; font-size: 14px;"
                  >
                    지식인에서 질문을 삭제하려면 다음 단계를 따르면 됩니다:

                    ​

                    1. 지식인 홈페이지에 로그인하세요.

                    2. 삭제하려는 질문을 찾아 클릭하세요.

                    3. 질문 페이지에서 수정 버튼을 클릭하세요.

                    4. 수정 페이지에서 삭제 버튼을 클릭하세요.

                    5. 삭제를 확인하는 팝업 창이 나타나면 예를 선택하세요.

                    ​

                    답변을 삭제하려면 답변을 작성한 사용자만이 삭제할 수 있습니다. 답변을 삭제하려면 다음 단계를 따르면 됩니다:

                    ​

                    1. 지식인 홈페이지에 로그인하세요.

                    2. 삭제하려는 답변을 찾아 클릭하세요.

                    3. 답변 페이지에서 수정 버튼을 클릭하세요.

                    4. 수정 페이지에서 삭제 버튼을 클릭하세요.

                    5. 삭제를 확인하는 팝업 창이 나타나면 예를 선택하세요.

                    ​

                    이렇게 하면 질문이나 답변이 지식인에서 삭제됩니다.
                  </VCol>
                  <VCol>
                    <div style="display: flex; justify-content: space-between;">
                      <span style="font-size: 12px; font-weight: bold;">2024.02.25</span>
                      <strong style="color: #45d15a; font-size: 12px;">더보기</strong>
                    </div>
                  </VCol>
                </VCard>
              </AppCardActions>
            </VCard>
          </VCol>
        </VCard>
      </VCol>

      <!-- 지식인 끝 --> 

      <VCol cols="5">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/V1TzoKc99rE"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
        <VCard
          flat
          :max-width="auto"
          class="mt-1 mt-sm- pa-0 custom-scrollbar"
          style="height: 600px; overflow-y: auto;"
        >
          <VCol
            v-if="true"
            class="d-flex justify-center align-center"
            style="height: 300px;"
          >
            <!-- 게시물이 없을 때의 템플릿 -->
            <VCol
              class="d-flex flex-column align-center justify-center"
              style="height: 100%;"
            >
              <VCardTitle class="headline font-weight-bold">
                등록된 게시물이 없습니다
              </VCardTitle>
              <VCardText>새로운 게시물을 작성해보세요!</VCardText>
            </VCol>
          </VCol>
          <VCol
            v-if="true"
            class="d-flex justify-center align-center"
            style="height: 300px;"
          >
            <!-- 게시물이 없을 때의 템플릿 -->
            <VCol
              class="d-flex flex-column align-center justify-center"
              style="height: 100%;"
            >
              <VCardTitle class="headline font-weight-bold">
                등록된 게시물이 없습니다
              </VCardTitle>
              <VCardText>새로운 게시물을 작성해보세요!</VCardText>
            </VCol>
          </VCol>
          <VCol
            v-if="true"
            class="d-flex justify-center align-center"
            style="height: 300px;"
          >
            <!-- 게시물이 없을 때의 템플릿 -->
            <VCol
              class="d-flex flex-column align-center justify-center"
              style="height: 100%;"
            >
              <VCardTitle class="headline font-weight-bold">
                등록된 게시물이 없습니다
              </VCardTitle>
              <VCardText>새로운 게시물을 작성해보세요!</VCardText>
            </VCol>
          </VCol>
        </VCard>
      </VCol>
    </VRow>
    <VBtn
      block
      style="margin-top: 10px;"
      @click="isUpgradeExercisePlan = true"
    >
      운동 추천 받기
    </VBtn>
    <UpdateExercise v-model:isDialogVisible="isUpgradeExercisePlan" />
  </section>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";

.custom-scrollbar::-webkit-scrollbar {
  background-color: #f5f5f5;
  inline-size: 0;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #888;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.vcol-ellipsis {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
}
</style>

<style scoped>
.pointer-cursor {
  cursor: pointer;
}
</style>
