<template>
  <div class="comment-form">
    <a-comment>
      <a-avatar class="avatar" slot="avatar" :src="avatar" alt="Han Solo" />
      <div slot="content">
        <a-textarea
          @focus="onFocus"
          @blur="onBlur"
          placeholder="输入评论..."
          :autosize="true"
          @change="handleChangeContent"
          :value="content"
        ></a-textarea>
        <a-button
          v-if="!replyId && (focus || (!focus && content))"
          class="submit"
          htmlType="submit"
          :loading="submitting"
          @click="submitForm"
          type="primary"
        >添加评论</a-button>

        <a-button @click="cancel" class="cancel" v-if="replyId" type="defalut">取消</a-button>
        <a-button
          v-if="replyId"
          class="submit"
          htmlType="submit"
          :loading="submitting"
          @click="submitForm"
          type="primary"
        >回复</a-button>
      </div>
    </a-comment>
  </div>
</template>

<script>
import Comment from "@/services/comment";
import eventBus from "@/common/eventBus";
import { Token } from "@/store";
import anonymousIcon from "@/assets/anonymous-avatar.svg";
import userIcon from "@/assets/user-avatar.svg";

export default {
  name: "SubmitComment",
  data() {
    return {
      submitting: false,
      content: "",
      token: Token.checkToken(),
      avatar: this.userId != 0 ? userIcon : anonymousIcon,
      focus: false
    };
  },
  props: {
    articleId: {
      required: true
    },
    replyId: {
      default: undefined
    },
    userId: {
      default: 0
    }
  },
  methods: {
    cancel() {
      eventBus.$emit("onAddCommentCancel", this.replyId);
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
      if (this.userId != 0) {
        data.user_id = this.userId;
      }

      Comment.addComment(data).then(res => {
        this.submitting = false;
        if (res.ok) {
          this.$message.success("评论成功");
          this.resetForm();
          eventBus.$emit("onAddCommentSuc", this.replyId);
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
    },
    onFocus() {
      this.focus = true;
    },
    onBlur() {
      this.focus = false;
    }
  }
};
</script>

<style scoped>
.avatar {
  margin-top: 5px;
}
.submit {
  margin-top: 5px;
}
.cancel {
  margin-top: 5px;
  margin-right: 10px;
}
</style>