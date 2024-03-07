<script setup>
import {
  blankEvent,
  useCalendar,
} from '@/views/apps/calendar/useCalendar'
import { useCalendarStore } from '@/views/apps/calendar/useCalendarStore'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'
import FullCalendar from '@fullcalendar/vue3'
import { computed, ref } from 'vue'

// Components
import CalendarEventHandler from '@/views/apps/calendar/CalendarEventHandler.vue'

const props = defineProps({
  connetId: {
    type: String,
    required: true,
  },
})


const store = useCalendarStore()

// 👉 Event
const event = ref(structuredClone(blankEvent))
const isEventHandlerSidebarActive = ref(false)

watch(isEventHandlerSidebarActive, val => {
  if (!val)
    event.value = structuredClone(blankEvent)

  // console.log(event.value)
})

const { isLeftSidebarOpen } = useResponsiveLeftSidebar()
const { refCalendar, calendarOptions, addEvent, updateEvent, removeEvent } = useCalendar(event, isEventHandlerSidebarActive, isLeftSidebarOpen)

// 👉 Check all
const checkAll = computed({
  get: () => store.selectedCalendars.length === store.availableCalendars.length,
  set: val => {
    if (val)
      store.selectedCalendars = store.availableCalendars.map(i => i.label)
    else if (store.selectedCalendars.length === store.availableCalendars.length)
      store.selectedCalendars = []
  },
})


/*
onMounted(async()=> await getData())

const Data = ref()
async function getData() {
  try {
    const response = await axios.post('http://localhost:4000/sch/seleteOne.do', { id: props.connetId })

    console.log("달력값 가져왔어??", response.data)
    Data.value = response.data

  } catch (error) {
    console.error(error)
  }
}
*/
const availableCalendars = ref([
  {
    color: 'success',
    label: '일정',
    value: 1,
  },
  {
    color: 'error',
    label: '아침',
    value: 2,
  },
  {
    color: 'warning',
    label: '점심',
    value: 3,
  },
  {
    color: '',
    label: '저녁',
    value: 4,
  },
  {
    color: 'info',
    label: '운동',
    value: 5,
  },
  {
    color: 'secondary',
    label: '경로',
    value: 6,
  },
])

const selectedCalendars = ref([])
</script>

<template>
  <div>
    <VCard>
      <!-- `z-index: 0` Allows overlapping vertical nav on calendar -->
      <VLayout style="z-index: 0;">
        <!-- 👉 Navigation drawer -->
        <VNavigationDrawer
          v-model="isLeftSidebarOpen"
          width="250"
          absolute
          touchless
          location="start"
          class="calendar-add-event-drawer"
          :temporary="$vuetify.display.mdAndDown"
        >
          <div class="pa-5 d-flex flex-column gap-y-8">
            <VBtn
              block
              @click="isEventHandlerSidebarActive = true"
            >
              Add event
            </VBtn>
            <div>
              <p class="text-sm text-uppercase text-medium-emphasis mb-3">
                Calendars
              </p>

              <div class="d-flex flex-column calendars-checkbox">
                <VCheckbox
                  v-model="checkAll"
                  label="View All"
                  color="secondary"
                />
                <VCheckbox
                  v-for="calendar in availableCalendars"
                  :key="calendar.label"
                  v-model="selectedCalendars"
                  :value="calendar.label"
                  :color="calendar.color"
                  :label="calendar.label"
                  class="pt-1"
                />
              </div>
            </div>
          </div>
        </VNavigationDrawer>
        <VMain>
          <VCard flat>
            <FullCalendar
              ref="refCalendar"
              :options="calendarOptions"
            />
          </VCard>
        </VMain>
      </VLayout>
    </VCard>
    <CalendarEventHandler
      v-model:isDrawerOpen="isEventHandlerSidebarActive"
      :event="event"
      @add-event="addEvent"
      @update-event="updateEvent"
      @remove-event="removeEvent"
    />
    <CalendarEventHandlerEdit
      v-model:isDrawerOpen="isEventHandlerSidebarActive"
      :event="event"
      @add-event="addEvent"
      @update-event="updateEvent"
      @remove-event="removeEvent"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/libs/full-calendar";

.calendars-checkbox {
  .v-label {
    color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
    opacity: var(--v-high-emphasis-opacity);
  }
}

.calendar-add-event-drawer {
  &.v-navigation-drawer:not(.v-navigation-drawer--temporary) {
    border-end-start-radius: 0.375rem;
    border-start-start-radius: 0.375rem;
  }
}
</style>

<style lang="scss" scoped>
.v-layout {
  overflow: visible !important;

  .v-card {
    overflow: visible;
  }
}
</style>
