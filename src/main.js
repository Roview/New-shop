import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//导入字体图标
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor);

Vue.component("tree-table", TreeTable);

// 配置请求的BaseUrl地址
axios.defaults.baseURL="http://timemeetyou.com:8889/api/private/v1/";
//请求拦截器
 axios.interceptors.request.use(res=>{
   //登陆期间，服务器并没有给你令牌，此时令牌为null
   //令牌是放在请求头里面 以后你每次请求都需要携带token去请求
 res.headers.Authorization=window.sessionStorage.getItem("token");
   return res;
 })
Vue.prototype.$http=axios;

Vue.config.productionTip = false
//全局样式
import './assets/css/global.css'

Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
