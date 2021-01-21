<template>
  <div>
<!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--卡片试图区域-->
    <el-card class="card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button @click="butClick" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
<!--表格-->
      <el-table :data="goodsList" border stripe class="table">
        <el-table-column type="index"></el-table-column>
        <el-table-column  label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column width="95px"  label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column width="95px" label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column  label="创建时间" prop="add_time">
<!--数据用作用域插槽取出使用过滤器-->
          <template slot-scope="scope">
              {{scope.row.add_time | showDate}}
          </template>
        </el-table-column>
        <el-table-column  label="操作" >
<!--通过作用域插槽来获取这行的数据-->
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
<!-- 分页-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  //解析时间戳
  import {formatDate} from '../../Utils/data'
  export default {
    name: "Goods",
    data(){
      return{
        //请求数据携带的参数
        queryInfo:{
          //表单提交的内容
          query:'',
          //当前页码
          pagenum:1,
          //每页显示条数
          pagesize:10
        },
        //商品列表
        goodsList:[],
        //总数居条数
        total:0,
      }
    },
    created() {
      this.getGoodsList();
    },
    methods:{
      //根据分页获取对应的商品列表
    async getGoodsList(){
     const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
      console.log(res);
     if (res.meta.status!==200){
         this.$message.error('获取商品失败');
     }
     this.goodsList=res.data.goods;
     this.total=res.data.total;
      // console.log(this.goodsList);
    },
      handleSizeChange(newsize){
        //当前页显示多少条数据 newsize:点击的哪一页
        this.queryInfo.pagesize=newsize;
        this.getGoodsList()
       },
      //点击页数显示数据
      handleCurrentChange(newpage){
        this.queryInfo.pagenum=newpage
        this.getGoodsList();
      },
      butClick(){
       this.getGoodsList();
      },
     async removeById(row){
   const  confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          return res;
        }).catch((err) => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
          return err;
        });
       console.log(confirmResult);
       if(confirmResult==='confirm'){
         //点击确认键,删除
       const {data:res}=await this.$http.delete(`goods/${row}`);
         if (res.meta.status===200){this.$message.success('删除成功')}
         // console.log(res);
        return  this.getGoodsList();
       }
      },
      goAddpage(){
      this.$router.push('/goods/Add')
      }
    },
    filters:{
      showDate(value){
        //将事件戳转换为Data对象
        const data = new Date(value * 1000);
        // 返回并且将data进行格式化
        return  formatDate(data,'yyyy-MM-dd hh:mm:ss');
      }
    },
  }
</script>

<style scoped>
.card{
  margin-top: 15px;
}
  .table{
    margin-top: 15px;
  }
</style>