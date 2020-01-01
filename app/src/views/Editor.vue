<template>
  <div>
    <a-row class="editor-title">
      <a-col :span="12">
        <a-input @change="handleChangeTitle" :value="title" placeholder="请输入文章标题" />
      </a-col>
      <a-col :span="1" :offset="9">
        <el-popover placement="bottom" title="标签" trigger="click">
          <LabelBind :activeLabels="activeLabels" @onTagsSelected="onTagsSelected"></LabelBind>
          <a-button slot="reference" icon="tags" shape="circle" type="default"></a-button>
        </el-popover>
      </a-col>
      <a-col :span="2">
        <a-button icon="check" type="primary" @click="publishArticle">{{publishDescription}}</a-button>
      </a-col>
    </a-row>
    <a-row>
      <mavon-editor
        class="editor-body"
        v-model="content"
        @imgAdd="imgAdd"
        :placeholder="contentPlaceholder"
        ref="md"
      ></mavon-editor>
    </a-row>
  </div>
</template>

<script>
import LabelBind from "@/components/LabelBind";
// import { getQiniuToken, uploadImage } from "@/services/qiniu";
import Http from "@/services/http";
import Article from "@/services/article";
// import config from "@/common/config";

export default {
  name: "Editor",
  components: { LabelBind },
  async created() {
    // await this.getQiniuToken();
    if (this.articleId) {
      await this.getArticle();
      this.publishDescription = "更新";
    }
  },
  data() {
    return {
      articleId: this.$route.params.id,
      content: "",
      title: "",
      label_ids: [],
      contentPlaceholder: "开始写作吧",
      // qiniuToken: "",
      publishDescription: "发布",
      article: null,
      activeLabels: [],
      uploadAction: "/api/file/upload",
    };
  },
  methods: {
    async publishArticle() {
      console.log("publish article");
      if (this.title === "") {
        this.$message.warning("标题不能为空");
        return;
      }
      if (this.content === "") {
        this.$message.warning("内容不能为空");
        return;
      }
      if (this.articleId) {
        await this.editArticle();
      } else {
        await this.addArticle();
      }
    },
    async editArticle() {
      let res = await Article.updateArticle(this.articleId, {
        title: this.title,
        content: this.content,
        label_ids: this.label_ids
      });
      if (res.ok) {
        this.$message.success("更新文章成功");
        window.location.href = "/post/".concat(this.articleId);
      } else {
        this.$message.error("更新文章出错");
      }
    },
    async addArticle() {
      let res = await Article.addArticle({
        title: this.title,
        content: this.content,
        label_ids: this.label_ids
      });
      if (res.ok) {
        this.$message.success("发布文章成功");
        window.location.href = "/post/".concat(res.data.id);
      } else {
        this.$message.error("发布文章出错");
      }
    },
    // async getQiniuToken() {
    //   let res = await getQiniuToken();
    //   if (res.ok) {
    //     this.qiniuToken = res.data.token;
    //   }
    // },
    async getArticle() {
      let res = await Article.getArticle(this.articleId);
      if (res.ok) {
        this.article = res.data;
        this.title = this.article.title;
        this.content = this.article.content;
        this.activeLabels = this.article.labels
          ? this.article.labels.map(v => v.id)
          : [];
        console.log(this.activeLabels);
      }
    },
    onTagsSelected(data) {
      this.label_ids = data;
    },
    async imgAdd(pos, file) {
      // let res = await uploadImage(file, this.qiniuToken);
      // if (res.ok) {
      //   this.$refs.md.$img2Url(pos, config.qiniuUrl.concat(res.data.key));
      // }
      Http.upload(file, this.uploadAction).then(res => {
        if (!res.ok) {
          this.$message.error("上传失败");
          return;
        }
        this.$refs.md.$img2Url(
          pos,
          `${process.env.VUE_APP_SERVER}/${res.data.avatar}`
        );
      });
    },
    handleChangeTitle(e) {
      this.title = e.target.value;
    }
  }
};
</script>

<style>
.editor-title {
  margin: 12px;
}

.editor-body {
  min-height: 500px;
}
</style>