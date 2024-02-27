<script setup>
import axios from '@axios'
import food3 from '@images/Unbalanced/22.jpg'
import food2 from '@images/margherita.jpg'
import food from '@images/veggieroll.jpg'
import { defineEmits, defineProps, ref } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  checkedExerciseItems: Array,
})

const emit = defineEmits(['sendDataExer'])
const checkedExerciseItems = ref([])

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId=userInfo.value.id

// 여기에 checkedItem에 체크박스 value 저장 저장된 배열 [id].vue에 emit으로 데이터 보냄
function sendDataToParent(value) {
  if (checkedExerciseItems.value.includes(value)) {
    // 이미 포함된 경우 해당 값을 제거한 새 배열 생성
    checkedExerciseItems.value = checkedExerciseItems.value.filter(item => item !== value)
  } else {
    // 포함되지 않은 경우 해당 값을 추가
    checkedExerciseItems.value.push(value)
    console.log('전달하기 전', checkedExerciseItems.value)
  }

  // 변경된 배열을 emit으로 전달
  emit('sendDataExer', checkedExerciseItems.value)

  axios.post('http://localhost:4000/croom/implementationFood.do', {
    foodCheckCount: checkedExerciseItems.value,
    id: connetId,
  })
  console.log('여기도 갔나')
}

const isChecked1 = ref(false)
const isChecked2 = ref(false)
const isChecked3 = ref(false)

onMounted(async () => { await setting() })

const setting = async () => {
  const response = await axios.post('http://localhost:4000/croom/implementationSetting.do', { id: connetId })
  if (response.status === 200) {
    const exerciseString = response.data.exercise // 문자열 "[B,D,L]"

    if (exerciseString && exerciseString.length > 2) { // 문자열이 "[B,D,L]" 형태보다 길 때만 처리
      const exerciseArray = exerciseString.substring(1, exerciseString.length - 1).split(',').map(item => item.trim()) // "[B, D, L]" -> "B, D, L" -> ["B", "D", "L"]

      checkedExerciseItems.value = exerciseArray // 배열 할당
      console.log('이행률 데이터는---', response)
      console.log('checkedItems.value---', checkedExerciseItems.value)
    }
    emit('sendDataExer', checkedExerciseItems.value)
  } else {
    console.error('이행률 데이터 가져오기 실패')
  }
}
</script>

<template>
  <VCard title="운동 이행률">
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
          dot-color="info"
        >
          <!-- 👉 Header -->
          <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
            <span class="app-timeline-title">
              운동 1
            </span>
            <span class="app-timeline-meta">운동명, 시간당 소모칼로리</span>
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
                  :src="food"
                  style=" width: 400px; height: 300px; align-self: center; margin: 10px;"
                >
              </div>
            </span>

            <!-- 👉 Person Actions -->
            <div>
              <VCheckbox
                v-model="isChecked1"
                color="info" 
                value="1"
                :checked="checkedExerciseItems.includes('1')"
                @click="sendDataToParent('1')"
              />
            </div>
          </div>
        </VTimelineItem>
        <!-- !SECTION -->

        <!-- !SECTION -->
        <VTimelineItem
          size="x-small"
          dot-color="info"
        >
          <!-- 👉 Header -->
          <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
            <span class="app-timeline-title">
              운동 2
            </span>
            <span class="app-timeline-meta">운동명, 시간당 소모칼로리</span>
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
                  :src="food2"
                  style=" width: 400px; height: 300px; align-self: center; margin: 10px;"
                >
              </div>
            </span>

            <!-- 👉 Person Actions -->
            <div>
              <VCheckbox
                v-model="isChecked2"
                :checked="checkedExerciseItems.includes('2')"
                color="info" 
                value="2"
                @click="sendDataToParent('2')"
              />
            </div>
          </div>
        </VTimelineItem>

        <!-- !SECTION -->
        <VTimelineItem
          size="x-small"
          dot-color="info"
        >
          <!-- 👉 Header -->
          <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
            <span class="app-timeline-title">
              운동 3
            </span>
            <span class="app-timeline-meta">운동명, 시간당 소모칼로리</span>
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
                  :src="food3"
                  style=" width: 400px; height: 300px; align-self: center; margin: 10px;"
                >
              </div>
            </span>

            <!-- 👉 Person Actions -->
            <div>
              <VCheckbox
                v-model="isChecked3"
                :checked="checkedExerciseItems.includes('3')"
                color="info" 
                value="3"
                @click="sendDataToParent('3')"
              />
            </div>
          </div>
        </VTimelineItem>
      </VTimeline>
    </VCardText>
  </VCard>
</template>
