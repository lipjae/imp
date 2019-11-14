<template>
  <div class="q-pa-md">

    <h4>LOGIN</h4>
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-input v-model="text" label="아이디" stack-label :dense="dense" />
      <q-input v-model="password" type="password" label="비밀번호" stack-label :dense="dense" />
    </div>
    <h5>일반로그인은 지원되지 않습니다.</h5>
    <div>
      <div>
        <a id="kakao_login" href="http://localhost:3000/api/auth"><img src="/statics/img/kakao_login.png" alt=""></a>
        <a id="naver_login" href="#" disabled><img src="/statics/img/naver_login.png" alt=""></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      password: '',
      dense: false
    }
  }
}
</script>

<style>
  h4,h5{text-align: center;}
  .column{margin:0px auto;}
  #naver_login {pointer-events: none;}
  #naver_login img{width:125px; margin-left:10px;}
</style>
