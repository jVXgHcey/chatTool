<template>
  <div class="page_wrap df">
    <vHeader :crossover="chatname"> </vHeader>
    <section class="app_contain coversation">
      <div class="coversationlist" :style="{ '-webkit-overflow-scrolling': scrollMode, height: wrapperHeight + 'px' }">
        <ul class="msgList">
          <van-list v-model="loading" :loading="loading" :offset="offset" :immediate-check="immediate" :direction="direction" :finished="finished" finished-text="没有更多了" @load="queryChatList">
            <chatRecordListItem class="item" v-for="(i, index) in conversine" :key="index" :item="i" :index="index" @callback="handleCb" />
          </van-list>
        </ul>
      </div>
    </section>
    <footer ref="footer" class="footshow">
      <section class="foot_top">
        <div>
          <input v-model="inputmessage" class="sendbox" maxlength="1000" @focus="inputFocus" @input="whatInput" @click="bottomHide" @keyup.enter="clickSend(1)" :class="{ lightborder: light }" />
        </div>
        <div>
          <span class="iconfont iconxiaolian" @click="bottomShow"></span>
        </div>
        <div>
          <div class="send" v-if="light" @click="clickSend(1)">
            <span>发送</span>
          </div>
          <span v-else class="iconfont iconjiahao1">
            <input class="send_input" type="file" name="image" accept="image/*" @change="setImg($event)" />
          </span>
        </div>
      </section>
      <div v-if="enlarge" class="enlarge_wrap">
        <div
          class="enlarge"
          v-if="enlarge"
          @click="enlargeHide"
          :class="{
            'movein-animate': enlargeShow,
            'moveout-animate-leave': enlargehides,
          }"
        >
          <img :class="[isNoramlSize ? 'w100' : 'h100']" :src="enlargeurl" alt />
        </div>
        <div class="save" @click="savePic">
          <span>保存到本地</span>
        </div>
      </div>
      <section class="foot_bottom" v-show="clickmore">
        <e-moji @clickFn="handleEmoji"></e-moji>
      </section>
    </footer>
    <van-action-sheet v-model:show="show" :actions="actions" cancel-text="取消" close-on-click-action @cancel="onCancel" @select="onSelect" />
  </div>
</template>

<script>
import { reactive, onMounted, toRefs, ref, nextTick, inject } from "vue";
import vHeader from "@/components/header/head";
import TextareaAutosize from "@/components/TextareaAutosize/TextareaAutosize";
import eMoji from "@/components/emoji/emoji";
import { Snowflake } from "@/service/Snowflake.js";
import { useStore } from "vuex";
import { singleChatRecord, sendMsg, entryGroup, ajaxUploadTemp, recallSingleMsg } from "@/service/getData";
import chatRecordListItem from "./components/chatRecordListItem.vue";

