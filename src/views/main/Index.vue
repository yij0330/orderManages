<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in list" :key="index">
        <div class="grid-content bg-purple">
          <i :class="item.icon"></i>
          <div class="detail-div">
            <p>{{ item.info }}</p>
            <p>{{item.allPrice}}</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <Echarts :Option="echarts_option"></Echarts>
    </el-card>
    <p>{{  num  }}</p>
  </div>
</template>

<script>
import Echarts from "@/components/Echarts"
import { totaldata } from "@/api/apis";
export default {
  data() {
    return {
      list: [
        { icon: "el-icon-tickets", info: "总订单", allPrice: "102,400" },
        { icon: "el-icon-coin danger", info: "总销售额", allPrice: "102,400" },
        { icon: "el-icon-notebook-2", info: "今日订单数", allPrice: "102,400" },
        {
          icon: "el-icon-wallet success",
          info: "今日销售额",
          allPrice: "102,400",
        },
      ],
      echarts_option: {},
      num: 100000,
    };
  },
  methods: {
    getNum(){
      this.num = this.num.toString().split('').reverse().join('')
      
    }
  },
  mounted() {
    totaldata().then((res) => {
      this.list[0].allPrice = res.data.totalOrder;
      this.list[1].allPrice = res.data.totalAmount;
      this.list[2].allPrice = res.data.todayOrder;
      this.list[3].allPrice = res.data.totayAmount;
      this.echarts_option = {
        title: {
          text: "数据统计",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["订单", "销售总额"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: res.data.xData,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "订单",
            type: "line",
            stack: "总量",
            data: res.data.orderData,
          },
          {
            name: "销售总额",
            type: "line",
            stack: "总量",
            data: res.data.amountData,
          },
        ],
      };
    });
  },
  components: {
    Echarts,
  }
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 2px;
}
.bg-purple {
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  i {
    font-size: 50px;
    color: #409eff;
  }
  .danger {
    color: #f56c6c;
  }
  .success {
    color: #67c23a;
  }
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.detail-div {
  p {
    padding: 0;
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    font-weight: bold;
    &:nth-child(1) {
      color: #ccc;
    }
  }
}
.myecharts-div {
  width: 500px;
  height: 400px;
}
</style>