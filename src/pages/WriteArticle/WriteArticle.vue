<!--
 * @Author: qiuqi
 * @Date: 2021-10-29 15:15:50
 * @LastEditTime: 2021-11-28 16:54:46
 * @LastEditors: Please set LastEditors
 * @Description: 创建文章页面
 * @FilePath: \xh_forum\src\pages\WriteArticle\WriteArticle.vue
-->

<template>
  <div class="pageBody">
    <Narbar></Narbar>
    <div class="articleContainer-body">
      <div class="articleContainer">
        <div class="create-article-text">
          <span>发帖子</span>
        </div>
        <div class="article">
          <a-form :form="form" name="basic">
            <a-form-item class="article-title" name="title" label="文章标题">
              <a-input
                size="large"
                placeholder="请输入标题（4-20个字）"
                v-decorator="[
                  'title',
                  {
                    rules: [
                      { required: true, message: '文章标题不能为空！' },
                      { min: 4, max: 20, message: '字数在4-20个字之间！' },
                    ],
                  },
                ]"
              />
            </a-form-item>
            <a-form-item
              class="article-description"
              name="description"
              label="文章简介"
            >
              <a-input
                size="large"
                placeholder="请输入简介（10-40个字）"
                v-decorator="[
                  'description',
                  {
                    rules: [
                      { required: true, message: '文章简介不能为空！' },
                      { min: 10, max: 40, message: '字数在10-40个字之间！' },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-form>
        </div>
        <div class="article-description"></div>
        <div class="article-body-text">
          <span class="required">*</span>
          <span>文章内容：</span>
        </div>
        <div class="article-body">
          <div id="ckeditor">
            <ckeditor
              :editor="editor"
              v-model="editorData"
              :config="editorConfig"
            ></ckeditor>
          </div>
        </div>
        <div>
          <div class="article-tag">
            <span class="required">*</span>
            <span>帖子分类：</span>
            <a-tag
              v-if="!tag"
              style="background: #fff; borderstyle: dashed; margin-left: 10px"
              @click="showTagsModel"
            >
              <a-icon type="plus" /> 选择标签
            </a-tag>
            <a-tag v-else color="#32b16c" @click="rechooseTag"
              >{{ tag }}
            </a-tag>
          </div>
        </div>
        <div>
          <div class="article-anonymous">
            <a-alert
              message="该匿名只是针对其他用户匿名，对作者本人、管理员和其他高权限人并非匿名。"
              type="warning"
              closable
              class="anonymous-alert"
            />
            <span>是否匿名发布：</span>
            <a-radio-group
              name="radioGroup"
              :default-value="false"
              @change="anonymousChange"
            >
              <a-radio :value="true"> 是 </a-radio>
              <a-radio :value="false"> 否 </a-radio>
            </a-radio-group>
          </div>
        </div>
        <div>
          <a-button
            class="create-article-btn"
            type="primary"
            @click="createArticle"
            >确认发布</a-button
          >
        </div>
      </div>
    </div>

    <a-modal
      width="600px"
      title="选择标签"
      :visible="chooseVisible"
      okText="确定"
      cancelText="取消"
      @ok="chooseTagOk"
      @cancel="chooseTagCancel"
      destroyOnClose
    >
      <div>请选择板块：</div>
      <a-radio-group>
        <a-radio
          v-for="(tag, index) in tagsList"
          :key="index"
          :style="radioStyle"
          :value="tag.tagname"
          @change="childrenTagOnChange(tag)"
        >
          {{ tag.tagname }}
        </a-radio>
      </a-radio-group>
      <div style="margin-top: 30px">请选择标签：</div>
      <div style="margin-top: 10px" v-if="tagsChildrenList.length === 0">
        请先选择板块！
      </div>
      <a-radio-group @change="tagOnChange">
        <a-radio
          v-for="(tag, index) in tagsChildrenList"
          :key="index"
          :style="radioStyle"
          :value="tag.tagname"
        >
          {{ tag.tagname }}
        </a-radio>
      </a-radio-group>
    </a-modal>
  </div>
</template>

<script>
import Narbar from "../../components/Navbar.vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { createArticleApi, getTagsApi } from "../../api/api";
export default {
  data() {
    return {
      editor: ClassicEditor,
      editorData: "",
      editorConfig: {
        language: "zh",
        toolbar: {
          items: [
            "heading",
            "|",
            "alignment",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "uploadImage",
            "undo",
            "redo",
          ],
        },
        image: {
          toolbar: [
            "imageStyle:inline",
            "imageStyle:wrapText",
            "imageStyle:breakText",
            "|",
            "toggleImageCaption",
            "imageTextAlternative",
          ],
        },
        ckfinder: {
          // uploadUrl: "http://localhost:3000/api/articles/upload",
          uploadUrl: "http://192.168.31.113:3000/api/articles/upload",
        },
      },
      tagsList: [],
      tagsChildrenList: [],
      form: this.$form.createForm(this, { name: "coordinated" }),
      // 创建文章参数
      createArticleParams: {
        article: {
          title: "",
          description: "",
          body: "",
          tagList: [],
          anonymous: false,
        },
      },
      chooseVisible: false,
      radioStyle: {
        // display: "block",
        height: "30px",
        lineHeight: "30px",
      },
      tag: "",
    };
  },
  components: {
    Narbar,
  },
  created() {
    this.getTagsList();
  },

  methods: {
    // 获取标签列表
    getTagsList() {
      getTagsApi().then((res) => {
        this.tagsList = res.data.tags;
        console.log(this.tagsList);
      });
    },

    createArticle() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          if (!this.editorData) {
            this.$message.warning("帖子内容不能为空！");
          } else if (!this.tag) {
            this.$message.warning("标签不能为空！");
          } else {
            this.createArticleParams.article.title = values.title;
            this.createArticleParams.article.description = values.description;
            this.createArticleParams.article.body = this.editorData;
            console.log(this.createArticleParams.article);
            await createArticleApi(this.createArticleParams).then((res) => {
              this.$message.success("创建帖子成功！");
              this.$router.push("/article/" + res.data.article._id);
            });
          }
        }
      });
    },
    showTagsModel() {
      this.chooseVisible = true;
    },
    chooseTagOk() {
      if (!this.tag) {
        this.chooseVisible = false;
      } else {
        this.createArticleParams.article.tagList.push(this.tag);
        console.log(this.createArticleParams.article);
        this.chooseVisible = false;
      }
    },
    chooseTagCancel() {
      this.tagsChildrenList = [];
      this.tag = "";
      this.chooseVisible = false;
    },
    tagOnChange(e) {
      console.log(e);
      this.tag = e.target.value;
      console.log(this.tag);
    },
    childrenTagOnChange(tag) {
      console.log(tag);
      this.tagsChildrenList = JSON.parse(JSON.stringify(tag.children));
      console.log(this.tagsChildrenList);
    },
    rechooseTag() {
      this.tag = "";
      this.chooseVisible = true;
    },
    anonymousChange(e) {
      console.log(e.target.value);
      this.createArticleParams.article.anonymous = e.target.value;
    },
  },
};
</script>

