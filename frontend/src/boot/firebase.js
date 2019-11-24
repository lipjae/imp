import * as firebase from 'firebase/app'
import 'firebase/app'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

const firebaseConfig = {
  apiKey: "AIzaSyAt4tSgkCiCC77ZmWvE2U_Hb1e5vsb14pI",
  authDomain: "iamport.firebaseapp.com",
  databaseURL: "https://iamport.firebaseio.com",
  projectId: "iamport",
  storageBucket: "iamport.appspot.com",
  messagingSenderId: "375216410780",
  appId: "1:375216410780:web:ff7ddb852394d78356dd59",
  measurementId: "G-BP6E2QG7ZC"
};

firebase.initializeApp(firebaseConfig)

const database = firebase.database() //fbDatabase
const storage = firebase.storage()
const auth = firebase.auth()
const firestore = firebase.firestore()
const functions = firebase.functions()
const firebase_ = firebase

// const settings = {/* your settings... */ timestampsInSnapshots: true}

// firebase.settings(settings)

export {
  database,
  storage,
  auth,
  firestore,
  firebase_,
  functions
}