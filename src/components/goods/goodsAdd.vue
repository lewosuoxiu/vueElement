<template>
  <el-card>
    <!-- 1,面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 提示 -->
    <el-alert class="alert" title="添加商品信息" type="success" center show-icon></el-alert>

    <!-- 步骤条 el-steps -->
    <el-steps :active="1*active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!--  -->
    <!-- {{active}} -->
    <!-- 包裹一层form表单 -->
    <el-form
      label-position="top"
      label-width="80px"
      :model="addForm"
      style="height: 400px; overflow: auto;"
    >
      <!-- tab切换卡 -->
      <el-tabs @tab-click="tabChange()" v-model="active" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>

          <!-- 节点选择器 -->
          <el-form-item label="商品分类">
            {{selectedOptions}}
            <el-cascader
              clearable
              props.expandTrigger="hover"
              v-model="selectedOptions"
              :options="options"
              @change="handleChange"
              :props="defaultProp"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="2" label="商品参数">
          <!-- 显示该三级分类的商品 参数 -->
          <el-form-item :label="item1.attr_name" v-for="(item1, i) in arrDyparams" :key="i">
            <!-- 复选框 -->
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox v-for="(item2, i) in item1.attr_vals" :key="i" :label="item2"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <!-- 商品属性 -->
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item, i) in arrStaticParams" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>

        <!-- 商品图片 -->
        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <!-- action="" //请求的全路径http开头 -->
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <!-- 富文本，添加商品 -->
        <el-tab-pane name="5" label="商品内容">
          <!-- 表单元素 -->
          <el-form-item label="名称">
            <!-- 表单元素 -->
            <el-button type="primary" @click="addGoods()">点我添加商品</el-button>
            <!-- 富文本插件组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <!-- tab 栏区域 -->
  </el-card>
</template>

<script>
// 引入富文本
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    quillEditor //富文本组件
  },
  data() {
    return {
      active: "1",
      addForm: {
        //添加商品的表单数据
        goods_name: "",
        goods_cat: "", // 以为‘,’分割的分类列表， 不能为空 --> 级联选择器绑定的selectedOptions
        // this.selectOption -> string
        goods_number: "",
        goods_introduce: "", //介绍，可以为空
        goods_price: "",
        goods_weight: "",
        pics: [], //pics是数组 [{pic: 图片临时路径}]
        attrs: [] //动态参数和静态参数 => 数组
      },
      //级联选择绑定的数据
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      arrDyparams: [], //动态参数数组
      // checkList: [],
      arrStaticParams: [], //静态参数
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoodCate();
  },
  methods: {
    //  获取三级分类的信息
    async getGoodCate() {
      const res = await this.$http.get("categories");
      //   console.log(res);
      this.options = res.data.data;
    },
    // tabChange点击不同的tab方法
    async tabChange() {
      // 如果点击的是第二个tab，同时三级分类要有值
      if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          // 提示
          this.$message.warning("请先选择商品的三级分类");
          return;
        }
        // 获取数据
        // id -> 分类Id
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        // console.log("----");
        // console.log(res);
        // 动态参数的数组 ，attr_name 和 attr_vals
        this.arrDyparams = res.data.data;
        // 把attr_vals字符串，转为数组
        this.arrDyparams.forEach(item => {
          // 并不是所有的三级分类 都有动态参数， 否则v-for会报错

          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
      } else if (this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          // 提示
          this.$message.warning("请先选择商品的三级分类");
          return;
        }
        // 获取静态参数的数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        // console.log("**********");
        // console.log(res);
        this.arrStaticParams = res.data.data;
      }
    },
    //级联选择器方法@change触发 @change="handleChange"
    handleChange() {},

    // 图片上传方法
    handlePreview(file) {
      // console.log(file)
    },
    handleRemove(file) {
      // console.log('移除');

      // console.log("移除");
      // console.log(file)
      // file.response.data.temp_path 图片临时上传的路径
      // 从this.form.pics 移除当前X掉的图片
      // 先获取该图片的索引
      // findIndex((item) => ) 遍历符合条件的元素索引进行返回
      //图片的格式：  [{pic: 图片路径1},{pic: 图片路径2}]

      let Index = this.addForm.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path;
        // 这儿的意思是，遍历数组中图片的路径和删掉的路径一致，
        // 那返回对应的Index值
      });
      this.addForm.pics.splice(Index, 1); //删除索引值
      // console.log('!!!!!!!')
      // console.log(this.addForm.pics);


    },
    handleSuccess(file) {
      //  console.log('成功');
      // console.log(file)
      // file.data.tmp_path 图片临时上传的路径
      this.addForm.pics.push({
        pic: file.data.tmp_path
      });
    },

    // 添加商品，发送请求
    async addGoods() {
      // goods_cat --> 分类，以为‘,’分割的分类列表， 不能为空
      this.addForm.goods_cat = this.selectedOptions.join(",");

      // console.log(this.arrDyparams);
      //格式 attrs [{attr_id: ?, attr_value: ?}]
      // 动态数组
      // 遍历 + 取值 + 放在一个新数组中
      // map遍历有返回值，返回新数组
      
      // arr1  动态参数数组
      let arr1 = this.arrDyparams.map((item) => {

        // return 'abc' //返回多少次 = 遍历数组的长度
        // item.attr 和 item.attr_vals
        return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })
      // console.log(arr1);

      // arr2 静态参数数组
       let arr2 = this.arrStaticParams.map((item) => {

        // return 'abc' //返回多少次 = 遍历数组的长度
        // item.attr 和 item.attr_vals
        return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })

      this.addForm.attrs = [...arr1, ...arr2]; //合并静态和动态参数的数组


      // 在发送请求之前， 处理this.form 中的未处理数据
      const res = await this.$http.post(`goods`, this.addForm);
      console.log('*********')
      console.log(res);
       const {
        meta: { status, msg },
        data
      } = res.data;
      // 回到商品列表
     if(status === 200 ) {
        this.$message.success(msg);
        this.$router.push({name: 'goods'})
     } else {
       this.$message.warning(msg);
     }
     
    }
  }
};
</script>

<style scoped>
.alert {
  margin-top: 20px;
}
.ql-editor {
  min-height: 300px !important;
}
</style>