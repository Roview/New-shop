<template>
<!--面包屑导航-->
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--所有的内容都要写在卡片-->
    <el-card class="box-card">
      <el-row :gutter="6">
        <el-col :span="7"><div class="grid-content bg-purple">
                <el-input clearable placeholder="请输入内容"  class="input-with-select"
                          v-model="UserList.query"
                          @clear="InputClear"    >
<!--双向绑定给我们传给url的参数的值，调用axios请求,就可以直接去搜索-->
                  <el-button slot="append" icon="el-icon-search" @click="getValue"></el-button>
                </el-input>
           </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="isshowshow">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表区域 stripe:添加阴影-->
      <el-table  :data="userlist" border stripe class="table">
<!--索引列，-->
        <el-table-column type="index" label="*"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
<!--第一次见到这个写法,传进来的值全部打印出来-->
          <template slot-scope="scope">
            <el-switch  v-model="scope.row.mg_state" @change="switchChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
<!-- 包一层可以获取对应的id-->
        <el-table-column label="操作" >
        <template slot-scope="scope">
            <el-button  plain type="primary" icon="el-icon-edit" size="mini" @click="showditDialog(scope.row.id)"></el-button>
            <el-button  @click="isdeleteok(scope.row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!--分配角色按钮-->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button  @click="AssigningRoles(scope.row)" type="warning" icon="el-icon-setting" size="mini" ></el-button>
            </el-tooltip>
        </template>
          </el-table-column>
      </el-table>
<!--分页-->
<!--         :current-page="currentPage4"-->
      <el-pagination
              class="pagination"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="UserList.pagenum"
              :page-sizes="[1, 2, 3, 20]"
              :page-size="UserList.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
<!--    :before-close="handleClose"-->
    <!-- @close关闭回调-->
    <el-dialog title="添加用户"
            :visible.sync="showshow"
            width="30%"
               @close="handleCloseone">
<!--主体内容区域-->
      <span>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
        <el-input v-model="ruleForm.password" show-password></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
        <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showshow = false">取 消</el-button>
    <el-button type="primary" @click="AuthenTicateUser">确 定</el-button>
  </span>
    </el-dialog>
<!--修改用户的表单-->
<!--:before-close="handleClose"-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
<!--修改用户表单主体内容-->
<!--Modifyuser:就是我们根据id保存的数据-->
      <el-form :model="Modifyuser" :rules="rules" ref="Modifyuser" label-width="80px"
          @close="ModiFuserClose"
      >
        <el-form-item label="用户名">
          <el-input v-model="Modifyuser.username" disabled></el-input>
        </el-form-item>
<!--复用一下邮箱地址规则-->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="Modifyuser.email" ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="Modifyuser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="ModifyuserClick">确 定</el-button>
      </span>
    </el-dialog>
