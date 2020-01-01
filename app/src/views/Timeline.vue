<template>
  <div>
    <div class="content">
      <ArticleSimpleList
        v-for="year in years"
        :key="year"
        :title="year.concat(' 年')"
        icon="calendar"
        :articles="articles[year]"
      ></ArticleSimpleList>
    </div>
    <a-back-top />
  </div>
</template>

<script>
import Article from "@/services/article";
import ArticleSimpleList from "@/components/ArticleSimpleList";

export default {
  name: "Timeline",
  components: { ArticleSimpleList },
  data() {
    return {
      articles: [],
      years: []
    };
  },
  created() {
    Article.getArticleTimeline().then(res => {
      if (res.ok) {
        let tmp = {};
        res.data.results.forEach(e => {
          if (!tmp[e.year]) {
            tmp[e.year] = [];
          }
          tmp[e.year].push({ id: e.id, title: e.title });
        });
        this.articles = tmp;
        this.years = Object.keys(this.articles);
        this.years.sort((x, y) => parseInt(y) - parseInt(x));
      }
    });
  }
};
</script>

<style scoped>
.year-card {
  width: fit-content;
  margin-left: 24px;
}
.article-item {
  font-size: 15px;
  color: rgba(0, 0, 0, 0.65);
}
.article-item-row {
  margin-top: 6px;
}
.content {
  margin-left: 24px;
  margin-top: 24px;
  padding-bottom: 24px;
  width: 300px;
}
</style>