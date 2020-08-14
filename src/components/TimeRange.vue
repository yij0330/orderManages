<template>
  <div class="block">
    <span class="demonstration">时间范围</span>
    <el-date-picker
      v-model="timeRange"
      type="daterange"
      align="center"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    ></el-date-picker>
    <el-button type="primary" @click="searchOrder">查询</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeRange: null,
    };
  },
  methods: {
    searchOrder() {
      this.$emit("getTimeRange", this.timeRange);
    },
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
</style>