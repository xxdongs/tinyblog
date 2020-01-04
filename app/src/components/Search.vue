<template>
  <div>
    <a-spin :spinning="fetching">
      <a-input-search class="search" placeholder="搜索（标题或正文）" @search="onSearch" />
    </a-spin>

    <a-modal :afterClose="afterClose" v-model="dialogShow" :destroyOnClose="true">
      <div slot="footer"></div>
      <ArticleSimpleList class="list" icon="search" title="搜索结果" :page="true" :articles="data"></ArticleSimpleList>
    </a-modal>
  </div>
</template>

<script>
import ArticleSimpleList from "@/components/ArticleSimpleList";
import Article from "@/services/article";

export default {
  name: "Search",
  components: { ArticleSimpleList },
  created() {},
  data() {
    return {
      fetching: false,
      dialogShow: false,
      data: []
    };
  },
  methods: {
    onSearch(value) {
      if (!value) return;
      this.fetching = true;
      Article.getArticleList({ key: value }).then(res => {
        if (res.ok) {
          this.data = res.data.results;
          this.dialogShow = true;
        } else {
          this.data = [];
          this.$message.info("暂无相关文章");
        }
        this.fetching = false;
      });
    },
    handleOk() {
      this.dialogShow = false;
    },
    afterClose() {
      
    }
  }
};
</script>

<style scoped>
.search {
  width: 300px;
}

.list {
  margin-top: 24px;
}
</style>