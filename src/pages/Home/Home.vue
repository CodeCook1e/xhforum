<!--
 * @Author: qiuqi
 * @Date: 2021-09-16 22:12:46
 * @LastEditTime: 2021-11-18 15:17:44
 * @LastEditors: Please set LastEditors
 * @Description: 论坛首页
 * @FilePath: \xh_forum\src\pages\Home\Home.vue
-->
<template>
  <div class="forumBody">
    <Narbar></Narbar>
    <div class="forumHomeContainer">
      <div class="home-body">
        <div class="home-body-left">
          <div class="left-label">
            <div class="middle-title">
              <a-icon
                class="icon-fire"
                type="fire"
                theme="twoTone"
                two-tone-color="#c01e2e"
              />
              <span>新华之家资讯</span>
            </div>
          </div>
          <div class="article-list">
            <div class="article-list-content">
              <a-list
                item-layout="vertical"
                size="large"
                :pagination="pagination"
                :data-source="articleList"
              >
                <a-list-item
                  slot="renderItem"
                  key="item.title"
                  slot-scope="item"
                >
                  <template slot="actions">
                    <span
                      v-if="!item.anonymous"
                      class="user-info-username"
                      @click="getMoreAuthor(item.author._id)"
                      >{{ item.author.username }}</span
                    >
                    <span v-else class="user-info-username">匿名用户</span>
                    <span class="user-info-updateAt">{{ item.updateAt }}</span>
                    <span @click="getMoreArticle(item._id)">
                      <a-icon type="star-o" style="margin-right: 8px" />
                      {{ item.favoritesCount }}
                    </span>
                    <span @click="getMoreArticle(item._id)">
                      <a-icon type="message" style="margin-right: 8px" />
                      {{ item.comments.length }}
                    </span>
                    <span class="article-tag">
                      <a-tag color="#32b16c">{{ item.tagList[0] }}</a-tag>
                    </span>
                  </template>
                  <a-list-item-meta :description="item.description">
                    <a slot="title" @click="getMoreArticle(item._id)">{{
                      item.title
                    }}</a>
                    <a-avatar
                      v-if="!item.anonymous"
                      class="user-info-avatar"
                      slot="avatar"
                      :src="item.author.image || defaultImgSrc"
                      @click="getMoreAuthor(item.author._id)"
                    />
                    <a-avatar
                      v-else
                      class="user-info-avatar"
                      slot="avatar"
                      alt="用户头像"
                      ><a-icon class="author-img-icon" slot="icon" type="user"
                    /></a-avatar>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </div>
          </div>
        </div>
        <div class="home-body-right">
          <div class="entranceLayout">
            <div class="create-article" @click="createArticle()">
              <div class="icon-edit-bg">
                <a-icon
                  class="icon-edit"
                  type="edit"
                  theme="twoTone"
                  two-tone-color="#FC7F00"
                />
              </div>
              <span>发帖子</span>
            </div>
            <div class="go-forum-btn" @click="goForum()">
              <div class="icon-file-bg">
                <a-icon
                  class="icon-file"
                  type="file-text"
                  theme="twoTone"
                  two-tone-color="#13A17D"
                />
              </div>
              <span>前往论坛中心</span>
            </div>
          </div>
          <div class="hot-search">
            <div class="hot-search-title">帖子热榜</div>
            <div class="split-line"></div>
            <div class="itemList"></div>
            <div class="hot-article-container">
              <div v-for="(article, index) in hotArticleList" :key="index">
                <a
                  class="hot-article-body"
                  @click="getMoreArticle(article._id)"
                >
                  <div class="hot-article-item">
                    <div class="hot-index">{{ index + 1 }}</div>
                    <div class="hot-title">{{ article.title }}</div>
                  </div>
                </a>
              </div>
              <div class="itemList"></div>
            </div>
          </div>
          <div class="hot-search">
            <div class="hot-search-title">热门话题</div>
            <div class="split-line"></div>
            <div class="itemList"></div>
            <div class="tag-container">
              <div
                v-for="(tag, index) in tagsList"
                :key="index"
                class="tag-body"
              >
                <div class="tag-title">{{ tag.tagname }}</div>
                <div class="tag-navigation-topic">
                  <a
                    v-for="(childrenTag, index) in tag.children"
                    :key="index"
                    @click="goForumByTag(childrenTag.tagname)"
                  >
                    {{ childrenTag.tagname }}
                  </a>
                </div>
              </div>
              <div class="itemList"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-back-top :visibilityHeight="0" />
  </div>
</template>

