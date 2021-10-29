<!--
 * @Author: qiuqi
 * @Date: 2021-09-08 21:57:53
 * @LastEditTime: 2021-09-20 18:17:11
 * @LastEditors: Please set LastEditors
 * @Description: 注册页面
 * @FilePath: \xh_forum\src\pages\Register\register.vue
-->
<template>
  <div class="forumBody">
    <Narbar></Narbar>
    <div class="forumRegisterContainer">
      <div class="forumWrapper">
        <a href="/home">
          <span class="mainTitle">新华之家-新华校园论坛</span>
          <span class="subTitle"> 点击前往论坛中心，即可查看热门帖子 </span>
          <div class="forumPic">
            <img src="../../assets/image/register.png" alt="forumPic" />
          </div>
        </a>
      </div>
      <div class="registerMainContainer">
        <div class="registerNav">
          <div class="registerNavItem">
            <a-icon type="user" />
            <div class="navItemText">注册新的账号</div>
          </div>
        </div>
        <div class="registerContent">
          <div class="registerContentTitle">注册新的账号</div>
          <a-form
            :form="form"
            class="registerForm"
            name="basic"
            @submit="register"
          >
            <a-form-item name="username">
              <a-input
                size="large"
                placeholder="用户名"
                v-decorator="[
                  'username',
                  {
                    rules: [{ required: true, message: '用户名不能为空！' }],
                  },
                ]"
              />
            </a-form-item>
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
                class="registerBtn"
                type="primary"
                size="large"
                html-type="submit"
                block
              >
                注册
              </a-button>
            </a-form-item>
          </a-form>
          <div class="registerLink">
            <a href="/login">前去登录</a>
          </div>
        </div>
      </div>
    </div>
    <div class="docRegisterFooter">
      <div class="footerText">
        <span>© 2021 - 2022 新华之家校园论坛版权所有.</span>
      </div>
    </div>
  </div>
</template>

<script>
import Narbar from "../../components/Navbar.vue";
import { registerApi } from "../../api/api";
export default {
  data() {
    return {
      // 注册表单数据绑定对象
      registerForm: {
        user: {
          username: "",
          email: "",
          password: "",
        },
      },
      // 对注册表单 form 进行注册
      form: this.$form.createForm(this, { name: "coordinated" }),
    };
  },

  methods: {
    register(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log(values);
          this.registerForm.user = values;
          await registerApi(this.registerForm).then((res) => {
            this.$message.success("注册成功");
            this.$router.push("/login");
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
}

.forumRegisterContainer {
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

.registerMainContainer {
  position: relative;
  flex-basis: 600px;
  background-color: #fff;
  height: 100%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
}

.registerNav {
  width: 100%;
}

.registerNavItem {
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

.registerContent {
  width: 330px;
  margin: 70px auto 0 auto;
}

.registerContentTitle {
  font-size: 18px;
  font-weight: 400;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

.registerForm {
  padding-top: 10px;
}

.registerBtn {
  background-color: #32b16c;
  border-color: #32b16c;
}

.registerBtn:hover {
  background-color: #1e9654;
  border-color: #1e9654;
}

.registerBtn:focus {
  background-color: #1e9654;
  border-color: #1e9654;
}

.registerLink {
  margin-top: -10px;
  text-align: right;
}

.registerLink > a {
  font-size: 12px;
  margin-left: 10px;
  color: #9b9ea0;
}

.registerLink > a:hover {
  color: #32b16c;
}

.docRegisterFooter {
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
  .registerMainContainer {
    margin: 0px 50px 0 50px;
    /* margin: -220px 50px 0 50px; */
    height: 465px;
  }
  .registerMainContainer > * {
    padding: 0 30px;
  }
  .registerContent {
    width: 330px;
    margin: 50px auto 0 auto;
  }
  .registerContentTitle {
    font-size: 16px;
  }
  .footerText {
    height: 40px;
    font-size: 10px;
  }
  .forumRegisterContainer {
    height: 500px;
  }
  .forumBody {
    min-width: 100%;
  }
}
</style>