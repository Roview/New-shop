<template>
<div>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
  </el-breadcrumb>
<!--卡片-->
  <el-card class="card">
    <el-alert class="el-icon-warning" title="注意:只允许为第三级分类设置相关参数!" type="warning" :closable="false"></el-alert>
    <el-row class="shop">
      <el-col>
        <span>选择商品分类:</span>
        <el-cascader clearable :show-all-levels="false" v-model="selectedCateKeys" :options="catelist" :props="cateProps" @change="handleChange"></el-cascader>
      </el-col>
    </el-row>
<!--标签区-->
    <el-tabs v-model="acriveName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="many">
<!--添加参数-->
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
<!--动态参数的表格-->
        <el-table  :data="manyTableData" border stripe>
<!--索引列-->
          <el-table-column  type="index"></el-table-column>
          <!--展开行-->
          <el-table-column type="expand">
            <template slot-scope="scope">
<!--循环渲染的tag标签-->
<!--删除根据索引删除数组中的第几个-->
                 <el-tag @close="handleClose(index,scope.row)"  closable  v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
<!--输入的文本框-->
<!--               @blur="handleInputConfirm"-->
              <el-input
                      class="dudiudiu"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)">
              </el-input>
<!--添加的按钮-->
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>

          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
          <!--作用域插槽的形式接受数据-->
            <template slot-scope="scope">
              <el-button @click="showEditDialog(scope.row.attr_id)" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button @click="removeParams(scope.row.attr_id)" type="primary" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" size="mini"  :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
<!--静态属性的表格-->
        <!--动态参数的表格-->
        <el-table  :data="onlyTableData" border stripe>
          <!--索引列-->
          <el-table-column  type="index"></el-table-column>
          <!--展开行-->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!--循环渲染的tag标签-->
              <el-tag closable  @close="handleClose(index,scope.row)"  v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
              <!--输入的文本框-->
              <!--               @blur="handleInputConfirm"-->
              <el-input
                      class="dudiudiu"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)">
              </el-input>
              <!--添加的按钮-->
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>

          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <!--作用域插槽的形式接受数据-->
            <template slot-scope="scope">
              <el-button @click="showEditDialog(scope.row.attr_id)" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button @click="removeParams(scope.row.attr_id)" type="primary" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
<!--弹出框-->
  <el-dialog
          :title="'添加'+ titleText "
          :visible.sync="addDialogVisible"
          @close="addDialogClosed"
          width="50%">
