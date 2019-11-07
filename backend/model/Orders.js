const mysql = require('mysql')

module.exports = {
  findById : function(merchant_uid) {

    var returnData = {}
    let conn = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'l1002212$$',
      database: 'imp'
    })

    var sql = 'SELECT * FROM imp_order WHERE io_merchant_uid = ?'

    conn.query(sql, merchant_uid, function(err,res,fields){
      console.log(res)
      return res;  
    })
    conn.end()

    
  }
}