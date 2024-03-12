<script setup>
import AppStepper from '@/@core/components/AppStepper.vue'
import bench from '@/assets/video/bench.mp4'
import dead from '@/assets/video/dead.mp4'
import exerciseSample from '@/assets/video/exerciseSample.mp4'
import axios from '@axios'
import { onMounted, reactive, ref, watch } from 'vue'



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

const userVideoRef = ref(null)

const fileInput = ref(null)
const state = reactive({ videoLoaded: false })

let countDownInterval = null  // 카운트다운 인터벌 저장 변수
const setCount = ref(5)
const repetitionCount = ref(10)

const changeVideoSrc = newSrc => {
  videoRef1.value.src = newSrc
  videoRef2.value.src = newSrc
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

const similarity = ref(null)
const video1Path = ref(null)
const video2Path = ref(null)
  

const startTimer = () => {
  videoRef1.value.src = "http://localhost:5000/static/mp4/exerciseSample.mp4" // 이 코드를 추가하세요.
  console.log("videoRef1.value.src:", videoRef1.value.src)
  if (videoRef1.value && fileInput.value) {
    let formData = new FormData()
    let file = new Blob([fileInput.value.files[0]], { type: 'video/mp4' })
    formData.append('video1', videoRef1.value.src)
    formData.append('video2', file)

    axios.post('http://localhost:5000/pose_detector', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        similarity.value = response.data.similarity
        video1Path.value = response.data.video1_path
        video2Path.value = response.data.process_results[1]  // video2Path를 process_results의 두 번째 항목으로 설정

        console.log(response.data) // 전체 응답 객체 출력
        console.log("similarity", response.data.similarity) // similarity 값만 출력
        console.log("video1_path", response.data.video1_path) // video1_path 값만 출력
        console.log("video2_path", video2Path.value) // video2_path 값만 출력
      })
      .catch(error => console.error('Error:', error))

    videoRef1.value.play()
    userVideoRef.value.play()
    console.log('chk')
    if (currentExerciseStep.value === setCount.value) {  
      currentExerciseStep.value = 0  
      currentNumberedStep.value++  
      console.log('chk')
    
      return  
    }
  }

  videoRef1.value.play()
  userVideoRef.value.play()
  countDownInterval = setInterval(() => {
    if (time.value > 0) {
      time.value--
    } else {
      if (isRestTime.value) {
        isRestTime.value = false
        time.value = 60
      } else {
        currentExerciseStep.value++
        if (currentExerciseStep.value >= exerciseSteps.value.length) {  
          clearInterval(countDownInterval)  
          currentExerciseStep.value = 0  
          
          return  
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
  userVideoRef.value.pause()

}


const videoLoaded = ref(false)

const handleLoadedData = () => {
  console.log('Video loaded')
  console.log('userVideoRef.value:', userVideoRef.value)
  videoLoaded.value = true  // 비디오 로드 완료 시 videoLoaded를 true로 설정
  console.log('videoLoaded.value after loaded:', videoLoaded.value)
}

const onDrop = e => {
  console.log('ondrop실행')
  e.preventDefault()
  console.log('videoLoaded.value:', videoLoaded.value)

  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('video/')) {
    const fileURL = URL.createObjectURL(file)

    console.log('videoLoaded.value:', videoLoaded.value)
    userVideoRef.value.src = fileURL
    console.log("fileURL", fileURL)
    userVideoRef.value.load()

    // 처리 결과를 보여주기 위해 video2Path.value를 확인하여 설정
    if (video2Path.value) {
      userVideoRef.value.src = video2Path.value
    }
  }
}

const onDropzoneClick = () => {
  fileInput.value.click()
}

const onFileChange = e => {
  console.log('input실행')

  const file = e.target.files[0]
  if (file && file.type.startsWith('video/')) {
    const fileURL = URL.createObjectURL(file)

    console.log('videoLoaded.value:', videoLoaded.value)
    if (userVideoRef.value) {
      userVideoRef.value.setAttribute('src', fileURL)
      userVideoRef.value.load()
      console.log('videoLoaded.value:', videoLoaded.value)
    } else {
      console.log("userVideoRef is null")
    }
  }
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

let videoRef1 = ref(null)
let videoRef2 = ref(null)

onMounted(() => {
  if (videoRef1.value && videoRef2.value) {
    videoRef1.value.src = "http://localhost:5000/static/mp4/exerciseSample.mp4"
  }
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
                src="http://localhost:5000/static/mp4/exerciseSample.mp4"
                type="video/mp4"
              >
            </video>
          </VCol> <!-- 운동 자세 영상 end -->
          <VCol cols="5">
            <!-- <VCol :cols="9-menuSize"> -->
            <!-- 운동 자세 영상 -->
            <video
              v-show="videoLoaded"
              ref="userVideoRef"
              controls
              width="100%"
              @loadeddata="handleLoadedData"
            />
            <div
              v-show="!videoLoaded"
              class="dropzone"
              @dragover.prevent
              @drop="onDrop"
              @click="onDropzoneClick"
            >
              <span>Drop video files here</span>
            </div>
            <input
              ref="fileInput"
              type="file"
              style="display: none;"
              @change="onFileChange"
            >
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
