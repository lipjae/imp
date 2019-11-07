<template>
  <div>
    <h3>API PAGE</h3>
    <div>
      <label for="">인증토큰 : </label>
      <span>{{token}}</span>
    </div>
    <div>
      <button @click="getCard">카드 리스트 불러오기</button>
      <component v-bind:is="comp"></component>
    </div>
  </div>
</template>

<script>

export default {
  name: 'API',
  created () {
    this.$axios.get('http://localhost:3000/api/getToken')
      .then((response) => {
        console.log(response)
        this.token = response.data.token
      })
  },
  data () {
    return {
      token: '',
      comp: ''
    }
  },
  methods: {
    getCard () {
      this.comp = 'CardComp'
    }
  },
  components: {
    CardComp: () => import('./CardList.vue')
  }
}
</script>
