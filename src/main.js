/*
 * @Author: your name
 * @Date: 2021-08-20 12:26:59
 * @LastEditTime: 2021-09-21 00:26:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \xh_forum\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/antui'
import './api/http'

// 导入全局样式表
import './assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')