<template>
  <div v-if="labels.length > 0">
    <a-card>
      <span slot="title">
        <a-icon type="tags" />&nbsp;标签
      </span>
      <a-tag class="tag-item" @click="totalClick" :color="total_color">全部</a-tag>
      <a-tag
        class="tag-item"
        v-for="item in labels"
        :key="item.label"
        :color="item.id === select_tag ? 'blue' : ''"
        @click="tagClick(item.id)"
      >{{item.label}}</a-tag>
      <a-tag class="tag-item" :color="untag_color" @click="untagClick">未标签</a-tag>
    </a-card>
  </div>
</template>

<script>
import Label from "@/services/label";
import eventBus from "@/common/eventBus";

export default {
  name: "LabelsBoundArticle",
  async created() {
    await this.getLabels();
  },
  mounted() {
    eventBus.$on("onArticleDeleted", () => {
      this.getLabels();
    });
  },
  data() {
    return {
      labels: [],
      total_color: "blue",
      untag_color: "",
      select_tag: -1
      // count: {}
    };
  },
  methods: {
    async getLabels() {
      Label.getAllLabels().then(res => {
        if (res.ok) {
          this.labels = res.data.results;
          // this.count = res.data.count;
        }
      });
    },
    tagClick(label_id) {
      this.$emit("onTagClick", label_id);
      this.total_color = "";
      this.untag_color = "";
      this.labels.forEach(e => {
        if (e.id === label_id) {
          this.select_tag = label_id;
        }
      });
    },
    untagClick() {
      this.select_tag = -1;
      this.$emit("onTagClick", -1);
      this.untag_color = "blue";
      this.total_color = "";
    },
    totalClick() {
      this.select_tag = -1;
      this.$emit("onTagClick", null);
      this.total_color = "blue";
      this.untag_color = "";
    }
  }
};
</script>

<style scoped>
.tag-item {
  /* margin-left: 12px; */
  margin-bottom: 6px;
}
</style>