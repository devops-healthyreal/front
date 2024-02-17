const axios = require('axios')
const { google } = require('googleapis')
const cron = require('node-cron')

//import fs from 'fs'

//import path from 'path'

//const data = fs.readFileSync(path.join(__dirname, '../@core/service-account.json'), 'utf8')


const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const getAccessToken = () => { //구글 api 사용을 위한 토큰
  return new Promise((resolve, reject)=>{
    //const key = JSON.parse(data)
    const key = require('../@core/service-account.json')

    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null,
    )

    jwtClient.authorize((err, token)=>{
      if(err) {
        reject(err)
        
        return
      }
      resolve(token.access_token)
    })
  })
}

getAccessToken().then(token=>{

  const FCM_API_URL = 'https://fcm.googleapis.com//v1/projects/webpushtest-c99b3/messages:send'
  const SERVER_KEY = `Bearer ${token}`//`bearer ${token}`

  //백그라운드 상태에서 오는 알림
  //onBackgroundMessage 함수를 이용해 백그라운드 메시지가 등록되는 것 같은데
  //아래의 코드는 background Message로 등록되어 있지 않음에도 왜 백그라운드 상태일 때 호출되는 것인지
  //이유는 아직 찾지 못함
  const message = {
    "message": {
      "token": "e8GiH-XuS33mVAWgbK0O-A:APA91bFvh7dKjEAzxqdzdjr6xZBp3IaINrmEBU7y5C7A9-0UMdccwjTRZPaOBdAwDfGZgA0oZ4G0E1-G6f7B8iv6AbCA2BkC4Dn1x4ymnv0SwlX_xNRWPFtX0WRbaeRJnGdCvyndwN3z",
      "notification": { 
        "title": "HelloWorld!!!",
        "body": "이제 쫌 돼라",
      },
      "webpush": { 
        "fcm_options": {
          "link": "https://dummypage.com",
        },
      },
    },
  }
  
  const sendMessage = () => { //알림 요청 보내는 부분
    axios.post(FCM_API_URL, message, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': SERVER_KEY,
      },
    },
    ).then(resp=>console.log(resp.data))
      .catch(err => console.log(err))
  }
  
  cron.schedule("* * * * *", sendMessage)
})


