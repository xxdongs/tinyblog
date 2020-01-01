<template>
  <div>
    <a-tabs defaultActiveKey="1" class="setting-tabs">
      <a-tab-pane key="1">
        <span slot="tab">
          <a-icon type="user" />个人资料
        </span>
        <Profile></Profile>
      </a-tab-pane>
      <a-tab-pane key="2">
        <span slot="tab">
          <a-icon type="safety" />密码修改
        </span>
        <Password></Password>
      </a-tab-pane>
      <!-- <a-tab-pane key="3">
        <span slot="tab">
          <a-icon type="global" />网站设置
        </span>
        <SiteSetting></SiteSetting>
      </a-tab-pane> -->
    </a-tabs>
  </div>
</template>

<script>
import Profile from "@/views/Profile";
import Password from "@/views/Password";
// import SiteSetting from "@/views/SiteSetting";
export default {
  name: "Setting",
  components: { Profile, Password },
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style scoped>
</style>
