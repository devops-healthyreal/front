<script setup>
import axios from '@axios'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import AppSearchHeaderBgDark from '@images/pages/app-search-header-bg-dark.png'
import AppSearchHeaderBgLight from '@images/pages/app-search-header-bg-light.png'

const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  subtitle: {
    type: String,
    required: false,
  },
  customClass: {
    type: String,
    required: false,
  },
  connetId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['crawlingComplete'])

defineOptions({ inheritAttrs: false })

const themeBackgroundImg = useGenerateImageVariant(AppSearchHeaderBgLight, AppSearchHeaderBgDark)
const searchKeyword = ref('')
const kincrawlingresult = ref([])

const kincrawling = () => {
// 검색 실행
  axios.get('http://localhost:5000/kinCrawling', { params: {
    search: searchKeyword.value,
    id: props.connetId,
  } })
    .then(response => {
      // 검색 결과 처리
      kincrawlingresult.value = response.data
      console.log('검색어 크롤링 :', kincrawlingresult.value)
      console.log(kincrawlingresult.value[0])
      emit('crawlingComplete', kincrawlingresult.value)
    })
    .catch(error => {
      // 에러 처리
      console.error(error)
    })
}
</script>

<template>
  <!-- 👉 Search Banner  -->
  <VCard
    flat
    class="text-center search-header"
    :class="props.customClass"
    :style="`background: url(${themeBackgroundImg});`"
  >
    <VCardText>
      <h5 class="text-h5 text-primary mb-6">
        {{ props.title }}
      </h5>

      <!-- 👉 Search Input -->
      <!-- v-bind="$attrs" -->
      <VTextField        
        v-model="searchKeyword"
        placeholder="Search"
        class="search-header-input mx-auto my-3"
        @keyup.enter="kincrawling"
      >
        <template #prepend-inner>
          <VIcon
            icon="mdi-magnify"
            size="24"
          />        
        </template>
      </VTextField>

      <p>{{ props.subtitle }}</p>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.search-header {
  padding: 4rem !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}

// search input
.search-header-input {
  border-radius: 0.375rem;
  background-color: rgb(var(--v-theme-surface));
  max-inline-size: 28.125rem;

  .v-field__prepend-inner {
    i {
      inset-block-start: 3px !important;
    }
  }
}

@media (max-width: 37.5rem) {
  .search-header {
    padding: 1.5rem !important;
  }
}
</style>
