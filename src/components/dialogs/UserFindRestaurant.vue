<script setup>
import axios from '@axios'
import { useStore } from 'vuex'
import FoodMap from '../../pages/exercise/map/FoodMap.vue'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  searchRestaurant: {
    type: String,
    required: true,
  },
  searchindex: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible'])

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId=computed(() => userInfo.value.id)

const search = ref('')
const userarea = ref('강남구 ') //타임라인에서 위치정보값 받거나 유저의 default 주소
const prior_area = ref('')
const bsch = ref(0)
const lsch = ref(0)
const dsch = ref(0)

const getarea = async connetId => {

  await axios.get('http://localhost:4000/sch/priorAddress', { params: { id: connetId.value } })
    .then(response => {
      prior_area.value = response.data
      console.log('받은 스케줄', prior_area.value)

      // prior_area.value의 각 요소를 순회하며 cal이 2인 경우 bsch에 sno 값을 설정
      prior_area.value.forEach((item, index) => {
        if (item.cal === 2) {
          bsch.value = item.sno
        }else if(item.cal === 3){
          lsch.value = item.sno
        }else if(item.cal === 4){
          dsch.value = item.sno
        }
      })
    })
}


/////////////////////////////////////////////////////

const saverestaurant = async () => {
  console.log('저장하기 버튼 클릭', bsch.value, '|', lsch.value, '|', dsch.value)

  // 전체 주소를 띄워쓰기를 기준으로 자르고 배열로 만듭니다.
  const addressParts = restaurant.value.address_name.split(' ')

  console.log('주소 : ', addressParts)

  // 3번째와 4번째 값을 추출하여 roadPointName 배열에 추가합니다.
  const roadPointName = `${addressParts[2]} ${addressParts[3]}`

  console.log('roadPointName -', roadPointName)


  // roadPoint를 객체 배열로 만듭니다.
  const roadPoint = [
    { La: restaurant.value.x, Ma: restaurant.value.y },
  ]

  await axios.get('http://localhost:4000/sch/updateRestaurant', { params: {
    id: connetId.value,
    cal: props.searchindex==0? 2 : props.searchindex==1? 3 : 4,
    sno: props.searchindex==0? bsch.value : props.searchindex==1? lsch.value : dsch.value,
    sDest: restaurant.value.address_name,
  } })
    .then(response => {
      console.log('변경된 행 : ', response.data)
    })

  // await axios.post('http://localhost:4000/exercise/upload', JSON.stringify({
  //   id: connetId.value,
  //   time: 2,
  //   roadPoint: roadPoint,
  //   roadPointName: [roadPointName],
  // }), { headers: { 'Content-Type': 'application/json' } })
}

/////////////////////////////////////////////////////

const restaurant = ref('')

const handleRestaurant = restaurantSave =>{
  restaurant.value = restaurantSave
  console.log('선택한 정보', restaurant.value)
}

const Initialization = () =>{
  restaurant.value = ''
}

onMounted(()=>{
  getarea(connetId)
})
</script>

<template>
  <!-- 👉 upgrade plan -->
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650"
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
  >
    <VCard class="py-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="$emit('update:isDialogVisible', false), Initialization()"
      />

      <VCardItem>
        <div class="d-flex justify-between align-center">
          <div
            class="text-h5"
            style="margin:0 auto;"
          >
            <VCardTitle style="margin-left: 120px;">
              <strong>{{ searchindex == 0? '아침' : searchindex == 1? '점심' : '저녁' }} 음식점</strong>
            </VCardTitle>
          </div>
          <div class="justify-end">
            <VBtn
              color="warning"            
              @click="saverestaurant"
            >
              저장하기
            </VBtn>
          </div>
        </div>
        <!-- 실제로 동작은 FoodMap 안에 있는 검색창에서 -->
        <div class="text-center">
          <form>
            키워드 : <input
              id="keyword"
              type="text"
              :value="userarea+searchRestaurant"
              size="20"
              placeholder="검색어를 입력하세요"
              readonly
            > 
          </form>
        </div>
        <!--
          <VCardSubtitle>
          찾아서
          </VCardSubtitle> 
        -->
      </VCardItem>

      <VCardText class="d-flex align-center flex-column flex-sm-nowrap px-15">
        <FoodMap
          :search-restaurant="searchRestaurant"
          :userarea="userarea"
          @restaurantSave="handleRestaurant"
        />
        <!--
          <VBtn
          class="mt-5"
          @click="$emit('update:isDialogVisible', false)"
          >
          확인
          </VBtn> 
        -->
      </VCardText>
    </VCard>
  </VDialog>
</template>
