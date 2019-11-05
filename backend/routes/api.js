var express = require('express');
var router = express.Router();
var cors = require('cors');
const axios = require('axios');
const mysql = require('mysql');


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

router.post('/payment/order', function(req, res){
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
    params.push(merchant_uid)

    conn.connect()
    conn.query(sql,params,function(err,result,fields){
        // console.log(err)
        var sqlRes = {}
        sqlRes.res = result
        sqlRes.uid = merchant_uid
        console.log(sqlRes)
        res.send(sqlRes)
        // console.log(fields)
    })
    conn.end()

})

router.post('/payments/complete',function(req, res){

    console.log(req.body);
    var reqParams = req.body
    
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'l1002212$$',
        database: 'imp'
    })

    var sql = 'INSERT INTO imp_order(io_pg,io_pay_method,io_merchant_uid,io_name,io_amount) VALUES("inicis",?,?,?,?)'
    var params = [
        reqParams.pay_method,
        reqParams.merchant_uid,
        reqParams.name,
        reqParams.paid_amount
    ];
    connection.connect();
    connection.query(sql, params, function (error, results, fields){
        console.log(results);
        console.log(error);
    });
    connection.end()
    
})


module.exports = router;