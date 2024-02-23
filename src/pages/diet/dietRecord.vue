<script setup>
import NutrientAnalysis from '@/components/dialogs/NutrientAnalysis.vue'
import axios from '@axios'

//영양소 분석 모달창
const isSubmitDisabled = ref(true) //submit버튼 활성화 컨트롤 변수

//이미지 파일 업로드 시 업로드한 이미지가 미리 보이도록 하는 함수
const uploadImg = (e, tagId) =>{  
  console.log(isSubmitDisabled)
  
  //(param)e : <input>태그에 발생한 change 이벤트 객체
  //(param)tagId : 업로드한 이미지를 뿌려줄 <img>태그의 아이디값
  const imgUrl = URL.createObjectURL(e.target.files[0]) //이미지 url 생성
  var imgTag = document.getElementById(tagId)
  imgTag.style.width = '250px'
  imgTag.style.height = '250px'
  imgTag.src = imgUrl
  if(tagId == 'imgBefore') {
    isSubmitDisabled.value = false
  }
  console.log(isSubmitDisabled)
  foodocr(e.target.files[0])
  console.log('함수끝')
}

const foodocr = imageFile => {
  console.log('foodocr 실행', imageFile)
  try {
    const reader = new FileReader()

    reader.onloadend = function () {
      const base64Encoded = reader.result.split(',')[1]

      console.log('제발', base64Encoded)

      const formdata = new FormData()

      formdata.append('base64Encoded', base64Encoded)
      axios
        .post('http://127.0.0.1:5000/foodOcr', formdata)
        .then(response => {          
          console.log(response.data.base64)
          
          return response.data
        })
        .then(data => {
          document.querySelector('#imgBefore').src = 'data:image/jpeg;base64,' + data.base64
          console.log('여기까지 들어옴', data)
        })
    }
    reader.readAsDataURL(imageFile) // 이미지 파일을 읽고 base64 인코딩된 데이터를 얻음
  } catch (e) {
    console.log('뭔데..')
    console.error(e)
  }
}

const makeDisable = () => {
  console.log('함수 실행됨')
  
  return false
}

//버튼을 누르면 input태그가 클릭되도록 작동하는 함수
const handleUpload = tagId => { 
  //(param)tagId : upload버튼을 눌렀을 때 실행되어야 할 <input>태그의 아이디값
  var filebtn = document.getElementById(tagId)
  console.log('파일버튼', filebtn)
  filebtn.click()
}

const rules = [fileList => !fileList || !fileList.length || fileList[0].size < 1000000 || 'Avatar size should be less than 1 MB!']
const isNutrientAnalysisVisible = ref(false) //모달창 컨트롤 변수
</script>

<template>
  <VCard>
    <VCardItem :style="{'background-color':'#F6F6F6'}">
      <VCardText>
        <p class="text-h4">
          식단의 사진을 등록해주세요
        </p>
        <VChip color="warning">
          ⚠️ 식전 사진 등록은 필수입니다
        </VChip>
      </VCardText>
    </VCardItem>
    <VRow :style="{'margin-top':'120px', 'display':'flex', 'justify-content':'center'}">
      <VCol
        cols="6"
        :style="{'display':'flex', 'justify-content':'center'}"
      >
        <VCard
          class="text-high-emphasis text-center"
          :style="{'width':'80%', 'margin-bottom':'100px'}"
        >
          <!-- 식전사진 업로드 -->
          <div :style="{'margin':'30px'}">
            <h2>식전 사진</h2>
          </div>
          <VCardItem :style="{'margin-top':'10px'}">
            <input
              id="filebtn"
              type="file"
              accept="image/*"
              hidden
              @change="uploadImg($event,'imgBefore')"
            >
            <!-- label의 for속성값과 input의 id값을 맞춰줘야 label영역을 클릭했을 때 input태그가 활성화됨 -->
            <label
              for="filebtn"
              class="input-plus"
            > 
              <div :style="{'width':'100%', 'height':'300px', 'display':'flex','justify-content': 'center','align-items': 'center'}">
                <img
                  id="imgBefore"
                  :style="{'width':'50px', 'height':'60px'}"
                  src="@images/noimage.png"
                >
              </div>
            </label>
          </VCardItem>
          <VCardText>
            <p class="text-base clamp-text">
              음식이 모두 보이도록<br>사진을 업로드해주세요.
            </p>
            <VBtn @click="handleUpload('filebtn')">
              upload
            </VBtn>
          </VCardText>

          <ShareProjectDialog v-model:isDialogVisible="isShareProjectDialogVisible" />
        </VCard> <!-- 식전사진 업로드 end -->
      </VCol>
      <VCol
        cols="6"
        :style="{'display':'flex', 'justify-content':'center'}"
      >
        <VCard
          class="text-high-emphasis text-center"
          :style="{'width':'80%', 'margin-bottom':'100px'}"
        >
          <!-- 식후사진 업로드 -->
          <div :style="{'display':'flex', 'justify-content':'center','margin':'30px'}">
            <strong style="font-size: x-large;">식후 사진</strong>
          </div>
          <VCardItem :style="{'margin-top':'10px'}">
            <input
              id="filebtnAfter"
              type="file"
              accept="image/*"
              hidden
              @change="uploadImg($event,'imgAfter')"
            > 
            <label
              for="filebtnAfter"
              class="input-plus"
            >
              <div :style="{ 'width':'100%', 'height':'300px', 'display':'flex','justify-content': 'center','align-items': 'center'}">
                <img
                  id="imgAfter"
                  :style="{'width':'50px', 'height':'60px'}"
                  src="@images/noimage.png"
                >
              </div>
            </label>
          </VCardItem>
          <VCardText>
            <p class="text-base clamp-text">
              식전 사진과 같은 구도로 찍은 사진을 <br>업로드해주세요.
            </p>
            <VBtn @click="handleUpload('filebtnAfter')">
              upload
            </VBtn>
          </VCardText>

          <ShareProjectDialog v-model:isDialogVisible="isShareProjectDialogVisible" />
        </VCard> <!-- 식후사진 업로드 end -->
      </VCol>
    </VRow>
    <VRow :style="{'display':'flex', 'justify-content': 'center'}">
      <VBtn
        :disabled="isSubmitDisabled"
        :style="{'margin-bottom':'50px'}"
        @click="isNutrientAnalysisVisible = !isNutrientAnalysisVisible"
      >
        SUBMIT
      </VBtn>
      <NutrientAnalysis v-model:isDialogVisible="isNutrientAnalysisVisible" />
    </VRow>
  </VCard>
</template>