import { useRoute } from "vue-router";
import { Toast } from "vant";
export default {
  components: {
    vHeader,
    TextareaAutosize,
    eMoji,
    chatRecordListItem,
  },
  setup() {
    const socket = inject("socket");
    const store = useStore();
    const loading = ref(false);
    const finished = ref(false);
    const show = ref(false);
    const inputmessage = ref("");
    const conversine = ref([]);
    const route = useRoute();
    const state = reactive({
      chatname: false,
      showLoginTime: "",
      lastLoginTime: "",
      clickmore: false,
      light: false,
      pageNum: 1,
      scrollMode: "auto",
      wrapperHeight: 0,
      direction: "up",
      curItem: {},
      fetching: false,
      immediate: false,
      offset: 100,
      actions: [{ name: "撤回" }],
      showUnread: false,
      unreadMsg: 0,
    });

    onMounted(() => {
      queryChatList();
      state.chatname = route.query.nickName;
      nextTick(() => {
        state.wrapperHeight = document.documentElement.clientHeight - document.querySelector(".msgList").getBoundingClientRect().top;
        scrollToBottom();
      });
      socket.socket.on("privateTalk", (data) => {
        if (data.from == route.query.friendUserId) {
          conversine.value.push(Object.assign(data.message, { status: 0 }));
          if (conversine.value.length > 400) {
            conversine.value = conversine.value.slice(this.msgList.length - 400);
          }
          let el = document.querySelector(".msgList");
          if (Math.ceil(el.scrollHeight) - Math.ceil(el.scrollTop) < 1200) {
            scrollToBottom();
            state.showUnread = false;
          }
          if (Math.ceil(el.scrollTop) + Math.ceil(el.clientHeight) < el.scrollHeight) {
            state.unreadMsg++;
            state.showUnread = true;
          }
          if (Math.ceil(el.scrollTop) + Math.ceil(el.clientHeight) == el.scrollHeight) {
            state.showUnread = false;
            state.unreadMsg = 0;
          }
        }
      });
    });
    const queryChatList = async () => {
      if (state.fetching) {
        return;
      }
      let params = {
        userId: store.state.userInfo.id,
        pageNum: state.pageNum,
        pageSize: 20,
        receivedUserId: store.state.infor.friendUserId,
        chatId: store.state.infor.chatId,
      };
      loading.value = true;
      state.fetching = true;
      let res = await singleChatRecord(params);
      try {
        if (res.data.content.length == 0) {
          loading.value = false;
          finished.value = false;
          return;
        }
        if (state.pageNum == 1) {
          conversine.value = res.data.content;
          finished.value = true;
          scrollToBottom();
          setTimeout(() => {
            finished.value = conversine.value.length > Number(res.data.totalElements);
          }, 500);
        } else {
          conversine.value = [...res.data.content, ...conversine.value];
          scrollToTop();
          setTimeout(() => {
            finished.value = conversine.value.length > Number(res.data.totalElements);
          }, 500);
        }
        state.pageNum++;
        loading.value = false;
        state.fetching = false;
      } catch (err) {
        loading.value = false;
        state.fetching = false;
        finished.value = false;
      }
    };

    const handleCb = (item) => {
      state.curItem = item;
      show.value = true;
    };
    const onSelect = async (item) => {
      socket.emit(
        "revokePrivateMessage",
        {
          receiveUserId: store.state.infor.friendUserId || store.state.infor.sendUserId,
          content: {},
        },
        function (d) {
          Toast("撤回成功");
        }
      );
      await recallSingleMsg({ id: state.curItem.item.id, chatId: state.curItem.item.chatId });
      try {
        conversine.value.splice(state.curItem.index, 1, {
          content: "消息已撤回",
          type: 6,
        });
      } catch (err) {}
    };
    const bottomShow = () => {
      state.clickmore = !state.clickmore;
    };
    const clickSend = async (type, imgpath) => {
      let params = {
        id: new Snowflake(1, 1, 0).nextId(),
        avatar: store.state.userInfo.avatar,
        content: type == 1 ? inputmessage.value : imgpath,
        type: type,
        createTime: new Date() / 1,
        receiveUserId: store.state.infor.friendUserId,
        sendUserId: store.state.userInfo.id,
        siteId: store.state.userInfo.siteId,
        siteCode: store.state.userInfo.siteCode,
        status: 2, //0成功 1失败  2loading
        chatId: store.state.infor.chatId,
        friendUserName: store.state.userInfo.nickName,
        friendAvatar: store.state.userInfo.avatar,
      };

      socket.emit(
        "privateTalk",
        {
          receiveUserId: store.state.infor.friendUserId,
          message: params,
        },
        (data) => {
          if (data) {
            if (data.code == 10001) {
            } else {
              conversine.value.push({
                ...params,
                status: 0,
              });
            }
          } else {
            conversine.value.push({
              ...params,
              status: 0,
            });
            state.light = false;
            inputmessage.value = "";
            scrollToBottom();
          }
        }
      );
    };
    const whatInput = () => {
      if (inputmessage.value) {
        state.light = true;
      } else {
        state.light = false;
      }
    };
    const scrollToBottom = () => {
      nextTick(() => {
        let el = document.querySelector(".coversationlist");
        const div = document.querySelector(".van-list");
        el.scrollBy(0, div.scrollHeight);
      });
    };
    const scrollToTop = () => {
      nextTick(() => {
        let el = document.querySelector(".coversationlist");
        let disY = 0;
        if (el) {
          disY = el.clientHeight;
        }
        if (el) {
          el.scrollBy(0, disY);
        }
      });
    };
    const handleEmoji = (item) => {
      inputmessage.value += item.native;
      state.light = true;
    };
    return {
      ...toRefs(state),
      inputmessage,
      bottomShow,
      whatInput,
      clickSend,
      handleEmoji,
      queryChatList,
      loading,
      finished,
      conversine,
      scrollToBottom,
      scrollToTop,
      onSelect,
      handleCb,
      show,
    };
  },
};
</script>

<style lang="scss">
.page_wrap {
  flex-direction: column;
  height: 100%;
  .app_contain {
    flex: 1;
    overflow-y: auto;
  }
}
.df {
  display: flex;
}

