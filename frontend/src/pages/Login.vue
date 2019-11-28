<template>
  <div class="q-pa-md">

    <h4>LOGIN</h4>
    <div class="q-gutter-y-md column" style="max-width: 500px">
      <q-input label="전화번호" stack-label  />
      
      <q-btn color="secondary" label="로그인" />     

      <div v-if="loginInfo == false">
        <!-- <a id="kakao_login" href="https://kauth.kakao.com/oauth/authorize?client_id=b8bd2008ad9c38a214dd349e3260183d&redirect_uri=http://localhost:3000/auth&response_type=code&scope=talk_message,birthday,account_email,talk_message,gender,profile,friends">
          <img src="/statics/img/kakao_login.png" alt="">
        </a> -->
        <a id="kakao_login" @click="kakaoLogin()" alt="">
          <img src="/statics/img/kakao_login.png" alt="">
        </a>
        <!-- <div id="naver_id_login"></div> -->
        
        <!-- <a id="naver_login" @click="naverLogin()">
          <img src="/statics/img/naver_login.png" alt="">
        </a> -->

        <div id="naver_id_login"></div>
        <div id="naverIdLogin"></div>
        <q-btn color="primary" label="회원가입 진행" @click="signComp.isActive = !signComp.isActive"/>
       
      </div>

      <div class="signUpFrame">
        
        
        <div class="none" v-bind:class="{ active: signComp.isActive }">
          <q-stepper
          v-model="step"
          vertical
          color="primary"
          animated
          >
            <q-step
              :name="1"
              title="전화번호를 입력해 주세요."
              icon="settings"
              :done="step > 1"
            >

              <q-input v-model="signUp.phoneNum" label="전화번호" stack-label  />
              
              <div id="sign-in-button"></div>

              <q-stepper-navigation>  
                <q-btn @click="getSignUpCode()" color="primary" label="다음" />
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="2"
              title="Create an ad group"
              caption="Optional"
              icon="create_new_folder"
              :done="step > 2"
            >
              
              <q-input v-model="signUp.code" label="인증코드" stack-label  /> 

              <q-stepper-navigation>
                <q-btn @click="step = 4" color="primary" label="Continue" />
                <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" />
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="3"
              title="Ad template"
              icon="assignment"
              disable
            >
              This step won't show up because it is disabled.
            </q-step>

            <q-step
              :name="4"
              title="Create an ad"
              icon="add_comment"
            >
              Try out different ad text to see what brings in the most customers, and learn how to
              enhance your ads using features like ad extensions. If you run into any problems with
              your ads, find out how to tell if they're running and how to resolve approval issues.

              <q-stepper-navigation>
                <q-btn color="primary" label="Finish" />
                <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
              </q-stepper-navigation>
            </q-step>
          </q-stepper>

        </div>
      </div>
      
    </div>


      

  </div>
</template>

<script>
// let Kakao = window.Kakao
// Kakao.init('85863bc58eeb21e016e2474f75ee1dec')

import { auth, firebase_ } from 'src/boot/firebase'
import Kakao from 'src/boot/kakao'
import naver_id_login from 'src/boot/naver'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
      user: {
        email: '',
        password: ''
      },
      signComp: {
        isActive : false,
        signIn : false
      },
      signUp : {
        phoneNum : '',
        code : ''
      },
      step: 1,
      customToken: '',
      kakaoToken: ''
    }
  },
  computed: {
    ...mapGetters({
      loginInfo : 'member/getLoginStatus'
    })
  },
  watch : {
    step : function (step){
        console.log(step)
      switch(step){

        case 1 : 

        // window.recaptchaVerifier = new firebase_.auth.RecaptchaVerifier('sign-in-button', {
        //   'size': 'normal',
        //   'callback': function(response) {
        //     // reCAPTCHA solved, allow signInWithPhoneNumber.
        //     // ...
        //   },
        //   'expired-callback': function() {
        //     alert('자동방지 인증이 만료되었습니다. 다시 해주세요.')
        //   }
        // });

        window.recaptchaVerifier.render().then(function(widgetId) {
          window.recaptchaWidgetId = widgetId;
        });

        break
        
        case 2 : 
          

        break

        
      }
      
    }
  },
  mounted() {
    
    
    if(this.loginInfo == false){
      var state = naver_id_login.getUniqState();
      naver_id_login.setButton("green", 3,45);
      naver_id_login.setDomain("http://localhost:8080/");
      naver_id_login.setState(state);
      // naver_id_login.setPopup();
      naver_id_login.init_naver_id_login();
    } 

    window.recaptchaVerifier = new firebase_.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': function(response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
      }
    });

    recaptchaVerifier.render().then(function(widgetId) {
      window.recaptchaWidgetId = widgetId;
    });

  },
  methods: {
    ...mapMutations({
      
    }),
    ...mapActions({
      afterLogin: 'member/afterLogin'
    }),
    kakaoLogin: function () {

      var vm = this

      Kakao.Auth.login({
        success: function(authObj) {
          // alert(JSON.stringify(authObj))
          Kakao.API.request({
            url: '/v1/user/me',
              success: function(res) {
                console.log(res)
                
                vm.afterLogin({type: 'kakao', data: res})
                // alert(JSON.stringify(res))
              // vm.afterLogin(res)
            },
              fail: function (error) {
                alert(JSON.stringify(error))
            }
          });
        },
        fail: function(err) {
          alert(JSON.stringify('로그인에 실패하셨습니다.'));
        }
      });
    },
    fbIsSignIn: function () {
      var user  = auth.currentUser
      console.log(user)
      if(user === null){
        this.$axios.post('/auth/fbIsSignIn')
          .then(res => {

          auth.signInWithCustomToken(res.data)
            .then(function(success){
              console.log(success)
            })
            .catch(function(err){
              console.log(err)
            })

          })
      }
      
    },
    getSignUpCode: function () {
      
      auth.settings.appVerificationDisabledForTesting = true

      var phoneNumber = '+82' + this.signUp.phoneNum.replace(/(^0+)/, "");
      var appVerifier = window.recaptchaVerifier;
      auth.signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function (confirmationResult) {
          debugger
          window.confirmationResult = confirmationResult;
          console.log('send')
        }).catch(function (error) {
          
          debugger
          console.log(error)
        });

      funcioj 
    },
    signInUP: function () {

      if(grecaptcha.getResponse(window.recaptchaWidgetId) === ''){
        alert('인증체크를 해주세요.')
      }
      auth.settings.appVerificationDisabledForTesting = true;
      var phoneNumber = '+821022455126';
      var appVerifier = window.recaptchaVerifier;
      auth.signInWithPhoneNumber(phoneNumber, appVerifier)
          .then(function (confirmationResult) {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            console.log('send')
          }).catch(function (error) {
            // Error; SMS not sent
            // ...
            console.log('not send')
          });
    },
    cookieTest: function () {

      this.$axios.post('/auth/fbSignIn')
        .then(res => {
          console.log(res.data)
        })
    }
    
  }
}
</script>

<style>
  h4,h5{text-align: center;}
  .column{margin:0px auto;}
  #kakao_login{cursor: pointer;}
  #naver_login img{width:125px; margin-left:10px;}
  #naver_id_login{display:inline-block}
  .login-frame{text-align:center;margin:20px;}
  .none{display:none;}
  .active{display:block;}


  
</style>
