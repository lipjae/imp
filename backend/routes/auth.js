let express = require('express');
let router = express.Router();
var firebase = require("firebase/app");

const qs = require('qs')
const rq = require('request')
const axios = require('axios');
const bodyPaser = require('body-parser')
const auth = require('../model/Auth')
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

router.get('/login',function(req, res){

  if(req.query.code == undefined){
    
    // & scope=birthday, account_email, gender, profile
    res.redirect('https://kauth.kakao.com/oauth/authorize?client_id=b8bd2008ad9c38a214dd349e3260183d&redirect_uri=http://localhost:3000/auth/login&response_type=code&scope=talk_message,birthday,account_email,talk_message,gender,profile,friends')

  }else{
                              
      try {
          var result = await axios.post('https://kauth.kakao.com/oauth/token', qs.stringify({
              'grant_type': 'authorization_code',
              'client_id': 'b8bd2008ad9c38a214dd349e3260183d',
              'redirect_uri': 'http://localhost:3000/api/auth',
              'code': req.query.code
          }))
                    
          await fs.writeJson('../auth/kakao_access.json', result.data)
          console.log(result.data)    
          res.json(result.data)
          // res.redirect('http://localhost:8080/api/kakao?auth=success')    
          
          
          
          
      } catch (error) {
          console.log(error)
      }      
      
  }
})

// router.get('/login', function(req, res){
//   res.send('<div><a id="kakao_login" href="http://localhost:3000/api/auth"><img src="http://localhost:8080/statics/img/kakao_login.png" alt=""></a></div>')
// })
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