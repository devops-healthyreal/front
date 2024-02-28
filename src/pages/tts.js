import { onMounted, ref } from 'vue'

let selectedVoice = ref(null)
let voices = ref([])
let ttsText = ref('')
let synthesis, utterance, loadVoices, startSynthesis, stopSynthesis

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

startSynthesis = function(text) {
  ttsText.value = text  // ttsText를 원하는 텍스트로 설정
  utterance.text = ttsText.value
  if (selectedVoice.value) {
    utterance.voiceURI = selectedVoice.value
  }
  window.speechSynthesis.speak(utterance)
}

stopSynthesis = function() {
  window.speechSynthesis.cancel()
}

export { startSynthesis, stopSynthesis, selectedVoice, voices }
