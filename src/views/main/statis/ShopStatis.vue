<template>
  <div class="block">
    <TimeRange @getTimeRange="getTime"></TimeRange>
    <el-card class="box-card">
      <Echarts :Option="echarts_option"></Echarts>
      <div style="width: 100%; height: 400px" class="mycharts-div"></div>
    </el-card>
  </div>
</template>

<script>
import { ordertotal } from "@/api/apis";
import Echarts from "@/components/Echarts"
import { getChinaTime } from "@/ulits/ulits";
import TimeRange from "@/components/TimeRange";
export default {
  data() {
    return {
      echarts_option : {},
    };
  },
  mounted() {
    this.refresh(this.timeRange);
  },
  methods: {
    //子传父
    getTime(timeRange) {
      this.timeRange = timeRange
      if (timeRange) {
        this.refresh(timeRange);
      } else
        this.$message({
          message: "食力派提醒:请选择时间范围",
          type: "warning",
        });
    },
    searchOrder() {},
    refresh(date) {
      date = JSON.stringify([getChinaTime(date[0]), getChinaTime(date[1])]);
      ordertotal(date).then((res) => {
        if (!res.data.data.length) {
          this.$message({
            message: "食力派提醒:此范围没有数据",
            type: "warning",
          });
        }
        this.echarts_option = {
          title: {
            text: "堆叠区域图",
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#6a7985",
              },
            },
          },
          legend: {
            data: ["销售总额"],
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              data: res.data.data.map((item) => getChinaTime(item.orderTime)),
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: [
            {
              name: "销售总额",
              type: "line",
              stack: "总量",
              areaStyle: {},
              data: res.data.data.map((item) => item.orderAmount),
            },
          ],
        };
      });
    },
  },
  components: {
    TimeRange,
    Echarts
  },
};
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 20px;
}
</style>