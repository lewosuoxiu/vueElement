<template>
  <el-card>
    <!-- 封装的面包屑组件 -->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <el-row>
      <el-col :span="8">
        <el-input v-model="queryinfo.query" placeholder="请输入内容" class="input-with-select" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
        </el-input>
      </el-col>
    </el-row>

    <el-table :data="orderlist" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="订单编号" prop="order_number" width="200"></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" prop="pay_status">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.pay_status === '0'" size="small">未付款</el-tag>
          <el-tag type="success" v-else size="small">已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"></el-table-column>
      <el-table-column label="下单时间" prop="create_time" width="140">
        <template slot-scope="scope">
          <template slot-scope>{{scope.row.create_time | fmtdate}}</template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="修改订单地址"
            @click="addressDialogVisible=true"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-location"
            size="mini"
            title="物流信息"
            @click="showWuliuDialog"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <!-- 使用级联选择器，加载省市区县的数据 -->
          <el-cascader
            :options="cityData"
            clearable
            props.expandTrigger="hover"
            v-model="selectedOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息的对话框 -->
    <el-dialog title="物流信息" :visible.sync="wuliuDialogVisible" width="50%">
      <el-steps direction="vertical" :active="1">
        <el-step
          v-for="(item, i) in wuliuInfo"
          :key="i"
          :title="item.time"
          :description="item.context"
        ></el-step>
      </el-steps>
    </el-dialog>
  </el-card>
</template>


<script>
import cityData from "@/assets/city_data2017_element.js";
export default {
  data() {
    return {
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 总记录条数
      total: 0,
      // 订单列表
      orderlist: [],
      // 控制 修改地址 对话框的显示与隐藏
      addressDialogVisible: false,
      addressForm: {
        // 省市区的数据
        address1: "",
        address2: ""
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请填写省市区", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      // 省市区的数据
      cityData: cityData,
      // 控制 物流对话框的显示与隐藏
      wuliuDialogVisible: false,
      // 物流信息对象
      wuliuInfo: [],
      selectedOptions: [] //当前选中的父级分类
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryinfo
      });

      if (res.meta.status !== 200)
        return this.$message.error("获取订单列表失败！");
      // console.log(res)
      this.orderlist = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage;
      this.getOrderList();
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    // 点击按钮，显示 物流对话框
    async showWuliuDialog() {
      // 根据 物流运单号，获取到 物流信息
      const { data: res } = await this.$http.get("/kuaidi/619915933338");
      if (res.meta.status !== 200)
        return this.$message.error("获取物流信息失败！");
      this.wuliuInfo = res.data;

      this.wuliuDialogVisible = true;
    }
  }
};
</script>
<style scoped>
</style>