<template>
  <div class="login-div">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width class="demo-ruleForm">
      <div class="bigTitle">
        <p>食力派管理系统</p>
        <p>SHILIPAI MANAGEMENT SYSTEM</p>
      </div>
      <el-form-item prop="acc">
        <el-input
          type="text"
          v-model="ruleForm.acc"
          autocomplete="off"
          placeholder="请输入账号"
          clearable
          prefix-icon="el-icon-user-solid"
        ></el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input
          type="password"
          v-model="ruleForm.pwd"
          autocomplete="off"
          placeholder="请输入密码"
          show-password
          prefix-icon="el-icon-lock"
        ></el-input>
      </el-form-item>
      <span class="errorMsg-span">{{ errorMsg }}</span>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "../api/apis";
import { accReg, pwdReg } from "@/ulits/reg";
export default {
  data() {
    var validateAcc = (rule, value, callback) => {
      if (!accReg.test(value)) {
        callback(new Error("请输入合法的用户名"));
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
      errorMsg: "",
      ruleForm: {
        acc: "",
        pwd: "",
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
          login(this.ruleForm.acc, this.ruleForm.pwd).then((res) => {
            if (res.data.code == 0) {
              localStorage.acc = this.ruleForm.acc;
              localStorage.token = res.data.token;
              localStorage.role = res.data.role;
              localStorage.id = res.data.id;
              this.$message({
                message: "食力派提醒:恭喜你，登录成功",
                type: "success",
              });
              //跳转
              this.$router.push("/main/index");
            } else this.errorMsg = res.data.msg;
          });
        } else {
          this.errorMsg = "食力派提醒:登录失败";
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less">
* {
  border: none;
}
.login-div {
  height: 100%;
  // background: rgb(84, 92, 100);
  background: linear-gradient(to bottom, #000, #222222,#333333,#444444,#555555,#444444,#333333,#222222,#000);
  
  display: flex;
  justify-content: center;
  align-items: center;
  .el-form {
    position: relative;
    .bigTitle {
      color: #fff;
      text-align: center;
      margin-bottom: 20px;
      p {
        margin: 0;
        font-size: 20px;
        &:nth-child(1) {
          font-size: 30px;
          letter-spacing: 15px;
        }
      }
    }
    width: 350px;
    .el-button {
      width: 100%;
    }
    .el-input__inner {
      color: #fff;
      background: transparent;
    }
    .errorMsg-span {
      position: absolute;
      top: 167px;
      z-index: 999;
      color: tomato;
      font-size: 12px;
    }
  }
}
</style>