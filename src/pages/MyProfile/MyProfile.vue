<!--
 * @Author: qiuqi
 * @Date: 2021-09-25 15:40:57
 * @LastEditTime: 2021-10-29 17:20:21
 * @LastEditors: Please set LastEditors
 * @Description: 我的资料页面
 * @FilePath: \xh_forum\src\pages\Profile\profile.vue
-->
<template>
  <div class="forumBody">
    <Narbar></Narbar>
    <div class="forumProfileContainer">
      <div class="userInfo">
        <div class="userInfoContainer">
          <div class="info-ava">
            <div class="info-ava-img" v-if="!userInfo.image">
              <a-icon type="user" />
            </div>
            <!-- 头像 -->
            <div class="info-ava-img" v-else></div>
          </div>
          <div class="info-name">
            <span>{{ userInfo.username }}</span>
          </div>
          <div class="info-operation" @click="editMyProfile">
            <a>编辑个人资料</a>
          </div>
        </div>
      </div>
      <!-- 文章 -->
      <div class="userArticleContainer">
        <div>
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="我发布的帖子">
              Content of Tab Pane 1
            </a-tab-pane>
            <a-tab-pane key="2" tab="我收藏的帖子">
              Content of Tab Pane 2
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>

    <!-- 编辑个人资料 对话框 -->
    <a-modal
      v-model="editMyProfileVisible"
      title="编辑个人资料"
      @ok="editOk"
      okText="确认"
      centered
      cancelText="取消"
      destroyOnClose
    >
      <a-form :form="form">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="用户名"
        >
          <a-input
            v-decorator="[
              'username',
              {
                rules: [{ required: true, message: '用户名不能为空' }],
                initialValue: userInfo.username,
              },
            ]"
            placeholder="请输入用户名"
          />
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="个人简介"
        >
          <a-input
            v-decorator="[
              'bio',
              {
                rules: [{ required: true, message: '个人简介不能为空' }],
                initialValue: userInfo.bio,
              },
            ]"
            placeholder="请输入个人简介"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import Narbar from "../../components/Navbar.vue";
import { getCurrentUserApi, updateCurrentUserApi } from "../../api/api";
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
export default {
  data() {
    return {
      formItemLayout,
      form: this.$form.createForm(this, { name: "updateCurrentUser" }),
      // 当前登录的信息
      userInfo: {},
      // 编辑个人资料对话框
      editMyProfileVisible: false,
      // 更新个人资料参数
      updateForm: {
        user: {
          username: "",
          bio: "",
          image: "",
        },
      },
    };
  },
  components: {
    Narbar,
  },
  created() {
    // 获取当前登录用户信息
    this.getCurrentUser();
  },
  methods: {
    // 获取当前登录用户信息
    getCurrentUser() {
      getCurrentUserApi().then((res) => {
        this.userInfo = res.data.user;
      });
    },
    // 打开个人资料对话框
    editMyProfile() {
      this.editMyProfileVisible = true;
    },
    // 确认更新个人资料
    editOk(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log(values);
          this.updateForm.user = values;
          await updateCurrentUserApi(this.updateForm).then((res) => {
            this.$message.success("更新个人资料成功");
            this.getCurrentUser();
            this.editMyProfileVisible = false;
          });
        }
      });
    },
    check() {
      this.form.validateFields((err) => {
        if (!err) {
          console.info("success");
        }
      });
    },
    handleChange(e) {
      this.checkNick = e.target.checked;
      this.$nextTick(() => {
        this.form.validateFields(["nickname"], { force: true });
      });
    },
  },
};
</script>

<style>
.forumBody {
  height: 100%;
  min-height: calc(100vh - 62px);
  background-color: #f3f3f3;
  min-width: 1366px;
}
.forumProfileContainer {
  /* display: flex;
  justify-content: center;
  align-items: center; */
  /* max-width: 1200px; */
  height: 100%;
  box-sizing: border-box;
  margin-top: 62px;
  /* padding: 70px 0; */
  /* margin: 62px auto 0 auto; */
}
.userInfo {
  background-color: #fff;
  text-align: center;
  /* background: #f3f3f3; */
  padding: 2rem 0 1rem 0;
  box-shadow: 0px 0px 5px rgba(163, 163, 163, 0.5);
}

.userInfoContainer {
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
  max-width: 1200px;
}

.info-ava {
  margin: 0 auto;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px rgba(153, 153, 153, 0.32) solid;
}

.info-ava-img {
  font-size: 50px;
  color: rgb(161, 161, 161);
}

.info-name {
  margin: 10px 0;
}

.info-name > span {
  font-weight: 700;
  font-size: 1.5rem;
  color: #373a3c;
}

.userArticleContainer {
  max-width: 1200px;
  /* box-sizing: border-box; */
  /* margin-top: 62px; */
  padding: 70px 0;
  margin: 0 auto;
}
</style>