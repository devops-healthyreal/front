<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  choicecategory: {
    type: String,
    required: true
  }
})


const emit = defineEmits(['update:isDialogVisible'])

const tabItemText = 'Biscuit cheesecake gingerbread oat cake tiramisu. Marzipan tiramisu jelly-o muffin biscuit jelly cake pie. Chocolate cookie candy croissant brownie cupcake powder cheesecake. Biscuit sesame snaps biscuit topping tiramisu croissant.'
const currentTab = ref('tab-1')
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650"
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
  >
    <VCard class="py-8">
      <VTabs
        v-model="currentTab"
        grow
        stacked
      >
        <VTab value="tab-1" @click="$emit('update:choicecategory', '육류')">
          <VIcon
            icon="mdi-food-steak"
            class="mb-2"
          />
          <span>육류</span>
        </VTab>
      
        <VTab value="tab-2" @click="$emit('update:choicecategory', '샌드위치')">
          <VIcon
            icon="mdi-bread-slice"
            class="mb-2"
          />
          <span>샌드위치</span>
        </VTab>
        
        <VTab value="tab-3" @click="$emit('update:choicecategory', '단백질')">
          <VIcon
            icon="mdi-egg-fried"
            class="mb-2"
          />
          <span>단백질</span>
        </VTab>
      </VTabs>
      <VTabs
        v-model="currentTab"
        grow
        stacked
      >
        <VTab value="tab-4" @click="$emit('update:choicecategory', '샐러드')">
          <VIcon
            icon="mdi-seed"
            class="mb-2"
          />
          <span>샐러드</span>
        </VTab>
      
        <VTab value="tab-5" @click="$emit('update:choicecategory', '도시락')">
          <VIcon
            icon="mdi-land-plots-circle-variant"
            class="mb-2"
          />
          <span>도시락</span>
        </VTab>
        
        <VTab value="tab-6" @click="$emit('update:choicecategory', '음료수')">
          <VIcon
            icon="mdi-beer"
            class="mb-2"
          />
          <span>음료수</span>
        </VTab>
      </VTabs>
      <VWindow
        v-model="currentTab"
        class="mt-5"
      >
        <VWindowItem
          v-for="i in 6"
          :key="i"
          :value="`tab-${i}`"
        >
          {{ tabItemText }}
        </VWindowItem>
      </VWindow>
    </VCard>
  </VDialog>
</template>
          