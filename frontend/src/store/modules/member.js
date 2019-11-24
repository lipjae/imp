
import { database } from 'src/boot/firebase'
import  Kakao from 'src/boot/kakao'

const state = {
  loginStatus: null,
  crntUser : ''
}

const actions = {
  async insertTest(){
    console.log('insertTest')
    var insertRes = await database.ref('users').child('2').set({
      test : 1,
      test2 : 2
    })
    console.log(insertRes)
  },
  async afterLogin({},data) {

    var uid = '';
    
    switch(data.type){
      case 'kakao' :
        uid = 'kakao-' + data.data.id
      break
    }

    var dbData = await database.ref('users').child(uid).once('value');

    
    if(dbData.val() == null){
      database.ref('users').child(uid).set({
        email: data.data.kaccount_email
      })
    }else{
      console.log(dbData)
      console.log(dbData.val())
    }
    
  }
}

export default {
  namespaced: true,
  actions,
  state
}