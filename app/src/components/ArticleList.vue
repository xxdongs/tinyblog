<template>
  <div class="container">
    <a-list
      v-if="articles.length >= 0"
      itemLayout="vertical"
      size="large"
      :dataSource="displayArticles"
    >
      <a-list-item slot="renderItem" slot-scope="item" :key="item.id">
        <template slot="actions">
          <span>
            <a-icon type="eye" style="margin-right: 8px" />
            {{item.views}}
          </span>
          <span>
            <a-icon type="message" style="margin-right: 8px" />
            {{item.comment_count}}
          </span>
          <span>
            <a-icon type="calendar" style="margin-right: 8px" />
            {{moment(item.created_at).format('YYYY年MM月DD日')}}
          </span>
          <ArticleMore v-if="inAdmin" :articleId="item.id" />
        </template>
        <a-list-item-meta>
          <a slot="title" target="_blank" :href="'/post/'.concat(item.id)">{{item.title}}</a>
        </a-list-item-meta>
        <div v-if="item.labels && item.labels.length > 0">
          <a-tag v-for="tag in item.labels.split(',')" :key="tag" color="blue">{{ tag }}</a-tag>
        </div>
      </a-list-item>
      <a-pagination
        v-if="articles.length > pageSize"
        class="article-page"
        :pageSize.sync="pageSize"
        :defaultCurrent="currentPage"
        :total="articles.length"
        @change="handleCurrentChange"
      />
    </a-list>
  </div>
</template>

<script>
import Article from "@/services/article";
import ArticleMore from "@/components/ArticleMore";
import moment from "moment";
import { Token } from "@/store";

export default {
  name: "ArticleList",
  async created() {
    await this.getArticleList();
  },
  props: ["clickedLabel"],
  components: { ArticleMore },
  data() {
    return {
      articles: [],
      pageSize: 10,
      currentPage: 1,
      more: Token.checkToken(),
      inAdmin: this.$route.name === "articleList",
      moment
    };
  },
  computed: {
    displayArticles: function() {
      let start = (this.currentPage - 1) * this.pageSize;
      let offset = this.articles.length % this.pageSize;
      let end =
        offset === 0 || start + this.pageSize < this.articles.length
          ? start + this.pageSize
          : start + offset;
      return this.articles.slice(start, end);
    }
  },
  watch: {
    clickedLabel: {
      deep: true,
      async handler(newVal) {
        await this.getArticleList(newVal);
      }
    }
  },
  methods: {
    async getArticleList(label_id) {
      let res = await Article.getArticleList(label_id);
      let ar = [];
      if (res.ok) {
        ar = res.data.results;
      }
      this.articles = ar;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  }
};
</script>

<style scoped>
.article-page {
  margin-top: 24px;
  margin-bottom: 24px;
  text-align: center;
}
</style>