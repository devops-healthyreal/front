<template>
  <div
    id="map"
    :style="{'width':'100%','height':'450px'}"
  /> 
</template>

<script setup>
import { getCurrentPosition, getLatLng, getPedePath } from '@/pages/exercise/googleGeoCoderAPI'
import { onMounted } from 'vue'

const map = ref() //지도객체
const markers = ref([]) //지도에 올려줄 마커들을 모아둔 객체 설정
const infos = ref([]) //지도에 올려줄 인포들을 모아둔 객체 설정
const polyline = ref() //지도객체 위의 polyline 정보값
var tempPath = [['출향인공원', '삭도', '예밀']] //더미데이터


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

const initMap = (lng, lat)=>{
  console.log("initMap:", lng, lat)
  var container  = document.getElementById('map'), // 이미지 지도를 표시할 div  
    options = { 
      center: new kakao.maps.LatLng(lat, lng), // 이미지 지도의 중심좌표
      level: 5, // 이미지 지도의 확대 레벨
    }
    
  map.value = new kakao.maps.Map(container, options)
  polyline.value =  new kakao.maps.Polyline({ //지도에 올려줄 polyline 설정
    strokeWeight: 3,
    strokeColor: '#007B2A',
    strokeOpacity: 1,
    strokeStyle: 'solid',
  })

  setTimeout(changePath, 3000)
}

const changePath = () => {
  var places = new kakao.maps.services.Places()
  var load = []

  tempPath.forEach(name => {
    getLatLng(name).then(latlng=> {
      console.log(`${name} latlng:`, latlng)
      load.push([latlng.lat, latlng.lng])
    })
      .catch(err => {
        places.keywordSearch(name, (result, status)=>{
          if (status === kakao.maps.services.Status.OK) {
            console.log('검색 결과:', result[0]) //위도, 경도 값에 대한 정보가 나와있음
            load.push([result[0].y, result[0].x]) //[x,y] = [lng, lat]
          }
        })
      })
  })
  getPedePath(load, tempPath, map.value, polyline.value, markers, infos)
  map.value.relayout()
}
</script>
