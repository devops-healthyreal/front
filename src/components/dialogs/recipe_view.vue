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
    <!-- :width="$vuetify.display.smAndDown ? 'auto' : 650" -->
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
        <VTab v-for="(recipe, index) in recipedata" :key="index" :value="'tab-' + (index + 1)">
            <img :src="recipe.RECIPE_IMG" alt="레시피 사진" style="width:50px;height:50px;">
            <a :href="recipe.RECIPE_URL">                        
            <span>{{ recipe.FOODNAME }}</span>
            </a>
        </VTab>
        </VTabs>
        <VWindow v-model="currentTab" class="mt-5">
        <VWindowItem v-for="(recipe, index) in recipedata" :key="index" :value="'tab-' + (index + 1)">
            제목 : {{ recipe.RECIPE_TITLE }}
        </VWindowItem>
        </VWindow>
    </VCard>
    </VDialog>
</template>
          