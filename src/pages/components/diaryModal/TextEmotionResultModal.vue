<script setup>
import { defineEmits, onUpdated } from 'vue'

const props = defineProps(["result", "diary", "urls"])

const emit = defineEmits(['update:submitEvent'])

const isDialogVisible = defineModel()
const result = ref()

console.log('자식 컴포넌트:', isDialogVisible)
console.log('부모 컴포넌트의 값 확인:', typeof props.result.score)
console.log('일기장 값:', props.diary)


const btnIcons = [
  {
    icon: 'mdi-emoticon-cry',
    value: 0,
  },
  {
    icon: 'mdi-emoticon-sad',
    value: 1,
  },
  {
    icon: 'mdi-emoticon-neutral',
    value: 2,
  },
  {
    icon: 'mdi-emoticon-excited',
    value: 3,
  },
  {
    icon: 'mdi-emoticon-cool',
    value: 4,
  },
]

const previousBtn = ref(null)
const selectedBtn = ref()

const selectButton = value => {
  previousBtn.value = selectedBtn.value
  selectedBtn.value = value
}

const getButtonColor = value => {
  if (selectedBtn.value === value) {
    switch (value) {
    case 0:
      return '#FF4500' // Angry - 오렌지레드
    case 1:
      return '#FF8C00' // Sad - 다크오렌지
    case 2:
      return '#FFD700' // Neutral - 노란색
    case 3:
      return '#7CFC00' // Excited - 초록색
    case 4:
      return '#00BFFF' // Cool - 딥스카이블루
    default:
      return '#E6E6FA' // 기본 대기중 색상
    }
  }
  else {
    return '#E6E6FA'
  }
}

onUpdated(()=>{
  const score = props.result.score

  console.log('score', score)
  console.log('전체 값:', props.result)
  if (typeof score != 'undefined') {
    if (-1 <= score && score <=-0.6) {
      selectButton(btnIcons[0].value)
      getButtonColor(btnIcons[0].value)
    }
    else if (-0.6 < score && score <=-0.2) {
      selectButton(btnIcons[1].value)
      getButtonColor(btnIcons[1].value)
    }
    else if (-0.2 < score && score <=0.2) {
      selectButton(btnIcons[2].value)
      getButtonColor(btnIcons[2].value)
    }
    else if (0.2 < score && score <=0.6) {
      selectButton(btnIcons[3].value)
      getButtonColor(btnIcons[3].value)
    }
    else {
      selectButton(btnIcons[4].value)
      getButtonColor(btnIcons[4].value)
    }
  }
})

const buttonController = isSubmit => {
  if(isSubmit) {
    emit("update:submitEvent", props.result.score)
  }
  isDialogVisible.value = false
}
</script>

<template>
  <!-- 로딩용 -->
  <VDialog
    v-model="isDialogVisible"
    persistent
    class="v-dialog-sm"
  >
    <!-- Dialog Content -->
    <VCard>
      <VCardText class="text-h6">
        <VIcon icon="mdi-chart-tree" />
        감정 분석 결과입니다
        <VCardText>
          <VChip
            label
            color="success"
            style="margin-right: 10px;"
          >
            SCORE {{ props.result.score.toFixed(2) }}
            <VTooltip
              location="right"
              activator="parent"
            >
              <span>score값이 1에 가까울수록 긍정적이며 <br>-1에 가까울수록 부정적인 감정을 의미합니다<br></span>
            </VTooltip>
          </VChip>
          <VChip
            label
            color="info"
          >
            COMPLEXITY: {{ props.result.mag.toFixed(2) }}
            <VTooltip
              location="right"
              activator="parent"
            >
              <span>complexity값이 0에 가까울수록 <br>느끼는 감정이 통일되어 있음을 의미합니다</span>
            </VTooltip>
          </VChip>
        </VCardText>
      </VCardText>
      
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="isDialogVisible = false"
      />
      <!-- 감정 이모지 선택하는 부분 -->
      <VRow :style="{'display':'flex', 'justify-content':'center'}">
        <VCol 
          v-for="(icon, index) in btnIcons" 
          :key="index"
          :style="{'display':'flex','justify-content':'center'}"
          cols="2"
        >
          <VBtn
            :icon="icon.icon"
            :size="btnSize"
            :color="getButtonColor(icon.value)"
            @click="selectButton(icon.value)"
          />
        </VCol>
        <VTooltip
          location="left"
          activator="parent"
        >
          <span>결과가 느끼는 감정과 다르다면 수정할 수 있습니다</span>
        </VTooltip>
      </VRow>
      <!-- 감정 이모지 선택하는 부분 end -->
      <VCol>
        <VCardText>
          {{ props.result.answer }}
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="secondary"
            @click="buttonController(false)"
          >
            돌아가기
          </VBtn>
          <VBtn
            color="success"
            @click="buttonController(true)"
          >
            등록
          </VBtn>
        </VCardActions>
      </VCol>
    </VCard>
  </VDialog>
</template>
