<template>
 <div>
   <!--面包屑导航-->
   <el-breadcrumb separator="/">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>商品管理</el-breadcrumb-item>
     <el-breadcrumb-item>添加商品</el-breadcrumb-item>
   </el-breadcrumb>
<!--卡片区域-->
   <el-card class="card">
     <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
<!--     步骤条-->
     <el-steps :space="200" :active="Number(activeIndex)" finish-status="success" size="mini" align-center>
       <el-step  title="基本信息"></el-step>
       <el-step title="商品参数"></el-step>
       <el-step title="商品属性"></el-step>
       <el-step title="商品图片"></el-step>
       <el-step title="商品内容"></el-step>
       <el-step title="完成"></el-step>
     </el-steps>
<!--tab主页区域-->
<!--每点击一次，就会打印出 每一个的name值-->
<!--From表单是设置在外面的-->
     <el-form :model="addForm" :rules="addrules" ref="ruleForm" label-width="100px" label-position="top">
       <el-tabs  v-model="activeIndex"  :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
         <el-tab-pane label="基本信息" name="0">
           <el-form-item label="商品名称" prop="goods_name">
             <el-input v-model="addForm.goods_name"></el-input>
           </el-form-item>
           <el-form-item label="商品价格" prop="goods_price" >
             <el-input type="number" v-model="addForm.goods_price"></el-input>
           </el-form-item>
           <el-form-item label="商品重量" prop="goods_weight">
             <el-input type="number" v-model="addForm.goods_weight"></el-input>
           </el-form-item>
           <el-form-item label="商品数量" prop="goods_number">
             <el-input type="number" v-model="addForm.goods_number"></el-input>
           </el-form-item>
           <el-form-item label="商品分类" prop="goods_cat">
<!--渲染级联选择器-->
             <el-cascader v-model="addForm.goods_cat" :options="catelist" :props="cateProps" @change="handleChange"></el-cascader>
           </el-form-item>
         </el-tab-pane>
         <el-tab-pane label="商品参数" name="1">
<!--渲染表单的item项-->
           <el-form-item :label="item.attr_name" v-for="(item,index) in manyTableData2" :key="item.attr_id">
             <el-checkbox-group v-model="item.attr_vals">
               <el-checkbox :label="i" v-for="(i,ix) in item.attr_vals" border :key="ix"></el-checkbox>
             </el-checkbox-group>
           </el-form-item>
         </el-tab-pane>
         <el-tab-pane label="商品属性" name="2">
           <el-form-item :label="item.attr_name" v-for="(item,index) in onlyTableData" :key="index">
<!--文本输入框-->
             <el-input v-model="item.attr_vals"></el-input>
           </el-form-item>
         </el-tab-pane>
         <el-tab-pane label="商品图片" name="3">
           <el-upload :action="uploadURL"
                   :on-preview="handlePreview"
                   :on-remove="handleRemove"
                   list-type="picture" :headers="headerobj" :on-success="handleSuccess">
             <el-button size="small" type="primary">点击上传</el-button>
           </el-upload>
         </el-tab-pane>
         <el-tab-pane label="商品内容" name="4">
<!--富文本编辑器-->
           <quill-editor v-model="addForm.goods_introduce"></quill-editor>
           <el-button type="warning" class="btn" @click="Add">添加商品</el-button>
         </el-tab-pane>
       </el-tabs>
     </el-form>
   </el-card>
