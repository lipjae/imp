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

    var result = await knex('imp_order').where({merchant_uid : 'order-1573140301420'}).update({status : 'cancel'})
  
    return result
  },
  orderInser: async (insertData) => {
    
    var result = await knex('imp_order').insert(insertData)
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
      .finally(() => {
        // knex.destroy()
      })

      return result
  },
  findById :async (merchant_uid) => {    

    var sql = 'SELECT * FROM imp_order WHERE io_merchant_uid = ?'

    var [rows] = await promisePool.query(sql, merchant_uid)
    
    pool.end()
    return rows;
    
  },
  findByIdAndUpdate: async (merchant_uid, paymentData) => {
    var sql = 'UPDATE '
  },
  statusChange : async (status, merchant_uid) => {

    console.log(status)
    console.log(merchant_uid)
    
    var result = await knex('imp_order').where({merchant_uid : merchant_uid}).update({status : status})
        
    return result

  }
}
