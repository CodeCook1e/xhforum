<!--
 * @Author: qiuqi
 * @Date: 2021-10-04 17:16:40
 * @LastEditTime: 2021-10-31 15:59:51
 * @LastEditors: Please set LastEditors
 * @Description: 管理系统主页面
 * @FilePath: \xh_forum\src\pages\AdminHome\AdminHome.vue
-->
<template>
  <a-layout id="components-layout-demo-top-side-2">
    <a-layout-header class="header">
      <div class="logo">
        <img src="../../assets/image/logo.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <a class="nav-top-btn" type="primary" @click="logout"> 退出登录 </a>
    </a-layout-header>
    <a-layout>
      <a-layout-sider class="layout-sider" width="200" style="background: #fff">
        <a-menu
          mode="inline"
          :default-selected-keys="['1']"
          :default-open-keys="['sub1']"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-sub-menu key="sub1">
            <span slot="title"><a-icon type="user" />用户管理</span>
            <a-menu-item key="1" @click="clickUser"> 用户列表 </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title"><a-icon type="laptop" />帖子管理</span>
            <a-menu-item key="2" @click="clickArticle"> 帖子列表 </a-menu-item>
            <a-menu-item key="3" @click="clickTag"> 分类列表 </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <!-- 路由占位符 -->
        <router-view></router-view>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import http from "../../api/http";
export default {
  data() {
    return {
      collapsed: false,
    };
  },
  methods: {
    // 退出登录
    logout() {
      http.adminRemoveToken();
      this.$router.push("/admin");
      this.$message.success("退出登录成功");
    },
    clickUser() {
      this.$router.push("/adminhome/user");
    },
    clickArticle() {
      this.$router.push("/adminhome/article");
    },
    clickTag() {
      this.$router.push("/adminhome/tag");
    },
  },
};
</script>

<style>
#components-layout-demo-top-side-2 {
  min-height: 100vh;
  min-width: 1366px;
}

#components-layout-demo-top-side-2 .logo {
  height: 64px;
  float: left;
}
#components-layout-demo-top-side-2 .logo > img {
  height: 64px;
  margin-top: -8px;
}

#components-layout-demo-top-side-2 .logo > span {
  color: #fff;
  font-size: 18px;
  margin-left: 20px;
}

.layout-sider {
  min-height: calc(100vh - 64px);
  height: 100%;
}

.nav-top-btn {
  float: right;
  display: block;
  box-sizing: border-box;
  height: 100%;
  padding: 0 20px;
  margin-right: -50px;
  font-size: 14px;
  line-height: 62px;
  background-color: #32b16c;
  color: #fff;
  text-align: center;
}

.nav-top-btn:hover {
  text-decoration: none;
  background-color: #1e9654;
  transition: all 0.3s ease-in-out;
  color: #fff;
}
</style>