<template>
  <div :class="['mainContainer', `bg${bgNum}`]">
    <router-view />
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
import { open } from "@/service/socketIo";
import { useStore } from "vuex";
import { getUserInfo } from "@/service/getData";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      bgNum: "5",
      transitionName: "slide-left",
    });
    onMounted(() => {
      let token = localStorage.getItem("tokenIM") || store.state.token;
      getUserInfo({ token: token }).then((res) => {
        try {
          let { siteCode, siteId, id } = res.data;
          open(`/nsp-${siteCode}`, { siteCode, siteId, userId: id, token: token }, function () {});
        } catch (err) {
          console.log(err);
        }
      });
    });
    router.beforeEach((to, from) => {
      if (to.meta.index > from.meta.index) {
        state.transitionName = "slide-left"; // 向左滑动
      } else if (to.meta.index < from.meta.index) {
        // 由次级到主级
        state.transitionName = "slide-right";
      } else {
        state.transitionName = ""; // 同级无过渡效果
      }
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>
<style lang="scss">
.mainContainer {
  height: 100%;
  overflow: hidden;
  z-index: 10;
}
.bg0 {
  background: url("assets/images/bg0.jpg") no-repeat;
  background-size: 100% 100%;
}
.bg1 {
  background: url("assets/images/bg1.jpg") no-repeat;
  background-size: 100% 100%;
}
.bg2 {
  background: url("assets/images/bg2.jpg") no-repeat;
  background-size: 100% 100%;
}
.bg3 {
  background: url("assets/images/bg3.jpg") no-repeat;
  background-size: 100% 100%;
}
.bg4 {
  background: url("assets/images/bg4.jpg") no-repeat;
  background-size: 100% 100%;
}
.bg5 {
  background: url("assets/images/bg5.jpg") no-repeat;
  background-size: 100% 100%;
}
.bg6 {
  background: url("assets/images/bg6.jpg") no-repeat;
  background-size: 100% 100%;
}
.bg7 {
  background: url("assets/images/bg7.jpg") no-repeat;
  background-size: 100% 100%;
}
.bg8 {
  background: url("assets/images/bg8.jpg") no-repeat;
  background-size: 100% 100%;
}
</style>
