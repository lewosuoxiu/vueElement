<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="heaeder-pic grid-content bg-purple">
            <img class src="../../assets/pics/machine.png" width="40%" alt="无法显示图片" />
          </div>
        </el-col>
        <el-col :span="18" class="middle">
          <h3>药柜管理系统</h3>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <a class="loginout" @click.prevent="handleSignout()" href="#">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside class="aside" width="200px">
        <!-- 侧边栏 -->
        <!-- 开启路由模式 -->
        <el-menu
        :router="true"
        :unique-opened="true"
        background-color="#fff"
        >
          <!-- 子菜单 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <!-- 子子菜单 -->
            <el-menu-item index="users">
              <i class="el-icon-circle-check"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu>

          <!-- 子菜单 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <!-- 子子菜单 -->
            <el-menu-item index="role">
              <i class="el-icon-circle-check"></i>
              <span>角色列表</span>
            </el-menu-item>
              <!-- 子子菜单 -->
             <el-menu-item index="right">
              <i class="el-icon-circle-check"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>

          <!-- 子菜单 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <!-- 子子菜单 -->
            <el-menu-item index="1-1">
              <i class="el-icon-circle-check"></i>
              <span>商品列表</span>
            </el-menu-item>
            <!-- 子子菜单 -->
            <el-menu-item index="1-1">
              <i class="el-icon-circle-check"></i>
              <span>分类参数</span>
            </el-menu-item>
            <!-- 子子菜单 -->
            <el-menu-item index="1-1">
              <i class="el-icon-circle-check"></i>
              <span>商品分类</span>
            </el-menu-item>
          </el-submenu>

          <!-- 子菜单 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <!-- 子子菜单 -->
            <el-menu-item index="1-1">
              <i class="el-icon-circle-check"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>

          <!-- 子菜单 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <!-- 子子菜单 -->
            <el-menu-item index="1-1">
              <i class="el-icon-circle-check"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main class="main">
        <!-- 主展示区域 -->
        <!-- 路由写到这展示-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 获取token
  // 判断token; 1,如果有token => 渲染 
  //如果没有token ,跳转到登录页
  data() {
    return{

    }
  },
  beforeCreate() {
    // 获取token
    const token = localStorage.getItem('token')

    if(!token) {
      // token 没有登录 =>
      this.$router.push({name: 'login'})
    }
    // if token有 => 继续渲染组件
  },
  methods: {
    // 退出登录
    handleSignout() {
      // 1.0清除token
      localStorage.clear();
      // 2.0提示退出
      this.$message.success('退出成成功')
      // 3.0来到login组件
      this.$router.push({name: 'login'})
    }
  }
};
</script>

<style scoped>
.container {
  height: 100%;
}
.header {
  background-color: #5595f9;
  color: #fff;
}
.aside {
  background-color: #fff; 
  /* height: 1000%; */
}
.heaeder-pic {
  /* margin: 0 auto;
   */
  display: flex;
  align-items: center;
  justify-content: center;
}
.main {
  background-color: #e9eef3;
  height: 100%;
}
.middle {
  text-align: center;
}
.loginout {
  line-height: 60px;
  text-decoration: none;
  color: #fff;
}
</style>