var express = require('express');
var router = express.Router();
var cors = require('cors');
const axios = require('axios');
const mysql = require('mysql');
const bodyPaser = require('body-parser')
const Order = require('../model/Orders')


let ACCESS_TOKEN = '';
const IMP_CODE = 'imp92549566';
const REST_API_KEY = '4268003460001225';
const REST_API_SECRET = 'LwWYeFvDXar3dOyTSzZ0McvHp36nDM4pj0oxGTbE3DHhrgajP9jBmPjLTq9xdeWwek4UdfzhSgykxJDn';
const API_URL = 'https://api.iamport.kr';

// CORS 설정
router.use(cors());
router.use(bodyPaser.json())

router.get('/',function(req,res){
    res.send('Hi');
})

router.get('/getToken',function(req,res){

    axios.post(API_URL+'/users/getToken',{    
        imp_key : REST_API_KEY,
        imp_secret : REST_API_SECRET    
            
    }).then(function(resdata){   
                
        if(resdata.data.code == 0){
            ACCESS_TOKEN = resdata.data.response.access_token;  
            console.log('인증토큰 : ' + ACCESS_TOKEN);
            res.send({
                code : 0,
                token : ACCESS_TOKEN
            });    
        }else{
            res.send({code : -1});
        }
        
    });    

})

router.get('/getCard',function(req,res){
    console.log(ACCESS_TOKEN);
    if(ACCESS_TOKEN == ''){
        res.send({
            code : -1,
            msg : '인증정보를 확인해주세요.'
        });
        return;
    }
    
    axios.get(API_URL+'/cards',{
        params : {
            _token : ACCESS_TOKEN
        }
    }).then(function(response){
        console.log(ACCESS_TOKEN);
        res.send(response.data.response);
    }).catch(function(err){
        console.log(ACCESS_TOKEN);
    });  

})

router.post('/payments/order', async function(req, res){
    
    retData = { is_success : false }
    req.body['merchant_uid'] = 'order-' + new Date().getTime()
    sqlRes = await Order.orderInser(req.body)
    if(sqlRes.errno === undefined){
        retData['is_success'] = true
        retData['order'] = req.body
    }
    res.send(retData)

})

// "/payments/complete"에 대한 POST 요청을 처리
router.post("/payments/complete", async (req, res) => {
    try {
        const { imp_uid, merchant_uid } = req.body; // req의 body에서 imp_uid, merchant_uid 추출
        
        // 액세스 토큰(access token) 발급 받기
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
                imp_key: REST_API_KEY, // REST API키
                imp_secret: REST_API_SECRET // REST API Secret
            }
        });
        const { access_token } = getToken.data.response; // 인증 토큰

        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
            url: `https://api.iamport.kr/payments/${imp_uid}`,
            method: "get", 
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
      });
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보

        const order = await Order.findById(paymentData.merchant_uid);

        const amountToBePaid = order.amount; // 결제 되어야 하는 금액
        // 결제 검증하기
        const { amount, status } = paymentData;    

        if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
            await Orders.findByIdAndUpdate(merchant_uid, paymentData)  // DB에 결제 정보 저장

            
        }
            
        console.log(paymentData)
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/payments/status',async function(req,res){

    var reqParams = req.body
            
    var res = await Order.statusChange(reqParams.status, reqParams.merchant_uid)
    res.send(res)
    
})

router.get('/test', async function (req, res) {

    var order = await Order.test()
    console.log(order)
    res.send('123123')
    // var test = await Order.test();
    // console.log(test)
    
    return 
    // var order = await Order.statusChange('complete', 'order-1573131822349')
    // const order = await Order.findById('order-1573131822349');

    console.log('controller')
    console.log(order)
    res.send(order)

})


module.exports = router;