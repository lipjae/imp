<template>
  <div class="q-pa-md">
    <q-btn label="환불하기" color="primary" @click="refund" class="q-mb-md" />
    <q-table
      title="Treats"
      :data="data"
      :columns="columns"
      row-key="__index"
      selection="single"
      :selected.sync="selected"
    />

  </div>
</template>

<script>
export default {
  name: 'orderList',
  data () {
    return {
      selected: [],
      columns: [
        {
          name: 'desc',
          required: true,
          label: 'name',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'pg', field: 'pg', label: '결제사', align: 'center' },
        { name: 'pay_method', label: '결제방법', field: 'pay_method', sortable: true, align: 'center' },
        { name: 'amount', label: '가격', field: 'amount', align: 'center' },
        { name: 'status', label: '결제상태', field: 'status', align: 'center' },
        { name: 'buyer_email', label: '이메일', field: 'buyer_email', align: 'center' },
        { name: 'buyer_name', label: '구매자', field: 'buyer_name', align: 'center' },
        { name: 'buyer_tel', label: '구매자 전화번호', field: 'buyer_tel', align: 'center' },
        { name: 'buyer_addr', label: '구매자 주소', field: 'buyer_addr', align: 'center' },
        { name: 'buyer_postcode', label: '구매자 우편번호', field: 'buyer_postcode', align: 'center' }
      ],
      data: []
    }
  },
  mounted () {
    this.getOrder()
  },
  methods: {
    getOrder () {
      this.$axios.get('http://localhost:3000/api/getOrder')
        .then((data) => {
          console.log(data.data)
          this.data = data.data
        })
    },
    refund () {
      event.preventDefault()
      if (this.selected.length === 0) {
        alert('환불할 주문을 선택해주세요.')
        return false
      }

      this.$axios({
        method: 'POST',
        url: 'http://localhost:3000/api/payments/cancel',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          merchant_uid: this.selected[0].merchant_uid, // 주문번호
          cancel_request_amount: this.selected[0].amount, // 환불금액
          reason: '테스트 결제 환불' // 환불사유
          // "refund_holder": "홍길동", // [가상계좌 환불시 필수입력] 환불 가상계좌 예금주
          // "refund_bank": "88" // [가상계좌 환불시 필수입력] 환불 가상계좌 은행코드(ex. KG이니시스의 경우 신한은행은 88번)
          // "refund_account": "56211105948400" // [가상계좌 환불시 필수입력] 환불 가상계좌 번호
        }
      }).then(data => {
        alert('환불 성공')
      }).catch(function (error) {
        alert('환불 실패')
      })
    }
  }
}
</script>

<style>

</style>
