<template>
  <div>
    <a-layout>
      <a-layout style="background: #fff;">
        <a-layout-content class="my-articles">
          <ArticleList></ArticleList>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import ArticleList from "@/components/ArticleList";

export default {
  name: "Home",
  components: { ArticleList }
};
</script>

<style scoped>
.my-articles {
  width: 70%;
  margin: 0 auto;
}
</style>