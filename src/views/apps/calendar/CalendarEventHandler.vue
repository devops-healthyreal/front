<script setup>
import axios from '@axios'
import {
  requiredValidator,
} from '@validators'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import { useCalendarStore } from './useCalendarStore'
import { startRecognition, transcript } from '/src/pages/stt.js'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  event: {
    type: null,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'addEvent',
  'updateEvent',
  'removeEvent',
])

const store = useCalendarStore()
const refForm = ref()


// 👉 Event
const event = ref(JSON.parse(JSON.stringify(props.event)))

const resetEvent = () => {
  event.value = JSON.parse(JSON.stringify(props.event))
  nextTick(() => {
    refForm.value?.resetValidation()
  })
}

watch(() => props.isDrawerOpen, resetEvent)

const removeEvent = () => {
  emit('removeEvent', event.value.id)

  // Close drawer
  emit('update:isDrawerOpen', false)
}

const handleSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      console.log(event.value)
      
      const url = 'http://localhost:4000/Calendar'

      const data = event.value

      console.log(data)
      axios.post(url, data)
        .then(response => {
          // 요청이 성공적으로 완료된 경우의 처리
          console.log(response.data)
          console.log("dkdkdkdk")

          // 추가적인 작업 수행 가능
        })
        .catch(error => {
          // 요청이 실패한 경우의 처리
          console.error(error)

          // 에러 처리 및 추가 작업 수행 가능
        })

      // If id exist on id => Update event
      if ('id' in event.value)
        emit('updateEvent', event.value)

      // Else => add new event
      else
        emit('addEvent', event.value)

      // Close drawer
      emit('update:isDrawerOpen', false)
    }
  })
}

// 👉 Form
const onCancel = () => {

  // Close drawer
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    resetEvent()
    refForm.value?.resetValidation()
  })
}

const startDateTimePickerConfig = computed(() => {
  const config = {
    enableTime: !event.value.allDay,
    dateFormat: `Y-m-d${ event.value.allDay ? '' : ' H:i' }`,
  }

  if (event.value.end)
    config.maxDate = event.value.end
  
  return config
})

const endDateTimePickerConfig = computed(() => {
  const config = {
    enableTime: !event.value.allDay,
    dateFormat: `Y-m-d${ event.value.allDay ? '' : ' H:i' }`,
  }

  if (event.value.start)
    config.minDate = event.value.start
  
  return config
})

// transcript의 값이 변경될 때 userInput의 값을 업데이트
watch(transcript, newValue => {
  userInput.value = `${newValue} ${userInput.value}`
})

const title = ref('')
const calendar = ref('')
const start = ref('')
const end = ref('')
const userInput = ref('')

const startArea = reactive({
  address: '',
})

const endArea = reactive({
  address: '',
})


/*
const response =  axios.post('http://localhost:4000/sch/insert.do', {
  title: title,
  calendar: calendar,
  start: start,
  end: end,
  area: area,
  content: userInput.value

})
*/

const handleUpdateAddressStart = newAddress => {
  startArea.address = newAddress.address
}

const handleUpdateAddressEnd = newAddress => {
  endArea.address = newAddress.address
}
</script>

<template>
  <VNavigationDrawer
    temporary
    location="end"
    :model-value="props.isDrawerOpen"
    width="420"
    class="scrollable-content"
    @update:model-value="(val) => $emit('update:isDrawerOpen', val)"
  >
    <!-- 👉 Header -->
    <AppDrawerHeaderSection
      :title="event.id ? 'Update Event' : 'Add Event'"
      @cancel="$emit('update:isDrawerOpen', false)"
    >
      <template #beforeClose>
        <IconBtn
          v-show="event.id"
          @click="removeEvent"
        >
          <VIcon
            size="18"
            icon="mdi-trash-can-outline"
          />
        </IconBtn>
      </template>
    </AppDrawerHeaderSection>

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- SECTION Form -->
          <VForm
            ref="refForm"
            @submit.prevent="handleSubmit"
          >
            <VRow>
              <!-- 👉 Title -->
              <VCol cols="12">
                <VTextField
                  v-model="title"
                  label="Title"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Calendar -->
              <VCol cols="12">
                <VSelect
                  v-model="calendar"
                  label="Calendar"
                  :rules="[requiredValidator]"
                  :items="store.availableCalendars"
                  :item-title="item => item.label"
                  :item-value="item => item.value"
                >
                  <template #selection="{ item }">
                    <div
                      v-show="event.calendar"
                      class="align-center"
                      :class="event.calendar ? 'd-flex' : ''"
                    >
                      <VBadge
                        :color="item.raw.color"
                        inline
                        dot
                        class="pa-1"
                      />
                      <span>{{ item.raw.label }}</span>
                    </div>
                  </template>
                </VSelect>
              </VCol>

              <!-- 👉 Start date -->
              <VCol cols="12">
                <AppDateTimePicker
                  :key="JSON.stringify(startDateTimePickerConfig)"
                  v-model="start"
                  :rules="[requiredValidator]"
                  label="Start date"
                  :config="startDateTimePickerConfig"
                />
              </VCol>

              <!-- 👉 End date -->
              <VCol cols="12">
                <AppDateTimePicker
                  :key="JSON.stringify(endDateTimePickerConfig)"
                  v-model="end"
                  :rules="[requiredValidator]"
                  label="End date"
                  :config="endDateTimePickerConfig"
                />
              </VCol>

              <!-- 👉 Location -->
              <VCol cols="12">
                <AddressApiStart
                  v-model="startArea"
                  :new-address="startArea" 
                  @update-address="handleUpdateAddressStart"
                />
                <AddressApiEnd
                  v-model="endArea"
                  :new-address="endArea" 
                  @update-address="handleUpdateAddressEnd"
                />
              </VCol>

              <!-- 👉 Description -->
              <VCol cols="12">
                <VBtn
                  id="startBtn"
                  class="d-flex flex-column align-end front-z-axis"
                  style=" z-index: 9999; height: 45px; margin-top: 80px;margin-left: 295px;"
                  variant="tonal"
                  @click="startRecognition"
                >
                  <VIcon
                    size="x-large"
                    icon="mdi-microphone-outline"
                    color="success"
                  />
                </VBtn>
                <VTextarea
                  v-model="userInput"
                  label="content"
                  style="margin-top: -140px;"
                  no-resize
                />
              </VCol>
              

              <!-- 👉 Form buttons -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Submit
                </VBtn>
                <VBtn
                  variant="tonal"
                  color="secondary"
                  @click="onCancel"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        <!-- !SECTION -->
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>