<script>
import Narbar from "../../components/Navbar.vue";
import http from "../../api/http";
import {
  getCurrentUserApi,
  getArticleListApi,
  getTagsApi,
  getHotArticleListApi,
} from "../../api/api";
export default {
  data() {
    return {
      isLogin: false,
      userInfo: {},
      articleList: [],
      hotArticleList: [],
      tagsList: [],
      defaultImgSrc:
        "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      pagination: {
        pageSize: 10,
      },
    };
  },
  components: {
    Narbar,
  },
  created() {
    this.isLogin = http.getToken() ? true : false;
    this.getCurrentUser();
    this.getArticleList();
    this.getHotArticleList();
    this.getTags();
  },
  methods: {
    // 获取当前登录用户
    getCurrentUser() {
      getCurrentUserApi().then((res) => {
        console.log(res.data.user);
        this.userInfo = res.data.user;
      });
    },
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
    // 获取热门文章列表
    getHotArticleList() {
      getHotArticleListApi().then((res) => {
        console.log(res.data.articles);
        this.hotArticleList = res.data.articles;
        this.hotArticleList.map((article) => {
          article.createAt = this.$moment(article.createAt).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          article.updateAt = this.$moment(article.updateAt).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
      });
    },
    // 获取标签列表
    getTags() {
      getTagsApi().then((res) => {
        this.tagsList = res.data.tags;
        console.log(this.tagsList);
      });
    },
    // 跳转到发帖子页面
    createArticle() {
      if (!this.isLogin) {
        this.$message.warning("请先登录再进行操作！");
      } else {
        this.$router.push("/writearticle");
      }
    },
    // 跳转到论坛中心页面
    goForum() {
      this.$router.push("/forum");
    },
    // 跳转到帖子详细信息页面
    getMoreArticle(articleId) {
      window.open(`/article/${articleId}`, "_blank");
      // this.$router.push("/article/" + articleId);
    },
    // 跳转到作者页面
    getMoreAuthor(userId) {
      if (this.userInfo._id === userId) {
        window.open(`/myprofile`, "_blank");
        // this.$router.push("/myprofile/");
      } else {
        window.open(`/profile/${userId}`, "_blank");
        // this.$router.push("/profile/" + userId);
      }
    },
    // 跳转到对应标签的论坛中心
    goForumByTag(tagname) {
      this.$router.push("/forum/" + tagname);
    },
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
.forumHomeContainer {
  max-width: 1200px;
  box-sizing: border-box;
  margin: 62px auto 0 auto;
}

.home-body {
  display: flex;
  align-items: flex-start;
  margin: auto;
  max-width: 1240px;
  padding-top: 20px;
  padding-bottom: 20px;
}

.home-body-left {
  flex-grow: 1;
  margin: 0 17px 0 0;
  line-height: 44px;
  background: #fff;
  border-radius: 4px;
  border-bottom: 1px solid #f6f6f6;
}
.left-label {
  flex-shrink: 7;
  border-left: none;
  margin: 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  border-bottom: 1px solid #f6f6f6;
  height: 45px;
  line-height: 45px;
}
.middle-title {
  color: #191c22;
  position: relative;
  font-size: 16px;
  font-weight: 600;
}
.icon-fire {
  margin-right: 10px;
  font-size: 15px;
}

.article-list {
  flex-shrink: 3;
}

.article-list-content {
  background: #fff;
  overflow: auto;
  padding: 8px 20px;
}

.user-info-username {
  cursor: pointer;
}
.user-info-updateAt {
  cursor: auto;
}
.user-info-avatar {
  cursor: pointer;
}

.entranceLayout {
  width: 400px;
  height: 106px;
  background: #fff;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 20px 0;
}

.create-article {
  border-right: 1px solid #f5f5f5;
  flex-grow: 1;
  height: 66px;
  text-align: center;
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 1em;
}

.create-article:hover {
  color: #000;
}

.icon-edit-bg {
  margin: 0 auto 8px auto;
  background-color: rgb(248, 239, 229);
  border-radius: 50%;
  width: 48px;
  height: 48px;
}

.icon-edit {
  display: block;
  font-size: 24px;
  padding-top: 12px;
}

.create-article > span {
  font-weight: 500;
  margin-top: 4px;
  margin-bottom: 0.5em;
}

.icon-file-bg {
  margin: 0 auto 8px auto;
  background-color: rgb(229, 243, 240);
  border-radius: 50%;
  width: 48px;
  height: 48px;
}

.icon-file {
  display: block;
  font-size: 24px;
  padding-top: 12px;
}

.go-forum-btn {
  flex-grow: 1;
  height: 66px;
  text-align: center;
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 1em;
}

.go-forum-btn:hover {
  color: #000;
}

.go-forum-btn > span {
  font-weight: 500;
  margin-top: 4px;
  margin-bottom: 0.5em;
}

.article-tag {
  border: none !important;
}

.hot-search {
  background: #fff;
  border-radius: 4px;
  margin-bottom: 20px;
}

.hot-search-title {
  height: 45px;
  line-height: 45px;
  color: #191c22;
  padding: 0 20px;
  position: relative;
  font-size: 16px;
  font-weight: 600;
}

.hot-search-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 13px;
  height: 20px;
  border-left: 3px solid #32b16c;
}

.split-line {
  height: 1px;
  background: #f4f4f4;
  margin: 0 20px;
}

.itemList {
  padding: 3px 0;
}

.tag-container {
  height: auto;
  visibility: visible;
  opacity: 1;
}

.tag-title {
  display: inline-block;
  padding: 12px 20px 5px;
  font-size: 14px;
  color: #191c22;
}

.tag-navigation-topic {
  position: relative;
  margin: 0 12px;
  padding: 0 0 6px;
}

.tag-navigation-topic > a {
  display: inline-block;
  margin: 6px 0;
  padding: 0 8px;
  font-size: 14px;
  line-height: 14px;
  color: #7b7e86;
  border-right: 1px solid #d8d8d8;
}

.tag-navigation-topic > a:hover {
  font-weight: bolder;
  color: #32b16c;
  border-right: 1px solid #d8d8d8;
}

.hot-article-body {
  background: transparent;
  text-decoration: none;
}

.hot-article-item {
  width: 360px;
  display: flex;
  line-height: 20px;
  font-size: 14px;
  color: #191c22;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 12px 20px;
}

.hot-index {
  min-width: 22px;
  font-size: 14px;
}

.hot-article-container
  div:nth-child(1)
  .hot-article-body
  .hot-article-item
  .hot-index {
  color: #c01e2e;
}

.hot-article-container
  div:nth-child(2)
  .hot-article-body
  .hot-article-item
  .hot-index {
  color: #fc7f00;
}

.hot-article-container
  div:nth-child(3)
  .hot-article-body
  .hot-article-item
  .hot-index {
  color: #fbb21a;
}

.hot-title {
  font-weight: 400;
  color: #2d3137;
}

.hot-title:hover {
  color: #32b16c;
}
</style>