<template>
<!-- 传入的option写了一个空的属性，在页面调用，出发updated -->
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