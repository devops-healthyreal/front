<script setup>
import { getRadialBarChartConfig } from '@core/libs/apex-chart/apexCharConfig'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
const statisticsChartConfig = computed(() => getRadialBarChartConfig(vuetifyTheme.current.value))

const series = [
  50,
  75,
]
</script>

<template>
  <VueApexCharts
    type="radialBar"
    height="400"
    :options="statisticsChartConfig"
    :series="series"
  />
</template>
