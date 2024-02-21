<script setup>
import UserCategory from '@/components/dialogs/UserCategory.vue'
import RecipeView from '@/components/dialogs/recipe_view.vue'
import axios from '@axios'
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId=userInfo.value.id

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

const dietPlansList = [
  {
    desc: 'Standard - $99/month',
    title: '아침 메뉴',
    content: '아침 메뉴 설명',
  },
  {
    desc: 'Basic - $0/month',
    title: '점심 메뉴',
    content: '점심 메뉴 설명',
  },
  {
    desc: 'Enterprise - $499/month',
    title: '저녁 메뉴',
    content: '저녁 메뉴 설명',
  },
]

const recipedata = ref([])//내 레시피 데이터

const getrecipe = async (connetId, foodname) =>{
  console.log('들어온 아이디와, 음식명', connetId, foodname)
  await axios.get('http://localhost:4000/recipe/View.do', { params: { 'id': connetId, 'foodname': foodname } })
    .then(response => {
    // recipedata.value = response.data;
    // console.log('가져온 레시피?',recipedata.value);

      // 음식명을 기준으로 데이터 묶기 // 필요 시, 한번 더 레시피 코드를 기준으로 데이터를 묶어야 할 것 같음    
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
    })
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
        :key="list"
        cols="12"
        md="4"
      >
        <VCard class="text-center">
          <VCardItem class="d-flex flex-column justify-center align-center">
            <VAvatar
              color="primary"
              variant="tonal"
              size="56"
              class="mb-2"
            >
              <VIcon
                size="2rem"
                icon="mdi-help-circle-outline"
              />
            </VAvatar>

            <h6 class="text-h6">
              <span>{{ list.title }}</span>
            </h6>
          </VCardItem>

          <VCardText>
            <span>{{ list.content }}</span>
          </VCardText>

          <VCardText class="justify-center">
            <VBtn
              variant="elevated" 
              style=" width: 90px;margin-right: 5px;"
              @click="getrecipe(connetId, list.title == '아침 메뉴'? '계란': list.title == '점심 메뉴'?'두부':'닭가슴살'), isRecipe = true"
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
      :recipedata="recipedata" 
    />
  </section>
</template>

<style lang="scss">
  @use "@core/scss/template/libs/apex-chart.scss";
</style>
