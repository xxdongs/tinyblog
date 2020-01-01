<template>
  <div>
    <a-layout>
      <a-layout-sider width="256" style="background: #fff">
        <LabelsBoundArticle class="my-sider" @onTagClick="onTagClick"></LabelsBoundArticle>
        <ArticleSimpleList class="my-sider" title="热门文章" icon="tags" :articles="hotArticles"></ArticleSimpleList>
      </a-layout-sider>
      <a-layout>
        <a-layout-content style="background: #fff">
          <ArticleList class="my-articles" :clickedLabel="clickedLabel"></ArticleList>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import LabelsBoundArticle from "@/components/LabelsBoundArticle";
import ArticleList from "@/components/ArticleList";
import ArticleSimpleList from "@/components/ArticleSimpleList";
import Article from "@/services/article";

export default {
  name: "Home",
  components: { LabelsBoundArticle, ArticleList, ArticleSimpleList },
  created() {
    this.getHotArticles();
  },
  data() {
    return {
      labels: [],
      clickedLabel: "",
      hotArticles: []
    };
  },
  methods: {
    onTagClick(label_id) {
      this.clickedLabel = label_id;
    },
    getHotArticles() {
      Article.getHotArticles().then(res => {
        if (res.ok) {
          this.hotArticles = res.data.results;
        }
      });
    }
  }
};
</script>

<style scoped>
.my-sider {
  margin-top: 24px;
  margin-left: 12px;
}
.my-articles {
  margin-top: 12px;
  margin-left: 24px;
  margin-right: 24px;
}
</style>