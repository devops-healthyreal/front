import { drawPolyLine } from '@/pages/exercise/createRoadView'
import axios from '@axios'

export async function getLatLng(keyword) { //구글 지도 api를 사용하여 위도, 경도 값 가져오기
  //입력받은 keyword를 url에 사용가능하게 인코딩
  var encodedAddress = encodeURIComponent(keyword)
  console.log('getLatLng에서 받은 인자:', keyword)
  console.log('넘겨준 address값:', encodedAddress)
  var geocodeKey = "AIzaSyDWWbycYmJo8T-6pHev1YUPWi_5W5FIHl0" //Geocoding api 키
  const resp = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${geocodeKey}`)

  console.log('반환값:', resp.data.results[0])
  if (typeof resp.data.results[0] == 'undefined') {
    return ''
  }
  
  return resp.data.results[0].geometry.location
}//getLatLng

export const getCurrentPosition = () => { //사용자의 현재 위치를 얻어오기 위한 함수
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

function checkArrayUpdated(arr) { //배열이 업데이트 되었는지 확인하는 함수
  return new Promise(resolve=>{
    setTimeout(()=>{
      if(arr.length != 0) resolve(arr)
    }, 1000)
  })
}//checkArrayUpdated

export function getPedePath(path, pathName, map, polyline, markers, infos) { //lat,lng 티맵라이브러리 (보행자의 경로를 불러오는 함수)
  
  checkArrayUpdated(path).then(path=>{
    if (path.length == 2){
      axios.post("https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&callback=function", JSON.stringify({
        speed: 30,
        endPoiId: "10001",
        reqCoordType: "WGS84GEO",
        searchOption: "0",
        resCoordType: "WGS84GEO",
        sort: "index",
        startX: path[0][1],
        startY: path[0][0],
        endX: path[1][1],
        endY: path[1][0],
        startName: encodeURIComponent(pathName[0]),
        endName: encodeURIComponent(pathName[1]),
      }), { headers: { 'accept': 'application/json', 
        'Content-Type': 'application/json',
        'appKey': 'nv0BZXqXpg62Y6cs6huTX6L0VKdvHXoN8Kf7tnwV' } })
        .then(resp=>{
          var pedePathPoint = { "pedePath": [], "pointPath": [] }

          for(var i=0; i<resp.data.features.length;i++){
            if (resp.data.features[i].properties.pointType!="GP" && resp.data.features[i].properties.pointType!=undefined){
              //[127.08084206052835, 37.47543377320427]
              console.log(resp.data.features[i].properties.pointType, ":", resp.data.features[i].geometry.coordinates)
              pedePathPoint.pointPath.push([resp.data.features[i].geometry.coordinates[1], resp.data.features[i].geometry.coordinates[0]])
            }
            if(resp.data.features[i].geometry.type=="LineString") {
              for (const point of resp.data.features[i].geometry.coordinates){
                pedePathPoint.pedePath.push([point[1], point[0]])
              }
            }
          }
          
          return pedePathPoint
        })
        .then(pedePathPoint=>{
          console.log('drawPolyLine에 넘기기 전;', pedePathPoint)
          drawPolyLine(pedePathPoint, pathName, map, polyline, markers, infos)
        })
    }
    else {
      var pathListParam=""
      for(var i=1; i<path.length-1; i++) {
        pathListParam += `${path[i][1]},${path[i][0]}_`
      }
      pathListParam = pathListParam.substring(0, pathListParam.length-1)
      console.log('pathListParam체크:', pathListParam)
      axios.post("https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&callback=function", JSON.stringify({
        startX: path[0][1],
        startY: path[0][0],
        angle: 20,
        speed: 30,
        endPoiId: "10001",
        endX: path[path.length-1][1],
        endY: path[path.length-1][0],
        passList: pathListParam,
        reqCoordType: "WGS84GEO",
        startName: encodeURIComponent(pathName[0]),
        endName: encodeURIComponent(pathName[1]),
        searchOption: "0",
        resCoordType: "WGS84GEO",
        sort: "index",
      } ), { headers: { 'Content-Type': 'application/json',
        'appKey': 'nv0BZXqXpg62Y6cs6huTX6L0VKdvHXoN8Kf7tnwV' } })
        .then(resp=>{
          var pedePathPoint = { "pedePath": [], "pointPath": [] }

          //var pedePathPoint = []
          console.log('반복문 전:', resp.data)
          for(var i=0; i<resp.data.features.length;i++){
            console.log(`${i}번째 pointType`, resp.data.features[i].properties.pointType)
            if (resp.data.features[i].properties.pointType!="GP" && resp.data.features[i].properties.pointType!=undefined){
              //[127.08084206052835, 37.47543377320427]
              console.log(resp.data.features[i].properties.pointType, ":", resp.data.features[i].geometry.coordinates)
              pedePathPoint.pointPath.push([resp.data.features[i].geometry.coordinates[1], resp.data.features[i].geometry.coordinates[0]])
            }
            if(resp.data.features[i].geometry.type=="LineString") {
              for (const point of resp.data.features[i].geometry.coordinates){
                pedePathPoint.pedePath.push([point[1], point[0]])
              }
            }
          }
          
          return pedePathPoint
        })
        .then(pedePathPoint=>{
          console.log('drawPolyLine에 넘기기 전;', pedePathPoint)
          drawPolyLine(pedePathPoint, pathName, map, polyline, markers, infos)
        })
    }
  })
} //getPedePath
