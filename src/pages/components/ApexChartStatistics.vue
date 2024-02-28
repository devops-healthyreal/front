<script setup>
import axios from '@axios'
import { getRadialBarChartConfig } from '@core/libs/apex-chart/apexCharConfig'
import { computed, defineProps } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { useStore } from 'vuex'

const props = defineProps({
  checkedItems: Array,
  checkedExerciseItems: Array,
})

const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId=userInfo.value.id

// ----------------------------------------------------------------------------------------

const checkedItems = ref([])
const checkedExerciseItems = ref([])
const currentTab = ref('tab-1')

function handleDataFromChild(data) {
  checkedItems.value = data
  console.log(checkedItems.value)
  console.log('여기다')
}

function handleDataFromChildExer (data) {
  checkedExerciseItems.value = data
  console.log(checkedExerciseItems.value)
  console.log('여기다운동')
  console.log(Array.isArray(checkedExerciseItems.value))
}

//-----------------------------------------------------------------------------------------
onMounted(async () => { await setting() })

//-----------------------------------------------------------------------------------------
const setting = async () => {
  console.log(connetId)

  const response = await axios.post('http://localhost:4000/croom/implementationSetting.do', { id: connetId })

  console.log(response)
  if (response.status === 200) {
    const exerciseString = response.data.exercise 
    const eattingString = response.data.eatting


    if (exerciseString && exerciseString.length > 2 || eattingString && eattingString.length > 2) { 
      const exerciseArray = exerciseString.substring(1, exerciseString.length - 1).split(',').map(item => item.trim()) // "[B, D, L]" -> "B, D, L" -> ["B", "D", "L"]

      checkedExerciseItems.value = exerciseArray // 배열 할당
      console.log('이행률 데이터는---', response)
      console.log('checkedItems.value---', checkedExerciseItems.value)

      const eattingArray = eattingString.substring(1, eattingString.length - 1).split(',').map(item => item.trim())

      checkedItems.value = eattingArray // 배열 할당
      console.log('이행률 데이터는---', response)
      console.log('checkedItems.value---', checkedItems.value)
      
    }
  } else {
    console.error('이행률 데이터 가져오기 실패')
  }
}


//-----------------------------------------------------------------------------------------
const vuetifyTheme = useTheme()
const statisticsChartConfig = computed(() => getRadialBarChartConfig(vuetifyTheme.current.value))

const series = computed(() => {
  const result = Array.isArray(checkedItems.value) ? 100 * (checkedItems.value.length / 3) : 0
  const resultexr = Array.isArray(checkedExerciseItems.value) ? 100 * (checkedExerciseItems.value.length / 3) : 0

  console.log(result.toFixed(2))

  if (result % 1 === 0 && resultexr % 1===0)
    return [result, resultexr]
  else
    return [result.toFixed(2), resultexr.toFixed(2)]
})
</script>

<template>
  <VueApexCharts
    :key="series"
    type="radialBar"
    height="400"
    :options="statisticsChartConfig"
    :series="series"
  />

  <VTabs
    v-model="currentTab"
    grow
    stacked
  >
    <!-- 탭 목록 -->
    <VTab value="tab-1"> 
      <VIcon
        icon="mdi-food-fork-drink"
        class="mb-2"
      />
      <span>식단</span>
    </VTab>

    <VTab value="tab-2">
      <VIcon
        icon="mdi-dumbbell"
        class="mb-2"
      />
      <span>운동</span>
    </VTab>
  </VTabs>
  <VWindow
    v-model="currentTab"
    class="mt-5"
  >
    <!-- 식단쪽 이행률 체크 타임라인 -->
    <VWindowItem value="tab-1">
      <TimelineBasic 
        :checked-items="checkedItems"
        @sendData="handleDataFromChild"
      />
    </VWindowItem>
    <!-- 운동쪽 이행률 체크 타임라인 -->
    <VWindowItem value="tab-2">
      <TimelineBasicExercise
        :checked-exercise-items="checkedExerciseItems"
        @sendDataExer="handleDataFromChildExer"
      />
    </VWindowItem>
  </VWindow>
</template>
