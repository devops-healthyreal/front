<script setup>
import AddressApi from '@/components/dialogs/RoomSetAddressApi.vue'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible'])

const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)
}


const userset = ref(4) //정원 수

const usersetlabel = { //정원Silder 초기값, 끝값 라벨 
  2: '2',
  8: '8',
}

const toggleSwitch = ref(true) // 참여자 제한 유무 
const matchingYN = ref(true) // 매칭희망여부
const openRoomYN = ref(true) // 방공개여부

const capitalizedLabel = label => {
  const convertLabelText = label.toString()
  
  return convertLabelText.charAt(0).toUpperCase() + convertLabelText.slice(1)
}

const checkboxContent = [
  {
    title: '남자',
    value: 'man',
  },
  {
    title: '여자',
    value: 'woman',
  },
]

const selectedCheckbox = ref(['man', 'woman'])

const sliderValues = ref([
  0,
  100,
])

const date = ref('')

const router = useRouter()

const createRoom = () => {
  router.push({ name: 'mate' }) //넘겨줄 Vue 경로 입력하기
}
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
        <VRow>
          <VCol cols="4">
            <strong>운동 종류 선택</strong>
            <Mategoal
              style="margin-top: 10px;"
              @update:model-value="handleGoalNoChanged"
            />
          </VCol>
          <VCol
            class="fitem"
            cols="4"
            rows="5"                
          >
            <strong>날짜 및 시간</strong>
            <AppDateTimePicker
              v-model="date"
              :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
              style="margin-top: 10px;"
            />
          </VCol>
          <VCol
            class="fitem"
            cols="2"
            rows="2" 
            style="justify-content: center;text-align: center;"
          >
            매칭
            <VSwitch
              v-model="matchingYN"
              :label="capitalizedLabel(matchingYN) === 'True' ? 'ON' : 'OFF' "
              style="margin-left: 18px;"
            />
          </VCol>
          <VCol
            class="fitem"
            cols="2"
            rows="2" 
            style="justify-content: center;text-align: center;"
          >
            방 공개
            <VSwitch
              v-model="openRoomYN"
              :label="capitalizedLabel(openRoomYN) === 'True' ? 'ON' : 'OFF' "
              style="margin-left: 18px;"
            />
          </VCol>
        </VRow>
        <VCol
          class="fbox"
          style="padding-bottom: 0;"
        >
          <VCol
            class="fitem"
            cols="8"
            rows="5" 
          >
            <h4>
              정원 설정 : {{ userset }}
            </h4>
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
            <AddressApi />
          </VCol>
        </VCol>
        <VCol>
          <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-4">
            <h4>참여자 제한 설정</h4>
            <VSwitch
              v-model="toggleSwitch"
              style="float: inline-end;"
              :label="userlimit = capitalizedLabel(toggleSwitch) === 'True' ? 'ON' : 'OFF' "
            />
          </div>
          <VCol
            v-if="userlimit === 'ON'"
            class="fbox"
            style="border-radius: 10px;background-color: #f7f6f6;"
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
        </VCol>

        <VCol
          cols="12"
          rows="4"
        >
          <VTextarea label="내용" />
        </VCol>
        <VCol style="text-align: center;">
          <VBtn @click="createRoom">
            등록
          </VBtn>
        </VCol>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style>
.fbox {
  display: flex;

  /* border:2px solid red; */
}

.fitem {
  /* border:1px solid green; */
}
</style>
