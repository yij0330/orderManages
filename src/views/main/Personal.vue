<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>管理员信息</span>
    </div>
    <!-- <p v-for="(item, index) in perinfo" :key="index">
      {{item.name}}: <span>{{ item.value }}</span>
    </p>-->
    <p>
      管理员ID:
      <span>{{ accInfo.id }}</span>
    </p>
    <p>
      账号:
      <span>{{ accInfo.account }}</span>
    </p>
    <p>
      用户组:
      <span>{{ accInfo.userGroup }}</span>
    </p>
    <p>
      创建时间:
      <span>{{ accInfo.ctime }}</span>
    </p>
    <div class="photo-div">
      管理员头像:
      <el-upload
        class="avatar-uploader"
        :action="ACC_IMG_UPDATA"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :data="updata"
      >
        <img v-if="accInfo.imgUrl" :src="accInfo.imgUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
  </el-card>
</template>

<script>
import { accountinfo, ACC_IMG_UPDATA } from "@/api/apis";
import { getChinaTime } from "@/ulits/ulits";
export default {
  created() {
    this.ACC_IMG_UPDATA = ACC_IMG_UPDATA;
    this.updata = { id: localStorage.id };
    this.updataInfo();
  },
  data() {
    return {
      accInfo: {},
      updata: {},
      ACC_IMG_UPDATA: "",
    };
  },
  methods: {
    updataInfo() {
      accountinfo(localStorage.id).then((res) => {
        res.data.accountInfo.ctime = getChinaTime(res.data.accountInfo.ctime);
        this.accInfo = res.data.accountInfo;
      });
    },
    //上传成功
    handleAvatarSuccess(res) {
      if (res.code == 0) {
        this.$message({
          message: res.msg,
          type: "success",
        });
        this.updataInfo();
        //向main传参   main里面接
        this.$bus.$emit("updatahead");
      } else this.$message.error(res.msg);
    },
  },
};
</script>

<style lang="less" scoped>
p {
  padding: 10px 0;
  font-size: 14px;
  &:first-child {
    padding-top: 0;
  }
  border-bottom: 1px solid #ebeef5;
  span {
    margin-left: 20px;
  }
}
.photo-div {
  display: flex;
  font-size: 14px;
  align-items: center;
  .avatar-uploader{
    margin-left: 20px;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>