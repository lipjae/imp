let express = require('express');
let router = express.Router();
var firebase = require("firebase/app");

const qs = require('qs')
const rq = require('request')
const axios = require('axios');
const bodyPaser = require('body-parser')
const Auth = require('../model/Auth')
const fs = require('fs-extra')


const firebaseConfig = {
  apiKey: "AIzaSyAt4tSgkCiCC77ZmWvE2U_Hb1e5vsb14pI",
  authDomain: "iamport.firebaseapp.com",
  databaseURL: "https://iamport.firebaseio.com",
  projectId: "iamport",
  storageBucket: "iamport.appspot.com",
  messagingSenderId: "375216410780",
  appId: "1:375216410780:web:ff7ddb852394d78356dd59",
  measurementId: "G-BP6E2QG7ZC"
};


firebase.initializeApp(firebaseConfig);

router.use(bodyPaser.json())

router.get('/login', function(req, res){
  res.send('<div><a id="kakao_login" href="http://localhost:3000/api/auth"><img src="http://localhost:8080/statics/img/kakao_login.png" alt=""></a></div>')
})

router.get('/', async function(req, res){
  console.log(req.query.code)
  
  if (req.query.code != undefined){

    try {
      var accessResult = await axios.post('https://kauth.kakao.com/oauth/token', qs.stringify({
        'grant_type': 'authorization_code',
        'client_id': 'b8bd2008ad9c38a214dd349e3260183d',
        'redirect_uri': 'http://localhost:3000/auth',
        'code': req.query.code
      }))
      console.log(accessResult.data)

      console.log('인증토큰: ' + accessResult.data.access_token)
      
      var profile = await axios({
        methods : 'POST',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: {
          Authorization: 'Bearer ' + accessResult.data.access_token
        }
      })

      console.log(profile.data)

      let signRes = await Auth.socialUp({
        id: profile.data.id,
        token: accessResult.data.access_token,
        refresh_token: accessResult.data.refresh_token,
        social_type: 'kakao'
      })

      console.log('db result : ' )
      console.log(signRes)
      
      
      res.redirect('http://localhost:8080/api/kakao?auth=success')    
    } catch (error) {
      res.send(error)
    }

  }else{
    res.redirect('http://localhsot:8000/api/login')
  }
})

router.get('/login/:type', function(req, res){
        
    switch (req.params.type){
      case 'kakao' :
        res.send('1')
        
        res.redirect('https://kauth.kakao.com/oauth/authorize?client_id=b8bd2008ad9c38a214dd349e3260183d&redirect_uri=http://localhost:3000/auth&response_type=code&scope=talk_message,birthday,account_email,talk_message,gender,profile,friends')
        
      break;
    }

    
})
// router.get('/', async function(req,res)  {
//   console.log(req.query.code);
//   if (req.query.code == undefined) {
//     res.redirect('https://kauth.kakao.com/oauth/authorize?client_id=b8bd2008ad9c38a214dd349e3260183d&redirect_uri=http://localhost:3000/auth&response_type=code&scope=talk_message,birthday,account_email,talk_message,gender,profile,friends')
//     // & scope=birthday, account_email, gender, profile
//   } else {
//     // console.log(req.query.code)

//     // var result = await rq.post({
//     //     url: 'https://kauth.kakao.com/oauth/token',
//     //     form : {
//     //         grant_type: 'authorization_code',
//     //         client_id: 'b8bd2008ad9c38a214dd349e3260183d',
//     //         redirect_uri: 'http://localhost:3000/api/auth',
//     //         code: req.query.code
//     //     }
//     // },
//     // await function(err,rqRes,body) {
//     //     // console.log(err)
//     //     // console.log(rqRes)
//     //     console.log(body)
//     //     return body            
//     // })
//     // console.log(result.body)
//     // res.send(result.body)

//     try {
//       var result = await axios.post('https://kauth.kakao.com/oauth/token', qs.stringify({
//         'grant_type': 'authorization_code',
//         'client_id': 'b8bd2008ad9c38a214dd349e3260183d',
//         'redirect_uri': 'http://localhost:3000/auth',
//         'code': req.query.code
//       }))
//       KAKAO_ACCESS_TOKEN = result.data.access_token

//       await fs.outputJson('./auth/kakao_access.json', result.data)
//       console.log(result.data)
//       res.redirect('http://localhost:3000/auth/login')
//       // res.redirect('http://localhost:8080/api/kakao?auth=success')




//     } catch (error) {
//       console.log(error)
//     }

//   }

// })

router.post('/signUp', async (req, res) => {
  
  
  try {
    let retRes = await auth.signUp(req.body.id, req.body.password)
    
    res.send(retRes)
  } catch (error) {
    // res.send(error.response.data)  
  }
  

  
})

module.exports = router;