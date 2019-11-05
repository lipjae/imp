<template>
  <div id="all-frame">
    <div>
      <keep-alive>
        <component v-bind:is="comp"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>

export default {
  name: 'API',
  created () {
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
  }
}
</script>

<style>
  #all-frame {
    padding: 10px;
  }
  span {
    margin: 10px
  }
</style>
