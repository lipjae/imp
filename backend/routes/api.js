var express = require('express');
var router = express.Router();
var cors = require('cors');
const axios = require('axios');
const mysql = require('mysql');
const Order = require('../model/Orders')


let ACCESS_TOKEN = '';
const IMP_CODE = 'imp92549566';
const REST_API_KEY = '4268003460001225';
const REST_API_SECRET = 'LwWYeFvDXar3dOyTSzZ0McvHp36nDM4pj0oxGTbE3DHhrgajP9jBmPjLTq9xdeWwek4UdfzhSgykxJDn';
const API_URL = 'https://api.iamport.kr';

// CORS 설정
router.use(cors());


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

router.post('/payments/order', function(req, res){
    var reqParams = req.body

    let conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'l1002212$$',
        database: 'imp'
    })   
    
    var sql = 'INSERT INTO imp_order(io_name,io_pg,io_pay_method,io_amount,buyer_email,buyer_name,buyer_tel,buyer_addr,buyer_postcode,io_merchant_uid) VALUES(?,?,?,?,?,?,?,?,?,?)'
    
    var params = Object.values(reqParams);
    //merchant_uid
    merchant_uid = 'order-' + new Date().getTime();
    reqParams['merchant_uid'] = merchant_uid
    params.push(merchant_uid)

    conn.connect()
    conn.query(sql,params,function(err,result,fields){

        var sqlRes = {}
        if(result.affectedRows > 0){
            sqlRes.res = true
            sqlRes.uid = merchant_uid
            sqlRes.inserId = result.insertId
            sqlRes.params = reqParams
        }else{
            sqlRes.res = false
        }
        
        
        
        res.send(sqlRes)
        // console.log(fields)
    })
    conn.end()

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

        console.log(order)

        console.log(req.body)
        console.log(`${ imp_uid}`);
        console.log(`${ merchant_uid }`);
        console.log(`${ access_token }`);
        // console.log(paymentData)
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/payments/status', function(req,res){

    var reqParams = req.body
    console.log(reqParams)
    let conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'l1002212$$',
        database: 'imp'
    })
    
    var sql = 'UPDATE imp_order SET status = ? WHERE io_merchant_uid = ?'
    conn.query(sql, [reqParams.status, reqParams.merchantId],function(error, results, fields){
        console.log(results);
        res.send(results)
    })

    conn.end()  
    
})

router.get('/test', async function (req, res) {

    const order = await Order.findById('order-1573031555939');

    res.send(order)

})


module.exports = router;