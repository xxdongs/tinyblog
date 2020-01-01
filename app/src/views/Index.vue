<template>
  <div>
    <a-menu
      type="flex"
      justify="start"
      class="header"
      v-model="current"
      mode="horizontal"
      @click="handleSelect"
    >
      <a-menu-item key="home">
        <a-icon type="home" />首页
      </a-menu-item>
      <a-menu-item key="timeline">
        <a-icon type="calendar" />时间线
      </a-menu-item>
      <!-- <a-menu-item key="about">
        <a-icon type="user" />关于
      </a-menu-item>-->
    <!-- <a-menu-item disabled> -->
    <HeaderAvatar class="user-avatar" v-if="more"></HeaderAvatar>
    <!-- </a-menu-item> -->
    </a-menu>
    <router-view />
  </div>
</template>

<script>
import { Token } from "@/store";
import HeaderAvatar from "@/components/HeaderAvatar";

export default {
  name: "Index",
  components: { HeaderAvatar },
  created() {
    if (this.$route.name === "home") {
      this.current = ["home"];
    } else if (this.$route.name === "about") {
      this.current = ["about"];
    } else if (this.$route.name === "timeline") {
      this.current = ["timeline"];
    }
  },
  data() {
    return {
      current: ["article"],
      BLOG_NAME: process.env.VUE_APP_BLOG_NAME,
      more: Token.checkToken(),
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
      } else if ("timeline" === item.key) {
        path = "/timeline";
      } else if ("about" === item.key) {
        path = "/about";
      }
      this.$router.push(path);
    },
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
</style>
