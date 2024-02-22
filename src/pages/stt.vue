<script setup>
import axios from '@axios'
import { defineProps, ref } from 'vue'

const props = defineProps({
  transcript: String,
  isRecognizing: Boolean,
  startRecognition: Function,
})


let transcript = ref(props.transcript)
let isRecognizing = ref(props.isRecognizing)
let recognition

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
</script>
