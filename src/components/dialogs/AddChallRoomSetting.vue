<script setup>
import AddressApi from '@/components/dialogs/RoomSetAddressApi.vue'
import axios from '@axios'
import { ref } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  userAddress: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible'])

const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)

}

const userAddress = reactive({
  address: '',
})

const handleUpdateAddress = newAddress => {
  userAddress.address = newAddress.address
}




const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id
  
const userset = ref(4) //정원 수
const achievementset = ref(50) //달성기준
let addressData = ref(null)

const selectedCheckbox = ref([])

const sliderValues = ref([
  0,
  100,
])

const selectedOption1 = ref('5,000원')
const openRoomYN = ref(true) // 방공개여부
const dateRange = ref('')
const content = ref('')
const title = ref('')
const id = connetId



const createRoom = async () => {
  console.log("userset---", userset)
  console.log("achievementset---", achievementset)
  console.log("selectedCheckbox---", selectedCheckbox)
  console.log("sliderValues---", sliderValues)
  console.log("selectedOption1---", selectedOption1)
  console.log("openRoomYN---", openRoomYN)
  console.log("dateRange---", dateRange)
  console.log("connetId-----", connetId)
  
  try {
    console.log("addressData---", userAddress.address)

    const response = await axios.post('http://localhost:4000/croom/createRoom.do', {
      userset: userset.value,
      achievementset: achievementset.value,
      areaSet: userAddress.address,
      selectedCheckbox: selectedCheckbox.value,
      sliderValues: sliderValues.value,
      selectedOption1: selectedOption1.value,
      openRoomYN: openRoomYN.value,
      dateRange: dateRange.value,
      content: content.value,
      title: title.value,
      id: connetId,
    })



    if (response.status === 200) {
      console.log('방 생성이 완료되었습니다.')
      router.push({ name: 'apps-user-id', params: { id: 21 } }) //넘겨줄 Vue 경로 입력하기
    } else {
      console.log('방 생성에 실패하였습니다.')
    }
  } catch (error) {
    console.error(error)
  }
}

//유효성 검사
const isValid = computed(() => {
  if (toggleSwitch.value === true && selectedCheckbox.value.length === 0) {
    return false
  }
  
  return userset.value > 0 && achievementset.value > 0 && userAddress.address !== '' && selectedOption1.value !== '' && dateRange.value !== '' && content.value !== ''
})

const usersetlabel = { //정원Silder 초기값, 끝값 라벨 
  2: '2',
  8: '8',
}

const achievementlabel = { //달성기준Silder 초기값, 끝값 라벨 
  0: '0',
  100: '100',
}



const toggleSwitch = ref(true) // 참여자 제한 유무 

const capitalizedLabel = label => {
  const convertLabelText = label.toString()
  
  return convertLabelText.charAt(0).toUpperCase() + convertLabelText.slice(1)
}

const checkboxContent = [
  {
    title: '남자',
    value: 1,
  },
  {
    title: '여자',
    value: 2,
  },
]

const pay = [
  '5,000원',
  '10,000원',
  '20,000원',
  '30,000원',
  '50,000원',
]

const router = useRouter()
</script>


