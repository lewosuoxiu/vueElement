<template>
  <el-card>
    <!-- 1,面包屑 -->
    <!-- 封装的面包屑组件 -->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>

    <!-- 2，搜索 -->
    <el-row class="searchRow">
      <el-col :span="24" class="searchArea">
        <el-button type="success" @click="showGoodsCate()" style="margin-top: 30px">添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="addForm">
        <el-form-item label="分类名称" label-width="120px">
          <el-input v-model="addForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 级联选择器 -->
        <el-form-item label="分类" label-width="120px">
          {{selectedOptions}}
          <el-cascader
            :show-all-levels="false"
            clearable
            props.expandTrigger="hover"
            v-model="selectedOptions"
            :options="cateList"
            @change="handleChange"
            :props="cateProp"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 表格 -->
    <el-table height="800px" :data="showList" style="width: 100%;margin-top:20px;">
      <!-- el-tree-grid树形组件 -->
      <!-- 
        treeKey -> nodekey -> 节点唯一标识 id
        parentKey -> 父节点的id
        levelKey -> 当前节点的级别
        childkey -> 子节点(改为child-key， 否则vue报错为黄色字体警醒)
      -->
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        :indentSize="30"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        child-key="children"
      ></el-tree-grid>
      <!-- <el-table-column type="index" label="#" width="100"></el-table-column> -->
      <!-- <el-table-column prop="cat_name" label="分类名称" width="180"></el-table-column> -->
      <el-table-column label="级别">
        <template slot-scope="scope">
          <!-- scope.row.level 0 1 2 -->
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-if="scope.row.cat_level === 1">二级</span>
          <span v-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted === false">有效</span>
          <span v-if="scope.row.level === true">无效</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" mini>编辑</el-button>
            <el-button type="danger" mini>删除</el-button>
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
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
// 局部引入element-tree-grid
var ElTreeGrid = require("element-tree-grid");

export default {
  components: {
    //注册组件名
    ElTreeGrid
  },
  data() {
    return {
      rightList: [],
      pagenum: 1,
      pagesize: 10,
      total: 1,
      dialogFormVisibleAdd: false, //是否隐藏添加对话框
      addForm: {
        cat_pid: -1,
        cat_name: "",
        cat_level: -1,
      },
      selectedOptions: [], //当前选中的父级分类
      showList: [], //获取分类参数列表
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      cateList: [], //获取所有级联的父级分类
      // 级联选择器中每一项的对应关系
      cateProp: {
        label: 'cat_name', // 展示的名称
        value: 'cat_id', // 选中之后的值
        children: 'children' // 实现父子嵌套的属性
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    //   获取所有分类
    async getGoodsCate() {
      const res = await this.$http.get(
        `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      // console.log(res);
      this.showList = res.data.data.result;
      this.total = res.data.data.total;
      //   console.log( this.rightList)
    },
    // 分页相关的方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val; //点击时候传入相应的条数
      // this.pagenum = 1 //重置页面为1
      this.getGoodsCate(); //重新获取数据
    },
    handleCurrentChange(val) {
      // 切换页码的时候，使用
      // console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getGoodsCate();
    },
    // 显示添加分类对话框
    async showGoodsCate() {
      // 获取二级分类的数据
      const res = await this.$http.get(`categories?type=2`);
      this.cateList = res.data.data;
      this.dialogFormVisibleAdd = true;
    },
    // 添加分类发送请求;
    async addCate() {
      // cat_pid 分类父ID 不能为空
      // cat_name 分类名称 不能为空
      // cat_level 分类层级 不能为空

      // 三种情况
      // 1, 一级分类 selectedOptions.length == 0  cat_pid = 0  at_level = 0
      // 2, 二级分类 selectedOptions.length == 1  cat_pid = selectedOptions[0]  cat_level = 1
      // 2, 二级分类 selectedOptions.length == 2  cat_pid = selectedOptions[1]  cat_level = 2
      // if (this.selectedOptions.length === 0) {
      //   this.addForm.cat_pid = 0;
      //   this.addForm.cat_level = 0;
      // } else if (this.selectedOptions.length === 1) {
      //   this.addForm.cat_pid = this.selectedOptions[0];
      //   this.addForm.cat_level = 1;
      // } else if (this.selectedOptions.length === 2) {
      //    this.addForm.cat_pid = this.selectedOptions[1];
      //   this.addForm.cat_level = 2;
      // }
      const res = await this.$http.post(`categories`, this.addForm);
      console.log('***********')
      console.log(res);
      // 更新视图
      this.getGoodsCate();
      // 关闭对话框
      this.dialogFormVisibleAdd = false;
      // 清空form
      this.addForm = {};

    },
    // 添加分类显示对话框

    //级联选择器方法@change触发 @change="handleChange"
    // 当选中的父级分类编号，触发的相应方法
    handleChange() {
      // 设置层级
      // this.addForm.cat_level = this.selectedOptions.length;
      // // 设置父类ID
      // if(htis.selectedOptions.length === 0) {
      //   // 如果没有选中任何父类，则分类id 为0
      //   this.addForm.cat_pid = 9
      // } else {

      // }
         // 设置层级：
      // this.addForm.cat_level = this.selectedOptions.length
      // // 设置父分类Id：
      // if (this.selectedOptions.length === 0) {
      //   // 如果没有选中任何父分类， 则 父分类Id为 0
      //   this.addForm.cat_pid = 0
      // } else {
      //   // 如果选中了父分类，则 把数组的最后一项，当作父分类
      //   this.addForm.cat_pid = this.selectedOptions[this.selectedOptions.length - 1]
      // }
      // // 此处添加分类有点bug

         if (this.selectedOptions.length === 0) {
        this.addForm.cat_pid = 0;
        this.addForm.cat_level = 0;
      } else if (this.selectedOptions.length === 1) {
        this.addForm.cat_pid = this.selectedOptions[0];
        this.addForm.cat_level = 1;
      } else if (this.selectedOptions.length === 2) {
         this.addForm.cat_pid = this.selectedOptions[1];
        this.addForm.cat_level = 2;
      }
    },
  }
};
</script>

<style  scoped>
</style>