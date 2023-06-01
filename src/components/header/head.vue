<template>
  <header>
    <div class="head_inner">
      <section class="logoPart" v-if="logoPart">
        <i @click="showNotice('click')" class="iconfont iconlaba"></i>
        <span @click="showNotice('click')">公告</span>
      </section>
      <section class="logoPart" v-if="crossover">
        <section class="goback" @click="goBackThing">
          <span class="iconfont iconhoutui"></span>
        </section>
        <!-- <slot name='clickrefresh' ></slot> -->
        <section class="covers_name" v-if="$route.path.indexOf('search') == -1">
          <span class="ellipsis">{{ crossover }}</span>
          <span class="loginTime" v-if="showLoginTime">({{ lastLoginTime ? "最近登录于" + lastLoginTime : "从未登陆" }})</span>
        </section>
        <slot name="searchpart"></slot>
      </section>
      <section class="addPart" v-if="add" @click="toggleShow(1)">
        <span class="iconfont iconjiahao"></span>
      </section>
      <!-- 下拉框 -->
      <section class="selectpart" v-show="addthing">
        <div class="cover" @click="toggleShow(0)"></div>
        <div class="selectlist">
          <ul>
            <router-link to="/creatGroup" tag="li" class="selectpart_li" v-if="onlyAdmin">
              <section class="selectsvg">
                <span class="iconfont iconqunliao1"></span>
              </section>
              <section class="selectext">发起群聊</section>
            </router-link>
            <router-link to="/search" tag="li" class="selectpart_li">
              <section class="selectsvg">
                <span class="iconfont icontianjia"></span>
              </section>
              <section class="selectext">添加朋友</section>
            </router-link>
            <router-link to="/creatDivide" tag="li" class="selectpart_li" v-if="onlyAdmin">
              <section class="selectsvg">
                <span class="iconfont iconxinhaoyou"></span>
              </section>
              <section class="selectext">创建好友分组</section>
            </router-link>
          </ul>
        </div>
      </section>
      <slot name="person"></slot>
    </div>
  </header>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { initLogin, getChatSiteSettingInfo, getImgDomain } from "@/service/getData";
import { Dialog } from "vant";
export default {
  props: {
    logoPart: {
      type: String,
      default: "",
    },
    crossover: {
      type: String,
      default: "",
    },
    searchPart: {
      type: Boolean,
      default: false,
    },
    person: {
      type: String,
      default: "",
    },
    lastLoginTime: {
      type: String,
      default: "",
    },
    showLoginTime: {
      type: String,
      default: "",
    },
  },
  setup(props, ctx) {
    const state = reactive({
      addthing: false,
      showVerCode: "",
    });
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    onMounted(() => {
      init();
    });

    const init = async () => {
      showNotice();
    };

    const onlyAdmin = computed(() => {
      if (store.state.getIsOnlyAdmin) {
        if (store.state.getUserInfo.type == 2) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });
    const getSiteId = computed(() => store.state.siteId);
    const getSiteCode = computed(() => store.state.siteCode);

    const toggleShow = (val) => {
      if (val) {
        state.addthing = false;
      } else {
        state.addthing = true;
      }
    };
    const goBackThing = () => {
      if (router.path == "/singlechat") {
        router.push("/dialogue");
      } else if (router.path == "/login") {
        return;
      } else {
        router.go(-1);
      }
    };
    const showNotice = async (type) => {
      // let params = {
      //   siteId: getSiteId,
      //   siteCode: getSiteCode,
      // }
      // const res = await getChatSiteSettingInfo(params);
      // Dialog({ message: res.data.notice });
    };

    return {
      ...toRefs(state),
      toggleShow,
      goBackThing,
      showNotice,
    };
  },
};
</script>
<style lang="scss">
.mint-msgbox-message {
  white-space: pre-wrap !important;
}
header {
  ::-webkit-scrollbar {
    display: none;
  }
  .head_inner {
    @include widthHeight(100%, 50px);
    background: #2286d7;
    z-index: 200;
    color: #fff;
    -webkit-overflow-scroll: touch;
    box-sizing: border-box;
    display: block;
    position: relative;
    left: 0;
    top: 0;
    right: 0;
  }
  .iconlaba {
    color: #ffffff;
    font-size: 18px;
    margin-right: 10px;
  }
  .iconai219,
  .iconjiahao,
  .iconqunliao1,
  .icontianjia,
  .iconxinhaoyou {
    color: #fff;
    font-size: 32px;
  }
  .logoPart {
    @include topcenter;
    @include sizeColor(16px, #fff);
    left: 20px;
    @include justify(flex-start);
    align-items: center;
    top: 25px;

    .goback span {
      color: #fff;
      font-size: 20px;
      width: 50px;
      display: inline-block;
    }
    .covers_name {
      flex: 2;
      display: flex;
      align-items: center;
      .ellipsis {
        max-width: 200px;
      }
      .loginTime {
        margin-left: 10px;
        font-size: 18px;
        color: #ccc;
      }
      span {
        @include sizeColor(20px, #fff);
        display: block;
      }
    }
  }
  .searchPart {
    @include topcenter;
    right: 10px;
    @include widthHeight(35px, 35px);
  }
  .addPart {
    @include topcenter;
    right: 20px;
    top: 40px;
    display: flex;
  }
  .selectpart {
    position: fixed;
    z-index: 2;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    .cover {
      position: fixed;
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0;
    }
    .selectlist {
      position: absolute;
      z-index: 100;
      top: 60px;
      right: 10px;
      width: 300px;
      background: #2286d7;
      ul {
        width: 300px;
        .selectpart_li {
          @include widthHeight(100%, 60px);
          border-bottom: 1px solid #51c3ff;
          @include justify(flex-start);
          align-items: center;
          .selectsvg {
            @include widthHeight(35px, 40px);
            margin: 0 30px;
            svg {
              @include widthHeight(100%, 100%);
            }
          }
          .selectext {
            @include sizeColor(16px, #fff);
          }
        }
      }
    }
  }
}
</style>
