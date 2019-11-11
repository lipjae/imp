const DB_OPTION = {
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'l1002212$$',
    database: 'imp'
  }
}
const mysql = require('mysql2')
const knex = require('knex')(DB_OPTION)
// const async = require('async')
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'l1002212$$',
  database: 'imp'
})
const promisePool = pool.promise()

module.exports = {
  test : async () =>  {

    // let sqlRes = await knex('imp_order').where({merchant_uid : 'order-1573140301420'}).update({status : 'cancel'})

    let sqlRes = await knex('imp_orderr').select()
  
    return sqlRes
  },
  orderInser: async (insertData) => { //오더 정보 저장
    
    let retData = {
      is_success: false,
      pk : '',
      msg : ''
    }
    try{
      var sqlRes = await knex('imp_order').insert(insertData)
      
        retData['is_success'] = true
        retData['pk'] = sqlRes[0]
        retData['msg'] = '저장 성공. 이니시스를 진행합니다..'
      
    }catch(e){
      retData['msg'] = e
    }
    
    console.log(retData)

    return retData
  },
  findById :async (merchant_uid) => {    

    try {
      var [retData] = await knex('imp_order').where({
        merchant_uid : merchant_uid
      })
      .select()
            
    } catch (e) {
      var retData = e
    }
    
    
    return retData;
    
  },
  findByParam : async (param) => {
    let retVal = {}
    let sqlRes = await knex('imp_order').where(param).select()

    try {
      [retVal] = await knex('imp_order').where(param).select()
      retVal['is_success'] = true
    } catch (e) {
      retVal['is_success'] = false
      retVal = e
    }    

    return retVal
  },
  statusChange : async (status, merchant_uid) => {
    let retData = {
      is_success : false,
      msg : ''
    } 
    try{
      let [sqlRes] = await knex('imp_order').where({merchant_uid : merchant_uid}).update({status : status})
      retData['is_success'] = true
      retData['msg'] = sqlRes
    }catch(e){
      retData['msg'] = e
    }
        
    return sqlRes

  }, 
  findByIdAndUpdate: async (merchant_uid, paymentData) => {
    
    console.log(merchant_uid)
    console.log(paymentData)

    let sqlRes = await knex('imp_order').where({ merchant_uid: merchant_uid }).update({ status: 'paid', pay_info: JSON.stringify(paymentData) })

    return sqlRes
  },
  getOrders: async () => {
    let sqlRes = await knex('imp_order').where({ status: 'paid'}).select()
    
    return sqlRes
  }
}
