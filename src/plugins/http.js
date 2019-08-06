// 插件模块

// 引入axios
import axios from 'axios'

// 新建一个对象
const MyHttpServer = {}

MyHttpServer.install =  (Vue) => {

    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
    // 给大Vue原型增加实例方法， 添加实例方法
    Vue.prototype.$http = axios
  }

// 导出对象
export default MyHttpServer