<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        :default-active="defaultActive"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        unique-opened
      >
        <h4 class="title_h4">
          <el-avatar
            src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1170284165,194880099&fm=26&gp=0.jpg"
          ></el-avatar>食力派外卖商家中心
        </h4>
        <div v-for="item in powerArr" :key="item.url">
          <el-menu-item :index="item.url" v-if="!item.children">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
          <el-submenu :index="item.url" v-else>
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.url"
              :index="child.url"
            >{{ child.name }}</el-menu-item>
          </el-submenu>
        </div>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="item in breadList" :key="item">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown trigger="click">
          <div class="user-div el-dropdown-link">
            欢迎你,
            {{ account }}
            <i class="el-icon-arrow-down el-icon--right"></i>
            <el-avatar :size="40">
              <img :src="imgUrl" />
            </el-avatar>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push('/main/personal')">个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="exitLogin">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { checkToken, accountinfo } from "@/api/apis";
export default {
  data() {
    return {
      defaultActive: "",
      asideList: [
        {
          url: "/main/index",
          icon: "el-icon-s-home",
          name: "后台首页",
          roles: ["super", "normal"],
        },
        {
          url: "/main/orderManager",
          icon: "el-icon-document",
          name: "订单管理",
          roles: ["super", "normal"],
        },
        {
          url: "3",
          icon: "el-icon-shopping-bag-2",
          name: "商品管理",
          children: [
            { url: "/main/shopList", name: "商品列表" },
            { url: "/main/addShop", name: "商品添加" },
            { url: "/main/shopcategory", name: "商品分类" },
          ],
          roles: ["super", "normal"],
        },
        {
          url: "/main/shopManager",
          icon: "el-icon-s-shop",
          name: "店铺管理",
          roles: ["super"],
        },
        {
          url: "5",
          icon: "el-icon-user",
          name: "账号管理",
          children: [
            { url: "/main/accList", name: "账号列表" },
            { url: "/main/addAcc", name: "添加账号" },
            { url: "/main/changePwd", name: "修改密码" },
          ],
          roles: ["super"],
        },
        {
          url: "6",
          icon: "el-icon-pie-chart",
          name: "销售统计",
          children: [
            { url: "/main/shopStatis", name: "商品统计" },
            { url: "/main/orderStatis", name: "订单统计" },
          ],
          roles: ["super"],
        },
      ],
      imgUrl: "",
      account: "",
      breadList: [],
      role: localStorage.role,
    };
  },
  computed: {
    powerArr() {
      return this.asideList.filter((item) => item.roles.includes(this.role));
    },
  },
  created() {
    //this.$route.path 当前hash地址
    this.defaultActive = this.$route.path;
    //身份令牌
    checkToken(localStorage.token).then((res) => {
      if (res.data.code != 0) {
        this.acc = "请登录";
        this.$message({
          message: "食力派提醒:登录失效，等登录",
          type: "warning",
        });
        this.$router.push("/login");
      } else {
        this.acc = localStorage.acc;
      }
    });
    this.refresh();
    //main接   个人中心修改图片传参
    this.$bus.$on("updatahead", () => {
      this.refresh();
    });

    //当前的hash值
    this.breadList = this.$route.meta.breadList;
  },
  methods: {
    refresh() {
      //账户信息
      accountinfo(localStorage.id).then((res) => {
        let accountInfo = res.data.accountInfo;
        this.account = accountInfo.account;
        this.imgUrl = accountInfo.imgUrl;
      });
    },
    exitLogin() {
      this.$confirm("您是否确定退出登录?", "食力派提醒:", {
        confirmButtonText: "残忍退出",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          localStorage.token = "";
          this.$router.push("/");
          this.$message({
            type: "success",
            message: "食力派提醒:已退出登录!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "食力派提醒:已取消删除",
          });
        });
    },
  },
  watch: {
    //检测所有需要变化的值
    //检测路由变化
    $route(to) {
      this.breadList = to.meta.breadList;
    },
  },
};
</script>

<style lang='less'>
@base: rgb(84, 92, 100);
body,
html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.el-container {
  height: 100%;
  .el-aside {
    background-color: @base;
    font-size: 14px;
    .title_h4 {
      margin-left: 20px;
      color: #fff;
      .el-avatar {
        vertical-align: middle;
      }
    }
    .el-menu {
      border: 0;
    }
  }
  //面包导航
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px !important;
    user-select: none;
    .el-avatar {
      vertical-align: middle;
    }
    i{
      margin-right: 10px;
    }
  }
  //主要内容
  .el-main {
    background-color: #e9eef3;
  }
}

//
</style>
