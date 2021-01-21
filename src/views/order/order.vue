<template>
 <div>
   <!--面包屑导航-->
   <el-breadcrumb separator="/">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>订单管理</el-breadcrumb-item>
     <el-breadcrumb-item>订单列表</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card class="card">
     <el-row>
       <el-col :span="8">
         <el-input placeholder="请输入内容" >
           <el-button slot="append" icon="el-icon-search"></el-button>
         </el-input>
       </el-col>
     </el-row>
<!--列表数据-->
     <el-table :data="orderlist" border stripe>
       <el-table-column type="index"></el-table-column>
       <el-table-column label="订单编号" prop="order_number"></el-table-column>
       <el-table-column label="订单价格" prop="order_price"></el-table-column>
       <el-table-column label="是否付款" prop="pay_status"></el-table-column>
       <el-table-column label="是否发货" prop="is_send">
         <template slot-scope="scope">
           <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
           <el-tag type="danger" v-else>未付款</el-tag>
         </template>
       </el-table-column>
       <el-table-column label="下单时间" prop="create_time">
         <template slot-scope="scope">
<!--用时间过滤器，把时间解析成yymmdd类型-->
           {{scope.row.create_time | showDate  }}
         </template>
       </el-table-column>
       <el-table-column label="操作">
         <template slot-scope="scope">
           <el-button type="primary" icon="el-icon-edit" @click="showbox"></el-button>
           <el-button type="success" icon="el-icon-location" @click="showProgressBos"></el-button>
         </template>
       </el-table-column>
     </el-table>
<!--分页-->
     <el-pagination
             @size-change="handleSizeChange"
             @current-change="handleCurrentChange"
             :current-page="queryInfo.pagenum"
             :page-sizes="[10, 20, 30, 40]"
             :page-size="100"
             layout="total, sizes, prev, pager, next, jumper"
             :total="total">
     </el-pagination>
   </el-card>
<!--修改地址-->
   <el-dialog
           title="修改地址"
           :visible.sync="dialogVisible"
           width="30%"
           :before-close="handleClose"
           @close="addressDialogClosed"
   >
     <el-form :model="addressForm" :rules="addressFormrules" ref="ruleFormrules" label-width="100px" >
       <el-form-item label="省市区/县" prop="address1" >
<!--级联选择器使用地址-->
         <el-cascader class="cascader" :options="citydata" v-model="addressForm.address1"></el-cascader>
       </el-form-item>
       <el-form-item label="详细地址" prop="address2">
         <el-input v-model="addressForm.address2"></el-input>
       </el-form-item>
     </el-form>
     <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
   </el-dialog>
<!--   展示物流进度的对话框-->
   <el-dialog
           title="物流进度"
           :visible.sync="progressVisible"
           width="30%">
     <span>暂无物流信息</span>

   </el-dialog>
 </div>
</template>

<script>
  import citydata from "./citydata";
  import {formatDate} from '../../Utils/data'
  export default {
    name: "order",
    data(){
       return{
         queryInfo:{
           query:'',
           pagenum:1,
           pagesize:10
         },
         //总件数
         total:0,
         //商品
         orderlist:[],
         dialogVisible:false,
         addressForm:{
           //保存级联选择器的数组
           address1:[],
           address2:''
         },
         //表单验证规则
         addressFormrules:{
           address1:[
              { required: true, message: '请输入活动名称', trigger: 'blur' },
         ],
           address2:[
             { required: true, message: '请输入详细地址', trigger: 'blur' },
           ]
         },
         citydata:citydata,
         progressVisible:false,
         progressInfo:[]
       }
      },
    created() {
      this.getOrderList()
    },
    methods:{
     async getOrderList(){
       const {data:res}=await this.$http.get('orders',{params:this.queryInfo})
       if (res.meta.status!==200){
       return    this.$message.error('数据请求失败');
       }
       console.log(res)
       this.total=res.data.total;
       this.orderlist=res.data.goods;
     },
      handleSizeChange(newsize){
       this.queryInfo.pagesize=newsize
        this.getOrderList();
      },
      handleCurrentChange(newpage){
        this.queryInfo.pagenum=newpage
        this.getOrderList();
      },
      //修改地址
      showbox(){
      this.dialogVisible=true
      },
      handleClose(){
        this.dialogVisible=false
      },
      //关闭表单就清空
      addressDialogClosed(){
         this.$refs.ruleFormrules.resetFields()
      },
       async showProgressBos(){
      const {data:res}=await this.$http.get(`/yuanton/1106975712662`)
         // if (res.data.meta.status===200){
         //     this.$message.success('获取物流成功');
         // }
         //   console.log(res);
         //保存物流信息
         this.progressInfo=res.data
         // this.$message.error('暂无物流信息');
         console.log(this.progressInfo);
         this.progressVisible=true
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
  .cascader{
    width: 100%;
  }
</style>