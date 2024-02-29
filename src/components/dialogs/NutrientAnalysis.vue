<script setup lang="ts">
import NutrientChart from '@/views/charts/apex-chart/NutrientChart.vue'
import CalorieChart from '@/views/charts/chartjs/CalorieChart.vue'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  bfood: {
    type: Array,
    required: true,
  },
  selectcurr: {
    type: String,
    required: true,
  },
  userdietinfo: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible'])

const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    max-width="1200"
    @update:model-value="dialogVisibleUpdate"
  >
    <VCard class="share-project-dialog pa-5 pa-sm-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="emit('update:isDialogVisible', false)"
      />
      <VRow>
        <VCol cols="6">
          <!-- 영양소 분석 -->
          <VCard 
            title="주요 영양소"
            :style="{'margin-top':'20px'}"
          >
            <NutrientChart :userdietinfo="userdietinfo" />
            <!-- 식단 테이블 -->
            <VTable
              height="250"
              class="text-center"
            >
              <thead>
                <tr>
                  <th class="text-center">
                    <VIcon icon="mdi-clock-time-five" />
                    &nbsp; 시간
                    <br>
                    recommend
                  </th>
                  <th class="text-center">
                    탄수화물 
                  </th>
                  <th class="text-center">
                    단백질
                  </th>
                  <th class="text-center">
                    지방
                  </th>
                  <th class="text-center">
                    나트륨
                  </th>
                  <th class="text-center">
                    콜레스트롤                 
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(item, index) in userdietinfo"
                  :key="index"
                >
                  <!-- <tr> -->
                  <td>
                    {{ item.ae_diettype }}
                  </td>
                  <td>
                    {{ item.carbohydrate }}
                  </td>
                  <td>
                    {{ item.protein }}
                  </td>
                  <td>
                    {{ item.fat }}
                  </td>
                  <td>
                    {{ item.sodium/1000 }}
                  </td>
                  <td>
                    {{ item.cholesterol/1000 }}
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCard>
        <!-- 영양소 분석 end -->
        </VCol>
        <VCol cols="6">
          <!-- 칼로리 분석 -->
          <VCard
            :style="{'margin-top':'20px'}"
            title="칼로리 분석"
          >
            <VCardItem>
              <CalorieChart :userdietinfo="userdietinfo" />
            </VCardItem>
            <!-- 칼로리 테이블 -->
            <VTable
              height="250"
              class="text-center"
              :style="{'margin-top':'15px'}"
            >
              <thead>
                <tr>
                  <th class="text-center">
                    <VIcon icon="mdi-clock-time-five" />
                    &nbsp; 시간
                  </th>
                  <th class="text-center">
                    칼로리
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(item, index) in userdietinfo"
                  :key="index"
                >
                  <td>
                    {{ item.ae_diettype }}
                  </td>
                  <td>
                    {{ item.calory }}
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCard>
        <!-- 칼로리 분석 ends -->
        </VCol>
      </VRow>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.share-project-dialog {
  .card-list {
    --v-card-list-gap: 1rem;
  }
}
</style>
