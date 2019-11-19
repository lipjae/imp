<template>
  <div class="q-pa-md">

    <h4>LOGIN</h4>
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-input v-model="user.id" label="아이디" stack-label  />
      <q-input v-model="user.password" type="password" label="비밀번호" stack-label  />
      <q-btn color="secondary" label="로그인" no-caps />
      <q-btn color="primary" label="회원가입" no-caps @click="signUp()"/>
    </div>

    <div class="login-frame">
      <div>
        <a id="kakao_login" href="http://localhost:3000/auth/login/kakao"><img src="/statics/img/kakao_login.png" alt=""></a>
        <a id="naver_login" href="#" disabled><img src="/statics/img/naver_login.png" alt=""></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        id: '',
        password: ''
      }
    }
  },
  methods: {
    signUp: function () {
      let id = this.user.id
      let password = this.user.password

      if (id !== '' && password !== '') {
        this.$axios.post('/auth/signUp', { id: id, password: password })
          .then(function (res) {
            console.log(res)
          })
      }

      console.log(id)
      console.log(password)
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
