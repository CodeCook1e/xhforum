<!--
 * @Author: qiuqi
 * @Date: 2021-10-28 16:23:15
 * @LastEditTime: 2021-11-18 21:50:35
 * @LastEditors: Please set LastEditors
 * @Description: 个人资料页面
 * @FilePath: \xh_forum\src\pages\Profile\Profile.vue
-->
<template>
  <div class="forumBody">
    <Narbar></Narbar>
    <div class="forumProfileContainer">
      <div class="userInfo">
        <div class="userInfoContainer">
          <div class="info-ava">
            <div class="info-ava-img">
              <a-avatar
                class="info-img"
                :src="userInfo.image || defaultImgSrc"
                alt="用户头像"
              />
            </div>
          </div>
          <div class="info-name">
            <span>{{ userInfo.username }}</span>
          </div>
          <div class="info-bio">
            <span v-if="userInfo.bio">个人简介：{{ userInfo.bio }}</span>
            <span v-else>当前用户暂无个人简介</span>
          </div>
          <a-button
            v-if="!isFollowing"
            shape="round"
            class="follow-btn"
            @click="followUser(userInfo._id)"
            >关注</a-button
          >
          <a-button
            v-else-if="isFollowing"
            shape="round"
            class="following-btn"
            @click="unfollowUser(userInfo._id)"
            >已关注</a-button
          >
        </div>
      </div>
      <!-- 文章 -->
      <div class="userArticleContainer">
        <div>
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="他发布的帖子">
              <div v-if="!isLogin">
                <a-result status="warning" title="登录后即可查看...">
                  <template #extra>
                    <a-button
                      class="go-login"
                      @click="goLogin()"
                      key="console"
                      type="primary"
                    >
                      前去登录
                    </a-button>
                  </template>
                </a-result>
              </div>
              <div v-else class="article-list-container">
                <div
                  v-for="(article, index) in articleList"
                  :key="index"
                  class="article-preview"
                >
                  <div class="article-meta">
                    <div>
                      <a-avatar
                        class="user-img"
                        :src="article.author.image || defaultImgSrc"
                        alt="用户头像"
                        @click="goUserProfile(article.author._id)"
                      />
                      <div class="user-info">
                        <span
                          class="author"
                          @click="goUserProfile(article.author._id)"
                          >{{ article.author.username }}</span
                        >
                        <span class="date">{{ article.updateAt }}</span>
                      </div>
                    </div>
                    <a-button
                      v-if="!article.isFavorite"
                      size="small"
                      class="unfavorite-btn"
                      @click="favoriteArticle(article._id)"
                    >
                      <a-icon type="heart" />
                      <span>{{ article.favoritesCount }}</span>
                    </a-button>
                    <a-button
                      v-else
                      size="small"
                      class="favorite-btn"
                      @click="unfavoriteArticle(article._id)"
                    >
                      <a-icon type="heart" />
                      <span>{{ article.favoritesCount }}</span>
                    </a-button>
                  </div>
                  <a class="preview-link" @click="getArticle(article._id)">
                    <h1 class="article-title">{{ article.title }}</h1>
                    <p class="article-description">
                      {{ article.description }}
                    </p>
                    <span>查看更多...</span>
                  </a>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
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
  getProfileApi,
  getCurrentUserApi,
  getArticleListApi,
  favoriteArticleApi,
  unfavoriteArticleApi,
  followUserApi,
  unfollowUserApi,
} from "../../api/api";
export default {
  data() {
    return {
      isLogin: false,
      userInfo: {},
      myInfo: {},
      articleList: [],
      articleParams: {},
      defaultImgSrc:
        "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      // 是否已经关注当前文章作者
      isFollowing: false,
    };
  },
  components: {
    Narbar,
  },
  created() {
    this.isLogin = http.getToken() ? true : false;
    this.getUserProfile(this.$route.params.userId);
  },
  methods: {
    // 获取自己资料
    getCurrentUser() {
      getCurrentUserApi().then((res) => {
        this.myInfo = res.data.user;
        this.getArticleList();
      });
    },
    // 获取他人资料
    getUserProfile(userId) {
      getProfileApi(userId).then((res) => {
        this.userInfo = res.data.user;
        this.getCurrentUser();
      });
    },
    getArticleList() {
      this.articleParams.author = this.userInfo.username;
      getArticleListApi(this.articleParams).then((res) => {
        // 匿名发布的帖子不显示
        let nullArr = [];
        this.articleList = nullArr;
        res.data.articles.map((article) => {
          if (!article.anonymous) {
            this.articleList.push(article);
          }
        });
        this.articleList.map((article) => {
          article.createAt = this.$moment(article.createAt).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          article.updateAt = this.$moment(article.updateAt).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          let index = this.myInfo.favorites.indexOf(article._id);
          if (index !== -1) {
            article.isFavorite = true;
          }
          let index2 = this.myInfo.following.indexOf(this.userInfo._id);
          if (index2 !== -1) {
            this.isFollowing = true;
          }
        });
        console.log(this.articleList);
      });
    },
    goUserProfile(userId) {
      if (this.myInfo._id === userId) {
        this.$router.push("/myprofile/");
      } else {
        this.$router.push("/profile/" + userId);
      }
    },
    // 跳转到文章详情页面
    getArticle(articleId) {
      this.$router.push("/article/" + articleId);
    },

    // 收藏文章
    favoriteArticle(articleId) {
      console.log(articleId);
      favoriteArticleApi(articleId).then((res) => {
        console.log(res);
        this.getUserProfile(this.$route.params.userId);
      });
    },

    // 取消收藏文章
    unfavoriteArticle(articleId) {
      console.log(articleId);
      unfavoriteArticleApi(articleId).then((res) => {
        console.log(res);
        this.getUserProfile(this.$route.params.userId);
      });
    },

    // 关注用户
    followUser(userId) {
      if (!this.isLogin) {
        this.$message.warning("请先登录再进行操作！");
      } else {
        followUserApi(userId).then((res) => {
          console.log(res);
          this.getUserProfile(this.$route.params.userId);
          this.$message.success("关注成功！");
        });
      }
    },

    // 取消关注用户
    unfollowUser(userId) {
      if (!this.isLogin) {
        this.$message.warning("请先登录再进行操作！");
      } else {
        unfollowUserApi(userId).then((res) => {
          console.log(res);
          this.isFollowing = false;
          this.getUserProfile(this.$route.params.userId);
          this.$message.success("取消关注成功！");
        });
      }
    },

    goLogin() {
      this.$router.push("/login");
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
.forumProfileContainer {
  height: 100%;
  box-sizing: border-box;
  margin-top: 62px;
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
  /* background-color: #eee; */
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px rgba(153, 153, 153, 0.32) solid; */
}
.info-img {
  width: 100px;
  height: 100px;
}
.info-name {
  margin: 10px 0;
}

.info-name > span {
  font-weight: 700;
  font-size: 1.5rem;
  color: #373a3c;
}

.info-bio {
  margin-bottom: 10px;
}

.info-bio > span {
  font-weight: 700;
  font-size: 1rem;
  color: #373a3c;
}

.userArticleContainer {
  max-width: 1200px;
  /* box-sizing: border-box; */
  /* margin-top: 62px; */
  padding: 70px 0;
  margin: 0 auto;
}

.article-preview:first-child {
  border-top: none;
}

.article-preview {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.5rem 0;
}

.article-meta {
  margin: 0 0 1rem;
  display: block;
  position: relative;
  font-weight: 300;
  display: flex;
  justify-content: space-between;
}

.user-img {
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  height: 32px;
  width: 32px;
}

.user-info {
  margin: 0 1.5rem 0 0.3rem;
  display: inline-block;
  vertical-align: middle;
  line-height: 1rem;
}

.author {
  cursor: pointer;
  display: block;
  font-weight: 500 !important;
}

.date {
  color: rgb(158, 158, 158);
  font-size: 0.8rem;
  display: block;
}

.preview-link {
  color: inherit !important;
}

.article-title {
  font-weight: 600 !important;
  font-size: 1.5rem !important;
  margin-bottom: 3px;
}

.article-description {
  font-weight: 300;
  color: #999;
  margin-bottom: 15px;
  font-size: 1rem;
  line-height: 1.3rem;
}

.preview-link > span {
  max-width: 30%;
  font-size: 0.8rem;
  font-weight: 300;
  color: #bbb;
  vertical-align: middle;
}

.favorite-btn {
  background-color: #32b16c;
  color: #fff;
}

.favorite-btn:hover,
.favorite-btn:focus {
  border-color: #32b16c;
}

.unfavorite-btn:hover,
.unfavorite-btn:focus {
  border-color: #32b16c;
}

.follow-btn {
  margin-top: 5px;
  border-color: #32b16c;
  color: #32b16c;
}

.follow-btn:hover,
.follow-btn:focus {
  border-color: #32b16c;
  background-color: #32b16c;
  color: #fff;
}

.following-btn {
  margin-top: 5px;
  border-color: #32b16c;
  background-color: #32b16c;
  color: #fff;
}

.following-btn:hover,
.follow-btn:focus {
  border-color: #32b16c;
  background-color: #fff;
  color: #32b16c;
}

.go-login {
  border-color: #32b16c;
  background-color: #32b16c;
  color: #fff;
}

.go-login:hover,
.go-login:focus {
  border-color: #1e9654;
  background-color: #1e9654;
  color: #fff;
}
</style>