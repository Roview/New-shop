//按需引入
import Vue from "vue";
import{Message,Input,Form,FormItem,Button} from 'element-ui';
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
//挂载全局
  Vue.prototype.$message=Message

