<template>
  <div>
    <a-list size="small" bordered :dataSource="articles">
      <a-list-item slot="renderItem" slot-scope="item">
        <a target="_blank" :href="'/post/'.concat(item.id)">{{item.title}}</a>
        <a-badge
          class="views-item"
          :count="item.views"
          :overflowCount="overflowCount"
          :numberStyle="{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
        />
      </a-list-item>
      <span slot="header">
        <a-icon :type="icon"></a-icon>
        &nbsp;{{ title }}
      </span>
    </a-list>
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
      required: true
    }
  },
  data() {
    return {
      overflowCount: 999999
    };
  }
};
</script>

<style scoped>
.views-item {
  margin-left: 6px;
}
</style>