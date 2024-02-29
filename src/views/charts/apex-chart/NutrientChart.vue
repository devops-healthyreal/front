<script lang="ts" setup>
import { getRadarChartConfig } from '@core/libs/apex-chart/lsyApexCharConfig'
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

const props = defineProps({
  bfood: {
    type: Array,
    required: true,
  },
})

const vuetifyTheme = useTheme()


//오늘의 날짜 구하기
var today = new Date()
var year = today.getFullYear()
var month = ('0' + (today.getMonth() + 1)).slice(-2)
var day = ('0' + today.getDate()).slice(-2)
var dateString = year + '-' + month  + '-' + day

const series = [
  {
    name: dateString,

    // data: [65, 46, 42, 25, 58],
    data: [props.bfood['carbohydrate'], props.bfood['protein'], props.bfood['fat'], props.bfood['sodium']/1000, props.bfood['cholesterol']/1000],
  },
]

const chartConfig = computed(() => getRadarChartConfig(vuetifyTheme.current.value))
</script>

<template>
  <VueApexCharts
    type="radar"
    height="300"
    :options="chartConfig"
    :series="series"
  />
</template>
