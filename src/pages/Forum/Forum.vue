<!--
 * @Author: qiuqi
 * @Date: 2021-09-16 22:12:46
 * @LastEditTime: 2021-09-20 19:37:50
 * @LastEditors: Please set LastEditors
 * @Description: 论坛首页
 * @FilePath: \xh_forum\src\pages\Home\Home.vue
-->
<template>
  <div class="forumBody">
    <Narbar></Narbar>
    <div class="forumHomeContainer">
      <div></div>
    </div>
  </div>
</template>

<script>
import Narbar from "../../components/Navbar.vue";
import { getArticleListApi } from "../../api/api";
export default {
  data() {
    return {};
  },
  components: {
    Narbar,
  },
  created() {
    // 获取文章列表
    this.getArticleList();
  },
  methods: {
    // 获取文章列表
    async getArticleList() {
      await getArticleListApi().then((res) => {
        console.log(res);
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
.forumHomeContainer {
  max-width: 1200px;
  box-sizing: border-box;
  margin: 62px auto 0 auto;
}
</style>