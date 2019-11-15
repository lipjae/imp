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


module.exports = {
  signUp: async (id,pw) => {

    let retMsg = '';
    let is_user = await knex('imp_user').where({ id: id})

    if(is_user.length == 0){
      var sqlRes = await knex('imp_user').insert({
        id: id,
        password: pw
      })
      if (sqlRes.length > 0){
        retMsg = '가입이 완료되었습니다.'
      }else{
        retMsg
      }

      
      
    }else{
      retMsg = '이미 가입된 회원입니다.';
    }


    
    return retMsg
  }
}