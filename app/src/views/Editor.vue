<template>
  <div>
    <div v-if="!notFound">
      <a-row class="editor-title">
        <a-col :span="12">
          <a-input @change="handleChangeTitle" :value="title" placeholder="请输入文章标题" />
        </a-col>
        <a-col :span="1" :offset="8">
          <a-tooltip :title="isPublic === 1 ? '公开' : '私密'" placement="left">
            <a-button
              @click="changePublic"
              :icon="isPublic === 1 ? 'eye' : 'eye-invisible'"
              shape="circle"
              type="default"
            ></a-button>
          </a-tooltip>
        </a-col>
        <a-col :span="1">
          <el-popover placement="bottom" title="标签" trigger="click">
            <LabelBind :activeLabels="activeLabels" @onTagsSelected="onTagsSelected"></LabelBind>
            <a-button slot="reference" icon="tags" shape="circle" type="default"></a-button>
          </el-popover>
        </a-col>
        <a-col :span="2">
          <a-button icon="check" type="primary" @click="publishArticle">{{publishDescription}}</a-button>
        </a-col>
      </a-row>
      <mavon-editor
        class="editor-body"
        :boxShadow="false"
        language="zh-CN"
        v-model="content"
        @imgAdd="imgAdd"
        placeholder="开始写作..."
        :autofocus="false"
        ref="md"
      ></mavon-editor>
    </div>
    <NotFound v-else></NotFound>
  </div>
</template>

<script>
import LabelBind from "@/components/LabelBind";
import NotFound from "@/components/NotFound";
// import { getQiniuToken, uploadImage } from "@/services/qiniu";
import Http from "@/services/http";
import Article from "@/services/article";
// import config from "@/common/config";

export default {
  name: "Editor",
  components: { LabelBind, NotFound },
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
      isPublic: 1,
      label_ids: [],
      // qiniuToken: "",
      publishDescription: "发布",
      activeLabels: [],
      uploadAction: "/api/file/upload",
      notFound: false
    };
  },
  methods: {
    async publishArticle() {
      if (this.title === "") {
        this.$message.warning("标题不能为空");
        return;
      }
      if (this.content === "") {
        this.$message.warning("内容不能为空");
        return;
      }
      let data = {
        title: this.title,
        content: this.content,
        label_ids: this.label_ids,
        public: this.isPublic
      };
      if (this.articleId) {
        await this.editArticle(data);
      } else {
        await this.addArticle(data);
      }
    },
    async editArticle(data) {
      let res = await Article.updateArticle(this.articleId, data);
      if (res.ok) {
        this.$message.success("更新文章成功");
        window.location.href = "/post/".concat(this.articleId);
      } else {
        this.$message.error("更新文章出错");
      }
    },
    async addArticle(data) {
      let res = await Article.addArticle(data);
      if (res.ok) {
        this.$message.success("发布文章成功");
        this.$router.push({ name: "post", params: { id: res.data.id } });
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
      let res = await Article.getArticle(this.articleId, 0);
      if (res.ok) {
        this.title = res.data.title;
        this.content = res.data.content;
        this.isPublic = res.data.public;
        this.activeLabels = res.data.labels
          ? res.data.labels.map(v => v.id)
          : [];
      } else {
        this.notFound = true;
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
    },
    changePublic() {
      if (this.isPublic === 1) {
        this.isPublic = 0;
      } else {
        this.isPublic = 1;
      }
    }
  }
};
</script>

<style>
.editor-title {
  margin: 12px;
}

.editor-body {
  height: 100%;
}
</style>