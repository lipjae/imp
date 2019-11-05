<template>
  <div>
    <h3>결제</h3>
    <div class="q-pa-md">
    <q-btn label="결제하기" color="primary" @click="requestPay" class="q-mb-md" />
      <q-table
        title="Treats"
        :data="data"
        :columns="columns"
        row-key="name"
        selection="single"
        :selected.sync="priceInfo"
      />

      <div class="q-mt-md">
        결제정보: {{ JSON.stringify(priceInfo) }}
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Payment',
  created () {
    this.IMP = window.IMP
    this.IMP.init('imp92549566')
  },
  data () {
    return {
      IMP: '',
      priceInfo: [],
      columns: [
        {
          name: 'desc',
          required: true,
          label: '상품',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'pg', align: 'center', label: 'pg', field: 'pg', sortable: true },
        { name: 'pay_method', label: '결제방법', field: 'pay_method', sortable: true },
        { name: 'amount', label: '가격', field: 'amount' },
        { name: 'buyer_email', label: '이메일', field: 'buyer_email' },
        { name: 'buyer_name', label: '구매자', field: 'buyer_name' },
        { name: 'buyer_tel', label: '구매자 전화번호', field: 'buyer_tel' },
        { name: 'buyer_addr', label: '구매자 주소', field: 'buyer_addr' },
        { name: 'buyer_postcode', label: '구매자 우편번호', field: 'buyer_postcode' }
      ],
      data: [
        {
          name: '포르쉐 카이엔',
          pg: 'inicis',
          pay_method: 'card',
          amount: '10',
          buyer_email: 'dlwognscap@gmail.com',
          buyer_name: '이재훈',
          buyer_tel: '010-22445-5126',
          buyer_addr: '서울특별시 강남구 신사동',
          buyer_postcode: '01181'
        },
        {
          name: '벨로스터 N',
          pg: 'inicis',
          pay_method: 'card',
          amount: '10',
          buyer_email: 'dlwognscap@gmail.com',
          buyer_name: '이재훈',
          buyer_tel: '010-22445-5126',
          buyer_addr: '서울특별시 강남구 신사동',
          buyer_postcode: '01181'
        },
        {
          name: '제네시스 gv80',
          pg: 'inicis',
          pay_method: 'card',
          amount: '10',
          buyer_name: '이재훈',
          buyer_email: 'dlwognscap@gmail.com',
          buyer_tel: '010-22445-5126',
          buyer_addr: '서울특별시 강남구 신사동',
          buyer_postcode: '01181'
        }
      ]
    }
  },
  methods: {
    requestPay: function () {
      if (this.priceInfo.length === 0) {
        alert('상품을 선택해주세요.')
        return false
      }
      var priceInfo = this.priceInfo[0]
      delete priceInfo['__index']
      console.log(priceInfo)

      this.$axios.post('http://localhost:3000/api/payment/order', priceInfo)
        .then(orderRes => {
          console.log(orderRes)
        })

      // IMP.request_pay(param, callback) 호출
      // this.IMP.request_pay({ // param
      //   pg: 'inicis',
      //   pay_method: 'card',
      //   merchant_uid: 'order-' + new Date().getTime(),
      //   name: '벨로스터 N',
      //   amount: 10,
      //   buyer_email: 'dlwognscap@gmail.com',
      //   buyer_name: '이재훈',
      //   buyer_tel: '010-2245-5126',
      //   buyer_addr: '서울특별시 강남구 신사동',
      //   buyer_postcode: '01181'
      // }, rsp => { // callback
      //   if (rsp.success) {
      //     // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
      //     console.log(rsp)

      //     this.$axios.post('http://localhost:3000/api/payments/complete', rsp).then(function (data) {
      //       // 가맹점 서버 결제 API 성공시 로직
      //       debugger
      //     })
      //   } else {
      //     alert('결제에 실패하였습니다. 에러 내용: ' + rsp.error_msg)
      //   }
      // })
    }

  }
}

</script>

<style>

</style>
