<template>
  <div class="container">
    <a-popconfirm
      v-for="tag in tags"
      title="确认删除此标签吗"
      @confirm="confirmDelete(tag.id)"
      @cancel="cancelDelete(tag.id)"
      :visible="tag.popup"
      okText="确认"
      cancelText="取消"
      :key="tag.id"
    >
      <a-tag class="tags" :color="tag.color" closable @close="handleClose(tag.id)">{{tag.label}}</a-tag>
    </a-popconfirm>
    <a-input
      v-if="inputVisible"
      ref="input"
      type="text"
      size="small"
      :style="{ width: '78px' }"
      :value="inputValue"
      @change="handleInputChange"
      @blur="handleInputBlur"
      @keyup.enter="handleInputConfirm"
    />
    <a-tag v-else @click="showInput" style="background: #fff; borderStyle: dashed;">
      <a-icon type="plus" />新建标签
    </a-tag>
  </div>
</template>

<script>
import Label from "@/services/label";

export default {
  name: "Tag",
  data() {
    return {
      tags: [],
      inputVisible: false,
      inputValue: "",
      colors: ["red", "orange", "green", "cyan", "blue", "purple"],
      notFound: false
    };
  },
  async created() {
    await this.getTags();
  },
  methods: {
    async getTags() {
      let res = await Label.getTags();
      if (res.ok) {
        let results = res.data.results;
        let i = 0;
        for (let l of results) {
          if (i === this.colors.length) i = 0;
          l.color = this.colors[i];
          l.popup = false;
          i++;
        }
        this.tags = results;
      } else {
        this.notFound = true;
      }
    },
    handleClose(tagId) {
      window.event.preventDefault();
      this.tags.forEach(tag => {
        if (tag.id === tagId) tag.popup = true;
      });
    },
    confirmDelete(tagId) {
      Label.deletTag(tagId).then(res => {
        if (res.ok) {
          this.tags = this.tags.filter(tag => tag.id != tagId);
        } else {
          this.$message.error("删除失败！");
        }
        this.tags.forEach(tag => {
          if (tag.id === tagId) tag.popup = false;
        });
      });
    },
    cancelDelete(tagId) {
      this.tags.forEach(tag => {
        if (tag.id === tagId) tag.popup = false;
      });
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(function() {
        this.$refs.input.focus();
      });
    },
    handleInputChange(e) {
      this.inputValue = e.target.value;
    },
    handleInputBlur() {
      this.inputVisible = false;
    },
    handleInputConfirm() {
      if (this.inputValue === "") {
        this.$message.warning("标签不能为空");
        return;
      }
      Label.addTag(this.inputValue).then(res => {
        if (res.ok) {
          this.getTags();
        } else {
          this.$message.error("标签已存在");
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 24px;
}
.tags {
  margin-bottom: 10px;
}
</style>
