<template>
  <div class="q-pa-md">
    <h4>LOGIN</h4>
    <div class="q-gutter-y-md column" style="max-width: 500px">
      <q-input label="전화번호" stack-label  />
      <q-btn color="primary" label="로그인" />
      <q-btn color="secondary" label="회원가입" @click="moveSignUp()" />     
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods: {
    moveSignUp () {
      this.$router.push('/signUp')
    }
  },
}
</script>

<style>

</style>