<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="curPage"
    :page-size="pagesize"
    :page-sizes="[5,10,20,50]"
    layout="total, sizes ,prev, pager, next, jumper"
    :total="Total"
  ></el-pagination>
</template>

<script>
export default {
  data() {
    return {
      curPage: 1,
      pagesize: 5,
    };
  },
  props: ["Total"],
  methods: {
    handleSizeChange(val) {
      this.$emit("curPageSize", val)
    },
    handleCurrentChange(val) {
        this.$emit("curPage", val)
    },
  },
};
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 20px;
}
</style>