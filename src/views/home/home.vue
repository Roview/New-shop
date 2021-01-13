<template>
 <button @click="qqqq">退出</button>
</template>

<script>
  export default {
    name: "home",
    methods:{
      qqqq(){
        //清除本地sessionStorage
        window.sessionStorage.clear();
        //直接跳转到登录页
        this.$router.push('/login');
      }
    }
  }
</script>

<style scoped>

</style>