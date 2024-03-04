<template>
  <VDialog 
    v-model="isDialogVisible"
    persistent
  >
    <VCard>
      <VCardText>
        아래의 경로로 등록하시겠습니까?
      </VCardText>
      <VCardItem>
        <div id="map" />
      </VCardItem>
    </VCard>
  </VDialog>
</template>

<script setup>
import { getCurrentPosition } from '@/pages/exercise/googleGeoCoderAPI'
import { onMounted } from 'vue'

const map = ref()

onMounted(()=>{
  const script = document.createElement("script")

  script.onload = () => {
    kakao.maps.load(()=>{ //kakao가 로드되었을 때 실행될 콜백함수 정의

      //지도 띄우기
      //lng, lat 값 얻기
      var lng
      var lat
      getCurrentPosition()
        .then(([currlng, currlat])=>{
          lng = currlng
          lat = currlat
          initMap(lng, lat)
          map.value.relayout()
      
          createRoadView(map.value)
        })
        .catch(err => {
          console.error(err)
        })
    })
  }
  script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=ca9eb44c2889273e11b9860d99308508&libraries=services,clusterer,drawing"
  document.head.appendChild(script)
})

const initMap = (lat, lng) => {
  const container = document.getElementById("map")

  const options = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 3,
  }

  map.value = new kakao.maps.StaticMap(container, options)
}
</script>