<template>
  <VDialog
    :model-value="props.isDialogVisible"
    max-width="900"
    persistent  
    @update:model-value="dialogVisibleUpdate"
  >
    <VCard class="share-project-dialog pa-5 pa-sm-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="emit('update:isDialogVisible', false)"
      />

      <VCardText>
        <VCardText style=" border-radius: 20px;background-color: #7ce626;">
          <div class="text-h5 mb-1 text-center">
            <strong>목표 설정</strong>
          </div>
        </VCardText>
        <VCol
          class="fbox"
          style="padding-bottom: 0;"
        >
          <VCol
            class="fitem"
            cols="4"
            rows="5" 
          >
            정원 설정 : <strong>{{ userset }}</strong>
            
            <VSlider
              v-model="userset"
              :step="1"
              :min="2"
              :max="8"
              :ticks="usersetlabel"
              show-ticks="always"
              tick-size="4"
            />
          </VCol>
          <VCol
            class="fitem"
            cols="4"
            rows="5"                
          >
            달성기준 : <strong>{{ achievementset }} % </strong>
            <VSlider
              v-model="achievementset"
              :step="1"
              :min="0"
              :max="100"
              :ticks="achievementlabel"
              show-ticks="always"
              tick-size="4"
            />
          </VCol>
          <!--
            <VCol>
            {{type}}
            </VCol> 
          -->
          <VCol
            class="fitem"
            cols="4"
            rows="5" 
            style="text-align: center;"
          >
            <AddressApi
              v-model="userAddress"
              :new-address="userAddress" 
              @update-address="handleUpdateAddress"
            />
          </VCol>
        </VCol>
        <VCol>
          <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-4">
            <h4>참여자 제한 설정</h4>
            <VSwitch
              v-model="toggleSwitch"
              style="float: inline-end;"
              :label="areaSet = capitalizedLabel(toggleSwitch) === 'True' ? 'ON' : 'OFF' "
            />
          </div>
          <Transition name="fade">
            <VCol
              v-if="areaSet === 'ON'"
              class="fbox"
              style="border-radius: 10px;background-color: #e9e9e9;"
            >
              <VCol
                class="fitem"
                cols="6"
                rows="4" 
              >
                <h4>성별</h4>
                <CustomCheckboxes
                  v-model:selected-checkbox="selectedCheckbox"
                  :checkbox-content="checkboxContent"
                  :grid-column="{ sm: '6', cols: '12' }"
                />
              </VCol>
              <VCol
                class="fitem"
                cols="6"
                rows="4"                    
              >
                <h4>
                  연령 : {{ (sliderValues[0] == 0 && sliderValues[1] == 100) ? '전체 연령' : sliderValues[0].toString() + '살 ~' + sliderValues[1].toString() + '살' }}                 
                </h4>
                <VCol style=" display: flex;width: 100%; justify-content: center;">
                  <VRangeSlider
                    v-model="sliderValues"
                    step="1"
                  />
                </VCol>
              </VCol>
            </VCol>
          </Transition>
        </VCol>
        <VCol class="fbox">
          <VCol
            class="fitem"
            cols="4"
            rows="5" 
            style="justify-content: center;text-align: center;"
          >
            <h4>
              참여비
            </h4>
            <VCol cols="12">
              <VSelect
                v-model="selectedOption1"
                :items="pay"
                label="Select"
                prepend-icon="mdi-currency-usd"
                single-line
                variant="filled"
              />
            </VCol>
          </VCol>
          <VCol
            class="fitem"
            cols="3"
            rows="5" 
            style="justify-content: center;text-align: center;"
          >
            <h4>방 공개 여부</h4>
            <VCol style=" display: flex;width: 100%; justify-content: center;">               
              <VSwitch
                v-model="openRoomYN"
                :label="areaSet = capitalizedLabel(openRoomYN) === 'True' ? 'ON' : 'OFF' "
              />
            </VCol>
          </VCol>
          <VCol
            class="fitem"
            cols="5"
            rows="5" 
            style="justify-content: center;text-align: center;"                  
          >
            <h4>기간 설정</h4>
            <AppDateTimePicker
              v-model="dateRange"
              label="기간을 설정해주세요"
              :config="{ mode: 'range', closeOnSelect: true }"
            />
          </VCol>
        </VCol>

        <VCol cols="12">
          <VTextarea
            v-model="title"
            rows="1"
            label="제목"
          />
        </VCol>
        <VCol
          cols="12"
          rows="4"
        >
          <VTextarea
            v-model="content"
            label="내용"
          />
          <VCol style="text-align: center;">
            <VBtn
              :disabled="!isValid"
              @click="createRoom"
            >
              확인
            </VBtn>
          </VCol>
        </vcol>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
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
