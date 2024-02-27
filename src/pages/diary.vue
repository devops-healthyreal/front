<script setup>
import AppDateTimePicker from '@/@core/components/app-form-elements/AppDateTimePicker.vue'
import TextEmotionDetectionModal from '@/pages/components/diaryModal/TextEmotionDetectionModal.vue'
import TextEmotionResultModal from '@/pages/components/diaryModal/TextEmotionResultModal.vue'
import DiaryView from '@/pages/diaryView.vue'
import axios from '@axios'
import DiaryPage from '@images/cards/DiaryPage.png'
import { Quill, QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import * as Emoji from "quill-emoji"
import { createApp, ref } from 'vue'
import { useStore } from 'vuex'
import SubmitConfirmModal from './components/diaryModal/SubmitConfirmModal.vue'


const store = useStore()


const app = createApp()

Quill.register("modules/emoji", Emoji)

app.component('QuillEditor', QuillEditor)

import timelineCardHeader from '@images/cards/timeline-card-header.png'
import {
  requiredValidatorDiaryPassword,
} from '@validators'


const biggeImgFile = ref(false)
const previousBtn = ref(null)
const btnSize = '40'  //버튼 크기
const isDialogVisible = ref(false)
const submitBtn = ref(false)
const writeDiaryContent = ref(false)
const readDiaryContent = ref(false)
const diaryLock = ref(false)
const selectedBtn = ref()
const viewPassword = ref(false)
const password = ref('Password')
const refVForm = ref()
const inputDiaryPhoto = ref(false)
const clickedImageUrl = ref('')

const testwordcloud = ref(false)

const isSubmitConfirmModalVisible = ref(false) //등록 확인 모달창
const isEmotionDetectDialogVisible = ref(false) //감정분석 api 요청 중일 때 로딩창
const isResultDialogVisible = ref(false) //감정 분석 결과 보여주는 창
const result = ref({}) //텍스트 감정 분석 결과값
const diary = ref('') //다이어리 콘텐츠 저장용
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId=computed(() => userInfo.value.id)
const userId = ref(connetId)
const inputEmotionPhoto = ref(false)
const emotiondata=ref('')
const imageData = ref('')

const getWordCloud = async () => {
  await axios.post('http://localhost:5000/wordcloud', {
    text: '<p>오늘은 학교에 다녀온 날이었습니다. 아침 일찍 일어나서 준비를 마치고 학교로 향했습니다. 학교에 도착하니 이미 많은 친구들이 모여있었고, 활기찬 분위기가 느껴졌습니다.</p><p>수업 시작 전에는 친구들과 이야기를 나누고 웃음 가득한 시간을 보냈습니다. 서로의 추억이 담긴 이야기를 나누며 학교 생활이 그리워졌던 순간이었습니다.</p><p>수업 시간에는 열심히 공부에 집중했습니다. 선생님들께서는 열정적으로 지식을 전달해 주셨고, 저희 학생들도 질문을 하며 적극적으로 수업에 참여했습니다. 새로운 지식을 습득하고 배우는 과정은 항상 흥미로웠습니다.</p><p>점심 시간에는 친구들과 함께 급식을 먹으며 이야기를 나누었습니다. 맛있는 음식을 함께 나누는 시간은 항상 즐거웠습니다. 함께 웃고 이야기하며 친밀감을 느낄 수 있어서 기분이 좋았습니다.</p>',
  }).then(response => {
    console.log('체크..', response.data)

    // 여기서 가져온 데이터를 원하는 방식으로 처리할 수 있습니다.
    imageData.value = 'data:image/png;base64,' + response.data.image // 이미지 데이터 저장 및 화면 업데이트
  }).catch(error => {
    console.error('워드 클라우드를 가져오는 동안 오류가 발생했습니다:', error)
  })
}

Quill.register("modules/emoji", Emoji)

app.component('QuillEditor', QuillEditor)

const imgUrlEmotion = ref([]) // 이미지 URL 담을 변수 -- 사진 여러개

const uploadImgEmotion = e => {
  const file = e.target.files[0] // 첫 번째 파일만 선택

  console.log('함수 안의 파일명:', file)
  
  if (file) {
    // 이미지 URL 생성
    const imgEmotion = URL.createObjectURL(file)
    
    // 이미지 URL을 배열에 추가
    imgUrlEmotion.value = [imgEmotion]
    
    // 파일을 formEmotion에 추가하고 서버로 업로드
    const formEmotion = new FormData()

    formEmotion.append('file', file)

    axios.post('http://localhost:5000/test', formEmotion, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log(response.data)
        emotiondata.value=response.data

      // 서버에서 받은 응답 처리
      })
      .catch(error => {
        console.error(error)

      // 오류 처리
      })
  } else {
    // 파일이 선택되지 않은 경우
    console.error('No file selected')
  }
}

