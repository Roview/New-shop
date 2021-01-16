<template>
  <div>
<!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--卡片-->
    <el-card class="box-card1">
        <el-table :data="rightList" border style="width: 100%">
<!--索引列-->
          <el-table-column type="index" label="#" width="40"></el-table-column>
          <el-table-column prop="authName" label="权限名称" width="400" class="cenrer">
          </el-table-column>
          <el-table-column prop="path" label="路径" width="500">
          </el-table-column>
          <el-table-column prop="level" label="权限等级" width="300">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level===0" type="success">一级</el-tag>
              <el-tag v-else-if="scope.row.level===1" type="info">二级</el-tag>
              <el-tag v-else="scope.row.level===2" type="warning">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Rights",
    data(){
      return{
        //权限列表
        rightList:[]
      }
    },
    created() {
     this.getRightsList();
      console.log(this.rightList);
    },
    methods:{
      async  getRightsList(){
       const {data:res}=await this.$http.get('rights/list');
        if(res.meta.status===200){
          console.log("请求权限列表成功");
        }
        this.rightList=res.data;
      }
    }
  }
</script>

<style scoped>
.box-card1{
  font-size: 16px;
  margin-top: 15px;
}
</style>