<script setup>
import FoodMap from '../../pages/exercise/map/FoodMap.vue'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  searchRestaurant: {
    type: String,
    required: true,
  },
  searchindex: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible'])
const search = ref('')
const userarea = ref('강남구 ') //타임라인에서 위치정보값 받거나 유저의 default 주소

/////////////////////////////////////////////////////
const saverestaurant = async () => {
  console.log('저장하기 버튼 클릭')
}

/////////////////////////////////////////////////////
</script>

<template>
  <!-- 👉 upgrade plan -->
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650"
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
  >
    <VCard class="py-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="$emit('update:isDialogVisible', false)"
      />

      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-5">
          {{ searchindex == 0? '아침' : searchindex == 1? '점심' : '저녁' }} 음식점
        </VCardTitle>
        <VBtn
          color="warning"
          @click="saverestaurant"
        >
          저장하기
        </VBtn>
        <!-- 실제로 동작은 FoodMap 안에 있는 검색창에서 -->
        <div>
          <form>
            키워드 : <input
              id="keyword"
              type="text"
              :value="userarea+searchRestaurant"
              size="20"
              placeholder="검색어를 입력하세요"
              readonly
            > 
          </form>
        </div>
        <!--
          <VCardSubtitle>
          찾아서
          </VCardSubtitle> 
        -->
      </VCardItem>

      <VCardText class="d-flex align-center flex-column flex-sm-nowrap px-15">
        <FoodMap
          :search-restaurant="searchRestaurant"
          :userarea="userarea"
        />
        <!--
          <VBtn
          class="mt-5"
          @click="$emit('update:isDialogVisible', false)"
          >
          확인
          </VBtn> 
        -->
      </VCardText>
    </VCard>
  </VDialog>
</template>
