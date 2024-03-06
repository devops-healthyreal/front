<script setup>
import { calendarEvents } from '/src/@fake-db/apps/exportData.js'
import { transcript } from '/src/pages/stt.js'

const date = new Date()
const toDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
const text = transcript


const jebal = () =>{
  console.log("타임라인이야 이거?", calendarEvents)
  console.log(toDay)
  console.log(calendarEvent[1])
  

}
</script>

<template>
  <VCard title="Daily Timeline">
    <VCardText>
      <VTimeline
        density="compact"
        align="start"
        line-inset="8"
        truncate-line="both"
      >
        <VTimelineItem
          v-for="calendarEvent in calendarEvents"
          
          :key="calendarEvent"
          dot-color="error"
          size="x-small"
        >
          <VCol v-if="calendarEvent.start.getDate()==toDay.getDate()">
            <div class="d-flex justify-space-between align-center flex-wrap">
              <h4 class="app-timeline-title me-1 mb-2">
                {{ calendarEvent.title }}
              </h4>
              <small class="app-timeline-meta text-no-wrap">Wednesday</small>
            </div>
            <p class="mb-0 app-timeline-text">
              {{ calendarEvent.extendedProps.description }}
              {{ calendarEvent.start.getDate() }}
            </p>
            <span class="d-flex align-center mt-2">
              <VIcon
                color="error"
                icon="mdi-file-pdf-box"
                class="me-1"
              />
              <span class="font-weight-medium text-sm">invoice.pdf {{ text }}</span>
            </span>
          </VCol>
        </VTimelineItem>
      </VTimeline>
    </VCardText>
  </VCard>
</template>
