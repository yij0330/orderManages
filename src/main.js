import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router/router'
import echarts from 'echarts'
// import './assets/styles/var.less'

// import '//at.alicdn.com/t/font_1990263_hv7vcnkps4w.css'

Vue.prototype.$echarts = echarts

//创建线程
Vue.prototype.$bus = new Vue()

Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')