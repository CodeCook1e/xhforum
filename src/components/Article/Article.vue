<!--
 * @Author: qiuqi
 * @Date: 2021-10-05 21:04:39
 * @LastEditTime: 2021-10-29 17:36:24
 * @LastEditors: Please set LastEditors
 * @Description: 帖子管理
 * @FilePath: \xh_forum\src\components\Article\article.vue
-->
<template>
  <div>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item>帖子管理</a-breadcrumb-item>
      <a-breadcrumb-item>帖子列表</a-breadcrumb-item>
    </a-breadcrumb>
    <a-layout-content
      :style="{
        background: '#fff',
        padding: '24px',
        margin: 0,
        minHeight: '280px',
      }"
    >
      <a-table :columns="columns" :data-source="articleList" rowKey="_id">
        <template slot="operation" slot-scope="text, article">
          <a href="javascript:;" class="editBtn" @click="editArticle(article)"
            >查看详情</a
          >
          <a href="javascript:;" class="editBtn" @click="editArticle(article)"
            >编辑</a
          >
          <a-popconfirm
            v-if="articleList.length"
            title="此操作将永久删除此文章，确定删除?"
            okText="确定"
            cancelText="取消"
            @confirm="() => deleteArticle(article._id)"
          >
            <a href="javascript:;" class="deleteBtn">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-layout-content>

    <!-- 编辑文章对话框 -->
    <a-modal
      width="700px"
      title="编辑文章"
      :visible="editVisible"
      okText="确定"
      cancelText="取消"
      @ok="editArticleOk"
      @cancel="editArticleCancel"
      destroyOnClose
    >
      <a-form
        :form="form"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-item name="title" label="文章标题">
          <a-input
            v-decorator="[
              'title',
              {
                initialValue: this.articleList.title,
                rules: [{ required: true, message: '文章标题不能为空！' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item name="description" label="文章简介">
          <a-input
            v-decorator="[
              'description',
              {
                initialValue: this.articleList.description,
                rules: [{ required: true, message: '文章简介不能为空！' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item name="author" label="作者">
          <a-input
            v-decorator="[
              'author',
              {
                initialValue: this.articleList.author,
                rules: [{ required: true, message: '作者不能为空！' }],
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
  { title: "文章标题", dataIndex: "title", key: "title" },
  { title: "文章简介", dataIndex: "description", key: "description" },
  { title: "作者", dataIndex: "author", key: "author" },
  { title: "创建时间", dataIndex: "createAt", key: "createAt" },
  { title: "更新时间", dataIndex: "updateAt", key: "updateAt" },
  {
    title: "操作",
    dataIndex: "",
    key: "x",
    scopedSlots: { customRender: "operation" },
  },
];
import {
  getArticleListApi,
  updateArticleApi,
  deleteArticleApi,
} from "../../api/api";

export default {
  data() {
    return {
      // 文章列表
      articleList: [],
      columns,
      editVisible: false,
      form: this.$form.createForm(this, { name: "coordinated" }),
    };
  },
  created() {
    // 获取文章列表
    this.getArticleList();
  },
  methods: {
    // 获取文章列表
    async getArticleList() {
      await getArticleListApi().then((res) => {
        this.articleList = res.data.articles;
      });
    },

    // 删除文章
    deleteArticle(articleId) {
      deleteArticleApi(articleId).then((res) => {
        this.getArticleList();
        message.success("删除文章成功！");
      });
    },

    // 编辑文章
    editArticle(article) {
      this.editVisible = true;
    },

    // 确定编辑文章
    editArticleOk() {},

    // 取消编辑文字
    editArticleCancel() {
      this.editVisible = false;
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