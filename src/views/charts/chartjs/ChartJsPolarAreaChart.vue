<script setup lang="ts">
import type { ChartJsCustomColors } from '@/views/charts/chartjs/types';
import { getPolarChartConfig } from '@core/libs/chartjs/chartjsConfig';
import PolarAreaChart from '@core/libs/chartjs/components/PolarAreaChart';
import { useTheme } from 'vuetify';

interface Props {
  colors: ChartJsCustomColors
}

const props = defineProps<Props>()

const vuetifyTheme = useTheme()

const chartConfig = computed(() => getPolarChartConfig(vuetifyTheme.current.value))


//평소 섭취하는 영양소의 비율을 나타내고자한 차트에요 원하면 바꿔도 괜찮아요
const data = {
  labels: ['탄수화물', '단백질', '지방', '나트륨', '콜레스테롤'],
  datasets: [
    {
      borderWidth: 0,
      label: 'Population (millions)',
      data: [16, 17.5, 15, 13.5, 11],
      backgroundColor: [props.colors.primary, props.colors.yellow, props.colors.polarChartWarning, props.colors.polarChartInfo, props.colors.polarChartGrey],
    },
  ],
}
</script>

<template>
  <PolarAreaChart
    :height="400"
    :chart-data="data"
    :chart-options="chartConfig"
  />
</template>
