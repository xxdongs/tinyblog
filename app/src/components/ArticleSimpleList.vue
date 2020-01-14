<template>
  <div>
    <a-list size="small" bordered :dataSource="page ? displayArticles : articles">
      <a-list-item slot="renderItem" slot-scope="item">
        <a target="_blank" :href="'/post/'.concat(item.id)">{{item.title}}</a>
        <span class="views" v-if="item.views > 0">
          <a-icon type="eye" />
          {{item.views}}
        </span>
      </a-list-item>
      <span v-if="title" slot="header">
        <a-icon :type="icon"></a-icon>
        &nbsp; {{ title }}
      </span>
    </a-list>
    <a-pagination
      v-if="page"
      class="article-page"
      :pageSize.sync="pageSize"
      :defaultCurrent="currentPage"
      :total="articles.length"
      @change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: "ArticleSimpleList",
  props: {
    articles: {
      required: true
    },
    title: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    page: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageSize: 5,
      currentPage: 1
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
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  }
};
</script>

<style scoped>
.article-page {
  margin-top: 24px;
  text-align: center;
}
.views {
  margin-left: 5px;
}
</style>