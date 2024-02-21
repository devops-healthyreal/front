<template>
  <div :style="{'height':'50px'}">
    <VSelect
      v-model="country"
      :items="items"
      label="시/군/구"
      variant="filled"
      :style="{'width':'30%','float':'left', 'margin-right':'20px', 'margin-left':'20px'}"
      prepend-icon="mdi-map-search-outline"
    />
    <VSelect
      v-model="selectedPath"
      :items="pathsName[country]"
      label="경로"
      variant="filled"
      :style="{'width':'50%','float':'left'}"
      prepend-icon="mdi-map-marker-path"
      @update:model-value="changePath"
    />
  </div>
  <div
    id="map"
    :style="{'width':'100%','height':'450px'}"
  /> <!-- @click="$emit('refreshChildRoad', lat[0], lng[0], drawingMap)" -->
</template>

<script setup>
import { createRoadView } from '@/pages/exercise/createRoadView'
import { getCurrentPosition, getLatLng, getPedePath } from '@/pages/exercise/googleGeoCoderAPI'
import { ref } from 'vue'

//메뉴 선택 핸들러 부분 start-----------
const country = ref(null) //사용자가 선택한 지역

const selectedPath = ref(null) //경로 선택지를 담을 변수

var items = ref([ //즐겨찾기 경로의 시/군/구 카테고리 선택 (받아온 데이터라고 가정)
  '아산시',
  '영월군',
])


var paths = { //카테고리에 해당되는 즐겨찾기 경로 모음 
  '아산시': [['탕정면사무소', '꾀꼴산성'], ['봉곡사', '봉수산', '오형제고개', '배골마을', '송악저수지']],
  '영월군': [['출향인공원', '삭도', '예밀'], ['예밀', '모운동']],
}

var pathsName = {} //메뉴에 뿌려줄 값을 담은 변수

for(const key in paths){ //path의 첫번째 원소에 뿌려줄 값을 저장
  pathsName[key] = []
  for (const path of paths[key]){ 
    var temp = ''
    path.forEach(point => {
      temp += point + '-'
    })
    temp = temp.slice(0, temp.length-1)
    pathsName[key].push(temp)
  }
}

//메뉴 선택 핸들러 부분 end-------------

var map = ref("") //지도 객체를 담을 변수
const markers = ref([]) //지도에 올려줄 마커들을 모아둔 객체 설정
const infos = ref([]) //지도에 올려줄 인포들을 모아둔 객체 설정
var polyline = ref()

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
      
          createRoadView(map.value) //지도에 동동이 및 로드뷰 띄우기
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

//지도를 화면에 로드하기 위한 함수
//지도 객체는 반응형이 아니므로 initMap 함수를 정의해 사용해야 함
const initMap = (lng, lat) => {
  const container = document.getElementById("map")

  const options = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 5,
  }

  map.value = new kakao.maps.Map(container, options)
  map.value.relayout()

  polyline.value =  new kakao.maps.Polyline({ //지도에 올려줄 polyline 설정
    strokeWeight: 3,
    strokeColor: '#007B2A',
    strokeOpacity: 1,
    strokeStyle: 'solid',
  })

}


const changePath = () => {
  console.log('paths', paths)
  console.log('country', country.value) //아산시
  console.log('selectedPath', selectedPath)
  var loadName
  for (var i=0; i<paths[country.value].length; i++) {
    if (pathsName[country.value][i] === selectedPath.value) loadName = paths[country.value][i]
  }
  console.log('loadName', loadName)

  //😴
  var load = []
  var places = new kakao.maps.services.Places() //검색을 위한 객체

  //load.value = [] //위도 경도 저장을 위한 변수
  loadName.forEach(name => {
    console.log('name:', name)
    getLatLng(name).then(latlng=> {
      console.log(`${name} latlng:`, latlng)
      load.push([latlng.lat, latlng.lng])
    })
      .catch(err=>{
        places.keywordSearch(name, (result, status)=>{
          if (status === kakao.maps.services.Status.OK) {
            console.log('검색 결과:', result[0]) //위도, 경도 값에 대한 정보가 나와있음
            load.push([result[0].y, result[0].x]) //[x,y] = [lng, lat]
          }
        })
      })
  })

  //recoPath: [Array(2), Array(2), Array(2)]
  //likeMap: {0: Array(2), 1: Array(2)}
  console.log('like-path에서 넘겨준 값:', load) //{0: Array(2), 1: Array(2)}
  getPedePath(load, loadName, map.value, polyline.value, markers, infos)
  map.value.relayout()
}
</script>

<style>
.info-title {
  display: block;
  border-radius: 4px;
  background: #50627f;
  block-size: 24px;
  color: #fff;
  line-height: 22px;
  padding-block: 0;
  padding-inline: 10px;
  text-align: center;
}
</style>
