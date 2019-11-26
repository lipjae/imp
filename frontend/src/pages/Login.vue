<template>
  <div class="q-pa-md">

    <h4>LOGIN</h4>
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-input v-model="user.email" label="이메일" stack-label  />
      <q-input v-model="user.password" type="password" label="비밀번호" stack-label  />
      <q-btn color="secondary" label="로그인" no-caps @click="sign('in')"/>
      <q-btn color="primary" label="회원가입" no-caps @click="sign('up')"/>
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

import { auth } from 'src/boot/firebase'
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
