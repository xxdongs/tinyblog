<template>
  <div>
    <a-form :form="profile">
      <a-form-item label="头像" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-avatar size="large" class="item" :src="avatar" icon="user" />
        <a-upload
          name="avatar"
          listType="text"
          class="upload-btn"
          :showUploadList="false"
          :action="uploadAction"
          :beforeUpload="beforeUpload"
          :customRequest="customRequest"
        >
          <a-button type="primary" size="small">
            <a-icon type="upload" />上传
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="昵称" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input v-decorator="['nickname']" class="item" />
      </a-form-item>

      <a-form-item label="邮箱" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          v-decorator="['email' ,{ rules: [{pattern: emailPattern , message: '邮箱格式错误' }] }]"
          class="item"
        />
      </a-form-item>
      <a-form-item label="城市" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input v-decorator="['city']" placeholder="还没选择城市呢" class="item" />
      </a-form-item>
      <a-form-item label="性别" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-select
          class="item"
          placeholder="选择性别"
          v-decorator="['gender']"
          @change="handleGenderChange"
        >
          <a-select-option value="0">男</a-select-option>
          <a-select-option value="1">女</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="简介" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-textarea
          class="item"
          v-decorator="['summary']"
          placeholder="这个人很懒，什么也没写。"
          :autosize="{ minRows: 3, maxRows: 12 }"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 1 }">
        <a-button @click="handleSubmit" class="item" type="primary" html-type="submit">确认</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import Http from "@/services/http";
import { getInfo, modifyInfo } from "@/services/user";
import config from "@/common/config";
import eventBus from "@/common/eventBus";
import userIcon from "@/assets/user-avatar.svg";
// import { getQiniuToken, uploadImage } from "@/services/qiniu";

export default {
  name: "Profile",
  data() {
    return {
      avatar: userIcon,
      profile: this.$form.createForm(this, { name: "profile" }),
      labelCol: { span: 1 },
      wrapperCol: { span: 6 },
      uploadAction: "/api/file/upload",
      emailPattern: config.emailPattern,
      qiniuToken: ""
    };
  },
  created() {
    this.getProfile();
    // getQiniuToken().then(res => {
    //   if (res.ok) {
    //     this.qiniuToken = res.data.token;
    //   }
    // });
  },
  methods: {
    handleSubmit() {
      this.profile.validateFields((err, values) => {
        if (!err) {
          let data = {};
          Object.keys(values)
            .filter(k => values[k])
            .forEach(k => (data[k] = values[k]));
          this.updateProfile(data);
        }
      });
    },
    customRequest(files) {
      Http.upload(files.file, this.uploadAction).then(res => {
        if (!res.ok) {
          this.$message.error("上传失败");
          return;
        }
        this.updateProfile({
          avatar: `${process.env.VUE_APP_SERVER}/${res.data.avatar}`
        });
      });
    },
    updateProfile(data) {
      modifyInfo(data).then(res => {
        if (res.ok) {
          this.getProfile();
          this.updateAvatarDone(data);
          this.$message.success(`更新成功`);
          return;
        }
        this.$message.error(`更新失败`);
      });
    },
    updateAvatarDone(data) {
      if (data.avatar) {
        eventBus.$emit("onAvatarUpdateDone", data.avatar);
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      if (!isJPG) {
        this.$message.error("只接受 JPEG 和 JPG 格式");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("图片大小需在2M以下");
        return false;
      }
      return isJPG && isLt2M;
    },
    handleGenderChange(value) {
      this.profile.setFieldsValue({ gender: value });
    },
    getProfile() {
      getInfo().then(res => {
        if (res.ok) {
          this.avatar = res.data.avatar;
          this.profile.setFieldsValue({
            nickname: res.data.nickname,
            email: res.data.email,
            city: res.data.city,
            gender: res.data.gender.toString(),
            summary: res.data.summary
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.item {
  margin-left: 12px;
}
.upload-btn {
  margin-left: 24px;
}
</style>
