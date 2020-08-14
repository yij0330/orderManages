<template>
  <div id="myeharts" style="width:100%; height: 400px">{{ Option.a }}</div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  props: ["Option"],
  
  updated() {
    let myecharts = this.$echarts.init(document.querySelector("#myeharts"));
    myecharts.setOption(this.Option);
  },
};
</script>

<style lang="less" scoped>
</style>