import Vue from 'nativescript-vue';
import Login from './components/Login';
import VueDevtools from 'nativescript-vue-devtools';
import * as localStorage from 'nativescript-localstorage';

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')
Vue.prototype.$localStorage = localStorage;

new Vue({
  render: h => h('frame', [h(Login)])
}).$start()
