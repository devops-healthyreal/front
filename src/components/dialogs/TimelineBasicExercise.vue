<script setup>
import food3 from '@images/Unbalanced/22.jpg'
import food2 from '@images/margherita.jpg'
import food from '@images/veggieroll.jpg'
</script>

<template>
  <VCard title="운동 이행률">
    <VCardText>
      <VTimeline
        side="end"
        align="start"
        line-inset="8"
        truncate-line="both"
        density="compact"
      >
        <!-- SECTION Timeline Item: Interview Schedule -->
        <VTimelineItem
          size="x-small"
          dot-color="info"
        >
          <!-- 👉 Header -->
          <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
            <span class="app-timeline-title">
              운동 1
            </span>
            <span class="app-timeline-meta">운동명, 시간당 소모칼로리</span>
          </div>


          <!-- 👉 Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Person -->
          <div class="d-flex justify-space-between align-center flex-wrap">
            <!-- 👉 Avatar & Personal Info -->
            <span class="d-flex align-bottom mt-2">
              <div>
                <img
                  id="diaryImages"
                  :src="food"
                  style=" width: 400px; height: 300px; align-self: center; margin: 10px;"
                >
              </div>
            </span>

            <!-- 👉 Person Actions -->
            <div>
              <VCheckbox color="info" />
            </div>
          </div>
        </VTimelineItem>
        <!-- !SECTION -->

        <!-- !SECTION -->
        <VTimelineItem
          size="x-small"
          dot-color="info"
        >
          <!-- 👉 Header -->
          <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
            <span class="app-timeline-title">
              운동 2
            </span>
            <span class="app-timeline-meta">운동명, 시간당 소모칼로리</span>
          </div>


          <!-- 👉 Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Person -->
          <div class="d-flex justify-space-between align-center flex-wrap">
            <!-- 👉 Avatar & Personal Info -->
            <span class="d-flex align-bottom mt-2">
              <div>
                <img
                  id="diaryImages"
                  :src="food2"
                  style=" width: 400px; height: 300px; align-self: center; margin: 10px;"
                >
              </div>
            </span>

            <!-- 👉 Person Actions -->
            <div>
              <VCheckbox color="info" />
            </div>
          </div>
        </VTimelineItem>

        <!-- !SECTION -->
        <VTimelineItem
          size="x-small"
          dot-color="info"
        >
          <!-- 👉 Header -->
          <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
            <span class="app-timeline-title">
              운동 3
            </span>
            <span class="app-timeline-meta">운동명, 시간당 소모칼로리</span>
          </div>


          <!-- 👉 Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Person -->
          <div class="d-flex justify-space-between align-center flex-wrap">
            <!-- 👉 Avatar & Personal Info -->
            <span class="d-flex align-bottom mt-2">
              <div>
                <img
                  id="diaryImages"
                  :src="food3"
                  style=" width: 400px; height: 300px; align-self: center; margin: 10px;"
                >
              </div>
            </span>

            <!-- 👉 Person Actions -->
            <div>
              <VCheckbox color="info" />
            </div>
          </div>
        </VTimelineItem>
      </VTimeline>
    </VCardText>
  </VCard>
</template>
