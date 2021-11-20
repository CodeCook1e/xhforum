/*
 * @Author: your name
 * @Date: 2021-08-20 12:26:59
 * @LastEditTime: 2021-11-20 15:34:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \xh_forum\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/antui'
import './api/http'
import CKEditor from '@ckeditor/ckeditor5-vue2';

import moment from "moment"
Vue.prototype.$moment = moment;

Vue.use(CKEditor);
// 导入全局样式表
import './assets/css/global.css'
import './assets/css/content-styles.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')