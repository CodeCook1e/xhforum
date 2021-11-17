<!--
 * @Author: qiuqi
 * @Date: 2021-09-25 15:40:57
 * @LastEditTime: 2021-11-17 13:24:37
 * @LastEditors: Please set LastEditors
 * @Description: 我的资料页面
 * @FilePath: \xh_forum\src\pages\Profile\profile.vue
-->
<template>
  <div class="forumBody">
    <Narbar ref="mychild"></Narbar>
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
            <input
              type="file"
              accept="image/*"
              name="uploader-input"
              class="uploader-file"
              id="upload"
              @change="(event) => updateImage(event)"
            />
            <div class="update-image-tip">
              <div>点击修改头像</div>
            </div>
          </div>
          <div class="info-name">
            <span>{{ userInfo.username }}</span>
          </div>
          <div class="info-bio">
            <span>个人简介：{{ userInfo.bio }}</span>
          </div>
          <div class="info-operation">
            <a @click="editMyProfile">编辑个人资料</a>
          </div>
        </div>
      </div>
      <!-- 文章 -->
      <div class="userArticleContainer">
        <div>
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="我发布的帖子">
              <div class="article-list-container">
                <a-list
                  item-layout="vertical"
                  :pagination="pagination"
                  :data-source="myArticleList"
                >
                  <a-list-item
                    slot="renderItem"
                    key="item._id"
                    slot-scope="article"
                  >
                    <div class="article-preview">
                      <div class="article-meta">
                        <div>
                          <a-avatar
                            class="user-img"
                            :src="article.author.image || defaultImgSrc"
                            alt="用户头像"
                            @click="getUserProfile(article.author._id)"
                          />
                          <div class="user-info">
                            <span
                              class="author"
                              @click="getUserProfile(article.author._id)"
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
                      <a-popconfirm
                        title="此操作将永久删除此文章，确定删除?"
                        okText="确定"
                        cancelText="取消"
                        @confirm="() => deleteArticle(article._id)"
                      >
                        <a class="delete-article-btn">删除</a>
                      </a-popconfirm>
                      <a-tag
                        v-if="article.anonymous"
                        color="red"
                        class="anonymous-tag"
                      >
                        匿名发布
                      </a-tag>

                      <a class="preview-link" @click="getArticle(article._id)">
                        <h1 class="article-title">{{ article.title }}</h1>
                        <p class="article-description">
                          {{ article.description }}
                        </p>
                        <span>查看更多...</span>
                      </a>
                    </div>
                  </a-list-item>
                </a-list>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="我收藏的帖子">
              <div class="article-list-container">
                <a-list
                  item-layout="vertical"
                  :pagination="pagination"
                  :data-source="favoritesArticleList"
                >
                  <a-list-item
                    slot="renderItem"
                    key="item._id"
                    slot-scope="article"
                  >
                    <div class="article-preview">
                      <div class="article-meta">
                        <div>
                          <a-avatar
                            class="user-img"
                            :src="article.author.image || defaultImgSrc"
                            alt="用户头像"
                            @click="getUserProfile(article.author._id)"
                          />
                          <div class="user-info">
                            <span
                              class="author"
                              @click="getUserProfile(article.author._id)"
                              >{{ article.author.username }}</span
                            >
                            <span class="date">{{ article.updateAt }}</span>
                          </div>
                        </div>
                        <a-button
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
                  </a-list-item>
                </a-list>
              </div>
            </a-tab-pane>
            <a-tab-pane key="3" tab="我关注的人">
              <div class="follow-list-container">
                <a-list
                  item-layout="vertical"
                  size="large"
                  :pagination="pagination"
                  :data-source="myFollowList"
                >
                  <a-list-item
                    slot="renderItem"
                    key="item._id"
                    slot-scope="item"
                  >
                    <template>
                      <div class="user-list-item">
                        <a-avatar
                          class="user-list-item-img"
                          :src="item.image || defaultImgSrc"
                          alt="用户头像"
                          @click="getUserProfile(item._id)"
                        />
                        <div class="list-item-follow-font">
                          <div
                            class="list-item-username"
                            @click="getUserProfile(item._id)"
                          >
                            {{ item.username }}
                          </div>
                          <div class="list-item-bio" v-if="item.bio">
                            个人简介：{{ item.bio }}
                          </div>
                          <div class="list-item-bio" v-else>
                            该用户暂无个人简介
                          </div>
                          <div class="list-item-otherinfo">
                            加入新华之家时间：{{ item.createAt }}
                          </div>
                        </div>
                        <a-button
                          class="list-follow-button"
                          @click="unfollow(item._id)"
                        >
                          已关注
                        </a-button>
                      </div>
                    </template>
                  </a-list-item>
                </a-list>
              </div>
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

    <!-- 取消关注对话框 -->
    <a-modal
      v-model="unfollowVisible"
      title="取消关注"
      @ok="unfollowOk"
      okText="确认"
      cancelText="取消"
      destroyOnClose
    >
      <span>确定取消关注该用户？</span>
    </a-modal>
  </div>
