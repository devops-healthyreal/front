<script setup>
import axios from '@axios'
import { defineEmits, defineProps, onMounted } from 'vue'

import { useStore } from 'vuex'

const props = defineProps({
  checkedItems: Array,
})

const emit = defineEmits(['sendData'])

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId=userInfo.value.id




// 여기에 checkedItem에 체크박스 value 저장 저장된 배열 [id].vue에 emit으로 데이터 보냄
const sendDataToParent = value => {
  const checkedItems = ref(props.checkedItems)

  console.log(value)
  if (checkedItems.value.includes(value)) {
    // 이미 포함된 경우 해당 값을 제거한 새 배열 생성
    console.log('배열에 있는'+checkedItems.value)
    checkedItems.value = checkedItems.value.filter(item => item !== value)
  } else {
    // 포함되지 않은 경우 해당 값을 추가
    checkedItems.value.push(value)
    console.log('전달하기 전'+checkedItems.value)
  }

  // 변경된 배열을 emit으로 전달
  emit('sendData', checkedItems.value)

  axios.post('http://localhost:4000/croom/implementationFood.do', { 
    foodCheckCount: checkedItems.value,
    id: connetId, 
  })
  console.log('여기도 갔나')
}






const dietinfo = ref([])

const getEatingRecord = async () => {
  console.log('체크해보자 : ')
  await axios.get('http://localhost:4000/Dietfood/DailyView.do', { params: { 'id': connetId } })
    .then(response => {
      if(response.data.length > 0){
        // 초기화
        dietinfo.value = [[], [], []]

        response.data.forEach(data => {
          if (data.mealType === '아침') {
            dietinfo.value[0] = data
          } else if (data.mealType === '점심') {
            dietinfo.value[1] = data
          } else if (data.mealType === '저녁') {
            dietinfo.value[2] = data
          }
        })
      }
      console.log('가져온 유저 Eating_Record', dietinfo.value)
    })
}

onMounted(async () => {
  await getEatingRecord()
  
  const isCheckedB = ref(false)
  const isCheckedL = ref(false)
  const isCheckedD = ref(false)

  if (props.checkedItems.includes('B')) {
    isCheckedB.value = true
  }
  if (props.checkedItems.includes('L')) {
    isCheckedL.value = true
  }
  if (props.checkedItems.includes('D')) {
    isCheckedD.value = true
  }
})
</script>

<template>
  <VCard title="식단 이행률">
    <VCardText>
      <VTimeline
        side="end"
        align="start"
        line-inset="8"
        truncate-line="both"
        density="compact"
      >
        <!-- SECTION Timeline Item: Interview Schedule -->
        <VTimelineItem
          size="x-small"
          dot-color="warning"
        >
          <!-- 👉 Header -->
          <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
            <span class="app-timeline-title">
              아침 식단
            </span>
            <span class="app-timeline-meta">{{ dietinfo[0]?.eating_foodname }}, kcal</span>
          </div>


          <!-- 👉 Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Person -->
          <div class="d-flex justify-space-between align-center flex-wrap">
            <!-- 👉 Avatar & Personal Info -->
            <span class="d-flex align-bottom mt-2">
              <div>
                <img
                  id="diaryImages"
                  :src="dietinfo[0]?.recipe_img"
                  style=" width: 400px; height: 300px; align-self: center; margin: 10px;"
                >
              </div>
            </span>

            <!-- 👉 Person Actions -->
            <div>
              <VCheckbox
                id="checkboxB"
                v-model="isCheckedB"
                color="warning"
                class="BCheckbox"
                value="B"
                :checked="isCheckedB"
                @click="sendDataToParent('B')"
              />
            </div>
          </div>
        </VTimelineItem>
        <!-- !SECTION -->

        <!-- !SECTION -->
        <VTimelineItem
          size="x-small"
          dot-color="warning"
        >
          <!-- 👉 Header -->
          <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
            <span class="app-timeline-title">
              점심 식단
            </span>
            <span class="app-timeline-meta">{{ dietinfo[1]?.eating_foodname }}, kcal</span>
          </div>


          <!-- 👉 Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Person -->
          <div class="d-flex justify-space-between align-center flex-wrap">
            <!-- 👉 Avatar & Personal Info -->
            <span class="d-flex align-bottom mt-2">
              <div>
                <img
                  id="diaryImages"
                  :src="dietinfo[1]?.recipe_img"
                  style=" width: 400px; height: 300px; align-self: center; margin: 10px;"
                >
              </div>
            </span>

            <!-- 👉 Person Actions -->
            <div>
              <VCheckbox
                id="checkboxL"
                v-model="isCheckedL"
                color="warning" 
                value="L"
                :checked="isCheckedL"
                @click="sendDataToParent('L')"
              />
            </div>
          </div>
        </VTimelineItem>

        <!-- !SECTION -->
        <VTimelineItem
          size="x-small"
          dot-color="warning"
        >
          <!-- 👉 Header -->
          <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
            <span class="app-timeline-title">
              저녁 식단
            </span>
            <span class="app-timeline-meta">{{ dietinfo[2]?.eating_foodname }}, kcal</span>
          </div>


          <!-- 👉 Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Person -->
          <div class="d-flex justify-space-between align-center flex-wrap">
            <!-- 👉 Avatar & Personal Info -->
            <span class="d-flex align-bottom mt-2">
              <div>
                <img
                  id="diaryImages"
                  :src="dietinfo[2]?.recipe_img"
                  style=" width: 400px; height: 300px; align-self: center; margin: 10px;"
                >
              </div>
            </span>

            <!-- 👉 Person Actions -->
            <div>
              <VCheckbox
                id="checkboxD"
                v-model="isCheckedD"
                color="warning" 
                value="D"
                :selecled="isCheckedD"
                @click="sendDataToParent('D')"
              />
            </div>
          </div>
        </VTimelineItem>
      </VTimeline>
    </VCardText>
  </VCard>
</template>
