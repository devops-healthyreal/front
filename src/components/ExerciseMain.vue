<script setup>
import axios from '@axios'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'


const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId=userInfo.value.id

const data = ref([])

const getData = async ()=>{

  const response = await axios.post('http://127.0.0.1:4000/exer/getData.do', { id: connetId })

  data.value = response.data
  console.log("운동 값 가져와??", response)

}

onMounted(getData)

console.log("운동 값 가져와??", data.value)

const isCardDetailsVisible = ref(false)
</script>

<template>
  <VRow>
    <!-- 👉 Influencing The Influencer -->
    <VCol
      v-for="(item, index) in data"
      :key="index"
      cols="12"
      sm="6"
      md="4"
    >
      <VCard>
        <iframe
          width="100%"
          height="150"
          :src="item.evideoPath"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />

        <VCardItem>
          <VCardTitle>{{ item.ename }}</VCardTitle>
        </VCardItem>

        <VCardText style="height: 120px;">
          {{ item.econtent }}
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.avatar-center {
  position: absolute;
  border: 5px solid rgb(var(--v-theme-surface));
  inset-block-start: -2rem;
  inset-inline-start: 1rem;
}

// membership pricing
.member-pricing-bg {
  position: relative;
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
}

.membership-pricing {
  sup {
    inset-block-start: 9px;
  }
}
</style>
