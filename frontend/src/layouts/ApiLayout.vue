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
      <!-- drawer content -->
      <q-list padding class="menu-list">

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="drafts" />
          </q-item-section>

          <q-item-section v-on:click="move('/api/login')">
            Login
          </q-item-section>
        </q-item>

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

        <q-item class="logout-btn" v-if="loginStatus == true">
          <q-btn color="negative" label="logout" @click="signOut()" />
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>



<script>

import { mapGetters, mapActions } from 'vuex'
import { auth } from 'src/boot/firebase'

export default {
  name: 'ApiLayOut',
  computed: {
    ...mapGetters({
      loginStatus: 'member/getLoginStatus'
    })
  },
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
      this.$axios.post('http://localhost:3000/api/test').then(res => {
        console.log(res.data)
      })
    },
    signOut () {
      this.$store.dispatch('member/signOut')
    }
  }
}
</script>
<style>
  #kakao_login{
    margin:5px;
  }
  .logout-btn{
    position: absolute;
    bottom: 0;
  }
</style>
