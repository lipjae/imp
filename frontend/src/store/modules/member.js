
import { database } from 'src/boot/firebase'
import  Kakao from 'src/boot/kakao'
import axios from 'axios'

const state = {
  loginStatus: false,
  crntUser : ''
}

const getters = {
  getLoginStatus: state => {
    console.log(state.loginStatus)
    return state.loginStatus
  }
}

const mutations = {
  setLoginStatus(state, data){
    state.loginStatus = data
  },
  setCrntUser(state, data){
    state.crntUser = data
  }
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
  async afterLogin({ dispatch, commit, getters, rootGetters },userData) {

    var uid = '';
    var uEmail = ''
    var uNickname = ''
    
    switch (userData.type){
      case 'kakao' :
        uid = 'kakao-' + userData.data.id
        uEmail = userData.data.kaccount_email
        uNickname = userData.data.properties.nickname
      break
    }
    
    // 등록된 유저인지 확인
    var dbData = await database.ref('users').child(uid).once('value');
    
    if (dbData.val() == null) { // 등록되지 않은 유저일때
      
      // firebase 커스텀 토큰 발급 및 커스텀토큰으로 유저 등록
      var signUpRes = await dispatch('fbSignUp',{id: uid})
      
      // 등록이 완료되면 DB에 유저정보 저장
      if( signUpRes.data.user !== undefined){

        database.ref('users').child(uid).set({
          email: uEmail,
          nickname : uNickname
        })

        commit('setLoginStatus', true)
      }
      
    }else{ // 등록된 유저일때
      commit('setCrntUser',dbData.val())
      commit('setLoginStatus', true)
    }
    
  },
  async fbSignUp ({},id) { 
    return axios.post('http://localhost:3000/auth/fbSignUp', id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}