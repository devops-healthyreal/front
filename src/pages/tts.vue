<script setup>
import axios from '@axios'
import { onMounted, ref } from 'vue'

const props = defineProps({
  transcript: String,
  isRecognizing: Boolean,
  startRecognition: Function,
})

let messages = ref([{ role: 'system', content: 'You are Helthy-Real\'s customer service chatbot.' }])
let chatgpt = ref('')
let selectedVoice = ref('')
let transcript = ref(props.transcript)
let isRecognizing = ref(props.isRecognizing)
let recognition
let voices = ref([])

//stt
if (!('webkitSpeechRecognition' in window)) {
  console.log('당신의 브라우저는 STT를 지원하지 않습니다.')
} else {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()
  recognition.lang = 'ko-KR'
  recognition.interimResults = true

  recognition.onspeechstart = () => {
    console.log('Recognition Start!')
  }

  recognition.onspeechend = () => {
    console.log('Recognition Stop!')
    recognition.stop()
    isRecognizing.value = false
  }

  recognition.onresult = async event => {
    console.log('event.results:', event.results)
    transcript.value = Array.from(event.results).map(results => results[0].transcript).join("")

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        // ChatGPT 응답 받기 시작
        try {
          const response = await axios.post('YOUR_CHAT_GPT_API_URL', { transcript: transcript.value })

          console.log(response.data)
        } catch (error) {
          console.error('ChatGPT에 요청 중 오류가 발생했습니다:', error)
        }
      }
    }
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
const sendToChatGPT = async () => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: messages.value,
      temperature: 0,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_API_KEY`,
      },
    })

    chatgpt.value = response.data.choices[0].message.content
    messages.value.push({ role: 'assistant', content: chatgpt.value })
    startSynthesis()
  } catch (error) {
    console.error('API 요청 중 오류가 발생했습니다:', error)
  }
}

// TTS functions
let synthesis, utterance, loadVoices, startSynthesis, stopSynthesis

if ('speechSynthesis' in window) {
  synthesis = window.speechSynthesis
  utterance  = new SpeechSynthesisUtterance()

  loadVoices = function() {
    var voices = window.speechSynthesis.getVoices()
    voices.forEach(function(voice, i) {
      if (voice.lang === 'ko-KR') {
        selectedVoice.value = voice.voiceURI
      }
    })
  }

  startSynthesis = function() {
    utterance.text = chatgpt.value
    if (selectedVoice.value) {
      utterance.voiceURI = selectedVoice.value
    }
    window.speechSynthesis.speak(utterance)
  }

  stopSynthesis = function() {
    window.speechSynthesis.cancel()
  }
} else {
  console.error('Web Speech API not supported')
}

// Load voices when component is mounted
onMounted(loadVoices)
</script>

<template>
  <VCard title="음성 챗봇 CCH 1.0">
    <VCardText>
      <VRow>
        <VCol cols="12">
          <VTextField
            id="result"
            v-model="transcript"
            label="아래 버튼 클릭후 말씀해 주세요"
            readonly
            placeholder="아래 버튼 클릭후 말씀해 주세요"
          />
        </VCol>
        <VCol cols="12">
          <VBtn
            id="startBtn"
            class="btn-lg btn-dark"
            @click="startRecognition"
          >
            SpeechToText Start
          </VBtn>
        </VCol>
        <VCol cols="12">
          <VTextField
            id="chat-gpt"
            v-model="chatgpt"
            placeholder="여기에 응답이 표시됩니다"
            readonly
          />
        </VCol>
        <VCol cols="12">
          <VSelect
            id="voice"
            v-model="selectedVoice"
            :items="voices"
            label="음성을 선택하세요"
          />
        </VCol>
        <VCol cols="12">
          <VBtn
            id="startTtsBtn"
            class="btn-lg btn-dark mb-1"
            @click="startSynthesis"
          >
            TextToSpeech Start
          </VBtn>
          <VBtn
            id="stopTtsBtn"
            class="btn-lg btn-dark mb-1"
            @click="stopSynthesis"
          >
            TextToSpeech Stop
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>


