
import { database, auth, firebase_ } from 'src/boot/firebase'
import  Kakao from 'src/boot/kakao'
import axios from 'axios'

const state = {
  loginStatus: false,
  crntUser : '',
  signUp: {
    phoneNum: '',
    code: '',
    confirmationResult: ''
  }
}

const getters = {
  getLoginStatus: state => {
    console.log(state.loginStatus)
    return state.loginStatus
  },
  getSignUpStatus: state => {
    return state.signUp
  }
}

const mutations = {
  setLoginStatus(state, data){
    state.loginStatus = data
  },
  setCrntUser(state, data){
    state.crntUser = data
  },
  setSignUpPhoneNum(state, data){
    state.signUp.phoneNum = data
  },
  setSignUpCode(state, data){
    state.signUp.code = data
  }
}
const actions = {

  // kakao, naver 로그인 이후
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
      
      case 'naver' : 
        uid = 'naver-' + userData.data.id
        uEmail = userData.data.email
        uNickname = userData.data.nickname
      break
    }
    
    // 등록된 유저인지 확인
    var dbData = await database.ref('users').child(uid).once('value');
    
    // 등록되지 않은 유저일때
    if (dbData.val() == null) { 
      
      //커스텀 토큰 발급
      var ctmToken  = await dispatch('fbCreateToken',{uid : uid})
      
      // firebase 회원가입 및 로그인
      firebase_.auth().signInWithCustomToken(ctmToken)
        .then(function (signIn){
          console.log(signIn)
          // 등록이 완료되면 DB에 유저정보 저장
          if (signIn.user !== undefined) {
            
            database.ref('users').child(uid).set({
              email: uEmail,
              nickname: uNickname
            })

            commit('setLoginStatus', true)
          }
        })
        .catch(function(error){

        })  
      
      
    // 등록된 유저일때
    }else{ 
      commit('setCrntUser',dbData.val())
      commit('setLoginStatus', true)
      //커스텀 토큰 갱신
      var ctmToken = await dispatch('fbCreateToken', { uid: uid })

      // 파이어베이스 로그인
      firebase_.auth().signInWithCustomToken(ctmToken)
    }
    
  },
  isSignIn ({commit}) { // 로그인 감지
    
    auth.onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        commit('setLoginStatus', true)
      } else {
        // No user is signed in.
      }
    });

    

  },
  // 파이어베이스 커스텀 토큰 생성
  async fbCreateToken ({}, uid) { 
    return axios.post('/auth/fbCreateToken', uid).then(function(res){
      return res.data
    })
  },
  // 로그아웃
  async signOut ({commit}) {
    firebase_.auth().signOut()
    commit('setLoginStatus',false)
    commit('setCrntUser','')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}