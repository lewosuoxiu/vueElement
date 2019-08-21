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
          <el-submenu :index="'' + item1.order" v-for="(item1, index) in menus" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <!-- 子子菜单 -->
            <el-menu-item :index="item2.path" v-for="(item2, index) in item1.children" :key="index">
              <i class="el-icon-circle-check"></i>
              <span>{{item2.authName}}</span>
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
      menus: [],
    }
  },
  beforeCreate() {
    // 获取token
    // const token = localStorage.getItem('token')

    // if(!token) {
    //   // token 没有登录 =>
    //   this.$router.push({name: 'login'})
    // }
    // // if token有 => 继续渲染组件
  },
  created() {
    this.getMenus();
  }, 
  methods: {
    // 获取导航数据
    async getMenus() {
       // token请求头
      // const AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(`menus`)
      // console.log(res);
      this.menus = res.data.data;
      // console.log(this.menus);
    },
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