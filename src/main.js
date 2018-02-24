import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'

import 'common/stylus/index.styl'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

fastclick.attach(document.body)
Vue.use(VueResource)
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
