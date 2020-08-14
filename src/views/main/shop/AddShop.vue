<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>添加商品</span>
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      hide-required-asterisk
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="ruleForm.name" size="small"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="category">
        <el-select v-model="ruleForm.category" placeholder="请选择" size="small">
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.cateName"
            :value="item.cateName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input-number v-model="ruleForm.price" :precision="2" :step="0.5" :min="0" size="small"></el-input-number>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-upload
          class="avatar-uploader"
          :action="ITEM_IMG_UPDATA"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="ruleForm.imgUrl" :src="SHOW_ITEM_IMG + ruleForm.imgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品描述" prop="goodsDesc">
        <el-input type="textarea" v-model="ruleForm.goodsDesc" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addGoods('ruleForm')" size="small">添加商品</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {
  categories,
  additem,
  ITEM_IMG_UPDATA,
  SHOW_ITEM_IMG,
} from "@/api/apis";
export default {
  created() {
    this.ITEM_IMG_UPDATA = ITEM_IMG_UPDATA;
    this.SHOW_ITEM_IMG = SHOW_ITEM_IMG;
    categories().then((res) => {
      this.options = res.data.categories;
      this.ruleForm.category = this.options[0].cateName;
    });
  },
  data() {
    return {
      ruleForm: {
        name: "",
        category: "",
        price: 0,
        imgUrl: "",
      },
      options: [],
      ITEM_IMG_UPDATA: "",
      SHOW_ITEM_IMG: "",
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 1, message: "请输入商品名", trigger: "blur" },
        ],
        num: [{ min: 1, max: 1000, message: "请输入1-1000", trigger: "blur" }],
        info: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 1, message: "请输入商品名描述", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleAvatarSuccess(res) {
      if (res.code == 0) {
        this.ruleForm.imgUrl = res.imgUrl;
        this.$message({
          message: "食力派提醒:图片添加成功",
          type: "success",
        });
      }
    },
    addGoods(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          additem(this.ruleForm).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                message: "食力派提醒:" + res.data.msg,
                type: "success",
              });
              for (const key in this.ruleForm) {
                this.ruleForm[key] = "";
              }
            } else this.$message.error("食力派提醒:" + res.data.msg);
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.title-div {
  padding: 10px;
  border-bottom: 1px solid rgb(235, 238, 245);
}
.el-input,
.el-textarea {
  width: 300px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>