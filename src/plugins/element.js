//按需引入
import Vue from "vue";
import {
  Message,
  Input,
  Form,
  FormItem,
  Button,
  Container,
  Header,
  Aside,
  Main,
  Breadcrumb,
  BreadcrumbItem,
  MessageBox,
  Table,
  TableColumn,
  Dialog,
} from 'element-ui';
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
//面包屑导航
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
//全局引用
  Vue.prototype.$message=Message
  Vue.prototype.$messageBox=MessageBox