<!--分配角色弹出框-->
    <el-dialog
            title="提示"
            :visible.sync="isdialogVisible"
            width="30%">
      <div>当前的用户：{{Usrlst.username}}</div>
      <div>当前的角色：{{Usrlst.role_name}}</div>
      <div>分配新角色:
        <el-select  v-model="selectRoleld" placeholder="请选择">
          <el-option v-for="item in ulist"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: "User",
    data(){
      // 自定义验证手机号的校验规则
     var validatePhone = (rule, value, callback) => {
       var phone = value.replace(/\s/g, "");//去除空格
       //校验手机号，号段主要有(不包括上网卡)：130~139、150~153，155~159，180~189、170~171、176~178。14号段为上网卡专属号段
       let regs = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
       if (value.length == 0) {
         callback();
       } else {
         if (!regs.test(phone)) {
           callback([new Error('手机号输入不合法')]);
         } else {
           callback();
         }
       }
     }
        return{
          selectRoleld:{},
       //所有的用户角色列表
          ulist:{},
          Usrlst:{},
          isdialogVisible:false,
        //封装接口文档请求的参数
        UserList:{
          //我们需要输入的内容
            query:'',
            //当前的页数
            pagenum:1,
            //当前每页显示多少条数据
            pagesize:1,
        },
        //保存数据
        userlist:[],
        //总页数
        total:0,
        showshow:false,
          //控制修改用户表单的显示与隐藏
          editDialogVisible:false,
          //保存根据id获取的数据
          Modifyuser:{},
        //添加用户表单数据
        ruleForm:{
          username:'',
          password:'',
          email:'',
          mobile:'',
        },
        //表单规则
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '用户名长度在3到10个字符', trigger: 'blur'}
          ],
          password:[
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '密码长度在6到15个字符', trigger: 'blur'}
          ],
          email:[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          mobile:[
            {required: true, message: '请输入手机号', trigger: 'blur'},
            //  validator查看自定义校验规则
            {validator:validatePhone ,trigger: 'blur',}
          ]
        },
      }
      },
    //请求
    created() {
       this.getUserList();
    },
    methods: {
      //请求用户管理数据
      async getUserList() {
        const {data: request} = await this.$http.get("users", {
          params: this.UserList
        });
        if (request.meta.status === 200) {
          console.log("请求成功");
        }
        console.log(request);
        this.userlist = request.data.users
        this.total = request.data.total
      },
      //pageSize 改变时会触发
      handleSizeChange(newsize) {
        //每页要请求多少条数据，重新请求
        this.UserList.pagesize = newsize;
        console.log(newsize);
        this.getUserList();
      },
      //监听页码值改变的事件
      handleCurrentChange(newPage) {
        // console.log(newPage)
        //newPage你每次点击显示多少条数据，这个数据传到params里面的参数,重新去发送ajax请求
        this.userlist.pagenum = newPage
        // console.log(this.userlist)
        this.getUserList();
      },
      //监听Switch开关的点击状态
      //statu传过来的是我们点击的哪个对象
      async switchChange(statu) {
        const request = await this.$http.put(`users/${statu.id}/state/${statu.mg_state}`)
        console.log(statu)
        console.log(request);
        if (request.data.meta.status === 200) {
          console.log("设置状态成功");
        } else {
          //请求失败，以前的状态取反
          statu.mg_state = !statu.mg_state;
        }
      },
      //点击搜索
      getValue() {
        this.getUserList()
      },
      //点击清除inputvalue触发
      InputClear() {
        //input清除就重新请求一次
        this.getUserList()
      },
      //点击添加用户弹出提示框
      isshowshow() {
        this.showshow = true;
      },
      //退出表单重置
      handleCloseone(){
         this.$refs.ruleForm.resetFields();
         this.showshow=false;
      },
      //表单检验，添加用户
       AuthenTicateUser(){
          this.$refs.ruleForm.validate(async callback=>{
           //如果callback为false,不发送请求
           if (!callback) return false;
           //反之发送请求
           const {data:req} =await this.$http.post("users",this.ruleForm);
            console.log(req);
            if (req.meta.status===201){
               this.$message.success(req.meta.msg);
            }else {
              this.$message.error("添加用户失败！");
            }
            //点击完退出
             this.showshow=false;
            //刷新列表，重新获取数据
             return this.getUserList();
         });
      },
      //根据id修改
      async showditDialog(id){
        //通过id进行传参
        const  {data:req}= await this.$http.get('users/'+id);
        //判断是否成功
        if (req.meta.status===200){
          // this.$message.success(req.meta.msg);
          console.log("获取成功");
        }
        //根据id请求到的数据被保存成一个变量了
        this.Modifyuser=req.data;
        this.editDialogVisible=true;
        console.log(this.Modifyuser);
      },
      //重置修改用户表单  ???? 不重置也会修改
      ModiFuserClose(){
        this.$refs.Modifyuser.resetFields();
      },
      //验证修改用户表单
      ModifyuserClick(){
        this.$refs.Modifyuser.validate(async callback=>{
          if (!callback)  return false;
        const {data:req}=await this.$http.put('users/'+this.Modifyuser.id, {
           email:this.Modifyuser.email,
           mobile:this.Modifyuser.mobile
        });
          if (req.meta.status===200) {
            // this.$message.success("修改用户成功!");
            console.log("修改用户成功!");
          }else {
            this.$message.error("修改用户失败!");
          }
          this.editDialogVisible=false;
          this.$message.success("修改用户成功!");
          //重新刷新用户列表
          return this.getUserList();
        })
      },
      //弹出框询问用户是否删除
      async  isdeleteok(id){
      //  会返回一个promise,利用.then来获取用户又没有点击删除和取消
      const aaa= await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          return res;
        }).catch(err=>{
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        return err;
        })
        console.log(aaa);
       //判断用户点击取消,就结束本次操作
        if(aaa==="cancel"){
          console.log(2);
           return  false;
        }else if (aaa==="confirm"){
        //请求删除数据
        const {data:deleteUse}= await this.$http.delete('users/'+id);
           if (deleteUse.meta.status===200){
             this.$message.success(deleteUse.meta.msg);
           }
          console.log(deleteUse)
          return this.getUserList();
        }
      },
      //弹出分配角色提示框
      async  AssigningRoles(row){
        this.isdialogVisible=true;
        this.Usrlst=row;
        //获取所有的用户角色列表
         const {data:res} = await this.$http.get('roles');
         if(res.meta.status!==200 ){
            this.$message.error("查找失败");
         }
         this.ulist=res.data;
        console.log( this.ulist);
      },
      //触发保存信息
      async  saveRoleInfo(){
       const {data:req}=await this.$http.put(`users/${this.Usrlst.id}/role`,{rid:this.selectRoleld})
        console.log(req)
        if(req.meta.status!==200 ){
          this.$message.error("更新角色失败");
        }
        this.$message.success("更新角色成功!");
        this.isdialogVisible=false;
        return this.getUserList();
      },
    }
  }
</script>

<style scoped>
  .table{
    margin-top: 15px;
    font-size: 12px;
  }
  .pagination{
    margin-top: 15px;
  }
</style>