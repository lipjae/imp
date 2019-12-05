<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column sign-form" style="max-width: 300px">

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

      <q-btn color="primary" v-if="authCode !== '' " label="signUp" />
      <q-btn color="primary" v-if="authCode === '' " label="getCode" @click="getSignUpCode" />
      
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

    function expire(){
      debugger
    }

    // fb recaptch
    window.recaptchaVerifier = new firebase_.auth.RecaptchaVerifier('fb-captcha', {
      'size': 'small',
      'expired-callback': expire
    });

    window.recaptchaVerifier.render().then(function(widgetId) {
      window.recaptchaWidgetId = widgetId
    });
  },
  methods: {
    getSignUpCode : async function () {

      let phoneNumber = '+82' + this.signInfo.phoneNum.replace(/(^0+)/, "")
      let appVerifier = recaptchaVerifier

      let captchaCheck = grecaptcha.getResponse(window.recaptchaWidgetId)

      if(captchaCheck === ''){
        alert('자동 등록방지를 위해 체크해주세요.')
        return 
      }

      try {

        this.authCode = await auth.signInWithPhoneNumber(phoneNumber, appVerifier)

      } catch (error) {

        grecaptcha.reset(window.recaptchaWidgetId);

      }

    },
    doSignUp: function () {
      
    }
  },
}
</script>

<style lang="sass">
.sign-form
  margin: 30vh auto
</style>