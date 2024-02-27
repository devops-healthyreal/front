<script lang="ts" setup>
import axios from '@axios'
import { getAreaChartSplineConfig } from '@core/libs/apex-chart/apexCharConfig'
import { computed, onMounted, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { useStore } from 'vuex'

const vuetifyTheme = useTheme()

const chartConfig = computed(() => getAreaChartSplineConfig(vuetifyTheme.current.value))
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id

const series=ref([])
const isDataLoaded = ref(false)
 
onMounted(async () => { await setting() })

const setting = async () => {
  const response = await axios.post('http://localhost:4000/Inbody/findAllInbody.do', { id: connetId })

  console.log("인바디 전체 데이타!!response.data:", response.data)
  console.log("response.data.map(item => item.inb_weight)", response.data.map(item => item.inb_weight))

  series.value = [
    {
      name: '체중',
      data: response.data.map(item => item.inb_weight),
    },
    {
      name: '골격근량',
      data: response.data.map(item => item.inb_smm),
    },
    {
      name: '체지방량',
      data: response.data.map(item => item.inb_bfm),
    },
    {
      name: 'BMI',
      data: response.data.map(item => item.inb_bmi),
    },
    {
      name: '체지방률',
      data: response.data.map(item => item.inb_pbf),
    },
  ]
  
  isDataLoaded.value = true
}
</script>

<template>
  <VueApexCharts
    type="area"
    height="400"
    :options="chartConfig"
    :series="series"
  />
</template>
