<template>
  <div class="address">
    <div @click="gotoSingleChat(item)">
      <van-swipe-cell>
        <van-cell
          :title="item.friendRemark || item.friendUserName"
          :value="'最近上线于' + item.lastLoginTime"
        >
          <template #icon>
            <img :src="imgServer + item.friendAvatar" alt />
          </template>
        </van-cell>
        <template #right>
          <van-button
            square
            type="danger"
            @click="handleDel(item.id)"
            text="删除"
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
import { delFriend } from "@/service/getData";
import { formatTime } from "@/mUtils/utils";
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  filters: {
    timeFormat: function (val) {
      return formatTime(val, "hh:mm");
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
    const gotoSingleChat = () => {};
    const handleDel = async (id) => {
      try {
        let res = await delFriend({ id: id });
        Toast({ message: "删除成功" });
        ctx.emit("callback");
      } catch (err) {
        console.log(err);
      }
    };
    return {
      ...toRefs(state),
      gotoSingleChat,
      handleDel,
      imgServer,
    };
  },
};
</script>
<style lang="scss">
.address {
  .van-swipe-cell__right {
    button {
      height: 100%;
    }
  }
  .van-cell {
    img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      border-radius: 4px;
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
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
