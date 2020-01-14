<template>
  <div>
    <CustomDatePick v-if="more" class="date-pick"></CustomDatePick>
    <a-list v-if="total > 0" itemLayout="horizontal" :dataSource="allComments">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-comment :avatar="anonymousIcon">
          <p slot="content">{{item.content}}</p>
          <a v-if="item.user_id != 0" slot="author">作者</a>

          <SubmitComment
            v-if="replyIds.indexOf(item.id) >= 0"
            :articleId="item.article_id"
            :replyId="item.id"
            :userId="userId"
          />

          <a-collapse
            :bordered="false"
            v-model="collapseKey"
            v-if="replyComments.filter(e => e.reply_id===item.id).length > 0"
          >
            <template v-slot:expandIcon="props">
              <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
            </template>
            <a-collapse-panel :key="item.id.toString()" header="查看回复" class="collapse-panel-style">
              <a-comment
                v-for="reply_item in replyComments.filter(e => e.reply_id===item.id)"
                :key="reply_item.id"
                :avatar="anonymousIcon"
              >
                <p slot="content">{{reply_item.content}}</p>
                <a v-if="reply_item.user_id != 0" slot="author">作者</a>
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
            <span class="action-item" @click="actionClick('reply',item.id)">回复</span>
          </template>
          <a-tooltip slot="datetime" :title="moment(item.created_at).format('YYYY-MM-DD HH:mm')">
            <span>{{moment(item.created_at).fromNow()}}</span>
          </a-tooltip>
        </a-comment>
      </a-list-item>
        <a-pagination
        :pageSize.sync="pageSize"
        class="comment-page"
        :defaultCurrent="currentPage"
        :total="total"
        :pageSizeOptions="pageSizeOptions"
        @showSizeChange="onShowSizeChange"
        showSizeChanger
        @change="handleCurrentChange"
      />
    </a-list>
    <NotFound v-else />
  </div>
</template>

<script>
import Comment from "@/services/comment";
import eventBus from "@/common/eventBus";
import moment from "moment";
import CustomDatePick from "@/components/CustomDatePick";
import SubmitComment from "@/components/SubmitComment";
import config from "@/common/config";
import { getInfo } from "@/services/user";
import { Token } from "@/store";
import anonymousIcon from "@/assets/anonymous-avatar.svg";
import NotFound from "@/components/NotFound";

const startDefault = "1970-01-01";
const endDefault = moment()
  .add(1, "day")
  .format("YYYY-MM-DD");

export default {
  name: "Comments",
  async created() {
    this.getComments();
    if (this.token) {
      getInfo().then(res => {
        if (res.ok) {
          this.userId = res.data.id;
        }
      });
    }
  },
  components: {
    CustomDatePick,
    SubmitComment,
    NotFound
  },
  data() {
    return {
      allComments: [],
      replyComments: [],
      currentPage: 1,
      pageSize: 5,
      total: 1,
      pageSizeOptions: config.pageSizeOptions,
      moment,
      more: this.$route.name === "comments",
      timeStart: startDefault,
      timeEnd: endDefault,
      loading: true,
      replyIds: [],
      collapseKey: "0",
      userId: 0,
      anonymousIcon,
      token: Token.checkToken()
    };
  },
  props: ["articleId"],
  mounted() {
    eventBus.$on("onAddCommentCancel", replyId => {
      this.clearReply(replyId);
    });
    eventBus.$on("onAddCommentSuc", replyId => {
      this.getComments();
      this.clearReply(replyId);
      this.collapseKey = replyId.toString();
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
    eventBus.$on("onUserInfoDone", userInfo => {
      this.userId = userInfo.id;
    });
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getComments();
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
      this.getComments();
    },
    getComments() {
      this.loading = true;
      if (this.articleId) {
        Comment.getArticleComments(
          this.articleId,
          (this.currentPage - 1) * this.pageSize,
          this.pageSize
        ).then(res => handler(res));
      } else {
        Comment.getComments(
          this.timeStart,
          this.timeEnd,
          (this.currentPage - 1) * this.pageSize,
          this.pageSize
        ).then(res => handler(res));
      }
      let handler = res => {
        if (res.ok) {
          this.allComments = res.data.results;
          this.total = res.data.count;
          this.getReplyComments(res.data.results.map(e => e.id).join(","));
        } else {
          this.allComments = [];
          this.replyComments = [];
          this.total = 0;
        }
        this.loading = false;
      };
    },
    getReplyComments(ids) {
      Comment.getReplyComments(ids).then(res => {
        if (res.ok) {
          this.replyComments = res.data.results;
        } else {
          this.replyComments = [];
        }
      });
    },
    actionClick(type, commentId) {
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
        if (this.replyIds.indexOf(commentId) === -1) {
          this.replyIds.push(commentId);
        }
      }
    },
    clearReply(replyId) {
      this.replyIds.splice(this.replyIds.indexOf(replyId), 1);
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