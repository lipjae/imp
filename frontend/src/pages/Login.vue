<template>
  <div class="q-pa-md">

    <h4>LOGIN</h4>
    <div class="q-gutter-y-md column" style="max-width: 500px">
      <q-input v-model="user.phoneNum" label="전화번호" stack-label  />
      <q-input v-if="signComp.signIn" v-model="user.code" label="인증코드" stack-label  />
      
      <!-- <q-btn color="secondary" label="로그인" no-caps /> -->
        <q-stepper
          v-model="step"
          vertical
          color="primary"
          animated
        >
          <q-step
            :name="1"
            title="회원가입 인증을 해주세요."
            icon="settings"
            :done="step > 1"
          >
            <div id="sign-in-button"></div>

            <q-stepper-navigation>
              <q-btn @click="step = 2" color="primary" label="Continue" />
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="2"
            title="Create an ad group"
            caption="Optional"
            icon="create_new_folder"
            :done="step > 2"
          >
            

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

    <div class="login-frame">
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
        signIn : false
      },
      step: 1,
      signUp : false,
      customToken: '',
      kakaoToken: ''
    }
  },
  computed: {
    ...mapGetters({
      loginInfo : 'member/getLoginStatus'
    })
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
      'size': 'normal',
      'callback': function(response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
      },
      'expired-callback': function() {
        // Response expired. Ask user to solve reCAPTCHA again.
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
    phoneAuth: function (){

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
</style>
