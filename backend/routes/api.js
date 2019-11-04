var express = require('express');
var router = express.Router();
var cors = require('cors');
const axios = require('axios');


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


module.exports = router;