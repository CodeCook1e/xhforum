<!--
 * @Author: qiuqi
 * @Date: 2021-09-04 16:33:27
 * @LastEditTime: 2021-10-28 17:24:48
 * @LastEditors: Please set LastEditors
 * @Description: 登录页面
 * @FilePath: \xh_forum\src\views\Login\Login.vue
-->
<template>
  <div class="forumBody">
    <Narbar></Narbar>
    <div class="forumLoginContainer">
      <div class="forumWrapper">
        <a href="/home">
          <span class="mainTitle">新华之家-新华校园论坛</span>
          <span class="subTitle"> 点击前往论坛中心，即可查看热门帖子 </span>
          <div class="forumPic">
            <img src="../../assets/image/login.png" alt="forumPic" />
          </div>
        </a>
      </div>
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
          <div class="loginLink">
            <a href="/register">免费注册</a>
          </div>
        </div>
      </div>
    </div>
    <div class="docLoginFooter">
      <div class="footerText">
        <span>© 2021 - 2022 新华之家校园论坛版权所有.</span>
      </div>
    </div>
  </div>
</template>

<script>
import Narbar from "../../components/Navbar.vue";
import http from "../../api/http";
import { loginApi } from "../../api/api";
export default {
  data() {
    return {
      // 登录表单数据绑定对象
      loginForm: {
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
          this.loginForm.user = values;
          await loginApi(this.loginForm).then((res) => {
            this.$message.success("登陆成功");
            this.$router.push("/home");
            console.log(res.data.token);
            http.setToken(res.data.token);
          });
        }
      });
    },
  },

  components: {
    Narbar,
  },
};
</script>

<style scoped>
.forumBody {
  height: 100%;
  min-height: calc(100vh - 62px);
  background-color: #f3f3f3;
  min-width: 1366px;
}

.forumLoginContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  height: 700px;
  box-sizing: border-box;
  padding: 70px 0;
  margin: 62px auto 0 auto;
}

.forumWrapper {
  flex-basis: 600px;
  height: 100%;
}

.forumWrapper > a {
  display: block;
  width: 100%;
  height: 100px;
  background-color: transparent;
  margin-top: 100px;
}

.forumPic {
  width: 350px;
  height: 350px;
}

.forumPic > img {
  margin-top: 40px;
  margin-left: -30px;
  height: 280px;
}

.mainTitle {
  display: block;
  text-align: left;
  line-height: 40px;
  font-size: 28px;
  color: black;
  margin-bottom: 20px;
}

.subTitle {
  display: block;
  text-align: left;
  line-height: 30px;
  font-size: 16px;
  letter-spacing: 0.7px;
  color: rgb(155, 155, 155);
}

.loginMainContainer {
  position: relative;
  flex-basis: 600px;
  background-color: #fff;
  height: 100%;
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

.loginLink {
  margin-top: -10px;
  text-align: right;
}

.loginLink > a {
  font-size: 12px;
  margin-left: 10px;
  color: #9b9ea0;
}

.loginLink > a:hover {
  color: #32b16c;
}

.docLoginFooter {
  box-sizing: border-box;
  max-width: 1200px;
  margin: 20px auto 0 auto;
  padding-top: 17px;
  border-top: 1px solid rgb(207, 208, 209);
}

.footerText {
  height: 100px;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 751px 响应式 */
@media screen and (max-width: 751px) {
  .forumWrapper {
    display: none;
  }
  .loginMainContainer {
    margin: 0px 50px 0 50px;
    /* margin: -220px 50px 0 50px; */
    height: 400px;
  }
  .loginMainContainer > * {
    padding: 0 30px;
  }
  .loginContent {
    width: 330px;
    margin: 50px auto 0 auto;
  }
  .loginContentTitle {
    font-size: 16px;
  }
  .footerText {
    height: 40px;
    font-size: 10px;
  }
  .forumLoginContainer {
    height: 500px;
  }
  .forumBody {
    min-width: 100%;
  }
}
</style>