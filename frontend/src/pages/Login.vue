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

        <a id="naver_login" href="#" disabled>
          <img src="/statics/img/naver_login.png" alt="">
        </a>
        <a id="kakao_login" @click="getKakaoToken()">
          <img src="/statics/img/kakao_login.png" alt="">
        </a>
        <button @click="getUser()">유저정보 가져오기</button>
        <button @click="createToken()">커스텀 토큰 생성</button>
        <button @click="verifyToken()">커스텀 토큰 확인</button>
      </div>
    </div>
  </div>
</template>

<script>
let Kakao = window.Kakao
Kakao.init('85863bc58eeb21e016e2474f75ee1dec')
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
  methods: {
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
    getKakaoToken: function () {
      let v = this

      Kakao.Auth.login({
        success: function (authObj) {
          v.kakaoToken = authObj.access_token
        },
        fail: function (err) {
          alert(JSON.stringify(err))
        }
      })
    }
  }
}
</script>

<style>
  h4,h5{text-align: center;}
  .column{margin:0px auto;}
  #naver_login {pointer-events: none;}
  #naver_login img{width:125px; margin-left:10px;}
  .login-frame{text-align:center;margin:20px;}
</style>
