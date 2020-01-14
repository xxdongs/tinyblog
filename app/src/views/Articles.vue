<template>
  <div>
    <!-- <a-tabs defaultActiveKey="1" class="setting-tabs">
      <a-tab-pane key="1">
        <span slot="tab">
          <a-icon type="eye" />公开文章
        </span>
        <ArticleList />
      </a-tab-pane>
      <a-tab-pane key="2">
        <span slot="tab">
          <a-icon type="eye-invisible" />私密文章
        </span> -->
        <ArticleList />
      <!-- </a-tab-pane> -->
    <!-- </a-tabs> -->
  </div>
</template>

<script>
import ArticleList from "@/components/ArticleList";
export default {
  name: "Articles",
  components: { ArticleList }
};
</script>

<style scoped>
</style>
