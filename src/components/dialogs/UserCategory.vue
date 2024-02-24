<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  choicecategory: {
    type: String,
    required: true,
  },
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
        style="margin-top: 50px;"
      >
        <VTab
          value="tab-1"
          @click="$emit('update:choicecategory', '육류')"
        >
          <VIcon
            icon="mdi-food-steak"
            class="mb-2"
          />
          <span>육류</span>
        </VTab>
      
        <VTab
          value="tab-2"
          @click="$emit('update:choicecategory', '양식')"
        >
          <VIcon
            icon="mdi-bread-slice"
            class="mb-2"
          />
          <span>양식</span>
        </VTab>
        
        <VTab
          value="tab-3"
          @click="$emit('update:choicecategory', '다이어트')"
        >
          <VIcon
            icon="mdi-egg-fried"
            class="mb-2"
          />
          <span>다이어트</span>
        </VTab>
      </VTabs>
      <VTabs
        v-model="currentTab"
        grow
        stacked
      >
        <VTab
          value="tab-4"
          @click="$emit('update:choicecategory', '영양식')"
        >
          <VIcon
            icon="mdi-seed"
            class="mb-2"
          />
          <span>영양식</span>
        </VTab>
      
        <VTab
          value="tab-5"
          @click="$emit('update:choicecategory', '일상')"
        >
          <VIcon
            icon="mdi-land-plots-circle-variant"
            class="mb-2"
          />
          <span>일상</span>
        </VTab>
        
        <VTab
          value="tab-6"
          @click="$emit('update:choicecategory', '찌개')"
        >
          <VIcon
            icon="mdi-beer"
            class="mb-2"
          />
          <span>찌개</span>
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
          