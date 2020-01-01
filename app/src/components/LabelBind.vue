<template>
  <div>
    <div class="tag-group">
      <a-tag
        class="all-tags"
        v-for="item in allTags"
        :key="item.id"
        :color="item.effect"
        @click="onTagClick(item.id)"
        :type="item.type"
      >{{ item.label }}</a-tag>
    </div>
    <div class="tag-group">
      <a-input
        placeholder="添加标签"
        class="add-tag"
        type="text"
        size="small"
        :value="newTag"
        @change="handleInputChange"
        @blur="handleInputBlur"
        @keyup.enter="handleInputConfirm"
      />
    </div>
  </div>
</template>

<script>
import Label from "@/services/label";

export default {
  name: "LabelBind",
  async created() {
    await this.getAllLabels();
  },
  data() {
    return {
      newTag: "",
      tagsDescription: "点击选择标签",
      allTags: [],
      selectedIds: []
    };
  },
  props: ["activeLabels"],
  watch: {
    selectedIds: function(data) {
      this.$emit("onTagsSelected", data);
      console.log(this.selectedIds);
    },
    activeLabels: function(val) {
      this.setActiveLabels(val);
    }
  },
  methods: {
    async handleInputBlur() {
      this.newTag = "";
    },
    async handleInputConfirm() {
      if (this.newTag === "") {
        this.$message.warning("标签不能为空");
        return;
      }
      let res = await Label.addLabel(this.newTag);
      if (res.ok) {
        this.allTags.push({
          id: res.data.id,
          label: this.newTag,
          effect: "green"
        });
        this.selectedIds.push(res.data.id);
      } else {
        this.$message.error("标签已存在");
      }
    },
    onTagClick(id) {
      for (let tag of this.allTags) {
        if (tag.id === id) {
          if (tag.effect === "") {
            tag.effect = "green";
            this.selectedIds.push(tag.id);
          } else {
            tag.effect = "";
            this.selectedIds.splice(this.selectedIds.indexOf(tag.id), 1);
          }
        }
      }
    },
    async getAllLabels() {
      let res = await Label.getAllLabels();
      if (res.ok) {
        let results = res.data.results;
        for (let l of results) {
          l.effect = "";
        }
        this.allTags = results;
        this.tagsDescription = "点击选择标签";
      } else {
        this.tagsDescription = "还没有创建标签呢";
      }
    },
    setActiveLabels(val) {
      console.log(val);
      if (this.activeLabels.length > 0) {
        this.allTags.forEach(v => {
          this.activeLabels.forEach(vv => {
            if (vv === v.id) {
              v.effect = "dark";
            }
          });
        });
        this.selectedIds = this.activeLabels;
      }
    },
    handleInputChange(e) {
      this.newTag = e.target.value;
    }
  }
};
</script>

<style scoped>
.all-tags {
  margin-left: 0.5rem;
  margin-top: 0.5rem;
  cursor: pointer;
}

.tagsDescription {
  margin: 0.5rem;
}

.add-tag {
  margin: 0.5rem;
  width: auto;
  vertical-align: bottom;
}
</style>