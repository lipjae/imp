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
  test : async () => {

    let sqlRes = await knex('imp_order').where({merchant_uid : 'order-1573140301420'}).update({status : 'cancel'})
  
    return sqlRes
  },
  orderInser: async (insertData) => {
    
    let sqlRes = await knex('imp_order').insert(insertData)
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
      .finally(() => {
        // knex.destroy()
      })

    return sqlRes
  },
  findById :async (merchant_uid) => {    

    // let sql = 'SELECT * FROM imp_order WHERE io_merchant_uid = ?'

    // let [rows] = await promisePool.query(sql, merchant_uid)

    let [sqlRes] = await knex('imp_order').where({
      merchant_uid : merchant_uid
    })
    .select()
    
    return sqlRes;
    
  },
  findByParam : async (param) => {
    console.log(param)
    let sqlRes = knex('imp_order').where(param).select()
    .then( await function (res){
      let [retVal] = res
      retVal['is_success'] = true
      return retVal
    })
    .catch( await function (err){      
      return {
        is_success: 'fail'
      }
    })

    return sqlRes
  },
  statusChange : async (status, merchant_uid) => {
    
    let sqlRes = await knex('imp_order').where({merchant_uid : merchant_uid}).update({status : status})
        
    return sqlRes

  }, 
  findByIdAndUpdate: async (merchant_uid, paymentData) => {
    
    console.log(merchant_uid)
    console.log(paymentData)

    let sqlRes = await knex('imp_order').where({ merchant_uid: merchant_uid }).update({ status: 'paid', pay_info: JSON.stringify(paymentData) })

    console.log(sqlRes)
    return sqlRes
  },
  getOrders: async () => {
    let sqlRes = await knex('imp_order').select()
    
    return sqlRes
  }
}
