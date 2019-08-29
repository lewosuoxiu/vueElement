<template>
  <el-card>
    <!-- 1,面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 提示 -->
    <el-alert class="alert" title="只允许为第三级分类设置参数" type="error"></el-alert>

    <!-- 包裹一层form表单 -->
    <el-form
      class="fromCascader"
      label-position="top"
      label-width="80px"
      :model="addForm"
      style="height: 150px; overflow: auto;"
    >
      <!-- 级联选择器 -->
      <el-form-item label="商品分类">
        {{selectedOptions}}
        <el-cascader
          :show-all-levels="false"
          clearable
          props.expandTrigger="hover"
          v-model="selectedOptions"
          :options="options"
          @change="handleChange"
          :props="defaultProp"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- tabs选项卡 -->
    <el-tabs v-model="active" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <!-- 按钮 -->
        <el-button type="danger">设置动态参数</el-button>
        <!-- 表格 -->
        <el-table :data="arrDyparams" style="width: 100%">
          <el-table-column type="expand" label="#">
            <template slot-scope="scope">
              <!-- el-tag 动态编辑标签 -->
              <el-tag
                :key="tag"
                v-for="tag in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row.attr_vals,scope.row.attr_id, scope.row.attr_name,tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row.attr_vals,scope.row.attr_id, scope.row.attr_name)"
                @blur="handleInputConfirm(scope.row.attr_vals,scope.row.attr_id, scope.row.attr_name)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-row>
                <el-button type="primary">编辑</el-button>
                <el-button type="danger">删除</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 静态参数 -->
      <el-tab-pane label="静态参数" name="2">
        <!-- 按钮 -->
        <el-button type="danger">设置静态参数</el-button>
        <!-- 表格 -->
        <el-table :data="arrStaticParams" style="width: 100%">
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="属性值" prop="attr_vals"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-row>
                <el-button type="primary">编辑</el-button>
                <el-button type="danger">删除</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      //级联选择绑定的数据
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      addForm: {},
      arrDyparams: [], //动态参数
      active: "1",
      paramsList: [], //参数列表的数据
      //   动态标签的数据
      inputVisible: false,
      inputValue: "" ,//
      arrStaticParams: [], //静态参数数组
    };
  },
  created() {
    this.getGoodCate();
  },
  methods: {
    // 获取三级分类数据
    async getGoodCate() {
      const res = await this.$http.get(`categories?type=3`);
      //   console.log(res);
      this.options = res.data.data;
    },
    // 级联选择器方法
    async handleChange() {
      if (this.selectedOptions.length === 3) {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        this.arrDyparams = res.data.data;
        this.arrDyparams.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
        // console.log(this.arrDyparams);
      }
    },
    // 点击tab切换的时候
    async handleClick() {
      if(this.active === "2") {
        if(this.selectedOptions.length === 3) {
          // 获取静态参数的数据
           const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        // console.log(res);
        this.arrStaticParams = res.data.data;

        }
      }
    },

    // 编辑标签的相应方法： 地址：https://element.eleme.cn/#/zh-CN/component/tag#tag-biao-qian

    // 点击X按钮
    async handleClose(attr_vals, attr_id, attr_name, tag) {
      attr_vals.splice(attr_vals.indexOf(tag), 1);

      // 点击X按钮，发起请求
      //接口文档1.7.5. 编辑提交参数  categories/:id/attributes/:attrId  put
      // put请求体 {attr_name: ?, attr_sel: ?, attr_vals: ?}
      // attr_name	参数名称	不能为空
      // attr_sel	[only,many]	不能为空
      // attr_vals	如果是 many 就需要填写值的选项，以逗号分隔

      let putData = {
        //put请求体也是个对象
        attr_name: attr_name,
        attr_sel: "many",
        attr_vals: attr_vals.join(",") //加上字符串
      };

      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${attr_id}`,
        putData
      );
      // console.log("-----");
      // console.log(res);
    },
    // 点击newTag + 按钮
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 回车键，失去焦点
    async handleInputConfirm(attr_vals, attr_id, attr_name) {
      let inputValue = this.inputValue;
      if (inputValue) {
        attr_vals.push(inputValue);

        let putData = {
          //put请求体也是个对象
          attr_name: attr_name,
          attr_sel: "many",
          attr_vals: attr_vals.join(",") //加上字符串
        };

        const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${attr_id}`,
          putData
        );
        // console.log("-----");
        // console.log(res);
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  }
};
</script>

<style  scoped>
.alert {
  margin-top: 20px;
}
.fromCascader {
  margin-top: 20px;
}
</style>