<template>
  <router-view></router-view>
</template>

<script>
export default {};
</script>

<style lang='less'>
body,
html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

</style>
