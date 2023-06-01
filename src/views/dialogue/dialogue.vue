<template>
  <v-page>
    <section class="dialogue">
      <div class="conversation">
        <van-list v-model="loading" :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <messageItem class="item" v-for="(i, index) in dialogList" :key="index" :item="i" @callback="handleCb" />
        </van-list>
      </div>
    </section>
  </v-page>
</template>

<script>
import { reactive, onMounted, toRefs, ref } from "vue";
import { Toast } from "vant";
import { useRoute, useRouter } from "vue-router";
import messageItem from "./components/messageItem.vue";
import { getLaterChatMessage, entryGroup, topChat, unReadNumToZero, delChatWin, getFriendPage, getGroupList } from "@/service/getData";

import { useStore } from "vuex";

export default {
  components: {
    messageItem,
  },
  setup() {
    const dialogList = ref([]);
    const loading = ref(false);
    const finished = ref(false);

    const router = useRouter();
    const store = useStore();
    const state = reactive({
      fetching: false,
      pageNum: 1,
      pageSize: 10,
    });
    onMounted(async () => {
      onLoad();
    });
    const talk = () => {
      console.log(111);
    };
    const onLoad = async (pageNum) => {
      try {
        if (pageNum == 1) {
          state.pageNum = 1;
        }
        let params = {
          pageNum: pageNum ? pageNum : state.pageNum,
          pageSize: state.pageSize,
          userId: store.state.userInfo.id,
        };
        if (state.fetching) {
          return;
        }
        state.fetching = true;
        loading.value = true;
        const res = await getLaterChatMessage(params);
        if (res.data.content.length == 0) {
          loading.value = false;
          finished.value = false;
          return;
        }
        if (pageNum == 1) {
          dialogList.value = res.data.content;
        } else {
          dialogList.value = [...dialogList.value, ...res.data.content];
        }
        loading.value = false;
        state.fetching = false;
        finished.value = dialogList.value.length > res.data.totalElements;
        state.pageNum++;
      } catch (error) {
        finished.value = true;
        loading.value = false;
        state.fetching = false;
      }
    };
    const handleCb = async () => {
      onLoad(1);
    };

    return {
      ...toRefs(state),
      dialogList,
      onLoad,
      loading,
      finished,
      handleCb,
      talk,
    };
  },
};
</script>
<style lang="scss">
.dialogue {
  .unread {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 10px;
    background-color: #f45353;
    color: #fff;
    position: absolute;
    right: 20px;
    bottom: 2px;
  }
  .isTop {
    background: rgba(255, 255, 255, 0.8) !important;
  }
  .iconlaba1:before {
    font-size: 18px;
    color: #000;
    height: 40px;
    line-height: 40px;
    margin-right: 10px;
  }
  .iconguanbilingsheng:before {
    font-size: 24px;
  }
  .my_scroller {
    padding-top: 80px;
    padding-bottom: 80px;
  }
  .noneList {
    font-size: 22px;
    text-align: center;
    padding: 10px;
    background: rgba(255, 255, 255, 0.6);
  }

  .iconqunliao2 {
    font-size: 38px;
    color: #fff;
    height: 64px;
    line-height: 64px;
  }
  .conversation {
    width: 100%;
    padding-bottom: 10px;
    .swipe-cell {
      padding: 6px 18px 0 18px;
      width: 100%;
      div {
        display: flex;
      }
      .imgwipe {
        @include widthHeight(82px, 72px);
        .sysbg {
          background: #fff;
        }
        .groupbg {
          background: #bfb7ff;
        }
        .imgstyle {
          @include widthHeight(64px, 64px);
          display: flex;
          justify-content: center;
          flex-flow: row wrap;
          align-items: flex-start;
          align-content: flex-start;
          overflow: hidden;
          border-radius: 32px;
          img {
            width: 100%;
            height: 100%;
            border: 0;
            flex-grow: 2;
          }
        }
      }
      .mint-cell-title {
        flex: 0;
      }
      .mint-cell-value {
        color: #888;
        display: flex;
        align-items: center;
        flex: 1;
      }
      .infordetail {
        flex-grow: 1;
        padding-top: 6px;
        .infordetail_top {
          padding-bottom: 6px;
          flex-direction: column;
          flex: 1;
          span:nth-of-type(1) {
            @include sizeColor(14px, #000);
            flex: 1;
            line-height: 20px;
            align-items: center;
            font-weight: 600;
            max-width: 350px;
            text-overflow: ellipsis;
          }
          span:nth-of-type(2) {
            @include sizeColor(24px, #666);
            flex: 1;
            line-height: 40px;
            align-items: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-weight: 400;
            width: 280px;
          }
        }
        .infordetail_bot {
          display: flex;
          flex-direction: column;
          flex: 1;
          position: relative;
          .up {
            height: 24px;
            text-align: right;
            line-height: 40px;
            flex: 1;
            justify-content: flex-end;
            color: #666;
          }
          .iconguanbilingsheng:before {
            font-size: 28px;
          }
          .iconthin-_pin_bookma:before {
            font-size: 24px;
          }
          .down {
            width: 42px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            border-radius: 12px;
            position: absolute;
            right: -10px;
            bottom: 5px;
          }
          .down2 {
            width: 42px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            border-radius: 12px;
            position: absolute;
            right: 15px;
            bottom: 5px;
          }
          .unread {
            width: 42px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            border-radius: 12px;
            background-color: #f45353;
            color: #fff;
            position: absolute;
            right: 5px;
            bottom: 5px;
          }
        }
      }
    }
    ul {
      width: 100%;
      li {
        box-sizing: border-box;
        @include justify(flex-start);
        border-bottom: 1px solid #e0e0e0;
        background: rgba(255, 255, 255, 0.6);
      }
    }
  }
  .applylist-form {
    font-size: 20px;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 20px;
    dd {
      button {
        margin-right: 20px;
      }
    }
  }
}
.mint-loadmore-bottom {
  span {
    color: #fff;
  }
}
</style>
