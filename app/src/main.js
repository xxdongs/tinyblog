import Vue from 'vue'
import App from './App'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import { Popover } from 'element-ui';
import router from './router'
import { initCommon } from "@/common/common";
// import store from "@/store"


Vue.component(Popover.name, Popover);
Vue.use(mavonEditor)
initCommon(Vue)


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
