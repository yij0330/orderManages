<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>商品分类</span>
      <el-button style="float: right;" type="primary" size="mini" @click="addCateClick">添加分类</el-button>
    </div>
    <el-table
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      :style="tableSize"
      v-loading="loading"
      element-loading-text="正在拼命加载中"
    >
      <el-table-column label="序号" width="100">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 + pagesize * (currentPage1 - 1) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品分类">
        <template slot-scope="scope">
          <span v-show="scope.row.isEdit">{{ scope.row.cateName }}</span>
          <el-input v-model="scope.row.cateName" v-show="!scope.row.isEdit" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="是否开启" prop="state">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="scope.row.isEdit"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
            :type="scope.row.isEdit ? null : 'success' "
          >{{ scope.row.isEdit ? "编辑" : "完成"}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage1"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="pagesize"
        layout="total, sizes,prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div> -->
    <Pages @curPageSize="pageSize" :Total="total" @curPage="pages"></Pages>
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="400px">
      <el-form :model="form" status-icon :rules="rules" ref="form" class="demo-form">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="cateName">
          <el-input v-model="form.cateName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth" prop="state">
          <el-switch v-model="form.state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="sureBtn('form')" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
//addCate
import { cateList, addCate, delCate, editCate, categories } from "@/api/apis";
import Pages from "@/components/Pages";
export default {
  created() {
    this.updataList();
  },
  data() {
    var validatorCate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入正确的商品分类"));
      } else if (this.categoriesArr.includes(this.form.cateName)) {
        callback(new Error("此商品名已存在"));
      } else {
        callback();
      }
    };
    return {
      page: 0,
      tableData: [],
      search: "",
      pagesize: 5,
      total: 1,
      currentPage1: 1,
      loading: true,
      tableSize: { width: "100%", height: "313px" },
      form: {
        cateName: "",
        state: true,
      },
      rules: {
        cateName: [{ validator: validatorCate, trigger: "blur" }],
      },
      formLabelWidth: "80px",
      dialogFormVisible: false,
      categoriesArr: [],
    };
  },
  methods: {
    updataList() {
      this.loading = true;
      window.setTimeout(() => {
        cateList(this.currentPage1, this.pagesize).then((res) => {
          this.total = res.data.total;
          let arr = res.data.data;
          for (let obj of arr) {
            obj.state = obj.state == 1;
            obj.isEdit = true;
          }
          this.tableData = arr;
          this.loading = false;
        });
      },1000);
      //所有商品名字
      categories().then((res) => {
        this.categoriesArr = res.data.categories.map((item) => item.cateName);
      });
    },
    pages(val){
      this.currentPage1 = val;
      this.updataList();
      this.tableSize.height = "auto"
    },
    pageSize(val){
      this.pagesize = val;
      this.updataList();
      this.tableSize.height = "auto"
    },
    //添加分类
    addCateClick() {
      this.dialogFormVisible = true;
    },
    sureBtn(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          //添加商品
          addCate(this.form).then((res) => {
            if (res.data.code == 0) {
              this.form.cateName = "";
              this.$message({
                message: res.data.msg,
                type: "success",
              });
              this.dialogFormVisible = false;
              this.updataList();
            } else this.$message.error(res.msg);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleEdit(row) {
      if (!row.isEdit) {
        editCate(row).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
          } else
            this.$message({
              message: res.data.msg,
              type: "warning",
            });
        });
        row.isEdit = true;
      } else row.isEdit = false;
    },
    //删除
    handleDelete(row) {
      this.$confirm("是否确定删除此商品分类", "删除商品分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delCate(row.id).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
              this.updataList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  components: {
    Pages,
  }
};
</script>

<style lang="less" scoped>
.block {
  padding: 10px;
  font-size: 12px;
}
</style>