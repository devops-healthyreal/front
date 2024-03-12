<script setup>
import AppStepper from '@/@core/components/AppStepper.vue'
import axios from '@axios'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import TestCam from './TestCam.vue'

const store = useStore()

const userId = computed(() => store.state.userStore.userInfo.id)


console.log('connectId', userId.value)

const time=ref(60)

const videoRef1 = ref('')
const videoRef2 = ref('')
const videoRef3 = ref('')

const numberedSteps = [
  {
    title: '운동1',
    videoSrc: videoRef1.value,
  },
  {
    title: '운동2',
    videoSrc: videoRef2.value,
  },
  {
    title: '운동3',
    videoSrc: videoRef3.value,
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

const videoUrl = ref('')


const currentExerciseStep = ref(0)  // 운동 단계를 추적하는 변수
const currentNumberedStep = ref(0)  // numberedSteps 단계를 추적하는 변수
const currentVideoSrc = ref('') // iframe에 표시될 현재 비디오의 URL

const isRestTime = ref(false) 

const userVideoRef = ref(null)

const fileInput = ref(null)
const state = reactive({ videoLoaded: false })

let countDownInterval = null  // 카운트다운 인터벌 저장 변수
const setCount = ref(5)
const repetitionCount = ref(10)
const evideoPath = ref('')


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
  console.log(`현재 단계: ${currentNumberedStep.value}`)

  const step = numberedSteps[currentNumberedStep.value]
  if (step) {
    // 여기서 직접 videoSrc를 업데이트합니다.
    switch(currentNumberedStep.value) {
    case 0:
      currentVideoSrc.value = videoRef1.value
      break
    case 1:
      currentVideoSrc.value = videoRef2.value
      break
    case 2:
      currentVideoSrc.value = videoRef3.value
      break
    }
  }
})

const UpdateExerciseSteps = () => {
  exerciseSteps.value = Array.from({ length: setCount.value }, (_, i) => ({
    title: `${i + 1}set`,
    subtitle: `${repetitionCount.value}회`,
  }))
}

const similarity = ref(null)
const video1Path = ref(null)
const video2Path = ref(null)

// 비디오 URL을 DOM 요소에 할당하는 함수
function assignVideoUrls(videos, videoRefs) {
  videos.forEach((video, index) => {
    const videoRef = videoRefs[index]
    if (video && videoRef && videoRef.value) {
      videoRef.value.src = video.evideoPath
    }
  })
}

const getData = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:4000/exer/getData.do', { id: userId.value })
    if (response.data) {
      videoRef1.value = response.data[0].evideoPath
      videoRef2.value = response.data[1].evideoPath
      videoRef3.value = response.data[2].evideoPath

      // 초기 비디오 URL 설정
      currentVideoSrc.value = videoRef1.value
    }
  } catch (error) {
    console.error('Error fetching video:', error)
  }
}



const startTimer = () => {
  if (videoRef1.value) {
    let formData = new FormData()

    formData.append('video1', videoRef1.value.src)


    axios.post('http://localhost:5000//PoseDetector', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        similarity.value = response.data.similarity
        video1Path.value = response.data.video1_path
        video2Path.value = response.data.process_results[1]

        console.log(response.data)
        console.log("similarity", response.data.similarity)
        console.log("video1_path", response.data.video1_path)
        console.log("video2_path", video2Path.value)
      })
      .catch(error => console.error('Error:', error))

    videoRef1.value.play()
    userVideoRef.value.play()
  }
  countDownInterval = setInterval(() => {
    if (time.value > 0) {
      time.value--
    } else {
      isRestTime.value = !isRestTime.value
      time.value = isRestTime.value ? 30 : 60

      if (!isRestTime.value) {
        currentExerciseStep.value++
          
        return  
      }
      isRestTime.value = true
      time.value = 30
    }
  }
  , 1000)
}

const stopTimer = () => {
  clearInterval(countDownInterval)
  videoRef1.value.pause()
  userVideoRef.value.pause()

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

console.log('userinfo id', userId.value)


const selectedStep = ref(0) // 1번 운동이 디폴트로 선택되도록 인덱스 0을 초기값으로 설정합니다.

// 운동 목록에서 항목을 클릭했을 때 호출될 메소드입니다.
function selectStep(index) {
  currentNumberedStep.value = index
}

const changeVideoSrc = (index, newSrc) => {
  console.log(index) // 디버깅을 위해 index 값 로깅
  switch (index) {
  case 0:
    videoRef1.value.src = newSrc
    break
  case 1:
    videoRef2.value.src = newSrc
    break
  case 2:
    videoRef3.value.src = newSrc
    break
  default:
    console.error('Invalid video index')
  }
}

onMounted(() => {
  getData()

})
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
          <TestCam :video="videoRef1.src" />
          <div
            v-for="(step, index) in numberedSteps"
            :key="index"
            @click="selectStep(index)"
          />
          <VCol cols="5">
            <!-- <VCol :cols="9-menuSize"> -->
            <!-- 운동 자세 영상 -->
            <iframe
              :src="currentVideoSrc"
              frameborder="0"
            />
          </VCol> <!-- 운동 자세 영상 end -->
          <VCol cols="5">
            <!-- <VCol :cols="9-menuSize"> -->
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

.dropzone {
  display: flex;
  width: 330px;
  height: 450px;
  align-items: center;
  justify-content: center;
  border: 2px dashed #000;
  cursor: pointer;
}
</style>
