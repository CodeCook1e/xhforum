<!--
 * @Author: qiuqi
 * @Date: 2021-08-25 16:27:09
 * @LastEditTime: 2021-11-16 15:09:01
 * @LastEditors: Please set LastEditors
 * @Description: 导航栏
 * @FilePath: \xh_forum\src\components\Navbar.vue
-->
<template>
  <div>
    <div class="nav-top">
      <a class="nav-top-logo" href="/home">
        <img src="../assets/image/logo.png" alt="logo" />
      </a>
      <a-button
        class="nav-list-btn"
        style="margin-bottom: 16px"
        @click="showDrawer"
      >
        <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
      </a-button>
      <ul class="nav-list">
        <li class="nav-item">
          <a
            :class="this.$route.path == '/home' ? 'list-active' : ''"
            @click="gohome"
            >首页</a
          >
        </li>
        <li class="nav-item">
          <a
            :class="this.$route.path == '/forum' ? 'list-active' : ''"
            @click="goforum"
            >论坛中心</a
          >
        </li>
        <li class="nav-item">
          <a
            :class="this.$route.path == '/writearticle' ? 'list-active' : ''"
            @click="gowritearticle"
            >发帖子</a
          >
        </li>
      </ul>
      <div class="nav-top-operation" v-if="!isLogin">
        <!-- 登陆人信息 -->
        <div class="nav-top-operation-info">
          <div class="nav-top-info-ava">
            <div><a-icon type="user" /></div>
          </div>
          <div class="nav-top-info-name">未登录</div>
        </div>
        <a class="nav-top-btn" href="/login" type="primary"> 立即登录 </a>
      </div>
      <div class="nav-top-operation" v-else>
        <!-- 登陆人信息 -->
        <div class="nav-top-operation-info" @click="toProfile">
          <div class="nav-top-info-img">
            <a-avatar
              v-if="!userInfo.image"
              class="info-img"
              :src="defaultImgSrc"
              alt="用户头像"
            />
            <a-avatar
              v-else
              class="info-img"
              :src="userInfo.image"
              alt="用户头像"
            />
          </div>
          <div class="nav-top-info-name">{{ userInfo.username }}</div>
        </div>
        <a class="nav-top-btn" type="primary" @click="logout"> 退出登录 </a>
      </div>
    </div>
    <a-drawer
      width="200px"
      title="导航菜单"
      placement="left"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <ul class="drawer-list">
        <li class="drawer-item">
          <a
            :class="this.$route.path == '/home' ? 'list-active' : ''"
            @click="gohome"
            >首页</a
          >
        </li>
        <li class="drawer-item">
          <a
            :class="this.$route.path == '/forum' ? 'list-active' : ''"
            @click="goforum"
            >论坛中心</a
          >
        </li>
      </ul>
    </a-drawer>
  </div>
</template>

<script>
import http from "../api/http";
import { getCurrentUserApi } from "../api/api";
export default {
  data() {
    return {
      // 是否登录
      isLogin: false,
      // 折叠按钮
      collapsed: false,
      // 抽屉
      visible: false,
      // 当前登录的信息
      userInfo: {},
      defaultImgSrc:
        "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
    };
  },
  created() {
    this.isLogin = http.getToken() ? true : false;
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    // 获取个人信息
    getCurrentUser() {
      getCurrentUserApi().then((res) => {
        this.userInfo = res.data.user;
      });
    },
    // 退出登录
    logout() {
      http.removeToken();
      this.$router.push("/login");
      this.$message.success("退出登录成功");
    },
    // 跳转到个人资料页面
    toProfile() {
      this.$router.push("/myprofile");
      this.currentList = this.$route.path;
    },
    // 跳转到主页
    gohome() {
      this.$router.push("/home");
    },
    // 跳转到论坛中心
    goforum() {
      this.$router.push("/forum");
    },
    // 跳转到发帖子页面
    gowritearticle() {
      if (!this.isLogin) {
        this.$message.warning("请先登录再进行操作！");
      } else {
        this.$router.push("/writearticle");
      }
    },
  },
  watch: {
    isLogin(val) {
      if (val === true) {
        // 获取登陆人信息
        this.getCurrentUser();
      }
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}

.nav-top {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  height: 62px;
  background-color: #fff;
  border-bottom: 1px solid rgba(153, 153, 153, 0.32);
  display: flex;
  padding: 0 20px;
  z-index: 10;
  box-sizing: border-box;
}

.nav-top-logo {
  display: flex;
  align-items: center;
}

.nav-top-logo img {
  width: 135px;
}

.nav-list {
  display: flex;
  list-style: none;
}

.nav-item > a {
  position: relative;
  display: block;
  font-weight: 500;
  font-size: 14px;
  color: #16181a;
  line-height: 62px;
  text-decoration: none;
  padding: 0 12px;
}

.nav-item > a:hover {
  color: #32b16c;
  text-decoration: none;
}

.nav-top-operation {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
}

.nav-top-operation-info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 50px;
}

.nav-top-operation-info:hover {
  cursor: pointer;
}

.nav-top-operation-info > div {
  padding: 15px;
}

.nav-top-info-ava {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px rgba(153, 153, 153, 0.32) solid;
}

.nav-top-info-ava > div {
  font-size: 18px;
}

.nav-top-info-img {
  padding: 0 !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-img {
  width: 35px;
  height: 35px;
}

.nav-top-info-name {
  font-weight: 500;
  font-size: 14px;
  color: #16181a;
}

.nav-top-link {
  display: block;
  margin-right: 24px;
  font-weight: 500;
  font-size: 14px;
  color: #16181a;
  line-height: 62px;
}

.nav-top-link:hover {
  color: #32b16c;
  text-decoration: none;
}

.nav-top-btn {
  display: block;
  box-sizing: border-box;
  height: 62px;
  padding: 0 20px;
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

.nav-list-btn {
  margin-top: 15px;
  display: none;
}

.nav-list-btn:hover,
.nav-list-btn:focus {
  color: #32b16c;
  border-color: #32b16c;
}

.drawer-list {
  list-style: none;
  padding: 0;
}

.drawer-item > a {
  position: relative;
  display: block;
  font-weight: 500;
  font-size: 14px;
  color: #16181a;
  text-decoration: none;
  padding-bottom: 10px;
}

.drawer-item > a:hover {
  color: #32b16c;
  text-decoration: none;
}

/* 导航列表选中高亮 */
.list-active {
  color: #32b16c !important;
}

@media screen and (max-width: 751px) {
  .nav-list-btn {
    display: block;
  }
  .nav-list {
    display: none;
  }
  .nav-top-operation > div {
    display: none;
  }
}
</style>