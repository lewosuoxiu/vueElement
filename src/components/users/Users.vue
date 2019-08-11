<template>
  <el-card class="box-card">
    <!-- 1,面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2，搜索 -->
    <el-row class="searchRow">
      <el-col>
        <el-input
          @clear="loadUserList()"
          clearable
          placeholder="请输入内容"
          v-model="query"
          class="inputSearch"
        >
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="showAddUser()">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 3，表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="username" label="姓名" width="80"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <!-- 处理日期格式 -->
      <el-table-column label="创建时间">
        <template slot-scope="userList">{{userList.row.create_time | fmtdate}}</template>
      </el-table-column>

      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
            <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              icon="el-icon-delete"
              circle
              @click="showDeleUser(scope.row.id)"
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4，分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 对话框 -->
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 表格中的数据
      // create_time: 1486720211
      // email: "adsfad@qq.com"
      // id: 500
      // mg_state: true
      // mobile: "12345678"
      // role_name: "主管"
      // username: "admin"

      query: "",
      pagenum: 1,
      pagesize: 2,
      // 表格里的数据
      userList: [],
      total: -1,
      // 添加对话框的属性
      dialogFormVisibleAdd: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 删除用户
    showDeleUser(userId) {
      this.$confirm("删除用户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送删除的请求 :id ====》 用户id
          // 1，data中找UserId
          // 2，把userID以showDeleUser参数形式传进来
          const res = await this.$http.delete(`users/${userId}`)
          console.log(res)
          
          if(res.data.meta.status === 200) {
            // 更新视图
            this.getUserList()
            // 删除成功提示
              this.$message({
              type: "success",
              message: res.data.meta.msg
            });
          }

          // this.$message({
          //   type: "success",
          //   message: "删除成功!"
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 添加用户 -- 发送请求
    async addUser() {
      // 关闭对话框
      this.dialogFormVisibleAdd = false;

      const res = await this.$http.post(`users`, this.form);
      console.log(res);
      const {
        meta: { status, msg },
        data
      } = res.data;
      if (status === 201) {
        // 1,提示成功
        this.$message.success(msg);
        // 2，关闭对话框
        // 3，更新视图
        this.getUserList();
        // 4，清空文本框
        // this.form.username = ''
        this.form = {};
      } else {
        this.$message.warning(msg);
      }
    },
    // 添加用户 --显示对话框
    showAddUser() {
      this.dialogFormVisibleAdd = true;
    },

    // 清空输入框，重新获取数据
    loadUserList() {
      this.getUserList();
    },
    // 搜索用户
    searchUser() {
      console.log("aaaaaaa");
      this.getUserList();
    },

    // 分页相关的方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val; //点击时候传入相应的条数
      // this.pagenum = 1 //重置页面为1
      this.getUserList(); //重新获取数据
    },
    handleCurrentChange(val) {
      // 切换页码的时候，使用
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getUserList();
    },

    // 获取用户列表的请求
    async getUserList() {
      // query	查询参数	可以为空
      // pagenum	当前页码	不能为空
      // pagesize	每页显示条数\

      // 需要设置请求头 ，授权的API，使用Authorization 字段，看接口文档
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      // Request URL: http://localhost:8888/api/private/v1/users?query=a&pagenum=1&pagesize=2 ,最后生成的url
      // console.log(res);

      // 解构赋值，得到data里的数据
      const {
        meta: { status, msg },
        data: { users, total }
      } = res.data;
      if (status === 200) {
        // 1，给表格数据赋值
        this.userList = users;
        // 2，给total赋值
        this.total = total;
        // 3，提示
        this.$message.success(msg);
        this.pagenum = 1; //发请求成功后，把页码改为1
      } else {
        // 提示
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style scoped>
.box-card {
  height: 100%;
}
.inputSearch {
  width: 300px;
}
.searchRow {
  margin-top: 20px;
}
</style>