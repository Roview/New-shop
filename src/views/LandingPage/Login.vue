<template>
  <div class="login_container">
    <div class="title">电商后台管理系统</div>
   <div class="login_box">
        <div class="user_box">
          <img src="../../assets/img/logo.png" alt="路径错误">
        </div>
<!--     表单区域-->
     <el-form ref="loginFormRef" :rules="loginFromRules" :model="loginForm" label-width="0px" class="form_box">
<!--账户-->
       <el-form-item prop="username">
<!--绑定再loginForm里面username属性里面-->
         <el-input  v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
       </el-form-item>
<!--密码-->
       <el-form-item prop="password">
         <el-input show-password v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
       </el-form-item>
       <!--按钮-->
       <el-form-item class="btns">
         <el-button type="primary" @click="LoginClick">登陆</el-button>
         <el-button type="info" @click="ResetLogin">重置</el-button>
       </el-form-item>
     </el-form>
   </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data(){
       return{
         //登陆表单的数据绑定对象
         loginForm:{
           username:'admin',
           password:'123456'
         },
         loginFromRules:{
           username: [
             { required: true, message: '请输入账户名称', trigger: 'blur' },
             { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
           ],
           password:[
             { required: true, message: '请输入账户密码', trigger: 'blur' },
             { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
           ]
         }
       }
    },
    methods:{
      //重置表单
      ResetLogin(){
          this.$refs.loginFormRef.resetFields();
      },
      // search(){
      //   this.LoginClick();
      // },
      //表单验证
      LoginClick(){
        this.$refs.loginFormRef.validate(async callback=>{
          //callback发送请求
         if (!callback)  return false;
        const {data:request}= await this.$http.post('login',this.loginForm);
          // console.log(request);
          if(request.meta.status===200){
            this.$message.success('登陆成功');
             window.sessionStorage.setItem("token",request.data.token);
             //跳转到首页
            return this.$router.push("/home");
          }else {
            this.$message.error("登陆失败");
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
  color: aqua;
}
.title{
  display: block;
  /*position: absolute;*/
  font-size: 80px;
 text-align: center;
  transform: translateY(50%);
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: gainsboro;
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
  border-radius: 5px;
  .user_box{
    width: 130px;
    height: 130px;
    border: 1px  white solid;
    border-radius: 50%;
    padding: 10px;
    background-color: cornsilk;
    box-shadow: 0 0 yellow;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .user_box img{
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
  .form_box{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns{
    display: flex;
    justify-content: center;
  }
}
</style>