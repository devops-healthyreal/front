<script setup>
import AppStepper from '@/@core/components/AppStepper.vue'
import { ref, watch } from 'vue'
import exerciseSample from '@/assets/video/exerciseSample.mp4'
import bench from '@/assets/video/bench.mp4'
import dead from '@/assets/video/dead.mp4'

let videoRef1 = ref(null)
let videoRef2 = ref(null)


const time=ref(60)

const numberedSteps = [
  {
    title: '스쿼트',
    videoSrc: exerciseSample,
  },
  {
    title: '벤치 프레스',
    videoSrc: bench,
  },
  {
    title: '데드 리프트',
    videoSrc: dead,
  },
]

const exerciseSteps =ref([
  {
    title: '1set',
    subtitle: '10회',
  },
  {
    title: '2set',
    subtitle: '10회',
  },
  {
    title: '3set',
    subtitle: '10회',
  },
  {
    title: '4set',
    subtitle: '10회',
  },
  {
    title: '5set',
    subtitle: '10회',
  },
])



const currentExerciseStep = ref(0)  // 운동 단계를 추적하는 변수
const currentNumberedStep = ref(0)  // numberedSteps 단계를 추적하는 변수
const isRestTime = ref(false) 

let countDownInterval = null  // 카운트다운 인터벌 저장 변수
const setCount = ref(5)
const repetitionCount = ref(10)

const changeVideoSrc = newSrc => {
  videoRef1.value.src = newSrc
}

const resetTimerAndSets = () => {
  time.value = 60
  setCount.value = 5
  repetitionCount.value = 10
  currentExerciseStep.value = 0
}

watch([setCount, repetitionCount], () => {
  exerciseSteps.value = Array.from({ length: setCount.value }, (_, i) => ({
    title: `${i + 1}set`,
    subtitle: `${repetitionCount.value}회`,
  }))
})


watch(currentNumberedStep, () => {
  const exercise = numberedSteps[currentNumberedStep.value]

  if (exercise) {
    changeVideoSrc(exercise.videoSrc)
    resetTimerAndSets()
  }
})

const UpdateExerciseSteps = () => {
  exerciseSteps.value = Array.from({ length: setCount.value }, (_, i) => ({
    title: `${i + 1}set`,
    subtitle: `${repetitionCount.value}회`,
  }))
}

const startTimer = () => {
  
  if (currentExerciseStep.value === setCount.value) {  // 세트 수만큼 운동했으면
    currentExerciseStep.value = 0  // 운동 단계를 초기화
    currentNumberedStep.value++  // 다음 운동으로 넘어감
    videoRef1.value.play()
    
    return  // 함수 종료 (타이머 시작하지 않음)
  }
  
  videoRef1.value.play()

  countDownInterval = setInterval(() => {
    if (time.value > 0) {
      time.value--
    } else {
      if (isRestTime.value) {
        isRestTime.value = false
        time.value = 60
      } else {
        currentExerciseStep.value++
        if (currentExerciseStep.value >= exerciseSteps.value.length) {  // 모든 세트가 끝났으면
          clearInterval(countDownInterval)  // 타이머 정지
          currentExerciseStep.value = 0  // 세트를 초기화
          
          return  // 함수 종료
        }
        isRestTime.value = true
        time.value = 30
      }
    }
  }, 1000)
}


const stopTimer = () => {
  clearInterval(countDownInterval)
  videoRef1.value.pause()
  videoRef2.value.pause()

}

//스위치
const toggleSwitch = ref('목록 on')
const toggleFalseSwitch = ref('목록 off')
const menuSize = ref('3')
const isVisible = ref(false)

const capitalizedLabel = label => {
  const convertLabelText = label.toString()

  console.log(convertLabelText.charAt(0).toUpperCase() + convertLabelText.slice(1))
  if(convertLabelText.charAt(0).toUpperCase() + convertLabelText.slice(1)=='True'){
    console.log('true')
    menuSize.value = 3
    isVisible.value= true
  }
  else {
    console.log('false')

    //menuSize.value = 0
    isVisible.value= false
  }
}
</script>

