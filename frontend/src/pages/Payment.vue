<template>
  <div>
    <h3>결제</h3>
    <div class="q-pa-md">
    <q-btn label="결제하기" color="primary" @click="requestPay" class="q-mb-md" />
      <q-table
        title="Treats"
        :data="payData"
        :columns="columns"
        row-key="name"
        selection="single"
        :selected.sync="priceInfo"
      />

      <div class="q-mt-md">
        결제정보: {{ JSON.stringify(priceInfo) }}
      </div>
    </div>
    <div>
      <img src="statics/img/prosche.jpg">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Payment',
  created () {
    this.$axios.get('/statics/json/goods.json')
      .then(data => {
        this.payData = data.data
      })
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
        // { name: 'io_name', field: 'io_name' },
        { name: 'pay_method', label: '결제방법', field: 'pay_method', sortable: true },
        { name: 'amount', label: '가격', field: 'amount' },
        { name: 'buyer_email', label: '이메일', field: 'buyer_email' },
        { name: 'buyer_name', label: '구매자', field: 'buyer_name' },
        { name: 'buyer_tel', label: '구매자 전화번호', field: 'buyer_tel' },
        { name: 'buyer_addr', label: '구매자 주소', field: 'buyer_addr' },
        { name: 'buyer_postcode', label: '구매자 우편번호', field: 'buyer_postcode' }
      ],
      payData: [

      ]
    }
  },
  methods: {
    requestPay: function () {
      event.preventDefault()
      if (this.priceInfo.length === 0) {
        alert('상품을 선택해주세요.')
        return false
      }
      var priceInfo = this.priceInfo[0]
      delete priceInfo['__index']
      console.log(priceInfo)

      this.$axios.post('http://localhost:3000/api/payments/order', priceInfo)
        .then(orderRes => {
          console.log(orderRes.data)
          if (orderRes.data.is_success === true) {
            console.log('저장 성공. 이니시스를 진행합니다..')

            // IMP.request_pay(param, callback) 호출
            this.IMP.request_pay(orderRes.data.order, rsp => { // callback
              if (rsp.success) {
                this.$axios.post('http://localhost:3000/api/payments/complete', {
                  imp_uid: rsp.imp_uid,
                  merchant_uid: rsp.merchant_uid
                }).then(completeRes => {
                  console.log(completeRes)
                  switch (completeRes.data.status) {
                    case 'vbankIssued':
                      // 가상계좌 발급 시 로직
                      break
                    case 'success':
                      // 결제 성공 시 로직
                      alert('결제가 완료되었습니다.')
                      break
                  }
                })
              } else {
                alert('결제에 실패하였습니다. 에러 내용: ' + rsp.error_msg)
                this.changeStatus(rsp.merchant_uid, 'cancel')
              }
            })
          } else {
            console.log(orderRes.data)
            console.log('저장 실패')
          }
        })
    },
    changeStatus (id, status) {
      this.$axios.post('http://localhost:3000/api/payments/status', { merchant_uid: id, status: status })
        .then(statusRes => {
          console.log(statusRes)
        })
    }

  }
}

</script>

<style>

</style>