var files = [] //파일 리스트

//사용자가 작성한 글을 html요소와 함께 저장 (view 용)
const diaryContent = ref('')

//사용자가 작성한 글에서 감정 분석 (텍스트 감정 분석 용)
const diaryText = ref('')

const diaryWriteComplet = isSubmit => {
  if (isSubmit) {
    var diaryTag = document.querySelector('.ql-editor')
    if (diaryTag != null){
      diaryContent.value = diaryTag.innerHTML
      diaryText.value = diaryTag.innerText
    }
    if(diaryText.value.trim().length == 0){
      alert('글을 입력해주세요')
      submitBtn.value = false
    }
    else {
      writeDiaryContent.value = true
      isSubmitConfirmModalVisible.value = true

    }
  }
  else {
    writeDiaryContent.value = false
    submitBtn.value = false
  }
}


const imageUrl = ref('') // 이미지 URL을 담을 변수 -- 사진 1개
const imgUrls = ref([]) // 이미지 URL 담을 변수 -- 사진 여러개
const imageSize = ref(null) //이미지 마우스 올릴 때 이벤트를 위한 변수

//파일 1개 업로드 함수 -- 오늘의 기분
const uploadImg = e => {
  const fileList = e.target.files
  if (fileList.length > 0) {
    const imgUrl = URL.createObjectURL(fileList[0])

    imageUrl.value = imgUrl
  } else {
    // Handle the case where no file is selected
    console.error('No file selected')
  }
}

// 마우스 클릭할 때
const handleImageClick = url => {
  clickedImageUrl.value = url // Set the clicked image URL
  biggeImgFile.value = true // Set biggeImgFile to true
  console.log(clickedImageUrl.value)
}

// 마우스 올릴 때
const handleMouseOver = index => {
  imageSize.value = index // Set the index of the hovered image
}

//마우스 떠날 때
const handleMouseLeave = () => {
  imageSize.value = null // Reset the index to null when mouse leaves
}

/////

// 멀티 파일 업로드할때 필요한 함수 -- 일기에 사진 추가할때 사용
const uploadImgMultiple = e => {
  const fileList = e.target.files

  files = e.target.files
  console.log('함수 안의 파일명:', files)
  if (fileList.length > 0) {
    // 여러 이미지를 저장할 배열
    const imageUrls = []

    // fileList의 각 파일에 대해 URL 생성 및 배열에 추가
    for (let i = 0; i < fileList.length; i++) {
      const imgUrl = URL.createObjectURL(fileList[i])

      imageUrls.push(imgUrl)
    }

    // 배열을 컴포넌트 내의 데이터에 할당
    imgUrls.value = imageUrls
  } else {
    // Handle the case where no file is selected
    console.error('No file selected')
  }
}

const deleteImage = index =>{
  imgUrls.value.splice(index, 1)
}

//input file에 사이즈에 대한 룰 설정
const rules = [fileList => !fileList || !fileList.length || fileList[0].size < 1000000 || 'Avatar size should be less than 1 MB!']



//[📌워드 에디터]Quill 객체 초기화

var temp = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  //['emoji'],
  ['blockquote', 'code-block'],
  
  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean'],                                         // remove formatting button
]

const toolbarOptions = {
  container: temp,
  handlers: {
    'emoji': function () {},
  },
}

//사용자가 입력한 값 가져오기
window.addEventListener('click', ()=>{
  var diaryTag = document.querySelector('.ql-editor')
  if (diaryTag != null){
    diaryContent.value = diaryTag.innerHTML
    diaryText.value = diaryTag.innerText
  }
})

//감정 분석 모달창 띄우기 용
const openModal = () => {
  isEmotionDetectDialogVisible.value = true
  axios.get("http://localhost:5000/diary", { params: {
    diary: diaryText.value,
  } })
    .then(resp => {
      console.log(resp.data)
      diary.value = diaryContent.value
      result.value = resp.data
      isEmotionDetectDialogVisible.value = false
      isResultDialogVisible.value = true
    })
}

function getTodayLabel() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}


