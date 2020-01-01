<template>
  <div>
    <a-menu
      type="flex"
      justify="start"
      class="menu"
      v-model="current"
      mode="horizontal"
      @click="handleSelect"
    >
      <!-- <a-menu-item key="index">
        <a-button @click="goIndex" icno="home" type="link">首页</a-button>
      </a-menu-item>-->
      <a-menu-item key="article">
        <a-icon type="file-text" />文章
      </a-menu-item>
      <a-menu-item key="comment">
        <a-icon type="message" />评论
      </a-menu-item>
      <a-menu-item key="setting">
        <a-icon type="setting" />设置
      </a-menu-item>
      <a-menu-item disabled key="write">
        <a-button icon="edit" id="addBtn" type="primary" @click="writeArticle">写文章</a-button>
      </a-menu-item>

      <HeaderAvatar class="user-avatar"></HeaderAvatar>
    </a-menu>

    <router-view class="view" />
  </div>
</template>

<script>
import HeaderAvatar from "@/components/HeaderAvatar";

export default {
  name: "Admin",
  components: { HeaderAvatar },
  data() {
    return {
      current: ["article"]
    };
  },
  created() {
    let name = this.$route.name;
    if (name === "admin") {
      this.$router.push("/");
    } else if (name === "comments") {
      this.current = ["comment"];
    } else if (name === "articleList") {
      this.current = ["article"];
    } else if (name === "setting") {
      this.current = ["setting"];
    }
  },
  methods: {
    handleSelect(item) {
      this.current = [item.key];
      let path = "";
      if ("article" === item.key) {
        path = "/admin";
      } else if ("comment" === item.key) {
        path = "/admin/comment";
      } else if ("setting" === item.key) {
        path = "/admin/setting";
      }
      this.$router.push(path);
    },
    writeArticle() {
      console.log("write");
      this.$router.push({ name: "editor_new" });
    },
    goIndex() {
      window.location.href = "/";
    }
  }
};
</script>

<style scoped>
.menu {
  background-color: rgb(245, 245, 245);
}
#addBtn {
  margin-left: 24px;
}
.view {
  margin-left: 24px;
}
.user-avatar {
  float: right;
  margin-right: 36px;
}
</style>
