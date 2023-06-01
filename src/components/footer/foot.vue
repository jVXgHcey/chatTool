<template>
  <div class="footerIm">
    <!-- 微信底部导航SVG存放 -->
    <ul class="clear">
      <router-link to="/dialogue" tag="li" class="footer_li">
        <section class="li_svg">
          <span class="iconfont iconliaotianjilu"></span>
          <i class="findwarn" v-if="firendwarn"></i>
        </section>
        <section
          class="li_text"
          :class="
            $route.path.indexOf('dialogue') !== -1 ? 'colortext' : 'color'
          "
        >
          聊天
        </section>
      </router-link>
      <router-link to="/addressbook" tag="li" class="footer_li">
        <section class="li_svg">
          <span class="iconfont iconwodelianxiren"></span>
          <i class="findwarn" v-if="groupwarn"></i>
        </section>
        <section
          class="li_text"
          :class="
            $route.path.indexOf('addressbook') !== -1 ? 'colortext' : 'color'
          "
        >
          联系人
        </section>
      </router-link>
      <router-link to="/group" tag="li" class="footer_li">
        <section class="li_svg">
          <span class="iconfont iconqunliao"></span>
        </section>
        <section
          class="li_text"
          :class="$route.path.indexOf('group') !== -1 ? 'colortext' : 'color'"
        >
          群组
        </section>
      </router-link>
      <router-link to="/find" tag="li" class="footer_li">
        <section class="li_svg">
          <span class="iconfont iconfaxian"></span>
        </section>
        <section
          class="li_text"
          :class="$route.path.indexOf('find') !== -1 ? 'colortext' : 'color'"
        >
          发现
        </section>
      </router-link>
      <router-link to="/me" tag="li" class="footer_li">
        <section class="li_svg">
          <span class="iconfont icongerenzhongxin"></span>
          <i class="findwarn" v-if="systemwarn"></i>
        </section>
        <section
          class="li_text"
          :class="$route.path.indexOf('me') !== -1 ? 'colortext' : 'color'"
        >
          个人中心
        </section>
      </router-link>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {},
  components: {},
  computed: {
    ...mapState(["firendwarn", "groupwarn", "systemwarn"]),
  },
  methods: {},
};
</script>
<style lang="scss">
.footerIm {
  width: 100%;
  height: 60px;
  border-top: 1px solid #d4d4d4;
  flex-shrink: 0;
  display: flex;
  box-sizing: border-box;
  .router-link-active {
    .iconfont {
      color: #00c8ff !important;
    }
  }
  ul {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    box-sizing: border-box;

    background: rgba(255, 255, 255, 1);
    .footer_li {
      display: flex;
      justify-content: center;
      text-align: center;
      position: relative;
      flex: 1;
      .li_svg {
        @include leftcenter;
        top: 10px;
        display: flex;
        .iconfont {
          font-size: 18px;
          color: #000;
        }
        .findwarn {
          display: block;
          position: absolute;
          right: -0.11rem;
          top: -0.11rem;
          @include widthHeight(15px, 15px);
          background: #f45353;
          border-radius: 50%;
        }
      }
      .li_text {
        text-align: center;
        @include sizeColor(14px, #979797);
        margin-top: 30px;
      }
      .color {
        color: #979797;
      }
      .colortext {
        color: #00c8ff;
      }
    }
  }
}
</style>
