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
      <div>
        <!-- <a id="kakao_login" href="https://kauth.kakao.com/oauth/authorize?client_id=b8bd2008ad9c38a214dd349e3260183d&redirect_uri=http://localhost:3000/auth&response_type=code&scope=talk_message,birthday,account_email,talk_message,gender,profile,friends">
          <img src="/statics/img/kakao_login.png" alt="">
        </a> -->
        <a v-if="loginInfo == false" id="kakao_login" @click="kakaoLogin()" alt="">
          <img src="/statics/img/kakao_login.png" alt="">
        </a>
        <div id="naver_id_login"></div>
        <!--
        <a id="naver_login">
          <img src="/statics/img/naver_login.png" alt="">
        </a>
        -->
      </div>
    </div>
  </div>
</template>

<script>
// let Kakao = window.Kakao
// Kakao.init('85863bc58eeb21e016e2474f75ee1dec')

import Kakao from 'src/boot/kakao'
// import naverLogin from 'src/boot/naver'
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
    var naver_id_login = new window.naver_id_login("buniXVCiAaaHIjxxHXO0", "http://localhost:8080/api/login");
  	var state = naver_id_login.getUniqState();
  	naver_id_login.setButton("white", 2,40);
  	naver_id_login.setDomain("http://localhost:8080/");
  	naver_id_login.setState(state);
  	naver_id_login.setPopup();
  	naver_id_login.init_naver_id_login();
  },
  created() {

    
    
    if( this.$route.query.code !== undefined){
      var data = {
        grant_type : 'authorization_code',
        client_id: 'buniXVCiAaaHIjxxHXO0',
        client_secret : '85cUbSTGjd',
        code: this.$route.query.code,
        state: 'RAMDOM_STATE'
      }
      this.$axios.post('https://nid.naver.com/oauth2.0/token',data).then(function(res){
        console.log(res)
      }).catch(function(err){
        console.log(err)
      })
    }
  },
  methods: {
    ...mapMutations({
      
    }),
    ...mapActions({
      afterLogin: 'member/afterLogin'
    }),
    sign: function (type) {
      let email = this.user.email
      let password = this.user.password

      if (email !== '' && password !== '') {
        this.$axios.post('http://localhost:3000/auth/sign/' + type, { email: email, password: password })
          .then(function (res) {
            console.log(res)

            switch (res.data.status) {
              case 'success' :
                alert('success')
                break

              case 'error' :
                alert(res.data.errorMessage)
                break
            }
          })
      }
    },
    getUser: function () {
      this.$axios.post('http://localhost:3000/auth/getUser')
        .then(function (res) {
          console.log(res)
        })
    },
    createToken: function () {
      this.$axios.post('http://localhost:3000/auth/createtoken')
        .then((res) => {
          console.log(res)
          this.customToken = res.data
        })
    },
    verifyToken: function () {
      this.$axios.post('http://localhost:3000/auth/verifyToken', { token: this.customToken })
        .then(function (res) {
          console.log(res)
        })
    },
    getLoginUser: function () {
      this.$axios.post('http://localhost:3000/auth/getLoginUser')
        .then(function (res) {
          console.log(res)
        })
    },
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
    getSession: function () {
      this.$axios.post('http://localhost:3000/auth/is_sess')
        .then(function (res) {
          console.log(res)
        })
    }    
  }
}
</script>

<style>
  h4,h5{text-align: center;}
  .column{margin:0px auto;}
  #naver_login img{width:125px; margin-left:10px;}
  .login-frame{text-align:center;margin:20px;}
</style>
