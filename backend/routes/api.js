let express = require('express');
let router = express.Router();
let cors = require('cors');
const qs = require('qs')
const rq = require('request')
const axios = require('axios');
const bodyPaser = require('body-parser')
const Order = require('../model/Orders')
const fs = require('fs-extra')


let ACCESS_TOKEN = '';
let KAKAO_ACCESS_TOKEN = ''
// const IMP_CODE = 'imp92549566';
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
    }else{
        retData['err'] = sqlRes
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
        console.log(order)
        console.log(order.amount)
        const amountToBePaid = Number(order.amount); // 결제 되어야 하는 금액
        // 결제 검증하기
        const { amount, status } = paymentData;    
        console.log('amount: ' + amount)
        console.log('amoutToBePaid: ' + amountToBePaid)
        if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
            console.log(typeof (amount))
            console.log(typeof (amountToBePaid))
            
            let upRes = await Order.findByIdAndUpdate(merchant_uid, paymentData)  // DB에 결제 정보 저장
            
            switch (status) {
                // case "ready": // 가상계좌 발급
                //     // DB에 가상계좌 발급 정보 저장
                //     const { vbank_num, vbank_date, vbank_name } = paymentData;
                //     await Users.findByIdAndUpdate("/* 고객 id */", { $set: { vbank_num, vbank_date, vbank_name } });
                //     // 가상계좌 발급 안내 문자메시지 발송
                //     SMS.send({ text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num} ${vbank_date} ${vbank_name}`});
                //     res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
                // break;
                case "paid": // 결제 완료
                    res.send({ status: "success", message: "일반 결제 성공" });
                break;
            }
            
        } else { // 결제 금액 불일치. 위/변조 된 결제

            throw { status: "forgery", message: "위조된 결제시도" };

        }
            
        console.log(paymentData)
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/payments/status',async function(req,res){

    let retVal = {}
    let reqParams = req.body
            
    retVal['sqlRes'] = await Order.statusChange(reqParams.status, reqParams.merchant_uid)

    res.send(retVal)
    
})

router.get('/getOrder', async function (req, res){
    
    retvVal = await Order.getOrders()
    res.send(retvVal)
})

router.post('/payments/cancel', async function (req,res){
    try {
        /* 액세스 토큰(access token) 발급 */
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                imp_key: REST_API_KEY, // [아임포트 관리자] REST API키
                imp_secret: REST_API_SECRET // [아임포트 관리자] REST API Secret
            }
        });
        const { access_token } = getToken.data.response; // 엑세스 토큰
      /* 결제정보 조회 */

        let payData = await Order.findByParam({
            merchant_uid : req.body.merchant_uid,
            amount: req.body.cancel_request_amount
        })
        
        if (payData.is_success == false){
            res.send(payData)
            return false;
        }

        const paymentData = payData
        const { merchant_uid, amout } = paymentData; // 조회한 결제정보로부터 imp_uid 추출
                
        /* 아임포트 REST API로 결제환불 요청 */
        const getCancelData = await axios({
            url: "https://api.iamport.kr/payments/cancel",
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": access_token // 아임포트 서버로부터 발급받은 엑세스 토큰
            },
            data: {
                reason: req.body.reason, // 가맹점 클라이언트로부터 받은 환불사유
                merchant_uid : merchant_uid, // imp_uid를 환불 고유번호로 입력,
                amout: req.body.cancel_request_amount
          }
        });
        
        const { response } = getCancelData.data; // 환불 결과
        
        await Order.statusChange('refund',merchant_uid)
        
        res.json(response)
      
    } catch (error) {
    res.status(400).send(error);
}
})

router.get('/test', async function (req, res) {

    const file = './auth/kakao_access.json'
    
    try {
        const result = await fs.writeJson(file, { test: 21231235 })    
        const data = await fs.readJson(file)
        res.send(data)
    } catch (error) {
        console.log(error)
    }
    

    
    // try{
    //     var sqlRes= await Order.findByParam({
    //         merchant_uid : 'order-1573365472099',
    //         amount: 10
    //     })
    //     res.send(view)
    // }catch(e){
    //     console.log(e)
    //     res.sendStatus(404).send(e)
    // }
    
})

