<template>
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="5">
        <span>订单号</span>
        <el-input v-model="myform.orderNo" placeholder="订单号" size="mini"></el-input>
      </el-col>
      <el-col :span="5">
        <span>收货人</span>
        <el-input v-model="myform.consignee" placeholder="收货人" size="mini"></el-input>
      </el-col>
      <el-col :span="5">
        <span>手机号</span>
        <el-input v-model="myform.phone" placeholder="手机号" size="mini"></el-input>
      </el-col>
      <el-col :span="5">
        <span>订单状态</span>
        <el-select v-model="myform.orderState" placeholder="订单状态" size="mini">
          <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="block">
      <span class="demonstration">选择时间</span>
      <el-date-picker
        size="mini"
        v-model="myform.date"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="center"
        style="width:300px"
      ></el-date-picker>
      <el-button size="mini" type="primary" @click="clearBtn">清空</el-button>
      <el-button size="mini" type="primary" @click="sreachBtn">查询</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%; height: 350px"
      :style="tableSize"
      v-loading="loading"
      element-loading-text="正在拼命加载中"
    >
      <el-table-column fixed prop="orderNo" label="订单号" width="80"></el-table-column>
      <el-table-column prop="orderTime" label="下单时间" width="200"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="150"></el-table-column>
      <el-table-column prop="consignee" label="收货人" width="100"></el-table-column>
      <el-table-column prop="deliverAddress" label="配送地址" width="200"></el-table-column>
      <el-table-column prop="deliveryTime" label="送达时间" width="200"></el-table-column>
      <el-table-column prop="remarks" label="用户备注"></el-table-column>
      <el-table-column prop="orderAmount" label="订单金额"></el-table-column>
      <el-table-column prop="orderState" label="订单状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleLook(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pages @curPageSize="pageSize" :Total="total" @curPage="pages"></Pages>
    <el-dialog :title="titleMsg" :visible.sync="dialogFormVisible" width="700px">
      <el-form :model="form" :disabled="isDisabled">
        <el-form-item label="订单号" :label-width="formLabelWidth">
          <el-input v-model="form.orderNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="下单时间" :label-width="formLabelWidth">
          <el-date-picker v-model="form.orderTime" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货人" :label-width="formLabelWidth">
          <el-input v-model="form.consignee" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" :label-width="formLabelWidth">
          <el-input v-model="form.deliverAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="送达时间" :label-width="formLabelWidth">
          <el-date-picker v-model="form.deliveryTime" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remarks" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="订单金额" :label-width="formLabelWidth">
          <el-input v-model="form.orderAmount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" :label-width="formLabelWidth">
          <el-select v-model="form.orderState" placeholder="订单状态">
            <el-option v-for="item in newOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" v-if="!isDisabled">取 消</el-button>
        <el-button type="primary" @click="sureBtn">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { orderList, orderDetail, orderEdit } from "@/api/apis";
import { getChinaTime } from "@/ulits/ulits";
import Pages from "@/components/Pages";
export default {
  created() {
    this.updataList(this.params);
  },
  data() {
    return {
      currentpage: 1,
      pagesize: 5,
      total: 1,
      options: ["全部", "已完成", "已受理", "派送中"],
      newOptions: [],
      tableData: [],
      myform: {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        date: null,
      },

      formLabelWidth: "80px",
      dialogFormVisible: false,
      form: {},
      isDisabled: false,
      titleMsg: "",
      loading: true,
      tableSize: {
        width: "100%",
        height: "350px",
      },
    };
  },
  methods: {
    //更新
    updataList(params) {
      (this.loading = true),
        window.setTimeout(() => {
          orderList({
            currentPage: this.currentpage,
            pageSize: this.pagesize,
            ...params,
          }).then((res) => {
            let orderArr = res.data.data;
            for (let obj of orderArr) {
              obj.orderTime = getChinaTime(obj.orderTime);
              obj.deliveryTime = getChinaTime(obj.deliveryTime);
              obj.orderAmount = Number(obj.orderAmount).toFixed(2);
            }
            this.tableData = orderArr;
            this.total = res.data.total;
            this.loading = false;
          });
        }, 1000);
    },
    //清空
    clearBtn() {
      for (const key in this.myform) {
        if (key == "date") this.myform[key] = null;
        else this.myform[key] = "";
      }
    },
    //查询
    sreachBtn() {
      //处理时间
      let { orderNo, consignee, phone, orderState, date } = this.myform;
      let params = {};
      if (orderNo != "") params.orderNo = orderNo;
      if (consignee != "") params.consignee = consignee;
      if (phone != "") params.phone = phone;
      if (orderState != "" && orderState != "全部")
        params.orderState = orderState;
      if (date) {
        params.date = JSON.stringify([
          getChinaTime(date[0]),
          getChinaTime(date[1]),
        ]);
      }
      this.params = params;
      this.updataList(this.params);
    },
    //查看
    handleLook(row) {
      this.isDisabled = true;
      this.titleMsg = "查看订单详情";
      this.dialogFormVisible = true;
      orderDetail(row.id).then((res) => {
        let lookOrder = res.data.data;
        lookOrder.orderTime = getChinaTime(lookOrder.orderTime);
        lookOrder.deliveryTime = getChinaTime(lookOrder.deliveryTime);
        lookOrder.orderAmount = Number(lookOrder.orderAmount).toFixed(2);
        this.form = lookOrder;
      });
    },
    //修改
    handleEdit(row) {
      this.isDisabled = false;
      this.titleMsg = "修改订单";
      this.dialogFormVisible = true;
      this.row = row;
      //深拷贝
      this.form = { ...row };
      this.newOptions = [...this.options]
      this.newOptions.splice(this.newOptions.indexOf("全部"),1)
    },
    sureBtn() {
      if (this.titleMsg == "查看订单详情") {
        this.dialogFormVisible = false;
        return;
      }
      
      if (JSON.stringify(this.row) === JSON.stringify(this.form)) {
        this.$message({
          message: "食力派提醒:当前信息与原信息一致",
          type: "warning",
        });
        return;
      }
      let newForm = {...this.form};
      newForm.orderTime = getChinaTime(newForm.orderTime)
      newForm.deliveryTime = getChinaTime(newForm.deliveryTime)
      orderEdit(newForm).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "食力派提醒:" + res.data.msg,
            type: "success",
          });
          this.dialogFormVisible = false;
          this.updataList();
        }
      });
    },
    pageSize(val) {
      this.pagesize = val;
      this.updataList(this.params);
      this.tableSize.height = "auto";
    },
    pages(val) {
      this.currentpage = val;
      this.updataList(this.params);
      this.tableSize.height = "auto";
    },
  },
  components: {
    Pages,
  },
};
</script>

<style lang="less" scoped>
.el-col {
  display: flex;
  align-items: center;
  span {
    font-size: 12px;
    margin-right: 20px;
    color: #909399;
  }
  .el-input,
  .el-select {
    width: 65%;
  }
}

.block {
  margin: 20px 0;
  font-size: 12px;
  span {
    color: #909399;
  }
  .el-date-editor {
    margin: 0 20px;
  }
}
.el-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    width: 45%;
  }
}
</style>