<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  recipedata: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible'])

const tabItemText = 'Biscuit cheesecake gingerbread oat cake tiramisu. Marzipan tiramisu jelly-o muffin biscuit jelly cake pie. Chocolate cookie candy croissant brownie cupcake powder cheesecake. Biscuit sesame snaps biscuit topping tiramisu croissant.'
const currentTab = ref('tab-1')

const closeModal = () => {
  // 모달 창을 닫는 로직을 작성합니다.
  emit('update:isDialogVisible', false);
}

</script>
<template>
    <VDialog
    width="1600"
    height="1600"
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
    >
    <VCard class="py-8" style="max-width: 100%; max-height: 100%;">
      <VCardActions class="justify-end">
        <VBtn icon @click="closeModal">
          <v-icon style="margin-top:-50px;">mdi-close</v-icon>
        </VBtn>
      </VCardActions>
        <VTabs v-model="currentTab" grow stacked>
        <VTab v-for="(group, index) in recipedata" :key="index" :value="'tab-' + (index+1)">
          <img :src="group[0].RECIPE_IMG" alt="레시피 사진" style="width:50px;height:50px;">
          <a :href="group[0].RECIPE_URL">
            {{group[0].FOODNAME}}
          </a>
        </VTab>
        </VTabs>
        <VWindow v-model="currentTab" class="mt-5">
          <VWindowItem v-for="(group, index) in recipedata" :key="index" :value="'tab-' + (index+1)">
              <strong>{{group[0].RECIPE_TITLE}}</strong>

              <div v-for="(gro, index) in group" :key="index">
                <div v-if="index == 0 && gro.RECIPE_SEQ && gro.RECIPE_SEQ.length > 0">
                  <br/>[조리순서]
                  <div style="max-height: 300px; overflow-y: auto;" class="scrollbar">
                    <p v-for="(seq, seqIndex) in gro.RECIPE_SEQ.split('||')" :key="seqIndex">
                      {{seqIndex + 1}} ) {{seq}}
                    </p>
                  </div>
                  <br/>
                  [재료]
                </div>
                
                <span v-if="gro.FOODNAME">
                  - {{ gro.INGREDIENT }} - {{gro.RI_AMOUNT}}
                </span>             
              </div>
          </VWindowItem>
        </VWindow>
    </VCard>
    </VDialog>
</template>

<style>
.scrollbar {
  overflow-y: scroll;
}

/* 스크롤바의 폭 너비 */
.scrollbar::-webkit-scrollbar {
  inline-size: 10px;
}

.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 10px; /* 스크롤바 둥근 테두리 */
  background: rgba(0, 220, 60); /* 스크롤바 색상 */
}

.scrollbar::-webkit-scrollbar-track {
  background: rgba(220, 20, 60, 10%);  /* 스크롤바 뒷 배경 색상 */
}
</style>