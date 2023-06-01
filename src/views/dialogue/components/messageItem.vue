<template>
  <div class="dialogueMessage">
    <div v-if="item.isSysMsg == 1" @click="gotoSystemMsg">
      <van-cell title="系统消息" :value="item.content" :label="item.createTime">
        <template #icon>
          <i class="iconfont iconlaba1"></i>
        </template>
        <template #right-icon>
          <i v-if="item.unReadNum > 0" class="unread">{{ item.unReadNum }}</i>
        </template>
      </van-cell>
    </div>
    <div
      v-else-if="!item.groupId"
      @click="gotoSingleChat(item)"
      :class="{ isTop: item.isTop == 1 }"
    >
      <van-swipe-cell>
        <van-cell
          :title="item.friendRemark || item.friendUserName"
          :value="format(item.createTime)"
          :label="item.content"
        >
          <template #icon>
            <img :src="imgServer + item.friendAvatar" alt />
          </template>
          <template #right-icon>
            <i v-if="item.unReadNum > 0" class="unread">{{ item.unReadNum }}</i>
          </template>
        </van-cell>
        <template #right>
          <van-button
            square
            type="danger"
            @click="handleDel(item)"
            text="删除"
          />
          <van-button
            square
            type="primary"
            @click="handleTop(item, 0)"
            text="置顶"
          />
        </template>
      </van-swipe-cell>
    </div>
    <div
      v-else-if="item.groupId"
      @click="gotoGroupChat(item)"
      :class="{ isTop: item.isTop == 1 }"
    >
      <van-swipe-cell>
        <van-cell
          :title="item.groupName"
          :value="format(item.createTime)"
          :label="item.content"
        >
          <template #icon>
            <img
              v-if="item.groupAvatar"
              :src="imgServer + item.groupAvatar"
              alt
            />
            <div v-else class="defalut">群</div>
          </template>
          <template #right-icon>
            <i v-if="item.unReadNum > 0" class="unread">{{ item.unReadNum }}</i>
          </template>
        </van-cell>
        <template #right>
          <van-button
            square
            type="danger"
            @click="handleDel(item)"
            text="删除"
          />
          <van-button
            square
            type="primary"
            @click="handleTop(item, 1)"
            text="置顶"
          />
        </template>
      </van-swipe-cell>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted, toRefs, computed } from "vue";
import { Toast } from "vant";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  delChatWin,
  topChat,
  entryGroup,
  unReadNumToZero,
} from "@/service/getData";
import { formatTime, formatDate } from "@/mUtils/utils";
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["callback"],
  setup(props, ctx) {
    const router = useRouter();
    const store = useStore();
    const state = reactive({});
    onMounted(async () => {});
    const imgServer = computed(() => {
      return store.state.imgServer;
    });
    const gotoSingleChat = (item) => {
      store.dispatch("saveUserInfo", item);
      router.push({
        path: "singleChat",
        query: {
          friendUserId: item.friendUserId,
          nickName: item.friendRemark || item.friendUserName,
        },
      });
    };
    const gotoGroupChat = (item) => {
      router.push({
        path: "/groupchat",
        query: { groupId: item.groupId, name: item.groupName },
      });
    };
    const handleContentItem = () => {};
    const unreadObj = () => {};
    const handleDel = async (item) => {
      try {
        let res = await delChatWin({
          userId: store.state.userInfo.id,
          chatId: item.chatId,
        });
        Toast({ message: "删除成功" });
        ctx.emit("callback");
      } catch (err) {
        console.log(err);
      }
    };
    const handleTop = async (item, type) => {
      try {
        let params = {};
        if (type == 0) {
          params = {
            userId: item.friendUserId,
            chatId: item.chatId,
            isTop: "1",
          };
        } else {
          params = {
            userId: store.state.userInfo.id,
            groupId: item.groupId,
            isTop: "1",
          };
        }
        let res = await topChat(params);
        Toast({ message: "置顶成功" });
        ctx.emit("callback");
      } catch (err) {
        console.log(err);
      }
    };
    const format = (time) => {
      return formatTime(time, "hh:mm");
    };
    return {
      ...toRefs(state),
      gotoSingleChat,
      gotoGroupChat,
      handleContentItem,
      unreadObj,
      imgServer,
      format,
      handleDel,
      handleTop,
    };
  },
};
</script>
<style lang="scss">
.dialogueMessage {
  .van-swipe-cell__right {
    button {
      height: 100%;
    }
  }
  .van-cell {
    img {
      width: 50px;
      margin-right: 10px;
    }
    .defalut {
      width: 50px;
      height: 50px;
      line-height: 50px;
      margin-right: 10px;
      background: #2286d7;
      color: #fff;
      border-radius: 50%;
      text-align: center;
    }
  }
}
</style>
