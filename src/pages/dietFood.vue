<script setup>
import UserCategory from '@/components/dialogs/UserCategory.vue'
import RecipeView from '@/components/dialogs/recipe_view.vue'
import axios from '@axios'
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id
const isUpgradePlanDietPlan = ref(false)
const isCheckedRecipe = ref(false)
const isCheckedRestaurant = ref(false)
const isCategory = ref(false)
const isRecipe = ref(false)
const router = useRoute()
const connectionData = ref([])

const fetchProjectData = () => {
  if (router.params.tab === 'connections') {
    axios.get('/pages/profile', { params: { tab: router.params.tab } }).then(response => {
      connectionData.value = response.data
    })
  }
}

const choicecategory = ref('') // 선택된 값이 저장될 변수

const handleChoiceCategory = value => {
  choicecategory.value = value
  console.log('선택한 카테고리:', value)
}

const updatediet = ref('')

const handleRecipedatach = value =>{
  const { recipe, dietType } = value

  recipedatach.value[dietType] = recipe
  updatediet.value = dietType
  console.log('선택한 레시피:', recipedatach.value, '선택한 index:', updatediet.value)
}

const dietPlansList = [
  {
    desc: 'Standard - $99/month',
    title: '아침 메뉴',
    content: '아침 메뉴 설명',
    index: 0,
  },
  {
    desc: 'Basic - $0/month',
    title: '점심 메뉴',
    content: '점심 메뉴 설명',
    index: 1,
  },
  {
    desc: 'Enterprise - $499/month',
    title: '저녁 메뉴',
    content: '저녁 메뉴 설명',
    index: 2,
  },
]

const recipedata = ref([]) // 내 레시피 데이터
const selectedGroups = ref([])
const dietPlansListtype = ref('')

const getrecipe = async (connetId, choicecategory, index) =>{
  console.log('들어온 아이디와, 카테고리', connetId, choicecategory, index)
  await axios.get('http://localhost:4000/recipe/View.do', { params: { 'id': connetId, 'category': choicecategory } })
    .then(response => {
      // 음식명을 기준으로 데이터 묶기
      recipedata.value = response.data.reduce((acc, curr) => {
        const FOODNAMEAll = curr.FOODNAME
        if (acc[FOODNAMEAll]) {
          acc[FOODNAMEAll].push(curr)
        } else {
          acc[FOODNAMEAll] = [curr]
        }
        
        return acc // 콜백 함수에서 값을 반환하도록 수정
      }, {})
      console.log('그룹으로 묶였는지 확인 -> ', recipedata.value)
      selectedGroups.value = getRandomGroups()
      dietPlansListtype.value = index
      console.log('랜덤 추출값:', selectedGroups.value)
    })
}


// recipedata 배열에서 무작위로 5개 그룹을 선택하는 함수
const getRandomGroups = () => {
  // 객체를 배열로 변환
  const dataArray = Object.values(recipedata.value)

  // 배열을 무작위로 섞음
  const shuffled = dataArray.sort(() => 0.5 - Math.random())

  // 상위 5개 항목을 반환
  return shuffled.slice(0, 5)
}

const savedietFood = () => {
  // 저장할 데이터
  // 아침, 점심, 저녁 별로 데이터를 가공하여 저장
  const morningData = {
    connetId: connetId,
    mealType: '아침', // 아침 식사 유형
    foodName: recipedatach.value[0][0].FOODNAME, // 아침에 선택된 음식명
    recipeCode: recipedatach.value[0][0].RECIPE_CODE, // 아침에 선택된 레시피 코드
  }

  const lunchData = {
    connetId: connetId,
    mealType: '점심', // 점심 식사 유형
    foodName: recipedatach.value[1][0].FOODNAME, // 점심에 선택된 음식명
    recipeCode: recipedatach.value[1][0].RECIPE_CODE, // 점심에 선택된 레시피 코드
  }

  const dinnerData = {
    connetId: connetId,
    mealType: '저녁', // 저녁 식사 유형
    foodName: recipedatach.value[2][0].FOODNAME, // 저녁에 선택된 음식명
    recipeCode: recipedatach.value[2][0].RECIPE_CODE, // 저녁에 선택된 레시피 코드
  }

  console.log('아침 :', morningData)
  console.log('점심 :', lunchData)
  console.log('저녁 :', dinnerData)

  // // Axios를 사용하여 서버로 데이터를 전송
  // axios.post('/your-server-endpoint', dataToSave)
  //   .then(response => {
  //     // 성공적으로 저장된 경우의 처리
  //     console.log('데이터가 성공적으로 저장되었습니다.');
  //     // 저장 후에 필요한 작업을 여기에 추가할 수 있습니다
  //   })
  //   .catch(error => {
  //     // 저장 중에 발생한 오류 처리
  //     console.error('데이터 저장 중 오류가 발생했습니다:', error);
  //     // 오류 처리 방법에 따라 적절한 조치를 취할 수 있습니다
  //   });
}

