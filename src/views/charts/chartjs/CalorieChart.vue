<script setup lang="ts">
import { getHorizontalBarChartConfig } from '@core/libs/chartjs/chartjsConfig'
import BarChart from '@core/libs/chartjs/components/BarChart'
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const props = defineProps({
  bfood: {
    type: Array,
    required: true,
  },
  selectcurr: {
    type: String,
    required: true,
  },
})

const vuetifyTheme = useTheme()

const chartOptions = computed(() => getHorizontalBarChartConfig(vuetifyTheme.current.value))

var currCalorie = 1000
var recommCalorie = 2100 //권장 칼로리
var barColor = '#87DBC6'
if (currCalorie.value > recommCalorie) {
  barColor = '#FD696E'
}
else if (currCalorie.value < recommCalorie) {
  barColor = '#A8FED7'
}

const data = {
  labels: [''],
  datasets: [
    {
      maxBarThickness: 30,
      label: '권장 칼로리',
      backgroundColor: '#87DBC6',
      borderColor: 'transparent',
      data: [recommCalorie],
    },
    {
      maxBarThickness: 30,
      backgroundColor: barColor,
      label: '누적 칼로리',
      borderColor: 'transparent',
      data: [props.bfood['calory']],
    },
  ],
}
</script>

<template>
  <BarChart
    :height="300"
    :chart-data="data"
    :bfood="bfood"
    :chart-options="chartOptions"
  />
</template>
