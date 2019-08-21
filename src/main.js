// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
// MyBread 其实是组件选项所在的对象
import MyBread from '@/components/cuscom/myBread.vue' //全局导入自定义封装的面包屑组件
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/reset.css'

// 引入axios封装 插件
import MyHttpServer from '@/plugins/http.js'
import moment from 'moment'

Vue.use(ElementUI);
Vue.use(MyHttpServer);
Vue.config.productionTip = false


// 全局过滤器-处理日期
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

// 自定义面包屑-全局组件
Vue.component(MyBread.name, MyBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // render: (h) => h(App),
  components: { App },
  template: '<App/>'
})