<template>
  <VContainer>
    <!-- fluid 속성 추가 -->
    <VRow>
      <VCol
        v-show="isVisible"
        :style="{'opacity':'0.7','position':'relative'}"
      >
        <!--
          <VDialog
          v-model="isVisible"
          :style="{'width':'100%'}"
          >
        -->
        <VCard>
          <!-- 운동 순서에 대한 메뉴창 -->
          <VCardItem>
            <AppStepper
              v-model:current-step="currentExerciseStep"
              direction="horizontal"
              :items="exerciseSteps"
              :style="{'height':'100%'}"
            />
            
            <VCardItem :style="{'margin-top':'10px'}">
              <VCol style="margin-bottom: -20px;">
                <VRow align="center">
                  <VCol cols="3">
                    <strong style="width: 90%; color: black; font-size: 25px;">
                      <VIcon icon="mdi-clock-time-eight" />
                      {{ isRestTime ? 'Rest time' : 'Exercise' }}  <!-- 휴식 시간인지 운동 시간인지 표시 -->
                    </strong>
                  </VCol>
                  <VCol cols="3">
                    <strong
                      id="sec"
                      style="color: black;font-size: 25px;"
                    >
                      {{ time }}
                    </strong>
                  </VCol>
                  <VCol cols="2">
                    <VTextField
                      v-model.number="setCount"
                      type="number"
                      label="세트 수"
                      variant="outlined"
                      @input="UpdateExerciseSteps"
                    />
                  </VCol>
                  <VCol cols="2">
                    <VTextField
                      v-model.number="repetitionCount"
                      type="number"
                      label="횟수"
                      variant="outlined"
                      @input="UpdateExerciseSteps"
                    />
                  </VCol>
                  <VCol cols="1">
                    <VBtn @click="startTimer">
                      시작하기
                    </VBtn>
                  </VCol>
                  <VCol cols="1">
                    <VBtn @click="stopTimer">
                      중지
                    </VBtn>
                  </VCol>
                </VRow>
                <br>
                <hr :style="{'width':'90%','margin':'auto'}">
              </vcol>
            </VCardItem>
          </vcarditem>
        </VCard>
      <!-- </VDialog> -->
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VLayout class="chat-app-layout bg-surface">
          <VCol
            cols="2"
            :style="{'background-color':'#FFFFF2'}"
          >
            <!-- 몇 세트인지에 대한 메뉴창 -->
            <VSwitch
              v-model="toggleSwitch"
              :label="capitalizedLabel(toggleSwitch)"
            />
            <p>자세측정 시작하기</p>

            <AppStepper
              v-model:current-step="currentNumberedStep"
              direction="vertical"
              :items="numberedSteps"
              :style="{'height':'80%'}"
            />
          </VCol> <!-- 몇 세트인지에 대한 메뉴창 end -->
    
          <!--  운동 순서에 대한 메뉴창 end -->
          <VCol cols="5">
            <!-- <VCol :cols="9-menuSize"> -->
            <!-- 운동 자세 영상 -->
            <video
              ref="videoRef1"
              controls
              muted 
              width="100%"
            > 
              <source
                src="@/assets/video/exerciseSample.mp4"
                type="video/mp4"
              >
            </video>
          </VCol> <!-- 운동 자세 영상 end -->
          <VCol cols="5">
            <!-- <VCol :cols="9-menuSize"> -->
            <!-- 운동 자세 영상 -->
            <video
              controls
              muted 
              width="100%"
            > 
              <source
                src="@/assets/video/exerciseSample.mp4"
                type="video/mp4"
              >
            </video>
          </VCol> 
        </VLayout>
      </vcol>
    </VRow>
  </VContainer>
</template>

<style lang="scss">
@use "@styles/variables/_vuetify.scss";
@use "@core/scss/base/_mixins.scss";
@use "@layouts/styles/mixins" as layoutsMixins;

// Variables
$chat-app-header-height: 68px;

// Placeholders
%chat-header {
  display: flex;
  align-items: center;
  min-block-size: $chat-app-header-height;
  padding-inline: 1rem;
}

.chat-app-layout {
  border-radius: vuetify.$card-border-radius;

  @include mixins.elevation(vuetify.$card-elevation);

  $sel-chat-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-chat-app-layout);
    }
  }

  .active-chat-user-profile-sidebar,
  .user-profile-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }

  .chat-list-header,
  .active-chat-header {
    @extend %chat-header;
  }

  .chat-list-search {
    .v-field__outline__start {
      flex-basis: 20px !important;
      border-radius: 28px 0 0 28px !important;
    }

    .v-field__outline__end {
      border-radius: 0 28px 28px 0 !important;
    }

    @include layoutsMixins.rtl {
      .v-field__outline__start {
        flex-basis: 20px !important;
        border-radius: 0 28px 28px 0 !important;
      }

      .v-field__outline__end {
        border-radius: 28px 0 0 28px !important;
      }
    }
  }

  .chat-list-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }
}

.chat-content-container {
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));

  // Adjust the padding so text field height stays 48px
  .chat-message-input {
    .v-field__append-inner {
      align-items: center;
      padding-block-start: 0;
    }

    .v-field--appended {
      padding-inline-end: 6px;
    }
  }
}

.chat-user-profile-badge {
  .v-badge__badge {
    /* stylelint-disable liberty/use-logical-spec */
    min-width: 12px !important;
    height: 0.75rem;
    /* stylelint-enable liberty/use-logical-spec */
  }
}
</style>
