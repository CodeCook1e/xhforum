<!--
 * @Author: qiuqi
 * @Date: 2021-10-04 17:16:51
 * @LastEditTime: 2021-10-31 16:29:12
 * @LastEditors: Please set LastEditors
 * @Description: 管理系统登录页面
 * @FilePath: \xh_forum\src\pages\AdminLogin\AdminLogin.vue
-->
<template>
  <a-layout id="components-layout-demo-top-side-2">
    <a-layout-header class="header">
      <div class="logo">
        <img src="../../assets/image/logo.png" alt="" />
        <span>后台管理系统</span>
      </div>
    </a-layout-header>
    <div class="login-flex">
      <div class="loginMainContainer">
        <div class="loginNav">
          <div class="loginNavItem">
            <a-icon type="user" />
            <div class="navItemText">账号密码登录</div>
          </div>
        </div>
        <div class="loginContent">
          <div class="loginContentTitle">账号密码登录</div>
          <a-form :form="form" class="loginForm" name="basic" @submit="login">
            <a-form-item name="email">
              <a-input
                size="large"
                placeholder="邮箱"
                v-decorator="[
                  'email',
                  {
                    rules: [{ required: true, message: '邮箱不能为空！' }],
                  },
                ]"
              />
            </a-form-item>
            <a-form-item name="password">
              <a-input
                size="large"
                type="password"
                placeholder="密码"
                v-decorator="[
                  'password',
                  {
                    rules: [{ required: true, message: '密码不能为空！' }],
                  },
                ]"
              />
            </a-form-item>
            <a-form-item>
              <a-button
                class="loginBtn"
                type="primary"
                size="large"
                html-type="submit"
                block
              >
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </a-layout>
</template>

<script>
import http from "../../api/http";
import { adminLoginApi } from "../../api/api";
export default {
  data() {
    return {
      // 管理员登录表单数据绑定对象
      adminLoginForm: {
        user: {
          email: "",
          password: "",
        },
      },
      // 对登录表单 form 进行注册
      form: this.$form.createForm(this, { name: "coordinated" }),
    };
  },

  methods: {
    login(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log(values);
          this.adminLoginForm.user = values;
          await adminLoginApi(this.adminLoginForm).then((res) => {
            this.$message.success("登陆成功");
            http.adminSetToken(res.data.token);
            this.$router.push("/adminhome");
          });
        }
      });
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

.login-flex {
  min-height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loginMainContainer {
  margin-top: -200px;
  flex-basis: 600px;
  position: relative;
  background-color: #fff;
  height: 530px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
}

.loginNav {
  width: 100%;
}

.loginNavItem {
  height: 60px;
  width: 100%;
  text-align: center;
  line-height: 60px;
  border-bottom: 3px solid #32b16c;
}

.navItemText {
  display: inline-block;
  margin-left: 12px;
  color: rgb(115, 119, 122);
  font-size: 16px;
}

.loginContent {
  width: 330px;
  margin: 100px auto 0 auto;
}

.loginContentTitle {
  font-size: 18px;
  font-weight: 400;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

.loginForm {
  padding-top: 10px;
}

.loginBtn {
  background-color: #32b16c;
  border-color: #32b16c;
}

.loginBtn:hover {
  background-color: #1e9654;
  border-color: #1e9654;
}

.loginBtn:focus {
  background-color: #1e9654;
  border-color: #1e9654;
}
</style>