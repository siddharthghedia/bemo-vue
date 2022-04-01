import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import interceptorsSetup from './helper/interceptors.js'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './scss/app.scss'
import VModal from 'vue-js-modal'

Vue.use(VueAxios, axios)
interceptorsSetup()
Vue.use(VModal)

Vue.config.productionTip = false

Vue.prototype.$baseUrl = "http://bemo.anyapps.xyz/"

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
