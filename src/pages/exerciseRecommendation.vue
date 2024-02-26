<script setup>
import UpdateExercise from '@/components/dialogs/UpdateExercise.vue'
import { useStore } from 'vuex'

const isUpgradeExercisePlan = ref(false)
const isCheckedRecipe = ref(false)
const isCheckedRestaurant = ref(false)
const isCategory = ref(false)

const router = useRoute()
const connectionData = ref([])

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id


const fetchProjectData = () => {
  if (router.params.tab === 'connections') {
    axios.get('/pages/profile', { params: { tab: router.params.tab } }).then(response => {
      connectionData.value = response.data
    })
  }
}

const kinCrawlingResult = ref([])

const handleCrawlingComplete = result => {
  kinCrawlingResult.value = result
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
            <!-- 👉 Search -->
            <AppSearchHeader
              v-model="faqSearchQuery"
              subtitle="찾고 싶은 단어를 작성해 주세요"
              :connet-id="connetId"
              custom-class="mb-7"
              @crawlingComplete="handleCrawlingComplete"
            />
            <!-- {{ kinCrawlingResult }} -->
            <!--
              <div v-if="kinCrawlingResult.length">
              <h2>Crawled Data:</h2>
              <ul>
              <li
              v-for="(item, index) in kinCrawlingResult"
              :key="index"
              >
              {{ item }}
              </li>
              </ul>
              </div> 
            -->
            <VCard
              v-for="(data, index) in kinCrawlingResult"
              :key="index"
              cols="12"
              style="margin: 20px 10px;"
            >
              <!-- 👉 Collapsible -->
              <AppCardActions
                action-collapsed
                :title="data.title"
                :hit="data.question_hit"
              >
                <small>{{ data.question_content }}</small>
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
                    <a :href="data.url"> 더 자세하게 보고싶어요</a>
                  </VCol>

                  <!-- props로 지식인 내용 먼저 좀 뿌려주시면 될 것 같습니다 -->
                  <VCol
                    class="vcol-ellipsis"
                    style="height: 75px; font-size: 14px;"
                  >
                    {{ data.answer_content }}
                  </VCol>
                  <VCol>
                    <div style="display: flex; justify-content: space-between;">
                      <span style="font-size: 12px; font-weight: bold;">{{ data.answer_date }}</span>
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
