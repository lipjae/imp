<template>
  <q-layout view="lhr lpR lFr">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          <span>인증토큰 :</span><span>{{token}}</span>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/page1" label="Page One" />
        <!--
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
        -->
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <div id="kakao_login">
        <a href="http://localhost:3000/api/auth"><img src="/statics/img/kakao_login.png" alt=""></a>
      </div>
      <div>
        <button @click="kakao()">카카오 보내기</button>
      </div>
      <!-- drawer content -->
      <q-list padding class="menu-list">
        <q-item clickable active v-ripple>
          <q-item-section avatar>
            <q-icon name="inbox" />
          </q-item-section>

          <q-item-section @click="move('/api')">
            getCardList
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="star" />
          </q-item-section>

          <q-item-section v-on:click="move('/api/payment')">
            Payment
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="send" />
          </q-item-section>

          <q-item-section v-on:click="move('/api/orderList')">
            orderList
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="drafts" />
          </q-item-section>

          <q-item-section>
            Drafts
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name: 'ApiLayOut',
  created () {
    this.$axios.get('http://localhost:3000/api/getToken')
      .then((response) => {
        console.log(response)
        this.token = response.data.token
      })
  },
  data () {
    return {
      left: false,
      token: ''
    }
  },
  methods: {
    move (locate) {
      this.$router.push(locate)
    },
    kakao () {
      if (this.$route.query.code) {
        console.log(this.$route.query.code)
        this.$axios.post('http://localhost:3000/api/kakaoMessage', { token: this.$route.query.code }).then(res => {
          console.log(res)
        })
      }
    }
  }
}
</script>
<style>
  #kakao_login{
    margin:5px;
  }
</style>
