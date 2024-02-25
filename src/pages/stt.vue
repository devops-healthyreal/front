<script setup>
import { onMounted, ref } from 'vue'

let transcript = ref('')
let isRecognizing = ref(false)
let recognition
let selectedVoice = ref(null)
let voices = ref([])
let ttsText = ref('')
let synthesis, utterance, loadVoices, startSynthesis, stopSynthesis

//stt
if (!('webkitSpeechRecognition' in window)) {
  console.log('당신의 브라우저는 STT를 지원하지 않습니다.')
} else {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()
  recognition.lang = 'Microsoft Heami - Korean (Korean)'
  recognition.interimResults = true

  recognition.onspeechstart = () => {
    console.log('Recognition Start!')
  }

  recognition.onspeechend = () => {
    console.log('Recognition Stop!')
    recognition.stop()
    isRecognizing.value = false
  }

  recognition.onresult = event => {
    console.log('event.results:', event.results)
    transcript.value = Array.from(event.results).map(results => results[0].transcript).join("")
  }

  recognition.onerror = event => {
    console.error('음성 인식 오류가 발생했습니다: ' + event.error)
  }
}

const startRecognition = () => {
  if (isRecognizing.value) {
    recognition.stop()
    isRecognizing.value = false
  } else {
    transcript.value = ''
    recognition.start()
    isRecognizing.value = true
  }
}

//tts
if ('speechSynthesis' in window) {
  synthesis = window.speechSynthesis
  utterance  = new SpeechSynthesisUtterance()

  loadVoices = function() {
    return new Promise(resolve => {
      let voiceList = window.speechSynthesis.getVoices()
      voices.value = voiceList.map(voice => ({ text: voice.name, value: voice.voiceURI }))
      console.log('Loaded voices: ', voices.value)
      resolve()
    })
  }
}

// Load voices when component is mounted
onMounted(async () => {
  window.speechSynthesis.onvoiceschanged = async () => {
    await loadVoices()
      
    let voice = voices.value.find(voice => voice.text === 'Microsoft Heami - Korean (Korean)')
    if (voice) { 
      selectedVoice.value = voice.value
    } else {
      console.log('Desired voice not found')
    }
  }
  window.speechSynthesis.getVoices()
})
  



const readUserInput = () => {
  if ('speechSynthesis' in window) {
    utterance.text = ttsText.value
    if (selectedVoice.value) {
      utterance.voiceURI = selectedVoice.value
    }
    window.speechSynthesis.speak(utterance)
  }
}

startSynthesis = function() {
  ttsText.value = chatgpt.value
  utterance.text = ttsText.value
  if (selectedVoice.value) {
    utterance.voiceURI = selectedVoice.value
  }
  window.speechSynthesis.speak(utterance)
}

stopSynthesis = function() {
  window.speechSynthesis.cancel()
}
</script>





<template>
  <VCol>
    <!-- STT -->
    <VBtn
      color="primary"
      @click="startRecognition"
    >
      음성 인식 시작
    </VBtn>
    <p>인식 결과: {{ transcript }}</p>

    <!-- TTS -->
    <VTextField
      id="input-tts"
      v-model="ttsText"
      label="TTS로 읽을 텍스트를 입력하세요."
    />
    <VBtn
      color="primary"
      @click="readUserInput"
    >
      읽어주기
    </VBtn>
    <VSelect
      v-model="selectedVoice"
      :items="voices.value"
      item-text="text"
      item-value="value"
      label="음성 선택"
    />
  </VCol>
</template>


