import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import Users from '@/components/users/Users'
import Rights from '@/components/rights/Rights'
import Roles from '@/components/rights/Roles'
import GoodsList from '@/components/goods/goodsList'
import GoodsAdd from '@/components/goods/goodsAdd'
import Params from '@/components/goods/params'
import GoodsCate from '@/components/goods/goodsCate'

// 引入element 提示框
import {Message} from 'element-ui';

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      redirect: '/login' // 如果用户访问的 / 根路径，则 重定向到 /login 页面
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {//登陆页面的路由规则
      name: 'home',
      path: '/',
      component: Home,
      redirect: '/users', // 只要进入了 home 页面，就立即重定向到 tenant 欢迎页
      children: [
          {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          name: 'goods', //商品列表
          path: '/goods', //这儿的名字没有统一，不过没关系path路径改为后端传过来的数据渲染就行
          component: GoodsList
        },
        {
          name: 'goodsAdd',
          path: '/goodsAdd', //添加商品
          component: GoodsAdd
        },
        {
          name: 'params',
          path: '/params', //分类参数
          component: Params // 注意： 引入的组件名和地址名不一样的时候，这么用
        },
        {
          name: 'categories',
          path: '/categories',
          component: GoodsCate
        },
      ]
    },
   
  ]
})


// 在路由配置生效之前，统一判断token
// 路由守卫在路由配置生效之前
// 路由/导航 守卫
// const router = new VueRouter

router.beforeEach((to, from, next) => {
  // to from next 
  // console.log(to, from );
  // 如果要去的是登陆 => next()
    if(to.path === '/login') {
      next()
    } else {
        // 如果要去的不是登陆
        // 判断token
        //   如果token没有， -> login
        //   如果有token  -> next()
        const token = localStorage.getItem('token')
        if(!token) {
          // 提示回到登录页
          // 这是.vue文件中的，这儿不能这样写
          // this.message.warning('回到登陆')

          Message.warning('请先登陆')

          // this.$router.push({name: 'login'}) //这儿的this.$router有问题,不能这样写
          router.push({
            name: 'login'
          })
          return;

        }
        next()
    }


});

export default router