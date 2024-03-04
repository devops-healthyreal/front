<script setup>
import AppStepper from '@/@core/components/AppStepper.vue'

const time=ref(60)

const numberedSteps = [
  {
    title: '스쿼트',
  },
  {
    title: '벤치 프레스',
  },
  {
    title: '데드 리프트',
  },
]

const exerciseSteps = [
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
]


const currentExerciseStep = ref(0)  // 운동 단계를 추적하는 변수
const currentNumberedStep = ref(0)  // numberedSteps 단계를 추적하는 변수
const isRestTime = ref(false) 

let countDownInterval = null  // 카운트다운 인터벌 저장 변수

const startTimer = () => {
  if (currentExerciseStep.value === exerciseSteps.length) {  // 모든 세트가 끝났으면
    currentExerciseStep.value = 0  // 세트를 초기화
    
    return  // 함수 종료 (타이머 시작하지 않음)
  }
  
  countDownInterval = setInterval(() => {
    if (time.value > 0) {
      time.value--
    } else {
      if (isRestTime.value) {
        isRestTime.value = false
        time.value = 60
      } else {
        currentExerciseStep.value++
        if (currentExerciseStep.value >= exerciseSteps.length) {  // 모든 세트가 끝났으면
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
                <strong style="width: 90%; margin-right: 35%; margin-left: 5%; color: black; font-size: 25px;">
                  <VIcon icon="mdi-clock-time-eight" />
                  {{ isRestTime ? 'Rest time' : 'Exercise' }}  <!-- 휴식 시간인지 운동 시간인지 표시 -->
                </strong>
                <strong
                  id="sec"
                  style=" margin-top: 10px;color: black;font-size: 25px;"
                >
                  {{ time }}
                </strong>
                <VBtn
                  style="margin-left: 420px;"
                  @click="startTimer"
                >
                  시작하기
                </VBtn>
              </VCol>
              <br>
              <hr :style="{'width':'90%','margin':'auto'}">
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