<style>
.pageBody {
  height: 100%;
  min-height: calc(100vh - 162px);
  background-color: #f3f3f3;
  min-width: 1366px;
}
.articleContainer-body {
  padding-top: 100px;
}
.articleContainer {
  background-color: #fff;
  box-sizing: border-box;
  width: 1000px;
  padding: 100px;
  margin: 62px auto auto;
  border-radius: 15px;
}

.create-article-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: #32b16c;
  margin-top: -30px;
  margin-bottom: 30px;
}
.article-body-text {
  margin-top: 30px;
}
.article-body {
  display: flex;
  justify-content: center;
}
#ckeditor {
  margin-top: 10px;
  width: 800px;
}
.create-article-btn {
  float: right;
}
.required {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
}
.article-tag {
  margin-top: 40px;
}
.create-article-btn {
  color: #fff;
  background-color: #32b16c;
  border-color: #32b16c;
  margin-top: 20px;
}

.create-article-btn:hover,
.create-article-btn:focus {
  background-color: #1e9654;
  border-color: #1e9654;
}

.ck-content {
  min-height: 300px;
}

.article-anonymous {
  margin-top: 30px;
}

.anonymous-alert {
  margin-bottom: 10px;
}

@media screen and (max-width: 751px) {
  .pageBody {
    min-width: 100vw;
  }
  .articleContainer-body {
    padding-top: 62px;
    min-width: 100vw;
  }
  .articleContainer {
    margin: 0px;
    padding: 62px 20px 80px 20px;
    max-width: 100vw;
    border-radius: 0px;
  }
  .article-body {
    max-width: 100vw;
  }
  #ckeditor {
    padding: 0px 10px 0px 10px;
    max-width: 98vw;
  }
  .article-tag {
    margin-top: 30px;
  }
}
</style>