const handleIconClicked = data => {
  const { connetId, choicecategory, index } = data

  getrecipe(connetId, choicecategory, index) // 클릭 이벤트 발생 시 getrecipe 함수 호출
}

watch(router, fetchProjectData, { immediate: true })
</script>

<template>
  <section>
    <VRow class="fill-height">
      <VCol cols="12">
        <VBtn
          block
          @click="isCategory = true"
        >
          카테고리
        </VBtn>
      </VCol>
      <VCol
        v-for="list in dietPlansList"
        :key="list.index"
        cols="12"
        md="4"
      >
        <VCard class="text-center">
          <VCardItem class="d-flex flex-column justify-center align-center">
            <VAvatar
              color="primary"
              variant="tonal"
              size="160"
              class="mb-2"
            >
              <VImg
                v-if="!(recipedatach[list.index] && recipedatach[list.index].length)"
                size="160px"
              />
              <VImg
                v-else
                style="height: 160px;"
                :src="recipedatach[list.index][0].RECIPE_IMG"
              />
            </VAvatar>
            <h6 class="text-h6">
              <span v-if="!(recipedatach[list.index] && recipedatach[list.index].length)">{{ list.title }}</span>
              <span v-else>{{ recipedatach[list.index][0].FOODNAME }}</span>
            </h6>
          </VCardItem>
          <VCardText>
            <span v-if="!(recipedatach[list.index] && recipedatach[list.index].length)">{{ list.content }}</span>
            <span v-else>{{ recipedatach[list.index][0].RECIPE_TITLE }}</span>
          </VCardText>
          <VCardText>
            <span v-if="!(recipedatach[list.index] && recipedatach[list.index].length)">레시피</span>
            <span
              v-else
              style="height: 450px;"
            >
              <div
                v-for="(gro, index) in recipedatach[list.index]"
                :key="index"
              >
                <div v-if="index == 0 && gro.RECIPE_SEQ && gro.RECIPE_SEQ.length > 0">
                  <br><strong style="margin: 0 20px;">[조리순서]</strong>
                  <div
                    style="max-height: 200px; overflow-y: auto;"
                    class="scrollbar"
                  >
                    <p
                      v-for="(seq, seqIndex) in gro.RECIPE_SEQ.split('||')"
                      :key="seqIndex"
                      style="margin: 10px 20px;"
                    >
                      {{ seqIndex + 1 }} ) {{ seq }}
                    </p>
                  </div>
                  <br>
                  <strong style="margin: 10px 20px;">[재료]</strong>
                </div>
                <span v-if="gro.FOODNAME">
                  - {{ gro.INGREDIENT }} - {{ gro.RI_AMOUNT }}
                </span>
              </div>
            </span>
          </VCardText>
          <VCardText class="justify-center">
            <VBtn
              variant="elevated"
              style=" width: 90px;margin-right: 5px;"
              @click="getrecipe(connetId, list.title == '아침 메뉴'? '양식': list.title == '점심 메뉴'?'찌개':'일상', list.index), isRecipe = true"
            >
              식단 재추천
            </VBtn>
            <VBtn
              variant="elevated"
              @click="isCheckedRestaurant = true"
            >
              음식점
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12">
        <VBtn
          block
          @click="savedietFood"
        >
          저장하기
        </VBtn>
      </VCol>
    </VRow>
    <UserCheckedRecipe v-model:isDialogVisible="isCheckedRecipe" />
    <UserFindRestaurant v-model:isDialogVisible="isCheckedRestaurant" />
    <UserCategory
      v-model:isDialogVisible="isCategory"
      :choicecategory="choicecategory"
      @update:choicecategory="handleChoiceCategory"
    />
    <RecipeView
      v-model:isDialogVisible="isRecipe"
      :recipedata="selectedGroups"
      :diet-plans-listtype="dietPlansListtype"
      :connet-id="connetId"
      @update:recipedatach="handleRecipedatach"
      @icon-clicked="handleIconClicked"
    />
  </section>
</template>

<style lang="scss">
  @use "@core/scss/template/libs/apex-chart.scss";
</style>
