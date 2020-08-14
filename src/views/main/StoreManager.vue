<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>店铺管理</span>
      <el-button style="float: right;" type="primary" @click="storeSave" size="mini">保存</el-button>
    </div>
    <el-form ref="form" :model="form" label-width="80px" width="600" v-loading="fullscreenLoading">
      <el-form-item label="店铺名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="公告">
        <el-input
          type="textarea"
          autosize
          placeholder="请输入内容"
          v-model="form.bulletin"
          resize="none"
          style="width:500px"
        ></el-input>
      </el-form-item>
      <el-form-item label="店铺头像">
        <el-upload
          class="avatar-uploader"
          :action="ITEM_SHOP_UPDATA"
          :show-file-list="false"
          :on-success="headerSuccess"
        >
          <img v-if="form.avatar" :src="SHOW_SHOP_IMG + form.avatar" class="avatar" />
        </el-upload>
      </el-form-item>
      <el-form-item label="店铺图片" class="shopPics">
        
        <el-upload
          :action="ITEM_SHOP_UPDATA"
          list-type="picture-card"
          :on-success="shopSuccess"
          :on-remove="removeImg"
          :file-list="shopImgs"
          ref="shopPic"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="配送费">
        <el-input-number v-model="form.deliveryPrice" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="送达时间">
        <el-input v-model="form.deliveryTime"></el-input>
      </el-form-item>
      <el-form-item label="配送描述">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="店铺评分">
        <el-rate v-model="form.score" show-text></el-rate>
      </el-form-item>
      <el-form-item label="销量">
        <el-input v-model="form.sellCount"></el-input>
      </el-form-item>
      <el-form-item label="活动">
        <!-- v-if="form.supports"  解决调用接口还没有返回数据就开始解析supports数组 -->
        <el-checkbox-group v-model="form.supports" v-if="form.supports">
          <el-checkbox :label="item" v-for="item in subSupports" :key="item">{{ item }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="营业时间">
        <el-time-picker
          size="mini"
          width="100px"
          is-range
          arrow-control
          v-model="form.date"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        ></el-time-picker>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {
  shopInfo,
  shopEdit,
  ITEM_SHOP_UPDATA,
  SHOW_SHOP_IMG,
} from "@/api/apis";
import { getChinaTime } from "@/ulits/ulits"
export default {
  created() {
    this.ITEM_SHOP_UPDATA = ITEM_SHOP_UPDATA;
    this.SHOW_SHOP_IMG = SHOW_SHOP_IMG;
    this.upShopInfo();
  },
  data() {
    return {
      dialogVisible: false,
      form: {},
      oldShopInfo: {},
      subSupports: [
        "在线支付满28减5",
        "VC无限橙果汁全场8折",
        "单人精彩套餐",
        "特价饮品8折抢购",
        "单人特色套餐",
      ],
      shopImgs: [],
      ITEM_SHOP_UPDATA: "",
      SHOW_SHOP_IMG: "",
      fullscreenLoading: false,
    };
  },
  methods: {
    upShopInfo() {
      this.fullscreenLoading = true;
      window.setTimeout(() => {
        shopInfo().then((res) => {
          this.form = res.data.data;
          this.oldShopInfo =JSON.parse(JSON.stringify(res.data.data));
          this.shopImgs = this.form.pics.map((item) => {
            return {
              name: item,
              url: SHOW_SHOP_IMG + item,
            };
          });
          this.fullscreenLoading = false;
        });
      }, 1000);
    },
    headerSuccess(res) {
      if (res.code == 0) {
        this.form.avatar = res.imgUrl;
        this.$message({
          message: "添加图片成功",
          type: "success",
        });
      }
    },
    shopSuccess(res) {
      if (res.code == 0) {
        this.form.pics.push(res.imgUrl);
        this.$message({
          message: "添加图片成功",
          type: "success",
        });
      }
    },
    removeImg(res){
      this.form.pics.splice(this.form.pics.indexOf(res.name), 1)
    },

    //修改商店信息
    storeSave() {
      let newShopObj = { ...this.form };
      newShopObj.pics = JSON.stringify([...newShopObj.pics]);
      newShopObj.date = JSON.stringify([getChinaTime(newShopObj.date[0]),getChinaTime(newShopObj.date[1])]);
      newShopObj.supports = JSON.stringify(newShopObj.supports);
      if (
        JSON.stringify(this.oldShopInfo) === JSON.stringify(this.form)
      ) {
        this.$message({
          message: "请修改商店信息",
          type: "warning",
        });
        return;
      }
      shopEdit(newShopObj).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "恭喜你，" + res.data.msg,
            type: "success",
          });
          this.upShopInfo();
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 145px;
  height: 145px;
  line-height: 145px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
.el-image {
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ebeef5;
}
.el-input {
  width: 500px;
}
.el-checkbox-group {
  width: 500px;
}
.el-rate {
  padding-top: 10px;
}
</style>