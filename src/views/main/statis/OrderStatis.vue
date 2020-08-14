<template>
  <div class="block">
    <TimeRange @getTimeRange="getTime"></TimeRange>
    <el-card class="box-card">
      <Echarts :Option="echarts_option"></Echarts>
    </el-card>
  </div>
</template>

<script>
import TimeRange from "@/components/TimeRange";
import Echarts from "@/components/Echarts"
import { ordertotal } from "@/api/apis";
import { getChinaTime } from "@/ulits/ulits";
export default {
  data() {
    return {
      echarts_option: {},
    };
  },
  mounted() {
    this.refresh();
  },
  methods: {
    getTime(timeRange) {
      if (timeRange) {
        let newTimeArr = timeRange.map((item) => getChinaTime(item));
        this.refresh(JSON.stringify(newTimeArr));
      } else
        this.$message({
          message: "请选择时间范围",
          type: "warning",
        });
    },
    refresh(date = `["2020-10-01 00:00:00","2020-10-01 00:00:00"]`) {
      ordertotal(date).then((res) => {
        /* if (!res.data.data.length) {
          this.$message({
            message: "此范围没有数据",
            type: "warning",
          });
        } */
        this.echarts_option = {
           a: '',
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999",
              },
            },
          },
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true },
            },
          },
          legend: {
            data: ["订单总额"],
          },
          xAxis: [
            {
              type: "category",
              data: res.data.data.map((item) => getChinaTime(item.orderTime)),
              axisPointer: {
                type: "shadow",
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "订单总额",
              min: 0,
              max: 250,
              interval: 50,
              axisLabel: {
                formatter: "{value} ml",
              },
            },
          ],
          series: [
            {
              name: "订单总额",
              type: "bar",
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
.demonstration {
  font-size: 14px;
  color: #909399;
}
.el-date-editor {
  margin: 0 20px;
}
.box-card {
  margin-top: 20px;
}
</style>