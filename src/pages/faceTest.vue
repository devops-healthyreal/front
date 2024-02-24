<script setup>
import axios from '@axios'
import { Quill, QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import * as Emoji from "quill-emoji"
import { createApp, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()


const app = createApp()

Quill.register("modules/emoji", Emoji)

app.component('QuillEditor', QuillEditor)



const inputDiaryPhoto = ref(false)

const userInfo = computed(() => store.state.userStore.userInfo)
const connetId=computed(() => userInfo.value.id)


const imgUrls = ref([]) // 이미지 URL 담을 변수 -- 사진 여러개

//파일 1개 업로드 함수 -- 오늘의 기분
const uploadImgMultiple = e => {
  const file = e.target.files[0] // 첫 번째 파일만 선택

  console.log('함수 안의 파일명:', file)
  
  if (file) {
    // 이미지 URL 생성
    const imgUrl = URL.createObjectURL(file)
    
    // 이미지 URL을 배열에 추가
    imgUrls.value = [imgUrl]
    
    // 파일을 formData에 추가하고 서버로 업로드
    const formData = new FormData()

    formData.append('file', file)

    axios.post('http://localhost:5000/test', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log(response.data)

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
</script>

<template>
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
            @change="uploadImgMultiple"
          />
        </VCol>
        <VCol>
          <VBtn 
            block
            @click="uploadImageToServer"
          >
            확인
          </VBtn>
        </VCol>
      </VCard>
    </VDialog>
  </VCol>
</template>

