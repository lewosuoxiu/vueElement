// 插件模块

// 引入axios
import axios from 'axios'

// 新建一个对象
const MyHttpServer = {}

MyHttpServer.install = (Vue) => {

  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 给大Vue原型增加实例方法， 添加实例方法
  // 在请求发起之前，会先来到下面的回调函数
  // 添加请求拦截器

  // 请求拦截器
  axios.interceptors.request.use(function (config) {
    // 在发起请求请做一些业务处理
    // console.log(config)
    // console.log(config.url)

    if (config.url !== 'login') { //判断是不是login，是的话就拦截添加请求头
      const AUTH_TOKEN = localStorage.getItem("token");
      config.headers["Authorization"] = AUTH_TOKEN;
    }


    return config;
  }, function (error) {
    // 对请求失败做处理
    return Promise.reject(error);
  });
  // 响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做处理
    return response;
  }, function (error) {
    // 对响应错误做处理
    return Promise.reject(error);
  });


  Vue.prototype.$http = axios
}

// 导出对象
export default MyHttpServer