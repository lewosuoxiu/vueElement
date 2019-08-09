import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import Users from '@/components/users/Users'
import Right from '@/components/rights/Right'
import Roles from '@/components/rights/Roles'

// 引入element 提示框
import {Message} from 'element-ui';

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
          {
          name: 'users',
          path: 'users',
          component: Users
        },
        {
          name: 'right',
          path: '/right',
          component: Right
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
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