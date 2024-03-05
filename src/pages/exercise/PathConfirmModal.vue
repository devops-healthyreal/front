<script setup>
import axios from '@axios'
import { defineEmits, defineProps, watch } from 'vue'
import { useStore } from 'vuex'


const props = defineProps({
  isDialogVisible: {
    type: Boolean,
  },
})

const emit=defineEmits(['returnBool'])
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId= ref(userInfo.value.id)

const mateLists = []

const isDialogVisible = ref(false)

const isMateSelected = ref(true)

onMounted(()=>{
  //메이트 리스트 불러오기
  axios.get("http://localhost:4000/comm/mate", { params: { id: connetId.value } })
    .then(resp=>{
      for (const mate of resp.data) {
        mateLists.push({
          name: mate.mate_id,
          avatar: mate.profilePath,
        })
      }
    })
    .catch(err => console.error("에러발생", err))
  isDialogVisible.value = props.isDialogVisible
})

const submit = () => {
  console.log("select에서 선택된 값 확인", value)
  emit('returnBool', false)
  if(value.value.length === 0) {
    
  }
}

watch(()=>props.isDialogVisible, ()=>{
  console.log("모달창이 뜰 때 실행됨?")
  isDialogVisible.value = props.isDialogVisible
})

const mateChanged = () => {
  console.log(value.value.length)
  if(value.value.length === 0) {
    isMateSelected.value = true
  }
  else{
    isMateSelected.value = false
  }
}

const value = ref()
</script>


<template>
  <VDialog
    :model-value="isDialogVisible"
    persistent
    width="500"
    style="padding-top: 20px;"
  >
    <VCard>
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="$emit('returnBool', false)"
      />
      <VCardText>
        🏃‍♀️ 산책을 같이 할 메이트를 선택하세요
      </VCardText>
      <VDivider />
      <VCardItem>
        <VSelect 
          v-model="value"
          style="margin-top: 10px;"
          :items="mateLists"
          item-title="name"
          item-value="name"
          label="나의 메이트 목록"
          multiple
          clearable
          clear-icon="mdi-close"
          @update:model-value="mateChanged"
        >
          <template #selection="{ item }">
            <VChip>
              <VAvatar
                start
                :image="item.raw.avatar"
              />
              <span>{{ item.title }}</span>
            </VChip>
          </template>
        </VSelect>
      </VCardItem>
      <VBtn
        variant="text"
        color="info"
        size="small"
        width="100px"
        style="margin: 0 auto;"
      >
        혼자 걸을래요
      </VBtn>
      <VBtn
        id="submitBtn"
        :disabled="isMateSelected"
        style="margin-top: 20px;"
        @click="submit"
      >
        등록
      </VBtn>
    </VCard>
  </VDialog>
</template>

