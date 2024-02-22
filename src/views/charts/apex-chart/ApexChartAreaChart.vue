<script lang="ts" setup>
import { getAreaChartSplineConfig } from '@core/libs/apex-chart/apexCharConfig'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()

const chartConfig = computed(() => getAreaChartSplineConfig(vuetifyTheme.current.value))

// data 하나하나가 그 달의 데이터라 보면 됩니다 간단하게 할 수 있을거라 믿어요!!
const series = [
  {
    name: '체중',
    data: [100, 120, 90, 170, 130, 160, 140, 240, 220, 180, 270, 280, 375],
  },
  {
    name: '골격근량',
    data: [60, 80, 70, 110, 80, 100, 90, 180, 160, 140, 200, 220, 275],
  },
  {
    name: '체지방량',
    data: [20, 40, 30, 70, 40, 60, 50, 140, 120, 100, 140, 180, 220],
  },
  {
    name: 'BMI',
    data: [23, 43, 40, 60, 83, 60, 30, 40, 80, 170, 140, 180, 220],
  },
  {
    name: '체지방률',
    data: [13, 15, 17, 28, 26, 30, 50, 110, 150, 90, 120, 100, 120],
  },
]
</script>

<template>
  <VueApexCharts
    type="area"
    height="400"
    :options="chartConfig"
    :series="series"
  />
</template>
