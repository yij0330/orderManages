<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>修改密码</span>
    </div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="原密码" prop="oldPwd">
        <el-input type="password" v-model="ruleForm.oldPwd" autocomplete="off" size="mini"></el-input>
        <span :class="{error_span: status, success_span: !status}">{{ checkPwdMsg }}</span>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input type="password" v-model="ruleForm.newPwd" autocomplete="off" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPwd">
        <el-input type="password" v-model="ruleForm.checkPwd" autocomplete="off" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" size="mini">提交</el-button>
        <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { checkPwd, editPwd } from "@/api/apis";
import { pwdReg} from '@/ulits/reg'
export default {
  data() {
    var validateOld = (rule, value, callback) => {
      if (!pwdReg.test(value)) {
        callback(new Error("请输入合法的密码"));
      } else {
        //旧密码接口
        checkPwd(this.ruleForm.oldPwd, localStorage.id).then((res) => {
          if (res.data.code == 0) {
            this.status = false;
            this.checkPwdMsg = res.data.msg;
            this.sureOldPwd = this.ruleForm.oldPwd;
          } else {
            this.status = true;
            this.checkPwdMsg = "旧密码错误，请重新输入";
          }
        });
        callback();
      }
    };
    var validateNew = (rule, value, callback) => {
      if (!pwdReg.test(value)) {
        callback(new Error("请输入合法的密码"));
      } else if(value == this.sureOldPwd){
        callback(new Error("与原密码一致，请修改"));
      }
      else {
        if (this.ruleForm.checkPwd != "") {
          this.$refs.ruleForm.validateField("checkPwd");
        }
        callback();
      }
    };
    var validateCheckPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != this.ruleForm.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        //通过
        callback();
      }
    };
    return {
      ruleForm: {
        oldPwd: "",
        newPwd: "",
        checkPwd: "",
      },
      checkPwdMsg: "",
      status: true,
      rules: {
        oldPwd: [{ validator: validateOld, trigger: "blur" }],
        newPwd: [{ validator: validateNew, trigger: "blur" }],
        checkPwd: [{ validator: validateCheckPwd, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //修改密码
          editPwd(this.ruleForm.newPwd, localStorage.id).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                message: "食力派提醒:" + res.data.msg,
                type: "success",
              });
              this.$router.push("/");
            }
          });
        } else {
          this.$message.error("食力派提醒:请完善信息~~~");
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
.el-input {
  width: 200px;
}
.error_span {
  color: red;
  font-size: 12px;
}
.success_span {
  color: green;
  font-size: 12px;
}
</style>