<!--提交表单的input值-->
    <el-form :model="addFrom" :rules="addFromrules" ref="addFrom"  label-width="100px" >
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="addFrom.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
  </el-dialog>
  <!--提交表单的input值-->
  <el-dialog
          :title="'修改'+ titleText "
          :visible.sync="editDialogVisibles"
          @close="editDialogClosed"
          width="50%">
    <!--提交表单的input值-->
    <el-form :model="editFrom" :rules="editFromrules" ref="editFrom"  label-width="100px" >
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="editFrom.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisibles = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
  export default {
    name: "params",
    data(){
      return{
        //所有的商品分类
        catelist:[],
        //级联配置对象
        cateProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children',
        },
        //级联选择器数组
        selectedCateKeys:[],
        //默认选中的值
        acriveName:"many",
        //保存动态参数
        manyTableData:[],
        //保存静态属性
        onlyTableData:[],
        //控制添加对话框的显示与隐藏
        addDialogVisible:false,
        //添加参数的表单对象
        addFrom:{
          attr_name:'',
        },
        //表单验证对象
        addFromrules: {
          attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' },
              ],
    },
        editFromrules:{
          attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' },
          ],
        },
        //编辑弹出表单是否隐藏
        editDialogVisibles:false,
        //编辑的表单数据
        editFrom:{},
        inputVisible:false,
        //文本框中输入的内容
        inputValue:''
      }
    },
    created() {
      this.getCateList()
    },
    methods:{
     async getCateList(){
     const {data:res}=await  this.$http.get('categories')
       if (res.meta.status!==200){
           this.$message.error('获取商品分类失败');
       }
       this.catelist=res.data;
       console.log(this.catelist)
      },
      //级联框选中项发生变化，触犯函数
     handleChange(){
       //点击获取的动态参数
      this.getparamDate();
      },
      //封装请求
      async  getparamDate(){
        //证明选中的不是三级分类
        //数组不等于3，把动态参数和静态参数全部清空表格数据就不会渲染
        if (this.selectedCateKeys.length !==3){this.selectedCateKeys=[];this.manyTableData=[];this.onlyTableData=[]}
        //选中的是数组中第3个数进行网络请求
        const {data:req}= await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.acriveName}} );
        if (req.meta.status!==200) return  this.$message.error('获取分类参数失败！');
        console.log(req)
         //渲染下拉框的数据
         req.data.forEach(item=>{
             item.attr_vals=item.attr_vals ?item.attr_vals.split(' ') : [];
             item.inputVisible=false
             item.inputValue=''
         })
        // console.log(this.Arrayvals)
        if(this.acriveName==='many'){
          this.manyTableData=req.data;
        }else {
          this.onlyTableData=req.data;
        }

        },
     //tab页签点击事件的处理函数
      handleTabClick(){
       //点击获取的静态资源
        this.getparamDate();
      },
      //退出或者点击取消表单刷新
      addDialogClosed(){
          this.$refs.addFrom.resetFields();
      },
      //点击提交
      addParams(){
        //表单检验
        this.$refs.addFrom.validate(async valid=>{
          // console.log(valid);
           if (!valid)  return false;
         const {data:res}= await this.$http.post(`categories/${this.cateId}/attributes`, {
              attr_name:this.addFrom.attr_name,
              attr_sel:this.acriveName
            })
          if (res.meta.status===201){
             this.$message.success("创建成功");
          }
             this.addDialogVisible=false;
             return  this.getparamDate();
        })
      },
      //编辑动态参数
      async showEditDialog(row){
      const {data:res} =await this.$http.get(`categories/${this.cateId}/attributes/${row}`,{params:{attr_sel:this.acriveName}})
        if (res.meta.status!==200){
           this.$message.error('获取参数信息失败');
        }
        //根据id把值赋值给我们弹出的表单
        this.editFrom=res.data
        console.log(res);
        this.editDialogVisibles=true;
       },
      //重置表单input的内容
      editDialogClosed(){
        this.$refs.editFrom.resetFields();
      },
      //提交编辑的内容传给服务器
      editParams(){
        this.$refs.editFrom.validate(async valid=>{
          if (!valid)  return false;
         const {data:res}= await this.$http.put(`categories/${this.cateId}/attributes/${this.editFrom.attr_id}`,{
            attr_name:this.editFrom.attr_name,attr_sel:this.acriveName
          });
         if(res.meta.status===200){
          this.$message.success("更新成功");
         }
          console.log(res);
         this.editDialogVisibles=false;
         return this.getparamDate();
        })
      },
     async removeParams(row){
       //确认删除先弹出个提示框
   const res= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((arr) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          return arr;
        }).catch((err) => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
          return err;
        });
        if (res!=='confirm'){
          console.log("已取消删除");
        }
       const {data:req}=await this.$http.delete(`categories/${this.cateId}/attributes/${row}`)
       if (req.meta.status===200) { this.$message.success('删除成功'); }
       console.log(req);
       console.log(12);
       return  this.getparamDate();
      },
      showInput(row){
        row.inputVisible=true
        //让文本框自动获得焦点
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
       handleInputConfirm(row){
        console.log(row)
        //判断input框去除前后空值判断==0
        if(row.inputValue.trim().length===0){
          row.inputValue=''
          //文本框失去焦点就把input隐藏
          row.inputVisible=false
        }else {
          //输入内容
          //新添加的东西push进我们的数组
          row.attr_vals.push(row.inputValue.trim());
          // console.log(row.attr_vals.join(' '))
          // 添加之后清空
          row.inputValue=''
      //
      this.saveAttrVals(row);
        }
      },
      async  saveAttrVals(row){
        //请求
        const  {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
          attr_name:row.attr_name,
          attr_sel:row.attr_sel,
          //转成字符串进行网络请求
          attr_vals:row.attr_vals.join(' ')
        })
        if(res.meta.status===200){
          this.$message.success('修改参数成功!');
        }
      },
      //根据 索引得知我们删的是第几个
    async handleClose(index,row){
        console.log(index);
        //删除数组中选中的这个本地删除
         row.attr_vals.splice(index,1);
        //重新请求
         return  this.saveAttrVals(row);
      }
    },
     computed:{
      isBtnDisabled(){
        if (this.selectedCateKeys.length!==3){return true;} return  false;
      },
       //判断是不是第三个数
       cateId(){
          if(this.selectedCateKeys.length===3){
            //数组中第三个返回
             return this.selectedCateKeys[2]
          }
          return  null;
       },
       titleText(){
         if (this.acriveName==='many'){
            return "动态参数"
         }
         return "静态属性"
       },

     }
  }
</script>

<style scoped>
.card{
  margin-top: 20px;
}
  .shop{
  padding: 10px;
  }
  .el-tag {
    margin: 10px;
  }
  .dudiudiu{
width: 150px;
  }
</style>