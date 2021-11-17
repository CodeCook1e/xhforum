<!--
 * @Author: qiuqi
 * @Date: 2021-10-05 21:04:39
 * @LastEditTime: 2021-11-12 16:14:40
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
          <a href="javascript:;" class="editBtn" @click="goArticle(article)"
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
      width="1200px"
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
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item name="title" label="文章标题">
          <a-input
            v-decorator="[
              'title',
              {
                initialValue: articleInfo.article.title,
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
                initialValue: articleInfo.article.description,
                rules: [{ required: true, message: '文章简介不能为空！' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item name="author" label="作者">
          <a-input
            disabled
            v-decorator="[
              'author',
              {
                initialValue: username,
                rules: [{ required: true, message: '作者不能为空！' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item name="body" label="内容">
          <div id="ckeditor">
            <ckeditor
              :editor="editor"
              v-model="editorData"
              :config="editorConfig"
            ></ckeditor>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const columns = [
  { title: "文章标题", dataIndex: "title", key: "title" },
  { title: "文章简介", dataIndex: "description", key: "description" },
  { title: "作者", dataIndex: "author.username", key: "author.username" },
  { title: "创建时间", dataIndex: "createAt", key: "createAt" },
  { title: "更新时间", dataIndex: "updateAt", key: "updateAt" },
  {
    title: "操作",
    dataIndex: "",
    key: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
import {
  getArticleListApi,
  adminUpdateArticleApi,
  adminDeleteArticleApi,
} from "../../api/api";

export default {
  data() {
    return {
      editor: ClassicEditor,
      editorData: "",
      editorConfig: {
        // Run the editor with the German UI.
        // language: "",
      },
      // 文章列表
      articleList: [],
      // 当前的文章信息
      articleInfo: { article: {} },
      // 当前文章作者
      username: "",
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
    getArticleList() {
      getArticleListApi().then((res) => {
        console.log(res.data.articles);
        this.articleList = res.data.articles;
        this.articleList.map((article) => {
          article.createAt = this.$moment(article.createAt).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          article.updateAt = this.$moment(article.updateAt).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
      });
    },

    // 删除文章
    deleteArticle(articleId) {
      adminDeleteArticleApi(articleId).then((res) => {
        this.getArticleList();
        message.success("删除文章成功！");
      });
    },

    // 查看文章详情
    goArticle(article) {
      window.open(`/article/${article._id}`, "_blank");
    },

    // 编辑文章
    editArticle(article) {
      this.articleInfo.article = article;
      this.username = article.author.username;
      this.editorData = article.body;
      this.editVisible = true;
    },

    // 确定编辑文章
    editArticleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.editorData) {
            this.$message.warning("帖子内容不能为空！");
          } else {
            console.log(values);
            this.articleInfo.article.title = values.title;
            this.articleInfo.article.description = values.description;
            this.articleInfo.article.body = this.editorData;
            adminUpdateArticleApi(this.articleInfo.article._id, {
              article: {
                title: this.articleInfo.article.title,
                description: this.articleInfo.article.description,
                body: this.articleInfo.article.body,
              },
            }).then((res) => {
              this.$message.success("编辑帖子成功！");
              this.getArticleList();
              this.editVisible = false;
            });
          }
        }
      });
    },

    // 取消编辑文字
    editArticleCancel() {
      this.editVisible = false;
    },
  },
};
</script>

<style scoped>
.editBtn {
  margin-right: 20px;
}
.deleteBtn {
  color: red;
}
</style>