footer {
  position: absolute;
  z-index: 201;
  border-top: 1px solid #e0e0e0;
  background: #f5f5f5;
  bottom: 0;
  width: 100%;
  .foot_top {
    padding: 5px 8px;
    // height: 80px;
    background: #f3f3f3;
    @include justify(flex-start);
    align-items: center;
    .iconfont {
      font-size: 30px;
    }
    div:nth-of-type(2),
    div:nth-of-type(3) {
      @include widthHeight(30px, 30px);
      margin-right: 10px;
    }
    div:nth-of-type(1) {
      margin-right: 5px;
      flex: 2;
      // height: 44px;
      border-bottom: 1px solid #e0e0e0;
      textarea {
        background: none;
        display: block;
        width: 100%;
        font-size: 26px;
        padding-top: 4px;
      }
      input {
        display: block;
        width: 100%;
        padding: 0 10px;
        line-height: 44px;
        height: 44px;
        border: 0;
        background: none;
        @include sizeColor(24px, #000);
        border-bottom: 1px solid #e0e0e0;
      }
      .lightborder {
        border-color: #66a3ff;
      }
    }
    div:nth-of-type(3) {
      margin-right: 10px;
      position: relative;
      .send {
        width: 40px;
        background: #66a3ff;
        height: 35px;
        padding: 5px 0;
        border-radius: 5px;
        @include justify(center);
        align-items: center;
        span {
          display: block;
          @include sizeColor(14px, #fff);
        }
      }
      .send:active {
        background: #66a3ff;
      }
      .send_input {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
  .foot_bottom {
    border-top: 1px solid #e0e0e0;
  }
}
.coversation {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  position: relative;
  overflow-y: scroll;
  flex: 1;
  -webkit-overflow-scrolling: touch;
  .none {
    visibility: hidden;
    height: 0;
    width: 0;
    opacity: 0;
    z-index: -9999;
  }
  .coversationlist {
    position: relative;
    padding: 0 10px;
    overflow: auto;
    margin: 0 auto;
    margin-bottom: 60px;

    ul {
      padding-top: 10px;
      width: 100%;
      box-sizing: border-box;
      width: 100%;
      overflow: hidden;
      position: relative;
      flex: 1;
      li {
        .other {
          width: 100%;
          @include justify(flex-start);
          margin-bottom: 12px;
          align-items: top;
          img {
            display: block;
            @include widthHeight(45px, 45px);
          }
          .whatsay {
            position: relative;
            display: flex;
            .whatsay_text {
              margin-left: 10px;
              max-width: 400px;
              background: #fff;
              padding: 8px 8px;
              border-radius: 8px;
              @include sizeColor(14px, #fff);
              line-height: 30px;
              word-break: break-all;
              font-weight: 600;
            }
            .whatsay_state {
              display: flex;
              align-items: center;
              .iconamazed::before {
                color: red;
                margin-left: 20px;
              }
            }
          }
        }
        .mysay {
          display: flex;
          flex-direction: row-reverse;
          .whatsay {
            flex-direction: row-reverse;
            margin-right: 24px;
            .whatsay_status {
              position: absolute;
              left: -120px;
              top: 14px;
            }
            // .whatsay_svg {
            //   right: 13px;
            //   left: auto;
            // }
            .whatsay_text {
              margin-left: 0;
              background: #5e9cf7;
              position: relative;
              @include sizeColor(14px, #fff);
              font-weight: 600;
            }
            .whatsay_img {
              display: flex;
              flex-direction: row-reverse;
              max-width: 400px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .whatsay_time {
              font-size: 14px;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              margin-right: 5px;
              text-align: right;
            }
            .whatsay_state {
              position: absolute;
              left: -110px;
              top: 18px;
              .iconamazed::before {
                color: red;
                display: flex;
                align-items: center;
                margin-left: 20px;
              }
            }
          }
          .color_invite {
            background: #5e9cf7;
            padding: 10px 5px;
            border-radius: 8px;
            @include sizeColor(24px, #f5ff80);
            line-height: 18px;
            word-break: break-all;
            font-size: 14px;
          }
          .whatsay_svg::after {
            content: "";
            width: 0;
            height: 0;
            border: 10px solid transparent;
            border-left: 10px solid #5e9cf7;
            position: absolute;
            right: -20px;
            top: 20px;
          }
        }
        .othersay {
          display: flex;
          .color_invite {
            background: #ff6767;
            margin-left: 10px;
            padding: 18px 10px;
            @include sizeColor(14px, #f5ff80);
            line-height: 18px;
            word-break: break-all;
          }
          .whatsay {
            display: flex;
            .whatsay_text {
              background: #ff6767;
              color: #fff;
              position: relative;
              @include sizeColor(14px, #fff);
              font-weight: 600;
            }
            .whatsay_img {
              display: flex;
              flex-direction: row-reverse;
              max-width: 400px;
              margin-left: 20px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .whatsay_time {
              font-size: 14px;
              justify-content: center;
              align-items: center;
              display: flex;
              margin-left: 5px;
              text-align: left;
            }
          }
          .whatsay_svg::after {
            content: "";
            width: 0;
            height: 0;
            border: 10px solid transparent;
            border-right: 10px solid #ff6767;
            position: absolute;
            left: -18px;
            top: 20px;
          }
        }
      }
      .whatsay_svg2::after {
        content: "";
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-right: 10px solid #ff6767;
        position: absolute;
        left: -8px;
        top: 20px;
      }
      .whatsay_svg3::after {
        content: "";
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-left: 10px solid #5e9cf7;
        position: absolute;
        right: -20px;
        top: 20px;
      }
    }
  }
}
</style>
