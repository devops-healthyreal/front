<script setup lang="ts">
import { getRadarChartConfig } from '@core/libs/chartjs/chartjsConfig'
import RadarChart from '@core/libs/chartjs/components/RadarChart'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()

const chartConfig = computed(() => getRadarChartConfig(vuetifyTheme.current.value))

//여기가 제일 귀찮을 거라 보는데 inbody 측정 결과를 여기로 가져와서 뿌려주고 
//밑에 평균이라 작성된 곳에 체중 몸무게 대비 평균 계산해서 넣어줘야 됩니다!!
const chartData = {
  labels: ['체중', '골격근량', '체지방량', 'BMI', '체지방률'],
  datasets: [
    {
      fill: true,
      label: '측정결과',
      borderColor: 'transparent',
      backgroundColor: 'rgba(134,229,127, 0.8)',
      data: [25, 59, 90, 81, 60],
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
    },
    {
      fill: true,
      label: '평균',
      borderColor: 'transparent',
      backgroundColor: 'rgba(155,136,250, 0.8)',
      data: [40, 100, 40, 90, 40],
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
    },
  ],
}
</script>

<template>
  <RadarChart
    :height="400"
    :chart-data="chartData"
    :chart-options="chartConfig"
  />
</template>
