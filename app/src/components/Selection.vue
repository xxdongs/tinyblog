<template>
  <div>
    <a-row type="flex" justify="start">
      <a-col :span="1">
        <span
          @click="onSelect('desc')"
          :class="{blueFont: clickType === 'desc'}"
          class="selections"
        >最新</span>
        <a-divider type="vertical" />
      </a-col>
      <a-col :span="1">
        <span
          @click="onSelect('asc')"
          :class="{blueFont: clickType === 'asc'}"
          class="selections"
        >最早</span>
        <a-divider type="vertical" />
      </a-col>
      <a-col :span="1">
        <span
          @click="onSelect('views')"
          :class="{blueFont: clickType === 'views'}"
          class="selections"
        >热门</span>
        <a-divider type="vertical" />
      </a-col>
      <a-col v-if="inAdmin" :span="1">
        <a-select @change="handlePrivacyChange" defaultValue="1" size="small">
          <a-select-option value="1">公开</a-select-option>
          <a-select-option value="0">私密</a-select-option>
        </a-select>
      </a-col>
      <a-col v-if="inAdmin" :span="0.5">
        <a-divider type="vertical" />
      </a-col>
      <a-col :span="3">
        <a-select
          :defaultValue="tags[0].id"
          size="small"
          style="width: 100%"
          @change="handleTagChange"
          placeholder="标签"
        >
          <a-select-option :value="item.id" v-for="item in tags" :key="item.id">{{item.label}}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { Token } from "@/store";
import Label from "@/services/label";

export default {
  name: "Selection",
  created() {
    this.getTags();
  },
  data() {
    return {
      token: Token.checkToken(),
      tags: [],
      clickType: "desc"
    };
  },
  props: {
    inAdmin: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getTags() {
      Label.getTags().then(res => {
        if (res.ok) {
          this.tags = res.data.results;
          this.tags.unshift({ id: 0, label: "全部标签" });
        }
      });
    },
    handlePrivacyChange(value) {
      this.$emit("onPrivacyClick", parseInt(value));
    },
    handleTagChange(value) {
      this.$emit("onTagClick", value);
    },
    onSelect(type) {
      if (this.clickType === type) return;
      this.clickType = type;
      this.$emit("onTypeSelect", type);
    }
  }
};
</script>

<style scoped>
.selections {
  cursor: pointer;
}
.blueFont {
  color: #1890ff;
}
.blackFont {
  color: black;
}
</style>