<!--   图片预览-->
   <el-dialog
           title="图片预览"
           :visible.sync="previewVisible"
           width="30%">
     <img :src="previewPath" alt="网络请求路径错误">
   </el-dialog>



 </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    name: "Add",
    data(){
      return{
        //激活哪一个进度条的索引
        activeIndex:'0',
        //添加商品的表单数据对象  稍后外面要去向服务器添加的东西
        addForm:{
          //商品名称
          goods_name:'',
          goods_price:0,
          goods_weight:0,
          goods_number:0,
          //级联选择器关联的数组
          goods_cat:[],
          //上传图片文件临时保存的数组
          pics:[],
          attrs:[]
        },
        //表单验证规则
        addrules:{
          goods_name:[
            { required: true, message: '请输入商品名称', trigger: 'blur' },
          ],
          goods_price:[
            { required: true, message: '请输入商品价格', trigger: 'blur' },
          ],
          goods_weight:[
            { required: true, message: '请输入商品重量', trigger: 'blur' },
          ],
          goods_number:[
            { required: true, message: '请输入商品数量', trigger: 'blur' },
          ],
          goods_cat:[
            { required: true, message: '请选择商品分类', trigger: 'blur' },

          ]
        },
        //商品分类数据
        catelist:[],
        cateProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children'
        },
        manyTableData2:{},
        onlyTableData:{},
        //动态绑定URL
        uploadURL:'http://timemeetyou.com:8889/api/private/v1/upload',
        //设置图片上传的请求头部
        headerobj:{
          //从本地存储取出token放在图片上传请求头
          Authorization : window.sessionStorage.getItem("token")
        },
        previewPath:'',
        previewVisible:false,
        //富文本编辑器的值绑定
        goods_introduce:''
      }
    },
    created() {
      this.getCateList()
    },
    methods:{
     async getCateList(){
      const {data:res}=await this.$http.get('categories');
        if (res.meta.status!==200){
             this.$message.error("商品请求分类数据失败");
        }
        this.catelist=res.data;
     },
      handleChange(){
        console.log(this.addForm.goods_cat)
        if (this.addForm.goods_cat.length!==3){
          this.addForm.goods_cat=[];
        }
      },
      //点击left标签前会触发这个钩子函数
      beforeTabLeave(){
             if (this.addForm.goods_cat.length!==3){
               this.$message.error('请选择商品分类');
               return false;
             }
      },
     async tabClicked(){
        console.log(this.activeIndex);
        if (this.activeIndex==='1'){
        //请求三级选项动态数据
       const {data:res} =await this.$http.get(`categories/${Number(this.CataId)}/attributes`,{params:{sel:'many'}})
          if(res.meta.status!==200){
           this.$message.error('获取三级动态数据失败');
          }
        res.data.forEach(item=>{
          //对返回的字符串进行切割返回一个数组
          item.attr_vals= item.attr_vals.length===0 ? [] : item.attr_vals.split(" ")
        })
        this.manyTableData2=res.data;
          console.log(this.manyTableData2);
        }
        if (this.activeIndex==='2'){
          //请求三级选项动态数据
          const {data:res} =await this.$http.get(`categories/${Number(this.CataId)}/attributes`,{params:{sel:'only'}})
          if(res.meta.status!==200){
            this.$message.error('获取静态属性失败');
          }
           //保存静态资源
                this.onlyTableData=res.data;
       console.log(this.onlyTableData);
        }
     },
      //处理图片的预览效果
      handlePreview(file){
        console.log(file);
        //这个函数会返回给我们添加的图片信息
        //获取这图片信息的完整url
        this.previewPath=file.response.data.url
        this.previewVisible=true;
      },
      //处理移除图片的操作
      handleRemove(file){
        console.log(file)
        //获取即将要删除的图片路径
        const filepath=file.response.data.tmp_path;
        //从添加图片信息的数组里去查找这个东西的索引值
        //拿你要删除的图片信息与数组中的图片信息作比较利用findIndex获取索引值
        const index=this.addForm.pics.findIndex(x=>{
        return x.pic===filepath
        })
        //索引值，从那个数组去拿到,调用数组的splice方法
        this.addForm.pics.splice(index,1);
      },
      //文件上传成功的钩子
      handleSuccess(response){
        console.log(response);
        //拼接一个保存图片信息的对象
        const picInfo={pic:response.data.tmp_path}
        this.addForm.pics.push(picInfo);
      },
      //提交表单并对表单做校验
      Add(){
        this.$refs.ruleForm.validate(async callback=>{
          //校验完成
          if (callback){
            //深拷贝一份this.addForm
           const form=_.cloneDeep(this.addForm);
            //goods_cat转为字符串，并且进行网络请求
            form.goods_cat=form.goods_cat.join(',');
            console.log(this.addForm);
            //处理动态参数和静态参数  attr_vals要变为字符串
            this.manyTableData2.forEach( item=>{
              const newInfo={attr_id:item.attr_id,attr_value: item.attr_vals};
              this.addForm.attrs.push(newInfo);
            })
            //处理静态属性  attr_vals:字符串
            this.onlyTableData.forEach( item=>{
              const newInfo={attr_id:item.attr_id, attr_value:item.attr_vals};
              this.addForm.attrs.push(newInfo);
            })
            //处理完的动静态属性赋值给form
            form.attrs=this.addForm.attrs;
            //网络请求添加商品  利用form当参数
             const {data:res} =await this.$http.post('goods',form);
             if(res.meta.status===200){
                 this.$message.success('创建成功!')
             }
            console.log(res);
             //跳转到商品页面
            return  this.$router.push('/goods');
          }else {
           this.$message.error('表单为空，请填写!')
          }
        })
      }
    },
    computed:{
    //获取三级选项的id
    CataId(){
      if(this.addForm.goods_cat.length===3){
         return this.addForm.goods_cat[2]
      }
      return  null;
    }
    }
  }
</script>

<style scoped>
.card{
  margin-top: 15px;
}
.el-steps{
  margin: 15px 0;
  /*font-size:13px ;*/
}
img{
  width: 100%;
}
  .btn{
    margin-top: 15px;
  }
</style>