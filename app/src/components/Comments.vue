<template>
  <div>
    <a-drawer title="回复" :width="480" @close="onClose" :visible="replyVisible" placement="left">
      <SubmitComment :articleId="commentArticleId" :replyId="replyId"></SubmitComment>
    </a-drawer>
    <CustomDatePick v-if="more" class="date-pick"></CustomDatePick>
    <a-list v-if="allComments.length > 0" itemLayout="horizontal" :dataSource="displayComments">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-comment :avatar="item.avatar">
          <p slot="content">{{item.content}}</p>
          <a v-if="item.user_id" slot="author">作者</a>

          <a-collapse
            :bordered="false"
            v-if="replyComments.filter(e => e.reply_id===item.id).length > 0"
          >
            <template v-slot:expandIcon="props">
              <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
            </template>
            <a-collapse-panel header="查看回复" class="collapse-panel-style">
              <a-comment
                v-for="reply_item in replyComments.filter(e => e.reply_id===item.id)"
                :key="'reply_'+ reply_item.reply_id"
                :avatar="reply_item.avatar"
              >
                <p slot="content">{{reply_item.content}}</p>
                <a v-if="reply_item.user_id" slot="author">作者</a>
                <template slot="actions" class="actions">
                  <span>
                    <a-tooltip class="action-item" title="删除" v-if="more">
                      <a-icon type="delete" @click="actionClick('delete',reply_item.id)" />
                    </a-tooltip>
                  </span>
                </template>
                <a-tooltip
                  slot="datetime"
                  :title="moment(reply_item.created_at).format('YYYY-MM-DD HH:mm')"
                >
                  <span>{{moment(reply_item.created_at).fromNow()}}</span>
                </a-tooltip>
              </a-comment>
            </a-collapse-panel>
          </a-collapse>

          <template slot="actions" class="actions">
            <span>
              <a
                v-if="more"
                class="action-item"
                target="_blank"
                :href="'/post/'.concat(item.article_id)"
              >{{item.article_title}}</a>
            </span>
            <span>
              <a-tooltip class="action-item" title="删除" v-if="more">
                <a-icon type="delete" @click="actionClick('delete',item.id)" />
              </a-tooltip>
            </span>
            <span class="action-item" @click="actionClick('reply',item.id,item.article_id)">回复</span>
          </template>
          <a-tooltip slot="datetime" :title="moment(item.created_at).format('YYYY-MM-DD HH:mm')">
            <span>{{moment(item.created_at).fromNow()}}</span>
          </a-tooltip>
        </a-comment>
      </a-list-item>
    </a-list>
    <a-pagination
      :pageSize.sync="pageSize"
      class="comment-page"
      :defaultCurrent="currentPage"
      :total="allComments.length"
      @change="handleCurrentChange"
    />
  </div>
</template>

<script>
import Comment from "@/services/comment";
import eventBus from "@/common/eventBus";
import moment from "moment";
import CustomDatePick from "@/components/CustomDatePick";
import SubmitComment from "@/components/SubmitComment";

const startDefault = "1970-01-01";
const endDefault = moment()
  .add(1, "day")
  .format("YYYY-MM-DD");

export default {
  name: "Comments",
  async created() {
    this.getComments();
  },
  components: {
    CustomDatePick,
    SubmitComment
  },
  data() {
    return {
      allComments: [],
      replyComments: [],
      currentPage: 1,
      pageSize: 5,
      moment,
      more: this.$route.name === "comments",
      timeStart: startDefault,
      timeEnd: endDefault,
      loading: true,
      replyVisible: false,
      commentArticleId: 0,
      replyId: 0
    };
  },
  props: ["articleId"],
  computed: {
    displayComments: function() {
      let start = (this.currentPage - 1) * this.pageSize;
      let offset = this.allComments.length % this.pageSize;
      let end =
        offset === 0 || start + this.pageSize < this.allComments.length
          ? start + this.pageSize
          : start + offset;
      return this.allComments.slice(start, end);
    }
  },
  mounted() {
    eventBus.$on("onAddCommentSuc", () => {
      this.replyVisible = false;
      this.getComments();
    });
    eventBus.$on("onDatePickChange", dateStrings => {
      if (dateStrings[0] === "" && dateStrings[1] === "") {
        this.timeStart = startDefault;
        this.timeEnd = endDefault;
      } else {
        this.timeStart = dateStrings[0];
        this.timeEnd = dateStrings[1];
      }
      this.getComments();
    });
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    getComments() {
      this.loading = true;
      if (this.articleId) {
        Comment.getArticleComments(this.articleId).then(res => handler(res));
      } else {
        Comment.getComments(this.timeStart, this.timeEnd).then(res =>
          handler(res)
        );
      }
      let handler = res => {
        if (res.ok) {
          let data = res.data;
          this.allComments = data.filter(e => !e.reply_id);
          this.replyComments = data.filter(e => e.reply_id);
        } else {
          this.allComments = [];
          this.replyComments = [];
        }
        this.loading = false;
      };
    },
    actionClick(type, commentId, articleId) {
      let vue = this;
      if ("delete" === type) {
        this.$confirm({
          title: "确认删除这条评论吗？",
          onOk() {
            Comment.deleteComment(commentId).then(res => {
              if (res.ok) {
                vue.getComments();
                vue.$message.success("删除成功");
              } else {
                vue.$message.success("删除失败");
              }
            });
          },
          onCancel() {}
        });
      } else if (type === "reply") {
        this.replyVisible = true;
        this.commentArticleId = articleId;
        this.replyId = commentId;
      }
    },
    onClose() {
      this.replyVisible = false;
    }
  }
};
</script>

<style scoped>
.input-nickname {
  max-width: 50%;
}

.comment-page {
  text-align: center;
  margin-bottom: 24px;
}
.action-item {
  cursor: pointer;
  font-size: 15px;
}
.actions {
  float: left;
}
.date-pick {
  margin-top: 12px;
}
.item-title {
  margin-right: 12px;
  color: rgba(0, 0, 0, 0.65);
}
.collapse-panel-style {
  border: 0;
}
</style>