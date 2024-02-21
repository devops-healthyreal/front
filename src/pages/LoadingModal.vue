<script setup>
import { defineProps, ref, watchEffect } from 'vue'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const isDialogVisible = ref(props.modelValue)

watchEffect(() => {
  if (props.modelValue !== isDialogVisible.value) {
    isDialogVisible.value = props.modelValue
  }
})

watchEffect(() => {
  if (props.modelValue !== isDialogVisible.value) {
    emit('update:modelValue', isDialogVisible.value)
  }
})
</script>

<template>
  <!-- Dialog Activator -->

  <!-- Dialog -->
  <VDialog
    v-model="isDialogVisible"
    width="300"
  >
    <VCard
      color="primary"
      width="300"
    >
      <VCardText class="pt-3">
        <p class="mb-2">
          비밀번호 변경하러 가는쥬우우웅
        </p>
        <VProgressLinear
          indeterminate
          class="mb-0"
        />
      </VCardText>
    </VCard>
  </VDialog>
</template>
