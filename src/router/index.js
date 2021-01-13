import Vue from 'vue'
import VueRouter from 'vue-router'
//路由懒加载
import Login from "../views/LandingPage/Login";
const home=()=>import('../views/home/home')
Vue.use(VueRouter)

const routes = [
    //重定向路由
  {
    path:'',
    redirect:'/login'
  },
  {
   path:'/login',
   component:Login
  },
  {
    path:'/home',
    component:home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//路由导航守卫
router.beforeEach((to,form,next)=>{
  //判断是不是登录页,是就进入
  if (to.path==='/login') return next();
  const tokenStr = window.sessionStorage.getItem("token");
   if (tokenStr===null){
     return  next('/login')
   }
   //这句必须要加
   next();
})
//导出
export default router
