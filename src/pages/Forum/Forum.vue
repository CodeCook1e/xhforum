<!--
 * @Author: qiuqi
 * @Date: 2021-09-16 22:12:46
 * @LastEditTime: 2021-11-19 17:23:57
 * @LastEditors: Please set LastEditors
 * @Description: 论坛首页
 * @FilePath: \xh_forum\src\pages\Home\Home.vue
-->
<template>
  <div class="forumBody">
    <Narbar></Narbar>
    <div class="forumHomeContainer">
      <div
        :class="!isChooseTag ? 'tag-container' : 'tag-container-isChooseTag'"
      >
        <div class="tag-content" v-for="(tag, index) in tagsList" :key="index">
          <div class="tag-header">
            <div class="tag-header-tab">{{ tag.tagname }}</div>
          </div>
          <div class="tag-body-content">
            <div
              class="tag-body"
              v-for="(childTag, index) in tag.children"
              :key="index"
            >
              <div class="tag-item">
                <div class="tag-item-image">
                  <img :src="childTag.image" alt="" />
                </div>
                <div class="tag-item-detail">
                  <div class="tag-item-detail-title-wrap">
                    <div
                      class="tag-item-detail-title"
                      @click="goForumByTag(childTag.tagname)"
                    >
                      #{{ childTag.tagname }}
                    </div>
                    <div class="tag-item-detail-desc">
                      <span class="tag-item-detail-desc-title"
                        >标签介绍：{{ childTag.describe }}</span
                      >
                    </div>
                  </div>
                  <div
                    class="tag-item-get"
                    @click="goForumByTag(childTag.tagname)"
                  >
                    <span>点击查看</span>
                    <a-icon type="right" style="font-size: 10px" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        :class="
          !isChooseTag
            ? 'tag-article-container'
            : 'tag-article-container-isChooseTag'
        "
      >
        <div class="tag-article-breadcrumb">
          <a-breadcrumb separator=">">
            <a-breadcrumb-item>论坛中心</a-breadcrumb-item>
            <a-breadcrumb-item v-if="this.$route.params.tagname">{{
              this.$route.params.tagname
            }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="tag-article-body">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="最新发布">
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
                        <span class="user-info-updateAt">{{
                          item.updateAt
                        }}</span>
                        <span @click="getMoreArticle(item._id)">
                          <a-icon type="star-o" style="margin-right: 8px" />
                          {{ item.favoritesCount }}
                        </span>
                        <span @click="getMoreArticle(item._id)">
                          <a-icon type="message" style="margin-right: 8px" />
                          {{ item.comments.length }}
                        </span>
                        <!-- <span class="article-tag">
                          <a-tag color="#32b16c">{{ item.tagList[0] }}</a-tag>
                        </span> -->
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
                          ><a-icon
                            class="author-img-icon"
                            slot="icon"
                            type="user"
                        /></a-avatar>
                      </a-list-item-meta>
                    </a-list-item>
                  </a-list>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="最多收藏"> 最多收藏 </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
    <a-back-top :visibilityHeight="0" />
  </div>
</template>

<script>
import Narbar from "../../components/Navbar.vue";
import {
  getArticleListApi,
  getTagsApi,
  getCurrentUserApi,
} from "../../api/api";
export default {
  data() {
    return {
      // 是否查看分类下文章
      isChooseTag: false,
      defaultImgSrc:
        "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      tagsList: [],
      tagParams: {},
      articleList: [],
      pagination: {
        pageSize: 10,
      },
    };
  },
  components: {
    Narbar,
  },
  created() {
    if (this.$route.params.tagname) {
      this.isChooseTag = true;
      console.log(this.$route.params.tagname);
      this.tagParams.tag = this.$route.params.tagname;
      this.getArticleList();
    }
    // 获取标签列表
    this.getTags();
    this.getCurrentUser();
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
      getArticleListApi(this.tagParams).then((res) => {
        console.log(res.data.articles);
        this.articleList = res.data.articles;
        this.articleList.map((article) => {
          article.createAt = this.$moment(article.createAt).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          article.updateAt = this.$moment(article.updateAt).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          article.commentCount = article.comments.length;
        });
      });
    },
    getTags() {
      getTagsApi().then((res) => {
        this.tagsList = res.data.tags;
        console.log(this.tagsList);
      });
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
    // 跳转到帖子详细信息页面
    getMoreArticle(articleId) {
      window.open(`/article/${articleId}`, "_blank");
      // this.$router.push("/article/" + articleId);
    },
    // 跳转到对应标签的论坛中心
    goForumByTag(tagname) {
      this.$router.push("/forum/" + tagname);
      this.isChooseTag = true;
      this.tagParams.tag = this.$route.params.tagname;
      this.getArticleList();
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
  display: flex;
  flex-direction: row;
  max-width: 1366px;
  box-sizing: border-box;
  margin: 62px auto 0 auto;
}

.tag-container {
  /* width: 450px; */
  margin-bottom: 30px;
  width: 1366px;
}

.tag-container-isChooseTag {
  width: 450px;
  margin-bottom: 30px;
}

.tag-content {
  padding: 20px 0;
}

.tag-daily {
  overflow: hidden;
  margin-bottom: 40px;
}
.tag-header {
  border-bottom: 2px solid #02a682;
}

.tag-header-tab {
  display: inline-block;
  font-size: 17px;
  color: #222;
  line-height: 30px;
  margin: 0px;
  cursor: pointer;
}

.tag-body-content {
  box-shadow: 0px 0px 8px rgba(168, 168, 168, 0.4);
}

.tag-body {
  background: #fff;
  padding: 15px 0 0px 30px;
}

.tag-item {
  display: flex;
  padding: 0;
  background: transparent;
  border: 0;
  margin-right: 30px;
  border-bottom: 1px solid rgba(153, 153, 153, 0.32);
}

.tag-body:last-child .tag-item {
  border-bottom: none;
  padding-bottom: 10px;
}

.tag-item-image {
  height: 80px;
  width: 80px;
  /* overflow: hidden;
  background: #ffffff;
  background-repeat: no-repeat;
  background-size: contain; */
  /* border: 5px solid #ffffff; */
  /* box-shadow: 0 0 0 1px #dfdcdc; */
  margin-bottom: 10px;
}

.tag-item-image > img {
  height: 80px;
  width: 80px;
}

.tag-item-detail {
  flex: 1 1;
  margin-left: 20px;
  margin-top: 10px;
  position: relative;
}

.tag-item-detail-title-wrap {
  padding-bottom: 8px;
}

.tag-item-detail-title {
  cursor: pointer;
  width: 100px;
  padding-right: 6px;
  font-size: 18px;
  color: #191c22;
  font-weight: 600;
  vertical-align: middle;
}

.tag-item-detail-title:hover {
  color: #32b16c;
}

.tag-item-detail-desc {
  display: flex;
  margin-top: 6px;
  line-height: 18px;
}

.tag-item-detail-desc-title {
  flex: 0, 1;
  font-size: 14px;
  color: #191c22;
  font-weight: 500;
}

.tag-item-get {
  cursor: pointer;
  max-width: 30%;
  font-size: 0.8rem;
  font-weight: 300;
  color: #aaa;
  vertical-align: middle;
  float: right;
}

.tag-item-get:hover {
  color: rgb(70, 70, 70);
}

.tag-article-container {
  display: none;
  flex: 1;
  padding: 20px 0 0 30px;
}

.tag-article-container-isChooseTag {
  display: block;
  flex: 1;
  padding: 20px 0 0 30px;
}

.tag-article-breadcrumb {
  height: 31px;
  border-bottom: 2px solid #02a682;
}

.tag-article-body {
  background: #fff;
  padding: 0 16px;
  box-shadow: 0px 0px 8px rgba(168, 168, 168, 0.4);
}

.article-list-content {
  background: #fff;
  overflow: auto;
  padding: 0px 20px 15px 20px;
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
</style>