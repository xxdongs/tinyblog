<template >
  <div>
    <span @click="confirmEdit">
      <a-icon type="edit" style="margin-right: 8px" />
    </span>
    <a-divider type="vertical" />
    <span style="margin-left: 5px">
      <a-popconfirm title="确认删除此文章吗" @confirm="confirmDelete" okText="确认" cancelText="取消">
        <span>
          <a-icon type="delete" />
        </span>
      </a-popconfirm>
    </span>
  </div>
</template>

<script>
import Article from "@/services/article";
import eventBus from "@/common/eventBus";

export default {
  name: "ArticleMore",
  props: ["articleId"],
  methods: {
    confirmDelete() {
      Article.deleteArticle(this.articleId).then(res => {
        if (res.ok) {
          eventBus.$emit("onArticleDeleted");
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    confirmEdit() {
      this.$router.push({
        name: "editor_edit",
        params: { id: this.articleId }
      });
    }
  }
};
</script>

<style scoped>
</style>