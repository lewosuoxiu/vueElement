<template>
  <el-card>
    <!-- 1,面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 容器 -->
    <div id="main" style="width: 600px; height: 400px; margin-top: 30px;"></div>
  </el-card>
</template>

<script>
let echarts = require("echarts");
export default {
  data() {
    return {};
  },
  mounted() {
    this.useEchart();
  },
  methods: {
    async useEchart() {
      //获取数据
      const res = await this.$http.get('reports/type/1')
      const {data: {meta, data}} = res
    //   console.log(res);
    // console.log(data);
    // console.log(meta);
    let options2 = data;
      // init
      let myChart = echarts.init(document.getElementById("main"));
        
      // option
      let options1 = {

        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      };
        let options = {...options1, ...options2}
      // setOption
      myChart.setOption(options);
    }
  }
};
</script>

<style scoped>
</style>