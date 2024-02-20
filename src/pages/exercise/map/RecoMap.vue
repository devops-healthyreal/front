<template>
  <div>
    <VSelect
      id="selectPath"
      :items="recommendPathView"
      label="추천 경로를 선택하세요"
      variant="filled"
      :style="{'width':'100%','float':'right'}"
      @change="selectButton"
    />
  </div>
  <div
    id="recoMap"
    :style="{'width':'100%','height':'450px'}"
  /><!-- @click="$emit('refreshChildRoad', lat[0], lng[0], drawingMap)" -->
</template>

<script setup>
import { createRoadView } from '@/pages/exercise/createRoadView'
import { ref } from 'vue'

//lat, lng 값을 저장할 변수 
const emit = defineEmits(["updateRoadView"])

const selectButton = () => {
  console.log('값이 바뀜')
}

var recommendPath = [ //받아온 데이터라고 가정
  ["달터근린공원", "구룡산길", "개암약수터"],
  ["실로암 약수터", "대모산 초소위", "독도모형", "대모산 정상"],
  ["선정릉", "봉은사"],
]
var map = ref(null) //지도 객체를 담을 변수
var recommendPathView = [] //받아온 경로를 뿌려주는 값을 저장할 변수
var pathAboutLatLng = []
onMounted(()=>{
  const script = document.createElement("script")

  console.log(document.getElementById('selectPath'))
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
          console.log('reco:', map.value)
      
          createRoadView(map.value)
        })
        .catch(err => {
          console.error(err)
        })
      
      
      

      //map.relayout()

      var places = new kakao.maps.services.Places() //검색을 위한 객체
      recommendPath.forEach(path=>{
        var temp = [] //[[lng,lat], [lng,lat], [lng,lat]...]
        var option = ''
        path.forEach(point=>{
          option += point + '-' //뿌려주는 용도의 text
          places.keywordSearch(point, (result, status)=>{
            if (status === kakao.maps.services.Status.OK) {
              //console.log('검색 결과:', result[0]) //위도, 경도 값에 대한 정보가 나와있음
              temp.push([result[0].x, result[0].y]) //[x,y] = [lng, lat]
            }
          })
        })
        recommendPathView.push(option) //드롭다운 선택란에 뿌려줄 값
        pathAboutLatLng.push(temp) //지도에 뿌려줄 위도, 경도 값
        console.log('pathAboutLatLng', pathAboutLatLng)
      })
      
    })
  }
  script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=ca9eb44c2889273e11b9860d99308508&libraries=services,clusterer,drawing"
  document.head.appendChild(script)
})

window.onclick = () =>{
  var pathTag = document.getElementsByClassName('v-select__selection-text')[0]
  if(typeof pathTag != 'undefined') {
    var path = pathTag.textContent
    console.log(path)
  }
}


//지도를 화면에 로드하기 위한 함수
//지도 객체는 반응형이 아니므로 initMap 함수를 정의해 사용해야 함
const initMap = (lng, lat) => {
  const container = document.getElementById("recoMap")

  const options = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 5,
  }

  map.value = new kakao.maps.Map(container, options)
  map.value.relayout()
  emit("updateRoadView", map.value)

  //경로 가져오기
}

//사용자의 현재 위치를 얻어오기 위한 함수
const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        resolve([position.coords.longitude, position.coords.latitude])
      }, error => {
        reject(error)
      })
    } else {
      reject(new Error('Geolocation is not supported by this browser.'))
    }
  })
}
</script>
