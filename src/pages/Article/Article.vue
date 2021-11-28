<!--
 * @Author: your name
 * @Date: 2021-11-03 20:22:31
 * @LastEditTime: 2021-11-28 17:42:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \xhforum\src\pages\Article\Article.vue
-->
<template>
  <div class="pageBody">
    <Narbar></Narbar>
    <div class="article-container-body">
      <div class="article-container">
        <div class="article-container-left">
          <div>
            <h1 class="article-title">{{ articleInfo.title }}</h1>
            <a-tag class="article-tag" color="#32b16c">{{ tag }}</a-tag>
            <a-button
              v-if="!articleInfo.isFavorite"
              size="small"
              class="unfavorite-btn"
              @click="favoriteArticle(articleInfo._id)"
            >
              <a-icon type="heart" />
              <span>{{ articleInfo.favoritesCount }}</span>
            </a-button>
            <a-button
              v-else
              size="small"
              class="favorite-btn"
              @click="unfavoriteArticle(articleInfo._id)"
            >
              <a-icon type="heart" />
              <span>{{ articleInfo.favoritesCount }}</span>
            </a-button>
          </div>
          <div>
            <a-popconfirm
              title="此操作将永久删除此文章，确定删除?"
              okText="确定"
              cancelText="取消"
              @confirm="() => deleteArticle(articleInfo._id)"
            >
              <a v-if="isMine" href="javascript:;" class="delete-article-btn"
                >删除</a
              >
            </a-popconfirm>
          </div>
          <div class="author-info">
            <div class="author">
              <a>
                <a-avatar
                  v-if="articleInfo.author && !isAnonymous"
                  class="author-img"
                  :src="articleInfo.author.image || defaultImgSrc"
                  alt="用户头像"
                  @click="getUserProfile(articleInfo.author._id)"
                />
                <a-avatar v-else class="author-img" alt="用户头像"
                  ><a-icon class="author-img-icon" slot="icon" type="user"
                /></a-avatar>
              </a>
              <div style="margin-left: 15px">
                <div class="author-top">
                  <span
                    v-if="!isAnonymous"
                    class="author-username"
                    @click="getUserProfile(articleInfo.author._id)"
                    >{{ username }}</span
                  >
                  <span v-else class="author-username">匿名用户</span>
                  <a-button
                    v-if="!isFollowing && !isMine"
                    shape="round"
                    size="small"
                    class="follow-btn"
                    @click="followUser(articleInfo.author._id)"
                    >关注</a-button
                  >
                  <a-button
                    v-else-if="isFollowing && !isMine"
                    shape="round"
                    size="small"
                    class="following-btn"
                    @click="unfollowUser(articleInfo.author._id)"
                    >已关注</a-button
                  >
                </div>
                <div class="article-time">
                  <span>{{ articleInfo.updateAt }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="article-html-body" v-html="articleInfo.body"></div>
        </div>
      </div>
    </div>
    <div class="article-comment-container">
      <div class="article-comment-body">
        <a-comment>
          <div slot="content">
            <a-form-item>
              <a-textarea
                :rows="4"
                :value="commentValue"
                @change="handleChange"
                placeholder="写下你的评论..."
              />
            </a-form-item>
            <a-form-item>
              <a-button
                html-type="submit"
                :loading="submitting"
                type="primary"
                @click="handleSubmit"
                class="submit-comment-btn"
              >
                发布评论
              </a-button>
            </a-form-item>
          </div>
        </a-comment>
        <div class="article-comment">
          <a-list
            v-if="comments.length"
            :data-source="comments"
            :header="`精彩评论 ${comments.length}`"
            item-layout="horizontal"
            :pagination="pagination"
          >
            <a-list-item slot="renderItem" slot-scope="item">
              <a-comment
                :author="item.author"
                :avatar="item.avatar"
                :content="item.content"
                :datetime="item.datetime"
                class="user-info-comment"
                @click="getUserProfile(item.authorId)"
              />
              <a-popconfirm
                title="此操作将永久删除此评论，确定删除?"
                okText="确定"
                cancelText="取消"
                @confirm="() => deleteComment(articleInfo._id, item.commentId)"
              >
                <a class="delete-btn" v-if="item.authorId === userInfo._id"
                  >删除</a
                >
              </a-popconfirm>
            </a-list-item>
          </a-list>
          <div v-else style="margin-top: 15px">当前帖子暂无评论</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Narbar from "../../components/Navbar.vue";
import {
  getArticleApi,
  getCurrentUserApi,
  addCommentsApi,
  getCommentsApi,
  deleteCommentApi,
  favoriteArticleApi,
  unfavoriteArticleApi,
  followUserApi,
  unfollowUserApi,
  deleteArticleApi,
} from "../../api/api";
import http from "../../api/http";
import moment from "moment";

export default {
  data() {
    return {
      isLogin: false,
      articleInfo: {},
      userInfo: {},
      username: "",
      tag: "",
      comments: [],
      submitting: false,
      commentValue: "",
      moment,
      addCommentParams: { comment: {} },
      pagination: {
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 5,
      },
      defaultImgSrc:
        "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      // 当前文章文章是不是自己的
      isMine: false,
      // 是否已经关注当前文章作者
      isFollowing: false,
      // 是否匿名
      isAnonymous: false,
    };
  },
  components: {
    Narbar,
  },
  created() {
    this.isLogin = http.getToken() ? true : false;
    this.getCurrentUser();
    this.getArticle();
    this.getComments();
  },
  methods: {
    // 获取帖子详细信息
    getArticle() {
      getArticleApi(this.$route.params.articleId).then((res) => {
        this.articleInfo = res.data.article;
        this.articleInfo.createAt = this.$moment(
          this.articleInfo.createAt
        ).format("YYYY-MM-DD HH:mm:ss");
        this.articleInfo.updateAt = this.$moment(
          this.articleInfo.updateAt
        ).format("YYYY-MM-DD HH:mm:ss");
        this.username = this.articleInfo.author.username;
        this.tag = this.articleInfo.tagList[0];
        this.isAnonymous = this.articleInfo.anonymous;
        let index = this.userInfo.favorites.indexOf(this.articleInfo._id);
        if (index !== -1) {
          this.articleInfo.isFavorite = true;
        }
        let index2 = this.userInfo.following.indexOf(
          this.articleInfo.author._id
        );
        if (index2 !== -1) {
          this.isFollowing = true;
        }
        if (this.articleInfo.author._id === this.userInfo._id) {
          this.isMine = true;
        }
      });
    },

    // 获取当前登录用户
    getCurrentUser() {
      getCurrentUserApi().then((res) => {
        console.log(res.data.user);
        this.userInfo = res.data.user;
      });
    },

    // 获取帖子评论信息
    getComments() {
      getCommentsApi(this.$route.params.articleId).then((res) => {
        console.log(res.data.comments);
        res.data.comments.map((comment) => {
          this.comments = [
            {
              commentId: comment._id,
              authorId: comment.author._id,
              author: comment.author.username,
              avatar: comment.author.image || this.defaultImgSrc,
              content: comment.body,
              datetime: this.$moment(comment.createdAt).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
            },
            ...this.comments,
          ];
        });
      });
    },

    //
    handleSubmit() {
      if (!this.isLogin) {
        this.$message.warning("请先登录再进行操作！");
      } else {
        if (!this.commentValue) {
          return;
        }
        this.submitting = true;
        this.addCommentParams.comment.body = this.commentValue;
        addCommentsApi(
          this.$route.params.articleId,
          this.addCommentParams
        ).then((res) => {
          console.log(res);
          this.submitting = false;
          this.$message.success("发布评论成功！");
          this.commentValue = "";
          this.comments = [];
          this.getComments();
        });
      }
    },

    handleChange(e) {
      this.commentValue = e.target.value;
    },

    deleteComment(articleId, commentId) {
      deleteCommentApi(articleId, commentId).then((res) => {
        this.$message.success("删除评论成功！");
        this.comments = [];
        this.getComments();
      });
    },

    // 跳转到用户的个人资料页面
    getUserProfile(userId) {
      if (this.userInfo._id === userId) {
        this.$router.push("/myprofile/");
      } else {
        this.$router.push("/profile/" + userId);
      }
    },

    // 收藏文章
    favoriteArticle(articleId) {
      if (!this.isLogin) {
        this.$message.warning("请先登录再进行操作！");
      } else {
        favoriteArticleApi(articleId).then((res) => {
          this.getArticle();
          this.getCurrentUser();
        });
      }
    },

    // 取消收藏文章
    unfavoriteArticle(articleId) {
      if (!this.isLogin) {
        this.$message.warning("请先登录再进行操作！");
      } else {
        unfavoriteArticleApi(articleId).then((res) => {
          this.getArticle();
          this.getCurrentUser();
        });
      }
    },

    // 关注用户
    followUser(userId) {
      if (!this.isLogin) {
        this.$message.warning("请先登录再进行操作！");
      } else {
        followUserApi(userId).then((res) => {
          this.getArticle();
          this.getCurrentUser();
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
          this.isFollowing = false;
          this.getArticle();
          this.getCurrentUser();
          this.$message.success("取消关注成功！");
        });
      }
    },

    // 删除文章
    deleteArticle(articleId) {
      deleteArticleApi(articleId).then((res) => {
        this.$message.success("删除文章成功！");
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style scoped>
.pageBody {
  height: 100%;
  min-height: calc(100vh - 62px);
  background-color: #f3f3f3;
  min-width: 1050px;
}

.article-container-body {
  padding-top: 30px;
}

.article-container {
  background-color: #f3f3f3;
  height: 100%;
  width: 1050px;
  margin: 62px auto 0 auto;
  display: flex;
  justify-content: space-between;
}

.article-container-left {
  background-color: #fff;
  width: 1050px;
  padding: 32px;
}

.article-container-right {
  background-color: #fff;
  width: 300px;
  padding: 16px;
}

.article-title {
  font-size: 30px;
  font-weight: 700;
  word-break: break-word;
  margin-bottom: 15px;
  display: inline-block;
}

.article-tag {
  margin-left: 30px;
  margin-right: 15px;
}

.author-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  font-size: 13px;
}

.author {
  display: flex;
  align-items: center;
}

.author-img {
  display: block;
  border-radius: 50%;
  border: 1px solid #eee;
  min-width: 50px;
  min-height: 50px;
  width: 50px;
  height: 50px;
}

.author-img-icon {
  font-size: 25px;
  margin-top: 10px;
}

.author-top {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.author-username {
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-right: 10px;
}

.follow-btn {
  border-color: #32b16c;
  color: #32b16c;
}

.follow-btn:hover,
.follow-btn:focus {
  border-color: #32b16c;
  background-color: #32b16c;
  color: #fff;
}

.article-time {
  color: #969696;
}

.article-comment-container {
  width: 1050px;
  margin: 0 auto 0px auto;
  display: flex;
  justify-content: space-between;
}

.article-comment-body {
  width: 1050px;
  margin-bottom: 100px;
}

.article-comment-body > div {
  margin-bottom: -20px;
}

.article-comment {
  width: 1050px;
}

.submit-comment-btn {
  float: right;
  background-color: #32b16c;
  border-color: #32b16c;
}

.submit-comment-btn:hover,
.submit-comment-btn:focus {
  color: #fff;
  background-color: #1e9654;
  border-color: #1e9654;
}

.delete-btn {
  color: red;
}

.user-info-comment {
  cursor: pointer;
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

.following-btn {
  border-color: #32b16c;
  background-color: #32b16c;
  color: #fff;
}

.delete-article-btn {
  color: red;
  float: right;
}

.article-html-body {
  overflow: hidden;
}

@media screen and (max-width: 751px) {
  .pageBody {
    min-width: 100vw;
  }
  .article-container-body {
    padding: 0;
  }
  .article-container {
    max-width: 100vw;
  }
  .article-title {
    font-size: 20px;
    font-weight: 700;
    word-break: break-word;
    margin-bottom: 15px;
    display: inline-block;
  }
  .delete-article-btn {
    margin-top: 10px;
  }
  .article-container {
    max-width: 100vw;
  }
  .article-container-left {
    max-width: 100vw;
  }
  .article-comment-container {
    max-width: 100vw;
  }
  .article-comment-body {
    max-width: 100vw;
    margin-bottom: 100px;
  }
  .article-comment-body > div {
    padding: 0 15px;
    max-width: 100vw;
  }
  .article-comment-body > div:first-child {
    padding: 0 15px 0 3px;
  }
  .article-title {
    max-width: 200px;
  }
  .article-tag {
    margin-left: 10px;
    margin-right: 15px;
  }
}
</style>
