<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>账号列表</span>
    </div>
    <el-table
      v-loading="loading"
      element-loading-text="正在拼命加载中"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      :style="tableSize"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="账号" prop="account"></el-table-column>
      <el-table-column prop="userGroup" label="用户组"></el-table-column>
      <el-table-column prop="ctime" label="创建时间" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pages @curPageSize="pageSize" :Total="total" @curPage="pages"></Pages>
    <div style="margin-top: 20px">
      <el-button type="primary" size="small" @click="batchdel">批量删除</el-button>
      <el-button @click="toggleSelection()" type="danger" size="small">取消选择</el-button>
    </div>
    <el-dialog title="修改账号" :visible.sync="dialogFormVisible" width="400px">
      <el-form :model="newform">
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input v-model="newform.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户组" :label-width="formLabelWidth">
          <el-select v-model="newform.userGroup">
            <el-option
              :label="item.name"
              :value="item.name"
              v-for="(item, index) in option"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditAcc">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { accList, accDel, batchdel, editAcc } from "@/api/apis";
import { getChinaTime } from "@/ulits/ulits";
import Pages from "@/components/Pages";

export default {
  data() {
    return {
      tableData: [],
      currentPage1: 1,
      total: 1,
      pagesize: 5,
      multipleSelection: [1, 2],
      ids: [],
      dialogFormVisible: false,
      formLabelWidth: "60px",
      loading: true,
      tableSize: { width: "100%", height: "313px" },
      newform: {
        account: "",
        userGroup: "",
      },
      option: [{ name: "超级管理员" }, { name: "普通管理员" }],
    };
  },
  created() {
    this.updata();
  },
  methods: {
    updata() {
      this.loading = true;
      window.setTimeout(() => {
        accList(this.currentPage1, this.pagesize).then((res) => {
          this.total = res.data.total;
          let resArr = res.data.data;
          for (let obj of resArr) {
            obj.ctime = getChinaTime(obj.ctime);
          }
          this.tableData = resArr;
          this.loading = false;
        });
      }, 1000);
    },
    handleEdit(row) {
      this.dialogFormVisible = true;
      this.newform = { ...row };
      this.oldAccInfo = row;
    },
    handleEditAcc() {
      if (this.newform.account == "") {
        this.$message({
          message: "账号不能为空",
          type: "warning",
        });
      } else if (
        JSON.stringify(this.newform) == JSON.stringify(this.oldAccInfo)
      ) {
        this.$message({
          message: "请修改信息",
          type: "warning",
        });
      } else {
        editAcc(
          this.newform.id,
          this.newform.account,
          this.newform.userGroup
        ).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            //修改当前登录的账号
            if (this.oldAccInfo.account == localStorage.acc) {
              localStorage.acc = this.newform.account;
              if (this.oldAccInfo.userGroup != this.newform.userGroup) {
                this.$message({
                  message: "当前用户组已修改，请重新登录",
                  type: "warning",
                });
                this.$router.push("/");
              }
              this.$bus.$emit("updatahead");
            }
            this.dialogFormVisible = false;
            this.updata();
          }
        });
      }
    },
    handleDelete(row) {
      this.$confirm("是否确定删除此用户账号", "删除账号", {
        confirmButtonText: "忍痛删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          accDel(row.id).then((res) => {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.updata();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    pageSize(val) {
      this.pagesize = val;
      this.updata();
      this.tableSize.height = "auto";
    },
    pages(val) {
      this.currentPage1 = val;
      this.updata();
      this.tableSize.height = "auto";
    },
    //选择框改变时触发 拿到选中的项
    handleSelectionChange(rows) {
      //那选中的
      this.ids = rows.map((item) => item.id);
    },
    //批量删除
    batchdel() {
      if (!this.ids.length)
        this.$message({
          message: "请至少选择1条信息",
          type: "warning",
        });
      else {
        this.$confirm("你确定批量删除用户名", "删除用户名", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            batchdel(JSON.stringify(this.ids)).then((res) => {
              this.updata();
              this.$message({
                type: "success",
                message: res.data.msg,
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
  },
  components: {
    Pages,
  },
};
</script>

<style lang="less" scoped>
.el-input {
  width: 72%;
}
</style>