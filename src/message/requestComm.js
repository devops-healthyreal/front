import { getGoogleKey } from '@/config'
import axios from '@axios'
import { ref } from 'vue'

export const sendCommReqMessage = (userId, subToId, cate) => {
  //subToId의 FMC토큰값을 얻어야함
  var fmcToken = ref('')
  console.log('sendCommReqMessage:', userId, subToId)
  var title
  var body
  if(cate=='s'){
    title = '구독 알림'
    body = `${userId}님이 회원님을 구독하셨습니다`
    console.log('구독 알림 보내기', title, body)
  }
  else if(cate=='fReq'){
    title = '친구 요청 알림'
    body = `${userId}님이 회원님께 친구 요청을 보냈습니다`
  }
  else if(cate=='fResp'){
    title = '친구 수락 알림'
    body = `${userId}님이 회원님의 친구 요청을 수락하셨습니다`
  }
  else if(cate=='mReq'){
    title = '메이트 요청 알림'
    body = `${userId}님이 회원님께 메이트 요청을 보냈습니다`
  }
  else{
    title = '메이트 수락 알림'
    body = `${userId}님이 회원님의 메이트 요청을 수락하셨습니다`
  }
  axios.get("http://localhost:4000/get/fmctoken", { params: {
    id: subToId,
  } })
    .then(res=> {
      console.log('requestComm.cjs파일에서 받은 토큰값 확인:', res.data)
      fmcToken.value = res.data
      console.log('차라리 여기서 오류가 난거라면..', fmcToken.value)
      
      const FCM_API_URL = 'https://fcm.googleapis.com//v1/projects/webpushtest-c99b3/messages:send'

      getGoogleKey().then(token=>{

        const SERVER_KEY = token//`bearer ${token}`
  
        //console.log('reqComm.js:', SERVER_KEY)
  
  
        //백그라운드 상태에서 오는 알림
        //onBackgroundMessage 함수를 이용해 백그라운드 메시지가 등록되는 것 같은데
        //아래의 코드는 background Message로 등록되어 있지 않음에도 왜 백그라운드 상태일 때 호출되는 것인지
        //이유는 아직 찾지 못함
        const message = {
          "message": {
            "token": fmcToken.value,
            "notification": { 
              "title": title,
              "body": body,
            },
            "webpush": { 
              "fcm_options": {
                "link": "https://dummypage.com",
              },
            },
          },
        } //message
            
        axios.post(FCM_API_URL, message, { //요청 보내기
          headers: {
            'Content-Type': 'application/json',
            'Authorization': SERVER_KEY,
          },
        },
        ).then(resp=>{
          console.log(resp.data)
        })
          .catch(err => console.log(err)) //axios.post
      })
    })
      
}
