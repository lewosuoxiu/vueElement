<template>
  <el-card class="box-card">
    <!-- 1,面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2，搜索 -->
    <el-row class="searchRow">
      <el-col>
        <el-input
          @clear="loadGoodsList()"
          clearable
          placeholder="请输入内容"
          v-model="query"
          class="inputSearch"
        >
          <el-button @click="searchGoods()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="$router.push({name: 'goodsAdd'})">添加商品</el-button>
      </el-col>
    </el-row>

    <!-- 3，表格 -->
    <el-table height="450px" :data="goodsList" style="width: 100%">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="480"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <!-- 处理日期格式 -->
      <el-table-column label="创建时间">
        <template slot-scope="goodsList">{{goodsList.row.create_time | fmtdate}}</template>
      </el-table-column>

      <!-- <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column> -->

      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-row>
            <!-- 编辑用户 -->
            <el-button
              size="mini"
              plain
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEditGoods(scope.row)"
            ></el-button>
            <!-- 设置用户权限 -->
            <!-- <el-button
              @click="showSetRole(scope.row)"
              size="mini"
              plain
              type="success"
              icon="el-icon-check"
              circle
            ></el-button> -->
            <!-- 删除用户 -->
            <el-button
              size="mini"
              plain
              type="danger"
              icon="el-icon-delete"
              circle
              @click="showDeleGoods(scope.row.id)"
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
      :page-sizes="[10, 20, 40, 100]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 对话框 -->
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.Goodsname" autocomplete="off"></el-input>
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
        <el-button type="primary" @click="addGoods()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input disabled v-model="form.Goodsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editGoods()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <!-- <el-input v-model="form.name" autocomplete="off"></el-input>
           -->
           {{curGoodsName}}
        </el-form-item>
        <el-form-item label="角色" label-width="100px">
          <!-- {{curRoleId}} -->
          <!-- 下拉框绑定元素 -->
          <el-select v-model="curRoleId" >
            <el-option label="请选择" :value="-1"></el-option>
            <el-option :label="item.roleName" :value="item.id"
            v-for="(item, i) in roles" :key="i"
            > 
            </el-option>
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
            <!-- 如果select的绑定的数据的值和option的value一样，就会显示该option的label值 -->
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
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
      // Goodsname: "admin"

      query: "",
      pagenum: 1,
      pagesize: 10,
      // 表格里的数据
      goodsList: [],
      total: -1,
      // 添加对话框的属性
      dialogFormVisibleAdd: false, //增加用户对话框
      dialogFormVisibleEdit: false, //编辑用户的对话框
      dialogFormVisibleRole: false, //分配角色的对话框
      form: {
        Goodsname: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 当前用户ID
      currGoodsId: -1,
      // 分配角色
      curRoleId: -1,
      curGoodsName: '',//当前显示的用户名
      roles: [], //保存所有的角色数据

    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {

       // 获取用户列表的请求
    async getGoodsList() {
      // query	查询参数	可以为空
      // pagenum	当前页码	不能为空
      // pagesize	每页显示条数\

      // 需要设置请求头 ，授权的API，使用Authorization 字段，看接口文档
      // const AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
        console.log(res);
      // 解构赋值，得到data里的数据
      const {
        meta: { status, msg },
        data: { goods, total }
      } = res.data;
      if (status === 200) {
        // 1，给表格数据赋值
        this.goodsList = goods;
        // console.log(this.goodsList);
        // 2，给total赋值
        this.total = total;
        // 3，提示
        this.$message.success(msg);
        this.pagenum = 1; //发请求成功后，把页码改为1
      } else {
        // 提示
        this.$message.warning(msg);
      }
    },
    // 分配角色，发送请求
    async setRole() {
      // Goods/:id/role
      // :id 要修改的用户id值
      // 请求体中rid 修改的新值角色id
      const res = await this.$http.put(`Goodss/${this.currGoodsId}/role`, {
        rid:this.curRoleId  //这个rid参数不能发在url中，请求文档中有说明的
      })
      // console.log(res);
    },
    // 分配角色
    async showSetRole(Goods) {
      this.curGoodsName = Goods.Goodsname;
      // 给currGoodsId赋值
      this.currGoodsId = Goods.id;
      // 获取所有的角色
      const res1 = await this.$http.get(`roles`)
      // console.log(res1);
      this.roles = res1.data.data;

      // 获取当前用户的角色Id
      const res = await this.$http.get(`Goodss/${Goods.id}`)
      // console.log(res)
      this.curRoleId = res.data.data.rid;

      this.dialogFormVisibleRole = true; //分配角色打开对话框
    },
    // 修改开关的状态
    async changeState(Goods) {
      // 发送请求
      //请求路径：Goodss/:uId/state/:type
      const res = await this.$http.put(
        `Goodss/${Goods.id}/state/${Goods.mg_state}`
      );
      // console.log(res);
    },
    // 编辑用户，发送请求
    async editGoods() {
      //Goodss/:id
      const res = await this.$http.put(`Goodss/${this.form.id}`, this.form);
      // console.log(res);
      // 关闭对话框
      this.dialogFormVisibleEdit = false;
      // 更新视图
      this.getGoodsList();
    },
    // 编辑用户的对话框
    showEditGoods(Goods) {
      // console.log(Goods);
      this.form = Goods;
      this.dialogFormVisibleEdit = true;
    },
    // 删除用户
    showDeleGoods(GoodsId) {
      this.$confirm("删除用户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送删除的请求 :id ====》 用户id
          // 1，data中找GoodsId
          // 2，把GoodsID以showDeleGoods参数形式传进来
          const res = await this.$http.delete(`Goodss/${GoodsId}`);
          // console.log(res);

          if (res.data.meta.status === 200) {
            this.pagenum = 1;
            // 更新视图
            this.getGoodsList();
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
    async addGoods() {
      // 关闭对话框
      this.dialogFormVisibleAdd = false;

      const res = await this.$http.post(`Goodss`, this.form);
      // console.log(res);
      const {
        meta: { status, msg },
        data
      } = res.data;
      if (status === 201) {
        // 1,提示成功
        this.$message.success(msg);
        // 2，关闭对话框
        // 3，更新视图
        this.getGoodsList();
        // 4，清空文本框
        // this.form.Goodsname = ''
        this.form = {};
      } else {
        this.$message.warning(msg);
      }
    },
    // 添加用户 --显示对话框
    showAddGoods() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },

    // 清空输入框，重新获取数据
    loadGoodsList() {
      this.getGoodsList();
    },
    // 搜索用户
    searchGoods() {
      // console.log("aaaaaaa");
      this.getGoodsList();
    },

    // 分页相关的方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val; //点击时候传入相应的条数
      // this.pagenum = 1 //重置页面为1
      this.getGoodsList(); //重新获取数据
    },
    handleCurrentChange(val) {
      // 切换页码的时候，使用
      // console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getGoodsList();
    },

   
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