<template>
  <div>
    <a-layout>
      <a-layout>
        <a-layout-content class="content">
          <a-list class="article" itemLayout="vertical" size="large" :split="false">
            <a-list-item>
              <template slot="actions">
                <span>
                  <a-icon type="eye" />
                  {{article.views}}
                </span>
                <span>
                  <a-icon type="message" />
                  {{article.comment_count}}
                </span>
                <span>
                  <a-icon type="calendar" />
                  {{moment(article.created_at).format('YYYY年MM月DD日')}}
                </span>
                <ArticleMore v-if="more" :articleId="articleId"></ArticleMore>
              </template>
              <a-list-item-meta>
                <h1 slot="title">{{article.title}}</h1>
              </a-list-item-meta>
              <div v-if="article.labels && article.labels.length > 0">
                <a-tag v-for="tag in article.labels" :key="tag.id" color="blue">{{ tag.label }}</a-tag>
              </div>
            </a-list-item>
            <div class="article-detail">
              <mavon-editor
                class="md center"
                :ishljs="mdSetting.heightLight"
                :value="article.content"
                :subfield="mdSetting.subfield"
                :defaultOpen="mdSetting.defaultOpen"
                :toolbarsFlag="mdSetting.toolbarsFlag"
                :editable="mdSetting.editable"
                :scrollStyle="mdSetting.scrollStyle"
              ></mavon-editor>
            </div>
            <SubmitComment class="article-comments" :articleId="articleId"></SubmitComment>
            <Comments class="article-comments" :articleId="articleId"></Comments>
          </a-list>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import Articl from "@/services/article";
import Comments from "@/components/Comments";
import ArticleMore from "@/components/ArticleMore";
import SubmitComment from "@/components/SubmitComment";
import eventBus from "@/common/eventBus";
import moment from "moment";
import { Token } from "@/store";

export default {
  name: "Post",
  components: { Comments, ArticleMore, SubmitComment },
  async created() {
    await this.getArticle();
  },
  mounted() {
    eventBus.$on("onArticleDeleted", () => {
      window.location.href = "/";
    });
  },
  data() {
    return {
      articleId: this.$route.params.id,
      article: {},
      articleList: [],
      isNotFound: false,
      mdSetting: {
        subfield: false, // 单双栏模式
        defaultOpen: "preview",
        editable: false,
        toolbarsFlag: false,
        scrollStyle: true,
        heightLight: true
      },
      more: Token.checkToken(),
      moment
    };
  },
  methods: {
    async getArticle() {
      let res = await Articl.getArticle(this.articleId);
      if (res.ok) {
        this.article = res.data;
        this.articleList = [this.article];
      } else {
        this.isNotFound = true;
      }
    }
  }
};
</script>

<style scoped>
.content {
  background: white;
}
.article-comments {
  margin-top: 20px;
  width: 80%;
}
.article {
  width: 80%;
  margin: 0 auto;
}
</style>