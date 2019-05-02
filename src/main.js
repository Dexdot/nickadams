import Vue from 'vue'
import App from './App.vue'
import BaseView from './BaseView.vue'

import router from './router'
import store from './store/'

import './sass/main.sass'

Vue.component('base-view', BaseView)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
