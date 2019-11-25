let express = require('express');
let router = express.Router();
var firebase = require('firebase')
var admin = require("firebase-admin");
const qs = require('qs')
const rq = require('request')
const axios = require('axios');
const bodyPaser = require('body-parser')
const Auth = require('../model/Auth')
const fs = require('fs-extra')
const googleKey = require('../auth/firebase.json')


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
admin.initializeApp({
  credential: admin.credential.cert(googleKey)
  // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});


router.use(bodyPaser.json())

router.post('/fbSignUp',(req, res) => {

  var id = req.body.id

  admin.auth().createCustomToken(id)
    .then(function (customToken) {

      firebase.auth().signInWithCustomToken(customToken)
        .then(function (success) {
          res.send(success)
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          res.send(error)
          // ...
        }); 

    })
    .catch(function (error) {
      res.send(error)
      console.log('Error creating custom token:', error);
    });
})

router.post('/verifyToken', (req, res) =>   {
  let idToken = req.body.token
  console.log(idToken)
  admin.auth().verifyIdToken(idToken)
    .then(function (decodedToken) {
      let uid = decodedToken.uid;
      console.log(decodedToken)
      res.send(decodedToken)
      // ...
    }).catch(function (error) {
      console.log(error)
      // Handle error
    });
})

router.post('/createToken',(req, res) => {
  let uid = 'kakaoToken'

  admin.auth().createCustomToken(uid)
    .then(function(customToken){
      res.send(customToken)
    })
    .catch(function (error) {
      console.log('Error creating custom token:', error);
    });
})

router.post('/getUser', (req, res) => {
  
  // admin.auth().getUserByEmail('dlwognscap@gmail.com')
  //   .then(function(userRecord){
  //     console.log(userRecord)
  //     res.send(userRecord.toJSON())
  //   })
  //   .catch(function(err){
  //     console.log(err)
  //     res.send(err)
  //   })
  admin.auth().getUser('kakao-1180319394')
    .then(function (userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully fetched user data:', userRecord.toJSON());
      res.send(userRecord.toJSON())
    })
    .catch(function (error) {
      console.log('Error fetching user data:', error);
      res.send(error)
    });
})

router.post('/getLoginUser',(req, res) => {
  console.log(req.session)
  
  firebase.auth().onAuthStateChanged(function (user) {
    console.log(user)
    if (user) {
      res.send(user)
      // User is signed in.
    } else {
      // No user is signed in.
      res.send('null')
    }
  });
})

router.post('/sign/:type', (req, res) => {
  
  switch (req.params.type){
    case 'up':
      firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then(function (resval) {

        sendSuccess = {
          status: 'success'
        }

        res.send(sendSuccess)

      }).catch(function (error) { 
        let sendErr = {
          errorCode: error.code,
          errorMessage: error.message,
          status: 'error'
        }
        res.send(sendErr)
      });
    break

    case 'in':
      firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(function (resval){

        req.session.uid = resval.user.uid

        sendSuccess = {
          status : 'success'
        }

        res.send(sendSuccess)

      }).catch(function (error) {
        let sendErr = {
          errorCode : error.code,
          errorMessage : error.message,
          status : 'error'
        }
        res.send(sendErr)
      });
    break
  }
  
})

router.get('/login', function(req, res){
  res.send('<div><a id="kakao_login" href="http://localhost:3000/api/auth"><img src="http://localhost:8080/statics/img/kakao_login.png" alt=""></a></div>')
})

router.get('/', async function(req, res){
  
  if (req.query.code != undefined){

    try {

      //kakao access token
      var accessResult = await axios.post('https://kauth.kakao.com/oauth/token', qs.stringify({
        'grant_type': 'authorization_code',
        'client_id': 'b8bd2008ad9c38a214dd349e3260183d',
        'redirect_uri': 'http://localhost:3000/auth',
        'code': req.query.code
      }))
      
      console.log(accessResult.data)

      // kakao user info
      var profile = await axios({
        methods : 'POST',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: {
          Authorization: 'Bearer ' + accessResult.data.access_token
        }
      })

      console.log(profile.data)
      console.log('아이디:' + profile.data.id)

    admin.auth().createCustomToken('kakao-'+profile.data.id)
      .then(function(customToken){
        signInCustom(customToken)
      })
      .catch(function (error) {
        console.log('Error creating custom token:', error);
      });
     
          
    } catch (error) {
      res.send(error)
    }

  }else{
    res.redirect('http://localhsot:8000/api/login')
  }
})

function signInCustom(token){
  
    firebase.auth().signInWithCustomToken(token).then(function (success) {
      console.log(success)
      res.send('http://localhsot:8000/api/login')
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      res.send(error)
      // ...
    }); 
}

router.get('/fireKakao',(req, res) => {
  console.log(req.query.token)
  if(req.query.token){
    firebase.auth().signInWithCustomToken(req.query.token).then(function(success){
      console.log(success)
      res.send('success')
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      res.send(error)
      // ...
    });
  }else{
    res.send('error')
  }
})

router.get('/login/:type', function(req, res){
        
    switch (req.params.type){
      case 'kakao' :
        console.log(req.params.type)
        res.redirect('https://kauth.kakao.com/oauth/authorize?client_id=b8bd2008ad9c38a214dd349e3260183d&redirect_uri=http://localhost:3000/auth&response_type=code&scope=talk_message,birthday,account_email,talk_message,gender,profile,friends')
        
      break;
    }   
})

router.post('/is_sess', function(req, res){
  console.log(req.session)
  if(req.session.userId == undefined){
    res.send('false')
  }else{
    res.send('true')
  }
  
})

router.post('/signUp', async (req, res) => {
  
  
  try {
    let retRes = await auth.signUp(req.body.id, req.body.password)
    
    res.send(retRes)
  } catch (error) {
    // res.send(error.response.data)  
  } 
  
})


router.post('/', async function (req, res) {

  console.log(req.body.accessToken)

  if (req.body.accessToken != undefined) {

    let accessToken = req.body.accessToken
    try {

      // kakao user info
      var profile = await axios({
        methods: 'POST',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      })

      console.log(profile.data)
      console.log('아이디:' + profile.data.id)

      // firebase custom token
      admin.auth().createCustomToken('kakao-' + profile.data.id)
      .then(function (customToken){
        
        firebase.auth().signInWithCustomToken(customToken)
          .then(function(createUser){
            console.log(createUser.operationType)

            var user = firebase.auth().currentUser;
            if(user){
              user.updateEmail(profile.data.kakao_account.email)
            }

            res.send(createUser.operationType)

            req.session.userId = 'kakao-' + profile.data.id
            console.log(req.session)
          })

            
          .catch(function(err){
            res.send(err)
          })

      }).catch(function(err){
        res.send(err)
      })

        

      
      
      

    } catch (error) {
      res.send(error)
    }

  } else {
    res.send('login Fali!')
  }
})

module.exports = router;