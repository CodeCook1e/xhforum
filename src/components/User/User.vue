<!--
 * @Author: qiuqi
 * @Date: 2021-10-05 20:51:41
 * @LastEditTime: 2021-10-31 14:04:58
 * @LastEditors: Please set LastEditors
 * @Description: 用户管理组件
 * @FilePath: \xh_forum\src\components\User\User.vue
-->
<template>
  <div>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item>用户管理</a-breadcrumb-item>
      <a-breadcrumb-item>用户列表</a-breadcrumb-item>
    </a-breadcrumb>
    <a-layout-content
      :style="{
        background: '#fff',
        padding: '24px',
        margin: 0,
        minHeight: '280px',
      }"
    >
      <a-table :columns="columns" :data-source="userList" rowKey="_id">
        <template slot="admin" slot-scope="text, user">
          <a-switch :checked="user.admin" @change="adminChange(user)" />
        </template>
        <template slot="operation" slot-scope="text, user">
          <a href="javascript:;" class="editBtn" @click="editUser(user)"
            >编辑</a
          >
          <a-popconfirm
            v-if="userList.length"
            title="此操作将永久删除此用户，确定删除?"
            okText="确定"
            cancelText="取消"
            @confirm="() => deleteUser(user._id)"
          >
            <a href="javascript:;" class="deleteBtn">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-layout-content>

    <!-- 编辑用户对话框 -->
    <a-modal
      width="700px"
      title="编辑用户资料"
      :visible="visible"
      okText="确定"
      cancelText="取消"
      @ok="editUserOk"
      @cancel="editUserCancel"
      destroyOnClose
    >
      <a-form
        :form="form"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-item name="username" label="用户名">
          <a-input
            v-decorator="[
              'username',
              {
                initialValue: userInfo.user.username,
                rules: [{ required: true, message: '用户名不能为空！' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item name="email" label="邮箱">
          <a-input
            v-decorator="[
              'email',
              {
                initialValue: userInfo.user.email,
                rules: [{ required: true, message: '邮箱不能为空！' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item name="bio" label="个人简介">
          <a-input
            v-decorator="[
              'bio',
              {
                initialValue: userInfo.user.bio,
                rules: [{ required: true, message: '个人简介不能为空！' }],
              },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
const columns = [
  { title: "用户名", dataIndex: "username", key: "username" },
  { title: "邮箱", dataIndex: "email", key: "email" },
  { title: "个人简介", dataIndex: "bio", key: "bio" },
  {
    title: "管理员权限",
    dataIndex: "",
    key: "admin",
    scopedSlots: { customRender: "admin" },
  },
  {
    title: "操作",
    dataIndex: "",
    key: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
import { getAllUsersApi, deleteUserApi, updateUserApi } from "../../api/api";
export default {
  data() {
    return {
      // 用户列表
      userList: [],
      columns,
      visible: false,
      // 当前的用户消息
      userInfo: { user: {} },
      form: this.$form.createForm(this, { name: "coordinated" }),
    };
  },
  created() {
    // 获取用户
    this.getAllUsers();
  },
  methods: {
    // 获取用户
    async getAllUsers() {
      await getAllUsersApi().then((res) => {
        this.userList = res.data.users;
      });
    },

    // 删除用户
    deleteUser(userId) {
      deleteUserApi(userId).then((res) => {
        this.getAllUsers();
        message.success("删除用户成功！");
      });
    },

    // 编辑用户
    editUser(user) {
      this.visible = true;
      this.userInfo.user = user;
    },

    // 确定编辑用户
    editUserOk() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log(values);
          this.userInfo.user.username = values.username;
          this.userInfo.user.email = values.email;
          this.userInfo.user.bio = values.bio;
          await updateUserApi(this.userInfo.user._id, this.userInfo).then(
            (res) => {
              this.$message.success("编辑用户成功！");
              this.getAllUsers();
              this.visible = false;
            }
          );
        }
      });
    },

    // 取消编辑用户
    editUserCancel() {
      this.visible = false;
    },

    // 改变用户权限
    adminChange(user) {
      user.admin = !user.admin;
      this.userInfo.user = user;
      updateUserApi(user._id, this.userInfo).then((res) => {
        this.$message.success("更改权限成功！");
        this.getAllUsers();
        console.log(this.userInfo.user);
      });
    },
  },
};
</script>

<style>
.editBtn {
  margin-right: 20px;
}
.deleteBtn {
  color: red;
}
</style>