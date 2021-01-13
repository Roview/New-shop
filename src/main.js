import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//导入字体图标
import './assets/fonts/iconfont.css'

Vue.prototype.$http=axios;

// 配置请求的BaseUrl地址
axios.defaults.baseURL="http://www.ysqorz.top:8888/api/private/v1/";

Vue.config.productionTip = false
//全局样式
import './assets/css/global.css'

Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
