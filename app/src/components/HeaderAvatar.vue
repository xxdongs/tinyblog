<template>
  <div>
    <a-dropdown placement="bottomLeft" v-if="token">
      <a-avatar class="user-avatar" icon="user" :src="avatar"></a-avatar>
      <a-menu slot="overlay" @click="handleMenuClick">
        <a-menu-item v-if="inIndex" key="1">
          <a-icon type="user" />管理
        </a-menu-item>
        <a-menu-item key="2" v-else>
          <a-icon type="home" />首页
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="logout" />登出
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-button @click="login" type="link" v-else>登录</a-button>
  </div>
</template>

<script>
import { getInfo } from "@/services/user";
import { Token } from "@/store";
import eventBus from "@/common/eventBus";
import userIcon from "@/assets/user-avatar.svg";

export default {
  name: "HeaderAvatar",
  mounted() {
    eventBus.$on("onAvatarUpdateDone", avatar => (this.avatar = avatar));
  },
  created() {
    let name = this.$route.name;
    console.log(name);
    if ("home" === name || "post" === name) {
      this.inIndex = true;
    } else {
      this.inIndex = false;
    }

    if (this.token) {
      getInfo().then(res => {
        if (res.ok) {
          if (res.data.avatar) this.avatar = res.data.avatar;
          eventBus.$emit("onUserInfoDone", res.data);
        }
      });
    }
  },
  data() {
    return {
      avatar: userIcon,
      inIndex: false,
      token: Token.checkToken()
    };
  },
  methods: {
    logout() {
      Token.removeToken();
    },
    handleMenuClick(e) {
      console.log("click left button", e);
      if (e.key === "1") {
        this.$router.push({ path: "/admin" });
      } else if (e.key === "2") {
        this.$router.push({ path: "/" });
      } else if (e.key === "3") {
        Token.removeToken();
        this.$router.push({ path: "/login" });
      }
    },
    login() {
      this.$router.push({ path: "/login" });
    }
  }
};
</script>

<style scoped>
.user-avatar {
  cursor: pointer;
}
</style>