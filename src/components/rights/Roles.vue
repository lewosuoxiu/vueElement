<template>
  <el-card>
    <!-- 面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row class="addRoleBtn">
      <el-col>
        <el-button type="info">添加角色</el-button>
      </el-col>
    </el-row>

    <!-- 3，表格 -->
    <el-table :data="roleList" style="width: 100%">
      <!-- expand展开属性 -->
      <el-table-column type="expand" width="150">
        <template slot-scope="scope">
          <el-row v-for="(item1, i) in scope.row.children" :key="i">
            <el-col :span="4">
              <!-- 一级权限 -->
              <el-tag @close="deleRight(scope.row, item1.id)" closable type>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2, i) in item1.children" :key="i">
                <el-col :span="4">
                  <!-- 二级权限 -->
                  <el-tag
                    @close="deleRight(scope.row, item2.id)"
                    closable
                    type="success"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限tag标签 -->
                  <el-tag
                    @close="deleRight(scope.row, item3.id)"
                    closable
                    type="warning"
                    v-for="(item3, i) in item2.children"
                    :key="i"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 无权限的提示 -->
          <span v-if="scope.row.children.length === 0">未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="150"></el-table-column>

      <el-table-column prop="roleDesc" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleName" label="角色描述" width="200"></el-table-column>

      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button  type="primary"  >编辑</el-button>
            <el-button
              @click="showSetRight(scope.row)"
              type="success"
            >权限设置</el-button>
            <el-button  type="danger" >删除</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改权限的对话框 -->
    <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
      <!-- 树形结构 -->
      <!--
         data 数据源
         show-checkbox 选择框
         node-key 每个节点的唯一标识 通常是data数据源中key名id
         default-expanded-keys默认展开【要展开的节点id】
         props 配置项{label, children}
         label 节点的文字标题和children节点的子节点
             值都来源于data绑定的数据源中的数据key名 'label'和 'children'
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"

        :default-expanded-keys="arrexpand"
        用default-expand-all 也能够打开所有的节点,
      -->
      <el-tree 
      ref="tree"
      :data="treelist" 
      show-checkbox 
      node-key="id" 
      default-expand-all
      :default-checked-keys="arrcheck"
      :props="defaultProps"
     ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      // roleDesc: "技术负责人"
      // roleName: "主管"
      // 以下是树形结构的数据
      dialogFormVisibleRight: false,
      treelist: [],
      defaultProps: {
        label: "authName",
        children: "children"
      },
      arrexpand: [],
      arrcheck: [],
      currRoleId: -1,
    };
  },  
  created() {
    this.getRoleList();
  },
  methods: {
    // 修改权限 - 发送请求
    async setRoleRight() {
    //  请求路径：roles/:roleId/rights
    // roleId 当前要修改权限的角色Id
    // rids 树形节点中，所有全选和半选的label的id[]
    
    // 获取全选的id的数组arr1 getCheckedKeys(), 这个方法返回的事数组
    // el-tree标签的js方法， el.tree.get
    //  用ref设置树形来调用方法
    let arr1 = this.$refs.tree.getCheckedKeys()
    console.log(arr1);
    
    // 获取半选的id的数据arr2 getHalfCheckedKeys()
    let arr2 = this.$refs.tree.getHalfCheckedKeys()
    console.log(arr2);


    // arr = arr1 + arr2
    // 合并数组方法： 1， 创建新数组，遍历添加进去，
    // 方法2，arr1.concat(arr2)
    let arr = [...arr1, ...arr2]
    // console.log(arr)

    const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {rids: arr.join(',')})
    // console.log(res);
    // 更新视图
    this.getRoleList();
    // 关闭对话框
    this.dialogFormVisibleRight = false;
    },

    // 修改分配权限 --打开对话框
    async showSetRight(role) {
      const res = await this.$http.get(`rights/tree`);
      //  console.log(role); //输出以下，获取当前角色的权限
      // console.log(res);
      
      //给currRoleId赋值
      this.currRoleId = role.id;

      this.treelist = res.data.data;
      console.log(this.treelist);
      // 把所有权限的创建到一个数组里
      // let arrtemp1 = [];
      // 三层嵌套循环
      // this.treelist.forEach(item1 => {
      //   arrtemp1.push(item1.id);
      //   item1.children.forEach(item2 => {
      //     arrtemp1.push(item2.id);
      //     item2.children.forEach(item3 => {
      //       arrtemp1.push(item3.id);
      //     });
      //   });
      // });

      // console.log(arrtemp1)
      // 赋值给arrexpand
      // this.arrexpand = arrtemp1
      // 点击打开对话框


        /*------------------------- */
        // 获取当前角色role的当前的权限ID
       let arrtemp2 = [];
      // 三层嵌套循环
      role.children.forEach(item1 => {
        // arrtemp2.push(item1.id);
        item1.children.forEach(item2 => {
          // arrtemp2.push(item2.id);
          item2.children.forEach(item3 => {
            arrtemp2.push(item3.id);
          });
        });
      });
      

      // console.log(arrtemp2);
      this.arrcheck = arrtemp2;

      this.dialogFormVisibleRight = true;
    },

    //  关闭标签，删除权限，
    async deleRight(role, rightId) {
      //接口文档的  请求路径：roles/:roleId/rights/:rightId
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      // console.log(res);
      //  删除成功后，返回200和该角色的剩余权限
      // this.getRoleList();
      // 没必要全部更新了，把role的children改为自己就可以了，只更新当前的权限
      role.children = res.data.data;
    },
    async getRoleList() {
      // token请求头
      // const AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(`roles`);
      // console.log(res);
      this.roleList = res.data.data;
    }
  }
};
</script>

<style scoped>
.addRoleBtn {
  margin-top: 20px;
}
</style>