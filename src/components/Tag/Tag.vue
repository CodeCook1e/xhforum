<!--
 * @Author: qiuqi
 * @Date: 2021-10-05 21:04:47
 * @LastEditTime: 2021-10-05 21:06:38
 * @LastEditors: Please set LastEditors
 * @Description: 帖子分类管理
 * @FilePath: \xh_forum\src\components\Tag\Tag.vue
-->
<template>
  <div>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item>帖子管理</a-breadcrumb-item>
      <a-breadcrumb-item>分类列表</a-breadcrumb-item>
    </a-breadcrumb>
    <a-layout-content
      :style="{
        background: '#fff',
        padding: '24px',
        margin: 0,
        minHeight: '280px',
      }"
    >
      分类列表
    </a-layout-content>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>