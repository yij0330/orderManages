<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>添加账号</span>
    </div>
    <!-- <div class="text item">
      <p>
        <span>账号</span>
        <el-input v-model="input" clearable></el-input>
      </p>
      <p>
        <span>密码</span>
        <el-input v-model="input" show-password></el-input>
      </p>
      <p>
        <span>用户组</span>
        <el-select v-model="value" clearable placeholder="请选择用户组">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </p>
      <p>
        <el-button type="primary" size="small">添加</el-button>
        <el-button size="small">重置</el-button>
      </p>
    </div>-->
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="acc">
        <el-input type="text" v-model="ruleForm.acc" autocomplete="off" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input type="password" v-model="ruleForm.pwd" autocomplete="off" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="用户组" prop="grounp">
        <el-select v-model="ruleForm.grounp" size="mini">
          <el-option label="超级管理员" value="超级管理员"></el-option>
          <el-option label="普通管理员" value="普通管理员"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" size="mini">提交</el-button>
        <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { accAdd } from "@/api/apis";
import {accReg, pwdReg} from '@/ulits/reg'
export default {
  data() {
    var validateAcc = (rule, value, callback) => {
      if (
        !accReg.test(value)
      ) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    var validatePwd = (rule, value, callback) => {
      if (!pwdReg.test(value)) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        acc: "",
        pwd: "",
        grounp: "超级管理员",
      },
      rules: {
        acc: [{ validator: validateAcc, trigger: "blur" }],
        pwd: [{ validator: validatePwd, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          accAdd(
            this.ruleForm.acc,
            this.ruleForm.pwd,
            this.ruleForm.grounp
          ).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                message: "食力派提醒:" + res.data.msg,
                type: "success",
              });
              this.ruleForm.acc = "";
              this.ruleForm.pwd = "";
            } else this.$message.error("食力派提醒:" + res.data.msg);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script> 

<style lang="less" scoped>
.el-input,.el-select {
  width: 200px;
}
</style>