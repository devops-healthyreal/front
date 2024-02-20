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

var items = ref([ //즐겨찾기 경로의 시/군/구 카테고리 선택 (받아온 데이터라고 가정)
  '평창군',
  '영월군',
])


var paths = { //카테고리에 해당되는 즐겨찾기 경로 모음 
  '평창군': [['봉평면 평창군 관광안내센터', '흥정천교', '평촌2교', '강변집', '금산교', '백옥포마을', '흥정천수로길', '백옥포교', '금당계곡로', '노루목고개', '용평여울목']],
  '영월군': [['출향인공원', '삭도', '예밀정류장'], ['예밀정류장', '액자전망대', '모운동']],
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
const load = ref([]) //위도경도값을 저장할 변수


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
  console.log('country', country.value)
  var loadName = paths[country.value]
  load.value = [] //위도 경도 저장을 위한 변수
  console.log('changePath:', loadName)
  loadName.forEach(name => {
    getLatLng(name).then(latlng=>{
      if (latlng!='') load.value.push([latlng.lat, latlng.lng])
      else {
        var places = new kakao.maps.services.Places() //검색을 위한 객체
        places.keywordSearch(name, (result, status)=>{
          if (status === kakao.maps.services.Status.OK) {
            //console.log('검색 결과:', result[0]) //위도, 경도 값에 대한 정보가 나와있음
            load.value.push([result[0].y, result[0].x]) //[x,y] = [lng, lat]
          }
        })
      }
    })
  })
  getPedePath(load.value, loadName, map.value, polyline.value, markers, infos)
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
