<script setup>
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
    <VCol
      cols="10"
      class="dll"
    >
      <!-- 지식인 질문 부분 -->
      <VCol>
        <VCard
          cols="12"
          style="margin: 20px 10px;"
        >
          <!-- 👉 Collapsible -->
          <VCol style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <VIcon
              icon="mdi-help-circle-outline"
              color="success"
              style="font-size: 50px;"
            />
            <strong style="font-size: 20px;">지식인 질문삭제 어떻게 하나요?</strong>
          </VCol>
          <VCol>
            <p style="margin: 0 20px;">
              내용인데 뭘 넣어야할까요
            </p>
          </VCol>
          <VCol style="margin: 0 10px;">
            <VAvatar
              color="success"
              size="small"
            />
            <span style=" margin-left: 8px;font-size: 12px; font-weight: bold;"> 유저 이름 </span>
            <span style=" margin-left: 8px;font-size: 12px; font-weight: bold;">2024.02.25</span>
            <span style=" margin-left: 8px;font-size: 12px; font-weight: bold;">조회수</span>
          </VCol>
        </VCard>

        <!-- 답변달기 버튼 추가? 부분 -->
        <VCard
          cols="12"
          style="margin: 20px 10px;"
        >
          <VCol style="display: flex; justify-content: space-between;">
            <VCol>
              <span style="font-size: 14px; font-weight: bold;"> 답변하시면 내공 10점을 답변이 채택되면 내공 125점을 드립니다. </span>
            </VCol>
            <VBtn style="margin-top: 5px;">
              답변하기
            </VBtn> 
          </VCol>
        </VCard>


        <!-- 지식인 질문 부분 -->
        <VCard style="margin: 10px;">
          <!-- 답변해주는 유저의 사진 VAvatar에 넣어주시고 color 삭제해주세요. -->
          <VCard
            style="margin: 20px;"
            class="pointer-cursor"
          >
            <VCol style="display: flex; justify-content: space-between;">
              <VCol>
                <VRow>유저 이름</VRow>
                <VRow style="font-size: 12px;">
                  <span>채택 답변 수</span>.<span>받은감사수</span>
                </VRow>
              </VCol>
              <VAvatar
                size="large"
                color="success"
              />
            </VCol>
          </VCard>

          <!-- props로 지식인 내용 먼저 좀 뿌려주시면 될 것 같습니다 -->
          <VCol>
            <p style="margin: 0 20px;">
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
            </p>
          </VCol>
          <VCol style="margin: 30px 50px 0;">
            <VChip
              color="warning"
              size="small"
            >
              <VIcon
                start
                icon="mdi-alert-circle-outline"
              />
              알아두세요!
            </VChip>
            <VCol style="margin-top: -12px;">
              <span style="font-size: 12px;">위 답변은 답변작성자가 경험과 지식을 바탕으로 작성한 내용입니다. 운동할 때 참고해주세요.</span>
            </VCol>
          </VCol>
          <VCol style="margin: 0 20px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 12px; font-weight: bold;">2024.02.25</span>
            </div>
          </VCol>
        </VCard>
      </VCol>
    </VCol>
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