//등록을 누르면 실행되는 코드
const postDiary = score => {
  console.log('값 잘 들어옴?:', score)

  const dateTag = document.getElementById("date").children[0]
  var dateVal = dateTag.value.replace(/-/g, '')+'-'+userId.value
  if(dateVal.trim()[0]=='-'){
    dateVal = getTodayLabel().replace(/-/g, '')+'-'+userId.value
  }

  
  console.log('날짜:', dateTag.value)
  console.log("dateVal", dateVal)

  // const today = new Date()
  // const year = today.getFullYear()
  // const month = String(today.getMonth() + 1).padStart(2, '0')
  // const day = String(today.getDate()).padStart(2, '0')
  
  // const diaryId = `${year}${month}${day}-${userId.value}` //다이어리 아이디 설정

  const formData = new FormData()

  console.log('함수 안의 파일명:', files)
  formData.append('id', userId.value)
  formData.append("diaryId", dateVal)
  formData.append('diary_content', diaryContent.value)

  //formData.append('imgUrls', files)
  formData.append('emotion', score.toFixed(2))

  if (files.length > 0) {
    for(var i=0;i<files.length;i++){
      console.log(files[i])
      formData.append('files', files[i])
    }
  }

  axios.post("http://localhost:4000/manage/diary/upload", formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(resp => {
      alert('글이 성공적으로 등록되었습니다.')
      window.location.href = 'http://localhost:3333/diary'
    })
    .catch(()=>alert('글 등록에 실패했습니다. 관리자에게 문의하세요.'))
}
</script>

<template>
  <VRow>
    <VCol>
      <!-- Diary 위 이미지 -->
      <VImg
        cover
        height="230"
        :src="timelineCardHeader"
      />
      <!-- Diary 시작 -->
      <VCard
        title=" "
        flat
        :max-width="auto"
        class="mt-4 mt-sm- pa-0"
      >
        <VRow
          v-if="!readDiaryContent"
          cols="12"
        >
          <!-- <VCol cols="2" /> -->
          
          <!-- 아이콘 / 오늘의 기분 버튼 줄 -->
          <!-- <VCol cols="2" /> -->
        </VRow>
        <VCol />
        <!-- 여기가 content부분 -->
        <!-- 해당 if는 일기 작성 / 일기 보기 버튼이 클릭 되지 않은 기본 상태 -->
        <VCard 
          v-if="!writeDiaryContent && !readDiaryContent"
          :image="DiaryPage"
          height="900"
          align="center"
        >
          <!-- 다이어리 비밀번호 입력 -->
          <Transition name="fade">
            <VRow v-if="!diaryLock">
              <VCol cols="9" />
              <VCol cols="2">
                <VForm 
                  ref="refVForm" 
                  @submit="diaryLock=true"
                >
                  <Transition name="fade">
                    <VTextField
                      v-if="viewPassword"
                      v-model="password"
                      style="margin-top: 450px;"
                      :append-inner-icon="show1 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                      :rules="[rules.required, rules.min, requiredValidatorDiaryPassword]"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      label="Password"
                      counter
                      @click:append-inner="show1 = !show1"
                    />
                  </Transition>
                </VForm>
              </VCol>
              <VCol cols="1">
                <VBtn 
                  icon="mdi-lock"
                  rounded="lg"
                  size="x-large"
                  style="margin-top: 450px;"
                  @click="viewPassword = true"
                />
              </VCol>
            </VRow>
          </Transition>
          <!-- 비밀번호 입력 끝 -->
          <!-- 비밀번호 입력 했을 시 보이는 화면 -->
          <VRow v-if="diaryLock">
            <VCol cols="4" />
            <VCol cols="2">
              <VBtn 
                style="margin-top: 600px;"
                @click="writeDiaryContent = true"
              >
                일기 작성
                <VTooltip
                  location="top"
                  activator="parent"
                >
                  오늘은 {{ getTodayLabel() }} 입니다
                </VTooltip>
              </VBtn>
            </VCol>
             
            <VCol cols="2">
              <VBtn 
                style="margin-top: 600px;"
                @click="readDiaryContent = true"
              >
                일기 보기
              </VBtn> 
            </VCol> 
          </VRow>
          <!-- 비밀번호 입력 했을 시 보이는 화면 끝 -->
        </VCard>
        <!-- 일기 보기 버튼 클릭 -->
        <VCard v-if="readDiaryContent">
          <DiaryView :img-urls="imgUrls" />
          <!-- 일기 보기 버튼 다시 비활성화하는 버튼 -->
          <VCol cols="2">
            <VBtn 
              cols="2"  
              @click="readDiaryContent=false"
            >
              뒤로가기
            </VBtn>
          </VCol>
        </VCard>
        <!-- 일기 보기 버튼 끝 -->

        <Transition name="fade">
          <div
            v-if="imageData"
            style=" margin-bottom: 20px;text-align: center;"
          >
            <VCol style="margin-bottom: 20px;">
              <strong style=" padding: 15px; border-radius: 8px; background-color: #33da00; color: white;">자주 사용한 단어</strong>
            </VCol>
            <img
              :src="imageData"
              alt="WordCloud"
            >
          </div>
        </Transition>


        <!-- 일기 쓰기 버튼 -->
        <VForm>
          <VCard v-if="writeDiaryContent">
            <VCol cols="12">
              <!-- 텍스트 영역 위 img 뿌려주는 공간 -->
              <Transition name="fade">
                <VRow
                  v-if="imgUrls.length > 0"
                  style="height: 200px; margin-top: 15px;"
                >
                  <VImg 
                    v-for="(url, index) in imgUrls" 
                    :key="index"
                    :src="url"
                    :style="{
                      width: imageSize === index ? '200px' : '150px',
                      height: imageSize === index ? '200px' : '150px',
                      alignSelf: 'center',
                      transition: 'width 0.2s, height 0.2s', // Transition for smooth size change
                      position: 'relative'
                    }"
                    @click="handleImageClick(url)"
                    @mouseover="handleMouseOver(index)"
                    @mouseleave="handleMouseLeave"
                  >
                    <VBtn
                      :key="index"
                      icon
                      size="small"
                      color="error"
                      class="delete-button"
                      style="position: absolute; top: 0; right: 0;"
                      @click.stop="() => deleteImage(index)"
                    >
                      <VIcon>mdi-close</VIcon>
                    </VBtn>
                  </VImg>
                </VRow>
              </Transition>
            </VCol>
            <VCol>
              <VRow style="margin-left: 12px;">
                <VCol cols="3">
                  <AppDateTimePicker
                    id="date"
                    v-model="date"
                    :label="getTodayLabel()"
                  />
                </VCol>
                <VSpacer />
                <VCol cols="1">
                  <VBtn @click="getWordCloud">
                    단어분석
                  </VBtn> 
                </VCol> 

                <!-- -------------------- 감정분석------------------------ -->
                <VCol cols="1">
                  <VDialog
                    v-model="inputEmotionPhoto"
                    width="600"
                  >
                    <template #activator="{ props }">
                      <VBtn 
                        width="50" 
                        v-bind="props "
                      >
                        감정분석
                      </VBtn>
                    </template>
                    <!-- Dialog Content -->
                    <VCard title="오늘의 얼굴을 보여주세요!!">
                      <DialogCloseBtn
                        variant="text"
                        size="small"
                        @click="inputEmotionPhoto = false"
                      />
                      <VCardText>
                        Ai가 얼굴을 인식해 감정을 분석해줍니다
                      </VCardText>
                      <VImg 
                        v-for="(url, index) in imgUrlEmotion" 
                        :key="index"
                        :src="url"
                        style="width: 400px; height: auto; align-self: center;"
                      />
                      <VCol style="text-align: center;">
                        {{ emotiondata.emotion }}
                        <VIcon
                          v-if="emotiondata.emotion == 'happy'"
                          color="success"
                          icon="mdi-emoticon-excited"
                        />
                        <VIcon
                          v-if="emotiondata.emotion == 'sad'"
                          color="info"
                          icon="mdi-emoticon-sad"
                        />
                        <VIcon
                          v-if="emotiondata.emotion == 'disgust'"
                          color="error"
                          icon="mdi-emoticon-dead"
                        />
                        <VIcon
                          v-if="emotiondata.emotion == 'angry'"
                          color="error"
                          icon="mdi-emoticon-angry"
                        />
                        <VIcon
                          v-if="emotiondata.emotion == 'fear'"
                          color="info"
                          icon="mdi-emoticon-frown"
                        />
                        <VIcon
                          v-if="emotiondata.emotion == 'surprise'"
                          color="warning"
                          icon="mdi-robot-confused"
                        />
                        <VIcon
                          v-if="emotiondata.emotion == 'neutral'"
                          color="secondery"
                          icon="mdi-emoticon-neutral"
                        />
                      </VCol>
                      <VCol cols="12">
                        <VFileInput
                          :rules="rules"
                          label="Face IMG"
                          type="file"
                          accept="image/png, image/jpeg, image/bmp"
                          placeholder="Pick an avatar"
                          prepend-icon="mdi-camera-outline"
                          @change="uploadImgEmotion"
                        />
                      </VCol>
                      <VCol>
                        <VBtn 
                          block
                          @click="inputEmotionPhoto=false"
                        >
                          확인
                        </VBtn>
                      </VCol>
                    </VCard>
                  </VDialog>
                </VCol>
                <!-- -------------------- 감정분석------------------------ -->
              </VRow>
            </VCol>
            <VCol>
              <VCol cols="12">
                <QuillEditor
                  id="quill-editor"
                  :toolbar="toolbarOptions"
                  style="height: 800px;"
                  rows="30"
                  @change="test"
                />
              </VCol>
              <VCol cols="12">
                <VRow>
                  <VCol cols="2">
                    <VBtn @click="diaryWriteComplet(true)">
                      등록
                    </VBtn>
                  </VCol>
                  <VSpacer />
                  
                  <VCol cols="1">
                    <VBtn 
                      width="50"  
                      @click="diaryWriteComplet(false)"
                    >
                      뒤로가기
                    </VBtn>
                  </VCol>
                  <VCol cols="1">
                    <VDialog
                      v-model="inputDiaryPhoto"
                      width="600"
                    >
                      <template #activator="{ props }">
                        <VBtn 
                          width="50" 
                          v-bind="props "
                        >
                          사진 추가
                        </VBtn>
                      </template>
                      <!-- Dialog Content -->
                      <VCard title="당신의 오늘의 기분을 알려주세요!!">
                        <DialogCloseBtn
                          variant="text"
                          size="small"
                          @click="inputDiaryPhoto = false"
                        />
                        <VCardText>
                          사진을 추가해주세요
                        </VCardText>
                        <VImg 
                          v-for="(url, index) in imgUrls" 
                          :key="index"
                          :src="url"
                          style="width: 400px; height: 400px; align-self: center;"
                        />
                        <VCol cols="12">
                          <VFileInput
                            :rules="rules"
                            label="Face IMG"
                            type="file"
                            accept="image/png, image/jpeg, image/bmp"
                            placeholder="Pick an avatar"
                            prepend-icon="mdi-camera-outline"
                            multiple
                            @change="uploadImgMultiple"
                          />
                        </VCol>
                        <VCol>
                          <VBtn 
                            block
                            @click="inputDiaryPhoto=false"
                          >
                            확인
                          </VBtn>
                        </VCol>
                      </VCard>
                    </VDialog>
                  </VCol>
                </VRow>  
                <SubmitConfirmModal
                  v-model="isSubmitConfirmModalVisible" 
                  @open-modal="openModal"
                />
                <TextEmotionDetectionModal v-model="isEmotionDetectDialogVisible" />
                <TextEmotionResultModal
                  v-model="isResultDialogVisible"
                  :result="result"
                  :diary="diary"
                  :urls="imgUrls"
                  @update:submitEvent="postDiary"
                />
                <!-- 멀티 이미지 클릭 시 열리는 모달 -->
                <VDialog
                  v-model="biggeImgFile"
                  width="600"
                  height="650"
                >
                  <VCard cols="12">
                    <VCardText>
                      <VImg
                        :src="clickedImageUrl"
                        width="600px"
                        height="600px"
                      />
                    </VCardText>
                  </VCard>
                </VDialog>
              </VCol>
            </VCol>
          </VCard>
        </VForm>
      </VCard>
      <!-- content부분 끝 -->
      <FontAwesomeIcon icon="coffee" />
    </VCol>
  </VRow>
</template>


<style lang="scss">
@font-face {
  font-family: seolleimcool-SemiBold;
  font-style: normal;
  font-weight: normal;
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2312-1@1.1/seolleimcool-SemiBold.woff2") format("woff2");
}

.ql-font-seolleimcool-SemiBold {
  font-family: seolleimcool-SemiBold;
}

.fade-enter,
.fade-enter-active {
  opacity: 0;
  transition: opacity 0.5s;
}

.fade-enter-to {
  opacity: 1;
}

.fade-leave-active,
.fade-leave {
  opacity: 1;
  transition: opacity 0.5s;
}

.fade-leave-to {
  opacity: 0;
}
</style>

