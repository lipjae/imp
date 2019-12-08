<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column sign-form" style="max-width: 220px">

      <q-input color="black-12" v-model="signInfo.phoneNum" label="전화번호">
        <template v-slot:prepend>
          <q-icon name="phone" />
        </template>
      </q-input>

      <q-input color="black-12" v-model="signInfo.code" label="인증코드">
        <template v-slot:prepend>
          <q-icon name="code" />
        </template>
      </q-input>

      <div id="fb-captcha"></div>

      <q-btn color="primary" v-if="authCode !== '' " label="signUp & signIn" @click="doSignInUp" />
      <q-btn color="primary" v-if="authCode === '' " label="getCode" @click="getSignUpCode" />

      <a id="kakao_login" @click="kakaoLogin()" alt="">
        <img src="/statics/img/kakao_login.png" alt="">
      </a>
      <button @click="test()">테스트</button>
      
    </div>
  </div>
</template>

<script>

import { auth, firebase_ } from 'src/boot/firebase'
import Kakao from 'src/boot/kakao'
import naver_id_login from 'src/boot/naver'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'


export default {
  data() {
    return {
      signInfo: {
        phoneNum : '',
        code: ''
      },
      authCode : '',
      text : ''
    }
  },
  computed: {
    ...mapGetters({
      loginInfo : 'member/getLoginStatus',
      signUp : 'member/getSignUpStatus'
    })
  },
  mounted() {

    // fb recaptch
    window.recaptchaVerifier = new firebase_.auth.RecaptchaVerifier('fb-captcha', {
      'size': 'invisible'
    });

    window.recaptchaVerifier.render().then(function(widgetId) {
      window.recaptchaWidgetId = widgetId
    });
  },
  methods: {
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
    getSignUpCode : async function () {

      let phoneNumber = '+82' + this.signInfo.phoneNum.replace(/(^0+)/, "")
      let appVerifier = recaptchaVerifier

      // let captchaCheck = grecaptcha.getResponse(window.recaptchaWidgetId)

      // if(captchaCheck === ''){
      //   alert('자동 등록방지를 위해 체크해주세요.')
      //   return 
      // }

      try {

        window.confirmationResult = await auth.signInWithPhoneNumber
        (phoneNumber, appVerifier)

        this.authCode = true

      } catch (error) {
        
        grecaptcha.reset(window.recaptchaWidgetId);

      }

    },
    doSignInUp: function () { // 회원가입 및 로그인
      let code = this.signInfo.code

      try {
        var res = confirmationResult.confirm(code)
        
        console.log(res)
        debugger

      } catch (error) {
        alert(error)
      }

    }
  },
}
</script>

<style lang="sass">
.sign-form
  margin: 30vh auto
</style>