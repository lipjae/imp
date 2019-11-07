const mysql = require('mysql2')
const async = require('async')
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'l1002212$$',
  database: 'imp'
})
const promisePool = pool.promise()

module.exports = {
  findById :async (merchant_uid) => {    

    var sql = 'SELECT * FROM imp_order WHERE io_merchant_uid = ?'

    var [rows] = await promisePool.query(sql, merchant_uid)
    
    pool.end()
    return rows;
    
  },
  findByIdAndUpdate: async (merchant_uid, paymentData) => {
    var sql = 'UPDATE '
  }
}
