<template>
  <div>
    <a-menu class="header" v-model="current" mode="horizontal" @click="handleSelect">
      <a-menu-item key="home" style="float: left">
        <a-icon type="home" />首页
      </a-menu-item>
      <a-menu-item key="timeline" style="float: left">
        <a-icon type="calendar" />时间线
      </a-menu-item>
      <!-- <a-menu-item key="about">
        <a-icon type="user" />关于
      </a-menu-item>-->
      <Search v-if="!isPost" class="search"></Search>
      <HeaderAvatar class="user-avatar"></HeaderAvatar>
    </a-menu>
    <router-view />
  </div>
</template>

<script>
import HeaderAvatar from "@/components/HeaderAvatar";
import Search from "@/components/Search";

export default {
  name: "Index",
  components: { HeaderAvatar, Search },
  created() {
    let name = this.$route.name;
    console.log("name " + name);
    if (name === "post") {
      this.isPost = true;
    }
    if (name === "home") {
      this.current = ["home"];
    } else if (name === "about") {
      this.current = ["about"];
    } else if (name === "timeline") {
      this.current = ["timeline"];
    }
  },
  data() {
    return {
      current: ["article"],
      BLOG_NAME: process.env.VUE_APP_BLOG_NAME,
      isPost: false
    };
  },
  methods: {
    goIndex() {
      this.$router.replace("/");
    },
    goAbout() {
      this.$router.push("/about");
    },
    handleSelect(item) {
      this.current = [item.key];
      let path = "";
      if ("home" === item.key) {
        path = "/";
        this.isPost = false;
      } else if ("timeline" === item.key) {
        path = "/timeline";
        this.isPost = false;
      } else if ("about" === item.key) {
        path = "/about";
        this.isPost = false;
      }
      this.$router.push(path);
    }
  }
};
</script>

<style scoped>
.header {
  background-color: rgb(245, 245, 245);
  height: 48px;
  color: black;
  font-size: 14px;
}

.header-font-size {
  font-size: 14px;
}
.user-avatar {
  float: right;
  margin-right: 36px;
}
.search {
  float: left;
  margin-left: 26px;
}
</style>
