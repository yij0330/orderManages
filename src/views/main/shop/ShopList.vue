<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>商品列表</span>
    </div>
    <el-table
      :data="tableData"
      v-loading="loading"
      element-loading-text="正在拼命加载中"
      :style="tableSize"
      @expand-change="isExpand"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="商品价格">
              <span>{{ props.row.price }}</span>
            </el-form-item>
            <el-form-item label="商品图片">
              <el-image style="width: 30px; height: 30px" :src="SHOW_ITEM_IMG + props.row.imgUrl"></el-image>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.ctime }}</span>
            </el-form-item>
            <el-form-item label="商品评价">
              <span>{{ props.row.rating }}</span>
            </el-form-item>
            <el-form-item label="商品销量">
              <span>{{ props.row.sellCount }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.goodsDesc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name"></el-table-column>
      <el-table-column label="所属分类" prop="category"></el-table-column>
      <el-table-column label="商品价格" prop="price"></el-table-column>
      <el-table-column label="商品图片" prop="imgUrl">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px" :src="SHOW_ITEM_IMG + scope.row.imgUrl"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="商品描述" prop="goodsDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pages @curPageSize="pageSize" :Total="total" @curPage="pages"></Pages>
    <el-dialog title="修改商品" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-select v-model="form.category" placeholder="请选择">
            <el-option
              v-for="(item, index) in form.options"
              :key="index"
              :label="item.cateName"
              :value="item.cateName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input-number v-model="form.price" :precision="2" :step="0.5" :max="1000000000"></el-input-number>
        </el-form-item>
        <el-form-item label="商品图片" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="ITEM_IMG_UPDATA"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="form.imgUrl" :src="SHOW_ITEM_IMG + form.imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品描述" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.goodsDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureBtn">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  goodList,
  goodDel,
  edititem,
  categories,
  ITEM_IMG_UPDATA,
  SHOW_ITEM_IMG,
} from "@/api/apis";
import { getChinaTime } from "@/ulits/ulits";
import Pages from "@/components/Pages";
export default {
  created() {
    this.ITEM_IMG_UPDATA = ITEM_IMG_UPDATA;
    this.SHOW_ITEM_IMG = SHOW_ITEM_IMG;
    this.updataList();
  },
  data() {
    return {
      tableData: [],
      curPage: 1,
      pagesize: 5,
      total: 1,
      dialogVisible: false,
      formLabelWidth: "80px",
      loading: true,
      ITEM_IMG_UPDATA: "",
      SHOW_ITEM_IMG: "",
      tableSize: { height: "703px" },
      form: {
        name: "",
        category: "",
        price: "",
        imgUrl: "",
        goodsDesc: "",
        id: "",
        options: [],
      },
    };
  },
  methods: {
    updataList() {
      this.loading = true;
      window.setTimeout(() => {
        goodList(this.curPage, this.pagesize).then((res) => {
          this.total = res.data.total;
          let arr = res.data.data;
          for (let obj of arr) {
            obj.price = parseFloat(obj.price).toFixed(2);
            obj.ctime = getChinaTime(obj.ctime);
          }
          this.tableData = arr;
          this.loading = false;
        });
      }, 1000);
    },
    isExpand(){
      this.tableSize.height = "auto";
    },
    //点击确定
    sureBtn() {
      this.oldShopInfo.price = parseFloat(this.oldShopInfo.price)
      if(JSON.stringify(this.oldShopInfo) == JSON.stringify(this.form)){
         this.$message({
            message: "食力派提醒: 当前信息与原信息一致",
            type: "warning",
          });
        return
      }
      edititem(
        this.form.name,
        this.form.category,
        this.form.price,
        this.form.imgUrl,
        this.form.goodsDesc,
        this.form.id
      ).then((res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          this.$message({
            message: "食力派提醒:" + res.data.msg,
            type: "success",
          });
          this.updataList();
          this.dialogVisible = false;
        } else this.$message.error("食力派提醒:" + res.data.msg);
      });
    },
    handleEdit(row) {
      //深拷贝，避免修改了row的数据不保存
      this.form = { ...row };
      categories().then((res) => {
        this.form.options = res.data.categories;
        this.dialogVisible = true;
        this.oldShopInfo = {...this.form};
      });
    },
    handleAvatarSuccess(res) {
      this.form.imgUrl = res.imgUrl;
      this.$message({
        message: "图片上传成功",
        type: "success",
      });
    },
    //删除
    handleDelete(row) {
      this.$confirm("确定删除此商品信息", "食力派提醒:", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          goodDel(row.id).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                message: "食力派提醒:" + res.data.msg,
                type: "success",
              });
              this.updataList();
            } else this.$message.error("食力派提醒:" + res.data.msg);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "食力派提醒:已取消删除",
          });
        });
    },
    //每页数量
    pageSize(val) {
      this.pagesize = val;
      this.updataList();
      this.tableSize.height = "auto";
    },
    //当前页
    pages(val){
      this.curPage = val;
      this.updataList();
      this.tableSize.height = "auto";
    },
  },
  components: {
    Pages,
  }
};
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.block {
  padding: 10px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>