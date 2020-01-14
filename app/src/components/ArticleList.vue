<template>
  <div class="container">
    <SelectArticle
      class="selection"
      @onTypeSelect="onTypeSelect"
      @onPrivacyClick="onPrivacyClick"
      @onTagClick="onTagClick"
      :inAdmin="inAdmin"
    />
    <a-list v-if="count > 0" itemLayout="vertical" size="large" :dataSource="articles">
      <a-list-item slot="renderItem" slot-scope="item" :key="item.id">
        <template slot="actions">
          <span>
            <a-icon type="eye" />
            {{item.views}}
          </span>
          <span>
            <a-icon type="message" />
            {{item.comment_count}}
          </span>
          <span>
            <a-icon type="calendar" />
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
        class="article-page"
        :pageSize.sync="pageSize"
        :defaultCurrent="currentPage"
        :total="count"
        @change="handleCurrentChange"
        :pageSizeOptions="pageSizeOptions"
        @showSizeChange="onShowSizeChange"
        showSizeChanger
      />
    </a-list>
    <NotFound v-else />
  </div>
</template>

<script>
import Article from "@/services/article";
import ArticleMore from "@/components/ArticleMore";
import SelectArticle from "@/components/SelectArticle";
import NotFound from "@/components/NotFound";
import moment from "moment";
import { Token } from "@/store";
import config from "@/common/config";

export default {
  name: "ArticleList",
  async created() {
    await this.getArticleList(null);
  },
  components: { ArticleMore, SelectArticle, NotFound },
  data() {
    return {
      articles: [],
      pageSize: 5,
      currentPage: 1,
      pageSizeOptions: config.pageSizeOptions,
      more: Token.checkToken(),
      inAdmin: this.$route.name === "articles",
      moment,
      latest: true,
      count: 1,
      clickTag: 0,
      isPublic: 1,
      selectType: "desc"
    };
  },
  methods: {
    async getArticleList() {
      let payload = { label_id: this.clickTag };
      if (this.selectType === "desc" || this.selectType === "asc") {
        payload.order_by = this.selectType;
      } else if (this.selectType === "views") {
        payload.by_views = 1;
      }
      let res = await Article.getArticleList(
        payload,
        this.isPublic,
        (this.currentPage - 1) * this.pageSize,
        this.pageSize
      );
      if (res.ok) {
        this.articles = res.data.results;
        this.count = res.data.count;
      } else {
        this.articles = [];
        this.count = 0;
      }
    },
    async handleCurrentChange(val) {
      this.currentPage = val;
      await this.getArticleList();
    },
    async onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
      await this.getArticleList();
    },
    async onTagClick(tag) {
      this.clickTag = tag;
      await this.getArticleList();
    },
    async onPrivacyClick(isPublic) {
      this.isPublic = isPublic;
      await this.getArticleList();
    },
    async onTypeSelect(type) {
      this.selectType = type;
      await this.getArticleList();
    }
  }
};
</script>

<style scoped>
.article-page {
  margin-bottom: 24px;
  margin-top: 24px;
  text-align: center;
}
.selection {
  margin-top: 12px;
}
</style>