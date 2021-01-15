<template>
 <el-container class="home-container">
<!--头部区域-->
  <el-header class="home-header">
    <div>电商后台管理系统</div>
<!--    @click="warningClick" warning-->
    <el-button type="warning"  @click="java">退出</el-button>
<!--退出询问是否退出-->

  </el-header>
  <el-container>
<!--主体左区域-->
   <el-aside class="home-aside" :width="iswidth">
     <div class="home-asidecenter" @click="toggleCollapse">|||</div>
<!--导航主体区域-->
     <el-menu :collapse="idcollapse" :collapse-transition="false"
              background-color="#545c64" text-color="#fff"
              active-text-color="#4A90D9"
              :unique-opened="true" :router="true"
              :default-active="active">
<!--一级菜单-->
<!--inde属性：是每个导航栏的唯一标识-->
       <el-submenu :index="String(item.id)" v-for="item in MenuList" :key="item.id">
         <template slot="title">
           <i :class="location[item.id]"></i>
           <span>{{item.authName}}</span>
         </template>
<!--二级菜单-->
<!--点击二级菜单，router跳转地址根本根据我们index决定的-->
         <el-menu-item  :index="'/'+String(itemChild.path)"
                        v-for="itemChild in item.children"
                        :key="itemChild.id"
                        @click="itemClick">
           <template slot="title">
             <i class="el-icon-s-tools"></i>
             <span>{{itemChild.authName}}</span>
           </template>
         </el-menu-item>
       </el-submenu>
     </el-menu>
   </el-aside>
<!--主体右区域-->
   <el-main class="home-main">
     <router-view></router-view>
   </el-main>
  </el-container>
 </el-container>
</template>

<script>
  export default {
    name: "home",
    data(){
      return{
        //左侧菜单数据
         MenuList:{},
        //循环给每个不是的icon
         location:{
            "125":"iconfont icon-user",
            "103":"iconfont icon-tijikongjian",
            "101":"iconfont icon-shangpin",
            "102":"iconfont icon-danju",
            "145":"iconfont icon-baobiao",
         },
        idcollapse:false,
        iswidth:"200px",
        //传进的url
        active:""
      }
    },
    //请求左侧数据方法
    created() {
      this.getMenuList();
    },
    methods:{
      warningClick(){
        //清除本地sessionStorage
        window.sessionStorage.clear();
        //直接跳转到登录页
        this.$router.push('/login');
      },
      //请求左侧导航栏数据
       async getMenuList(){
       const  {data:res}=await this.$http.get("menus");
        if (res.meta.status===200){
          this.$message.success(res.meta.msg);
        }else {
          this.$message.error("获取菜单列表失败，请检查接口");
        }
        this.MenuList=res.data;
       console.log(res);
      },
      //点击实现导航栏的折叠
      toggleCollapse(){
        this.idcollapse=!this.idcollapse;
        // this.collapsetransition=true
        if(!this.idcollapse){
           this.iswidth=200+'px';
        }else {
          this.iswidth=64+'px';
        }
      },
      //点击按钮高亮，index激活菜单  arr是我们每次点击的路径，路径车传给index，就可以高亮
      itemClick(){
        console.log(this.$route.path)
         this.active=this.$route.path;
      },
      //页面如果返回重新获取最新的url
      onCloseModal(){
        this.active=this.$route.path;
      },
      //询问是否退出
      java() {
        this.$confirm('确定要退出吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!',
          },this.warningClick());
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });
        });
      }
    },
    mounted() {
      //监听页面返回上一层
      if (window.history && window.history.pushState) {
              history.pushState(null, null, document.URL);
              window.addEventListener("popstate", this.onCloseModal, false);
      }
    },
    //退出系统询问
  }
</script>

<style scoped>
.home-container{
  height: 100%;
}
.home-header{
  display: flex;
  justify-content: space-between;
  background-color: #454B4E;
  /*居中,不会顶部贴着父元素的顶部*/
  align-items: center;
  color: white;
}
.home-header div{
   font-size: 30px;
   /*line-height: 60px;*/
  display: flex;
  /*纵向对其*/
  align-items: center;
}
.home-aside {
  background-color: #41464F;
}
.home-main{
    background-color: #C9CDD0;
}
/*清除导航栏下拉右边多出一部分*/
.el-menu {
  border-right: none;
}
  .home-asidecenter{
    background-color: #535968;
    font-size: 10px;
    cursor: pointer;
    line-height: 20px;
    text-align: center;
    letter-spacing: 0.2em;
    color: white;
  }
</style>