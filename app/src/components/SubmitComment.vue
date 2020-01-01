<template>
  <div class="comment-form">
    <a-comment>
      <a-avatar slot="avatar" :src="userAvatar" alt="Han Solo" />
      <div slot="content">
        <a-form-item>
          <a-textarea placeholder="内容" :rows="4" @change="handleChangeContent" :value="content"></a-textarea>
        </a-form-item>
        <a-form-item>
          <a-button htmlType="submit" :loading="submitting" @click="submitForm" type="primary">添加评论</a-button>
        </a-form-item>
      </div>
    </a-comment>
  </div>
</template>

<script>
import Comment from "@/services/comment";
import eventBus from "@/common/eventBus";
import faker from "faker";
import { getInfo } from "@/services/user";
import { Token } from "@/store";

export default {
  name: "SubmitComment",
  created() {
    if (this.token) {
      this.getUser();
    } else {
      this.userAvatar = faker.image.avatar();
    }
  },
  data() {
    return {
      submitting: false,
      content: "",
      token: Token.checkToken(),
      userAvatar: "",
      userId: null
    };
  },
  // props: ["articleId",'replyId'],
  props: {
    articleId: {
      required: true
    },
    replyId: {
      default: undefined
    }
  },
  methods: {
    getUser() {
      getInfo().then(res => {
        if (res.ok) {
          this.userAvatar = res.data.avatar;
          this.userId = res.data.id;
        }
      });
    },
    submitForm() {
      if (!this.content) {
        this.$message.info("请填写完整昵称和内容");
        return;
      }
      this.submitting = true;
      let data = {
        article_id: parseInt(this.articleId),
        avatar: this.userAvatar,
        content: this.content
      };
      if (this.replyId) {
        data.reply_id = this.replyId;
      }
      if (this.userId) {
        data.user_id = this.userId;
      }

      Comment.addComment(data).then(res => {
        this.submitting = false;
        if (res.ok) {
          this.$message.success("评论成功");
          this.resetForm();
          eventBus.$emit("onAddCommentSuc");
          return;
        }
        this.$message.error("评论失败");
      });
    },
    resetForm() {
      this.nickname = "";
      this.content = "";
    },
    handleChangeContent(e) {
      this.content = e.target.value;
    },
    handleChangeNickname(e) {
      this.nickname = e.target.value;
    }
  }
};
</script>

<style scoped>
.comment-form {
  margin-top: 24px;
}
</style>