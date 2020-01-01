<template>
  <div>
    <!-- <a-dropdown placement="bottomRight">
      <a-avatar class="user-avatar" icon="user" :src="avatar"></a-avatar>
      <a-menu slot="overlay">
        <a-menu-item v-if="inIndex">
          <a class="header-font-size" href="/admin">管理</a>
        </a-menu-item>
        <a-menu-item v-else>
          <a class="header-font-size" href="/">主页</a>
        </a-menu-item>
        <a-menu-item>
          <a @click="logout" href="/login" class="header-font-size">登出</a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>-->

    <!-- <a-popover placement="bottom" class="user-avatar">
      <template slot="content">
        <a-menu @click="handleMenuClick">
          <a-menu-item key="1" v-if="inIndex">
            <a-icon type="user" />管理
          </a-menu-item>
          <a-menu-item key="2" v-else>
            <a-icon type="user" />主页
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="user" />登出
          </a-menu-item>
        </a-menu>
      </template>
      <a-avatar icon="user" :src="avatar"></a-avatar>
      <a-icon type="caret-down" />
    </a-popover>-->
    <a-dropdown>
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
      <span>
        <a-avatar class="user-avatar" icon="user" :src="avatar"></a-avatar>
        <a-icon style="margin-left: 6px" type="down" />
      </span>
    </a-dropdown>
  </div>
</template>

<script>
import { getInfo } from "@/services/user";
import { Token } from "@/store";

export default {
  name: "HeaderAvatar",
  created() {
    let name = this.$route.name;
    console.log(name);
    if ("home" === name) {
      this.inIndex = true;
    } else {
      this.inIndex = false;
    }

    getInfo().then(res => {
      if (res.ok) {
        this.avatar = res.data.avatar;
      }
    });
  },
  data() {
    return {
      avatar: "",
      inIndex: false
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
    }
  }
};
</script>

<style scoped>
.user-avatar {
  cursor: pointer;
}
</style>