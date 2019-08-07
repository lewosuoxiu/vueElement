import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import Users from '@/components/users/Users'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },{
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'users',
        path: 'users',
        component: Users
      }]
    },
   
  ]
})
