<template>
  <div class="q-pa-md">
    <q-btn @click="test()">test</q-btn>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">카드사 리스트</div>
      </q-card-section>

      <q-markup-table>
        <thead>
          <tr>
            <th class="text-center">no</th>
            <th class="text-center">name</th>
            <th class="text-center">code</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(card, index) in cards" v-bind:key="index">
            <td class="text-center">{{index+1}}</td>
            <td class="text-center">{{card.name}}</td>
            <td class="text-center">{{card.code}}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card>
  </div>

</template>

<script>
export default {
  name: 'GetCard',
  created () {
    this.$axios.get('http://localhost:3000/api/getCard')
      .then((res) => {
        this.cards = res.data
        console.log(res.data)
      })
  },
  data () {
    return {
      cards: []
    }
  },
  methods: {
    test: function () {
      this.$axios.post('http://localhost:3000/api/test')
        .then((res) => {
          console.log(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
