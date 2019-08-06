<template>
  <div  class="login-wrap">
    <el-form 
    class="login-form"
    label-position="top" 
    label-width="80px" 
    :model="formdata"
    >
    <h2>用户登陆</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
       <el-button 
       @click.prevent="handleLogin()"
       class="login-btn" 
       type="primary"
       >登陆</el-button>
    
    </el-form>
  </div>
</template>

<script>
export default {
    data(){
        return {
            formdata: {
                username:'',
                password: '',
            },
        }
    },
    methods: {
      // 用async 和await代码简写异步方法
        async handleLogin() {
          const res = await this.$http.post('login', this.formdata)
          // console.log(res);

          const {data, meta: {msg, status}} = res.data

           if (status === 200) {
            //  登陆成功,保存token值
            localStorage.setItem('token', data.token)

            //  如果登陆成功：1，跳转home页；2，提示成功
             this.$router.push({name: 'home'}) //编程式导航
             this.$message.success(msg);
           } else {
            //   else 不成功：1，提示消息
            this.$message.warning(msg);
           }
          


          // this.$http.post('login', this.formdata).then(res => {
          //   console.log(res)
          //    // 对象的解构赋值
          //   const {
          //     data, 
          //     meta: {msg, status}
          //     } = res.data

          //   // 下面的思路：
          //   //   如果登陆成功：1，跳转home页；2，提示成功
          //   //   else 不成功：1，提示消息

          //  if (status === 200) {
          //   //  如果登陆成功：1，跳转home页；2，提示成功
          //    this.$router.push({name: 'home'}) //编程式导航
          //    this.$message.success(msg);
          //  } else {
          //   //   else 不成功：1，提示消息
          //   this.$message.warning(msg);
          //  }


          // })
        }
    }
};
</script>

<style  scoped>
.login-wrap{
    height: 100%;
    background-color: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-wrap .login-form {
    width: 400px;
    background-color: #fff;
    border-radius: 5px;
    padding: 30px;
}
.login-wrap .login-btn{
    width: 100%;
}
</style>