</template>

<script>
import Narbar from "../../components/Navbar.vue";
import {
  getCurrentUserApi,
  updateCurrentUserApi,
  getArticleListApi,
  getArticleApi,
  favoriteArticleApi,
  unfavoriteArticleApi,
  getProfileApi,
  unfollowUserApi,
  updateImageApi,
  deleteArticleApi,
} from "../../api/api";
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
export default {
  data() {
    return {
      formItemLayout,
      form: this.$form.createForm(this, { name: "updateCurrentUser" }),
      defaultImgSrc:
        "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      // 当前登录的信息
      userInfo: {},
      myArticleParams: {},
      myArticleList: [],
      favoritesArticleList: [],
      // 编辑个人资料对话框
      editMyProfileVisible: false,
      // 取消关注用户对话框
      unfollowVisible: false,
      // 更新个人资料参数
      updateForm: {
        user: {
          username: "",
          bio: "",
          image: "",
        },
      },
      // 取消关注的用户id
      unfollowUserId: "",
      // 文章是否已收藏
      follow: false,
      // 我关注的用户
      myFollowList: [],
      pagination: {
        pageSize: 5,
      },
      // 修改头像参数
      updateImageParam: { user: { image: "" } },
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
        console.log(this.userInfo);
        let nullArr = [];
        this.myFollowList = nullArr;
        this.userInfo.following.map((userId) => {
          getProfileApi(userId).then((res) => {
            console.log(res.data.user);
            res.data.user.createAt = this.$moment(
              res.data.user.createAt
            ).format("YYYY-MM-DD");
            res.data.user.updateAt = this.$moment(
              res.data.user.updateAt
            ).format("YYYY-MM-DD");
            this.myFollowList.push(res.data.user);
            console.log(this.myFollowList);
          });
        });
        this.getMyArticleList();
        this.getFavoritesArticleList();
      });
    },

    // 获取我收藏的文章列表
    getFavoritesArticleList() {
      let nullArr = [];
      this.favoritesArticleList = nullArr;
      this.userInfo.favorites.map((articleId) => {
        console.log(articleId);
        getArticleApi(articleId).then((res) => {
          console.log(res.data.article);
          res.data.article.createAt = this.$moment(
            res.data.article.createAt
          ).format("YYYY-MM-DD HH:mm:ss");
          res.data.article.updateAt = this.$moment(
            res.data.article.updateAt
          ).format("YYYY-MM-DD HH:mm:ss");
          this.favoritesArticleList.push(res.data.article);
        });
      });
    },

    // 获取我发布的文章列表
    getMyArticleList() {
      this.myArticleParams.author = this.userInfo.username;
      getArticleListApi(this.myArticleParams).then((res) => {
        this.myArticleList = res.data.articles;
        this.myArticleList.map((article) => {
          article.createAt = this.$moment(article.createAt).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          article.updateAt = this.$moment(article.updateAt).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          let index = this.userInfo.favorites.indexOf(article._id);
          if (index !== -1) {
            article.isFavorite = true;
          }
        });
        console.log(this.myArticleList);
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
          this.updateForm.user = values;
          await updateCurrentUserApi(this.updateForm).then((res) => {
            this.$message.success("更新个人资料成功！");
            this.getCurrentUser();
            this.$refs.mychild.getCurrentUser();
            this.editMyProfileVisible = false;
          });
        }
      });
    },

    // 跳转到文章详情页面
    getArticle(articleId) {
      window.open(`/article/${articleId}`, "_blank");
      // this.$router.push("/article/" + articleId);
    },

    // 收藏文章
    favoriteArticle(articleId) {
      console.log(articleId);
      favoriteArticleApi(articleId).then((res) => {
        console.log(res);
        this.getMyArticleList();
        this.getCurrentUser();
      });
    },

    // 取消收藏文章
    unfavoriteArticle(articleId) {
      console.log(articleId);
      unfavoriteArticleApi(articleId).then((res) => {
        console.log(res);
        this.getMyArticleList();
        this.getCurrentUser();
      });
    },

    // 跳转到用户的个人资料页面
    getUserProfile(userId) {
      if (this.userInfo._id === userId) {
        this.$router.push("/myprofile/");
      } else {
        window.open(`/profile/${userId}`, "_blank");
        // this.$router.push("/profile/" + userId);
      }
    },

    // 取消关注用户
    unfollow(userId) {
      this.unfollowUserId = userId;
      this.unfollowVisible = true;
    },

    unfollowOk() {
      unfollowUserApi(this.unfollowUserId).then((res) => {
        console.log(res);
        this.getCurrentUser();
        this.unfollowVisible = false;
      });
    },

    // 删除文章
    deleteArticle(articleId) {
      console.log(articleId);
      deleteArticleApi(articleId).then((res) => {
        this.$message.success("删除文章成功！");
        this.getCurrentUser();
      });
    },

    // 修改头像
    updateImage(event) {
      console.log(event.currentTarget.files[0]);
      this.updateImageParam.user.image = event.currentTarget.files[0];
      let forms = new FormData();
      forms.append("file", event.currentTarget.files[0]);
      updateImageApi(forms).then((res) => {
        console.log(res);
        this.$message.success("修改头像成功！");
        this.getCurrentUser();
        this.$refs.mychild.getCurrentUser();
      });
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

.info-ava-img {
  width: 100px;
  height: 100px;
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

.user-list-item {
  align-items: center;
  font-size: 14px;
  color: #7b7e86;
  display: flex;
  border-bottom: 1px solid #f6f6f6;
  padding: 16px 0;
  justify-content: flex-start;
}

.user-list-item:hover {
  background-color: rgb(235, 235, 235);
}

.user-list-item-img {
  cursor: pointer;
  width: 72px;
  height: 72px;
}

.list-item-follow-font {
  flex-shrink: 0;
  padding-left: 20px;
  flex-grow: 1;
}

.list-item-username {
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  color: #191c22;
  line-height: 22px;
}

.list-item-bio {
  font-size: 14px;
  font-weight: 400;
  color: #4e5158;
  line-height: 20px;
}

.list-item-otherinfo {
  font-size: 14px;
  font-weight: 400;
  color: #7b7e86;
  line-height: 20px;
}

.list-follow-button {
  background-color: #32b16c;
  color: #fff;
}

.list-follow-button:hover,
.list-follow-button:focus {
  border-color: #32b16c;
}

.uploader-file {
  opacity: 0;
  position: absolute;
  top: 94px;
  margin: 0 auto;
  width: 100px;
  height: 100px;
  cursor: pointer;
  z-index: 100;
}

.update-image-tip {
  opacity: 0;
  position: absolute;
  top: 94px;
  margin: 0 auto;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  z-index: 10;
  background-color: rgba(155, 155, 155, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.1s;
}

.update-image-tip > div {
  font-size: 12px;
  color: #fff;
  text-align: center;
}

.uploader-file:hover + .update-image-tip {
  opacity: 1;
  cursor: pointer;
}

.delete-article-btn {
  color: red;
  float: right;
  margin-left: 20px;
}

.anonymous-tag {
  float: right;
}
</style>