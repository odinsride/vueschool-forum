// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import firebase from 'firebase'
import App from './App'
import router from './router'
import store from '@/store'
import AppDate from '@/components/AppDate'

Vue.component('AppDate', AppDate)
Vue.config.productionTip = false

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyCY68H7O8WOrzFMiq2yN3o1dvgtXPGXWs4',
  authDomain: 'vue-school-forum-9f3f5.firebaseapp.com',
  databaseURL: 'https://vue-school-forum-9f3f5.firebaseio.com',
  projectId: 'vue-school-forum-9f3f5',
  storageBucket: 'vue-school-forum-9f3f5.appspot.com',
  messagingSenderId: '1028349875536'
}
firebase.initializeApp(config)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