router.post('/test', async function (req, res) {
    
    

    var data  = qs.stringify({
        receiver_uuids : JSON.stringify(["uoi8j7eCuoKzn6qSpJSglKWRvY67iLmNvts"]),
        template_object: JSON.stringify({
            "object_type": "feed",
            "content": {
                "title": "디저트 사진",
                "description": "아메리카노, 빵, 케익",
                "image_url": "http://mud-kage.kakao.co.kr/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg",
                "image_width": 640,
                "image_height": 640,
                "link": {
                "web_url": "http://www.daum.net",
                "mobile_web_url": "http://m.daum.net",
                "android_execution_params": "contentId=100",
                "ios_execution_params": "contentId=100"
                }
            },
            "social": {
                "like_count": 100,
                "comment_count": 200,
                "shared_count": 300,
                "view_count": 400,
                "subscriber_count": 500
            },
            "buttons": [
                {
                "title": "웹으로 이동",
                "link": {
                    "web_url": "http://www.daum.net",
                    "mobile_web_url": "http://m.daum.net"
                }
                },
                {
                "title": "앱으로 이동",
                "link": {
                    "android_execution_params": "contentId=100",
                    "ios_execution_params": "contentId=100"
                }
                }
            ]
        })
    })
    
    
    try {
        var restRes = await axios.post('https://kapi.kakao.com/v1/api/talk/friends/message/default/send',data,{ headers : {
            Authorization: 'Bearer 8FqO21MwrNVKYD0pjfzFI61J2VlA-9gnW18L3AopyWAAAAFuZWVWSQ'
        }})
        console.log(restRes)
        res.json(restRes.data)
    } catch (error) {
        console.log(error.response)
        res.send(error.response.data)
    }
    return
    try {
        var restRes = await axios.get('https://kapi.kakao.com/v1/api/talk/friends',{ headers : {
            Authorization: 'Bearer 8FqO21MwrNVKYD0pjfzFI61J2VlA-9gnW18L3AopyWAAAAFuZWVWSQ'
        }})
        res.json(restRes.data)
    } catch (error) {
        
        res.send(error.response.data)
    }

    


    try {
              
        const config = { 
            headers: { 
                'Authorization': 'Bearer mAyzu2i5UixVFU9VeMIIFkagWNE6ZacEyFfZ1goqAq8AAAFuY2qwmA' 
            } 
        }
        const data = qs.stringify({
            template_object: JSON.stringify({
                "object_type": "text",
                "text": "하 진짜 드디어 보내지네 ...",
                "link": {
                    "web_url": "https://developers.kakao.com",
                    "mobile_web_url": "https://developers.kakao.com"
                },
                "button_title": "바로 확인"
            })
        })
        var restRes = await axios.post('https://kapi.kakao.com/v2/api/talk/memo/default/send', data, config)

        res.send(restRes.data)
        
    } catch (error) {
        console.log(error.response.data)
        res.json(error.response.data)
    }

    
    

    // try{
    //     let view = await Order.orderInser({name:'test'})
    //     console.log(view)
    //     res.send(view)
    // }catch(e){
    //     console.log(e)
    //     res.sendStatus(404).send(e)
    // }
    
})
router.get('/auth', async function(req,res){
    
    if(req.query.code == undefined){
        res.redirect('https://kauth.kakao.com/oauth/authorize?client_id=b8bd2008ad9c38a214dd349e3260183d&redirect_uri=http://localhost:3000/auth&response_type=code&scope=talk_message,birthday,account_email,talk_message,gender,profile,friends')
            // & scope=birthday, account_email, gender, profile
    }else{
        // console.log(req.query.code)
        
        // var result = await rq.post({
        //     url: 'https://kauth.kakao.com/oauth/token',
        //     form : {
        //         grant_type: 'authorization_code',
        //         client_id: 'b8bd2008ad9c38a214dd349e3260183d',
        //         redirect_uri: 'http://localhost:3000/api/auth',
        //         code: req.query.code
        //     }
        // },
        // await function(err,rqRes,body) {
        //     // console.log(err)
        //     // console.log(rqRes)
        //     console.log(body)
        //     return body            
        // })
        // console.log(result.body)
        // res.send(result.body)
                                
        try {
            var result = await axios.post('https://kauth.kakao.com/oauth/token', qs.stringify({
                'grant_type': 'authorization_code',
                'client_id': 'b8bd2008ad9c38a214dd349e3260183d',
                'redirect_uri': 'http://localhost:3000/api/auth',
                'code': req.query.code
            }))
            KAKAO_ACCESS_TOKEN = result.data.access_token
            
            await fs.writeJson('../auth/kakao_access.json', result.data)
            console.log(result.data)    
            res.json(result.data)
            // res.redirect('http://localhost:8080/api/kakao?auth=success')    
            
            
            
            
        } catch (error) {
            console.log(error)
        }      
        
    }
    
})
router.post('/kakaoMessage', async function (req, res) {

    console.log(qs.stringify({
        grant_type: 'authorization_code',
        client_id: 'b8bd2008ad9c38a214dd349e3260183d',
        redirect_uri: 'http://localhost:8080/api',
        code: req.body.token
    }))
    var result = await axios({
        methods: 'POST',
        url: 'https://kauth.kakao.com/oauth/token',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: qs.stringify({
            grant_type: 'authorization_code',
            client_id: 'b8bd2008ad9c38a214dd349e3260183d',
            redirect_uri: 'http://localhost:3000/auth',
            code: req.body.token
        })
    })

    res.send(result)
    return
    try {
        var result = await axios({
            methods: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: {
                grant_type: 'authorization_code',
                client_id: 'b8bd2008ad9c38a214dd349e3260183d',
                redirect_uri: 'http://localhost:3000/kakaoMessage',
                code: req.body.token
            }
        })
        res.send(result)
    } catch (error) {
        res.send(error)
    }
    

    
    return 
    axios({
        methods: 'GET',
        url: 'https://kapi.kakao.com/v1/api/talk/profile',
        headers: {
            Authorization: 'Bearer 1HVgCFbTzIPWutTJN8u9Qw8H2H0EXkGMS9687ZoLVoWZ50VzlpyQjNQLhs26uOaX75bObQopdbMAAAFuWZS2-A' 
        }
    }).then(res => {
        console.log(res)
    })

    res.send(req.body.token)
    return
    await axios({
        method : 'GET',
        url: 'http://kauth.kakao.com/oauth/authorize?client_id=b8bd2008ad9c38a214dd349e3260183d&redirect_uri=http://localhost:3000/api/kakaoMessage&response_type=code'
    }).then(res => {
        console.log('성공')
        res.send(res)
    }).catch(err => {
        console.log('실패')
        res.send(err)
    })
})

module.exports = router;