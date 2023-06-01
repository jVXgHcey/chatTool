<template>
  <section class="login_wrap">
    <head-top :crossover="chatName" v-if="!imShow"></head-top>

    <div class="login_inner" v-if="!imShow">
      <div class="login_top"></div>
      <section class="login_item">
        <span class="iconfont iconwodelianxiren"></span>
        <input
          class="input_style"
          maxlength="16"
          v-model="userName"
          placeholder="输入账号"
        />
      </section>
      <section class="login_item clear">
        <span class="iconfont iconyinsi"></span>
        <input
          class="input_style"
          ref="pass"
          maxlength="16"
          type="password"
          v-model="password"
          placeholder="输入密码"
          @keyup.enter="submitLogin"
        />
      </section>
      <section class="login_item clear" v-if="showVerCode">
        <span class="iconfont iconyinsi"></span>
        <input
          class="input_style"
          type="text"
          v-model="verCodeUser"
          placeholder="输入验证码"
          @keyup.enter="submitLogin"
        />
        <span class="vercode_style" @click="refreshVer"
          ><img :src="verImgUrl"
        /></span>
      </section>
      <!--<section class="login_item remember">
        <label for="remember"> <input class="rememberinput" type="checkbox" v-model="remember" id="remember" /><span>记住密码</span> </label>
      </section>
      -->
      <div class="login_button">
        <div class="button_style" @click="submitLogin">登录</div>
      </div>
      <!--<div class="regist_content">
        <span v-if="isLogin == 1 && getEnableSite" class="regist_text" @click="toRegister">创建账号</span>
      </div>
      <div class="regist_content mt50">
         <span class="client" v-if="getStraff.isOpen == 1 && getEnableSite" @click="gotoStaff">咨询客服</span>
      </div> -->
    </div>
  </section>
</template>

<script>
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/foot";
import { getQueryString } from "@/mUtils/utils";
import {
  loginSubmit,
  getVerifyCode,
  initLogin,
  websiteConf,
  verifyCodeImgm,
  nickNameCheck,
  updateUserInfo,
  getUserInfo,
  enableSiteGate,
  getChatSiteSettingInfo,
  getPublicKey,
} from "@/service/getData";
import { setStore, getStore, setToken, debounce } from "@/mUtils/utils";
import { JSEncrypt } from "jsencrypt";
import md5 from "js-md5";
import { reactive, toRefs, onMounted, computed, ref } from "vue";
import { vCodeUrl } from "@/service/getData";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  components: {
    headTop,
    footGuide,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      chatName: "",
      straffStatue: "open",
      userName: "",
      password: "",
      verCodeUser: "",
      verCodeServer: "",
      showVerCode: false,
      staffType: "",
      staffLink: "",
      remember: [],
      siteId: "",
      siteCode: "",
      code: "2",
      imShow: false,
      reg: /^[\u4E00-\u9FA5A-Za-z0-9_]{1,12}$/,
      options: [
        {
          label: "记住密码",
          value: "1",
        },
      ],
      IS_IOS: null,
      IS_ANDROID: null,
      verRandom: md5(`${Math.random()}`),
      verImgUrl: "",
      publicKey: () => {},
    });

    onMounted(() => {
      getPlatForm();
      initLoginFun();
      initPublicKey();
      initSite();
    });
    // watch(switchValue, (newValue, oldValue) => {
    //   if (newValue == true) {
    //     pass.type = "password";
    //   } else {
    //     pass.type = "text";
    //   }
    // });
    const imgServer = computed(() => {
      return store.state.imgServer;
    });
    const getPlatForm = () => {
      const ua = navigator.userAgent.toUpperCase();
      const userAgent = ua;
      // 当前环境是否为Android平台
      state.IS_ANDROID = ua.indexOf("ANDROID") != -1;
      // 当前环境是否为IOS平台
      state.IS_IOS = ua.indexOf("IPHONE") != -1;
    };

    const initPublicKey = async () => {
      let res = await getPublicKey();
      state.publicKey = function (password) {
        let encrpyt = new JSEncrypt();
        encrpyt.setPublicKey(res.data);
        let data = encrpyt.encrypt(password);
        return data;
      };
    };

    const verImgUrl = () => {
      state.verImgUrl =
        "api/chat-tool/index/verifyCodeImg?verId=" + state.verRandom;
    };

    const initLoginFun = async () => {
      let res = await initLogin();
      state.showVerCode = res.data.validateCode;
      if (state.showVerCode) {
        verImgUrl();
      }
    };
    const initSite = () => {
      store.dispatch("initSite");
    };
    const submitLogin = async () => {
      try {
        let params = {
          verId: state.verRandom,
          userName: state.userName,
          password: state.publicKey(md5(state.password)),
          platformType: state.code,
          verifyCode: state.verCodeUser,
          siteCode: store.state.site.siteCode,
          siteId: store.state.site.id,
        };

        let res1 = await loginSubmit(params);
        setToken(res1.data);
        let userInfo = await getUserInfo({ token: res1.data });
        store.dispatch("setUser", userInfo.data);
        store.dispatch("setToken");
        let { siteCode, siteId, id } = userInfo;
        open(
          `/nsp-${siteCode}`,
          { siteCode, siteId, userId: id, token: res1.data },
          function () {}
        );
        router.push({
          path: "/dialogue",
          query: { userId: userInfo.data.id },
        });
      } catch (error) {}
    };

    return {
      ...toRefs(state),
      submitLogin,
      initLoginFun,
      initPublicKey,
      getPlatForm,
      imgServer,
    };
  },
};
</script>
<style lang="scss">
#app {
  height: 100%;
}
.login_wrap {
  width: 100%;
  height: 100%;
  background: url("../../assets/images/lbg.jpg") no-repeat;
  background-size: 100% 100%;
  .backtoim {
    position: absolute;
    bottom: 266px;
    right: 48px;
    width: 66px;
    height: 66px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #ddd;
    border-radius: 50%;
    font-size: 20px;
    line-height: 32px;
    text-align: center;
    background: #f8f8f8;
    cursor: pointer;
    img {
      width: 100%;
      border: 0;
    }
  }
  .wrap_iframe {
    height: 100%;
    width: 100%;
    border: 0;
  }
  .mt50 {
    margin-top: 50px;
  }
  .mint-cell {
    background: rgba(255, 255, 255, 0);
    margin-left: 20px;
  }
  .remember {
    label {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      span {
        font-size: 14px;
      }
    }
  }
  .login_inner {
    background: rgba(255, 255, 255, 0.8);
    margin: 0 10px;
    margin-top: 20px;
    padding: 40px 0 60px 0;
  }
  .login_top {
    padding: 10px 0;
    width: 100%;
    text-align: center;
    font-size: 22px;
    span {
      position: absolute;
      right: 24px;
      top: 24px;
      font-size: 32px;
      color: #000;
    }
  }
  .vercode_style {
    display: flex;
    align-items: center;
    line-height: 48px;
    height: 48px;
    font-weight: bold;
    width: 120px;
    margin-top: 5px;
    flex: 1;
    img {
      width: 100%;
      height: 48px;
    }
  }
  .login_img {
    width: 100%;
    height: 300px;
    align-items: center;
    text-align: center;
    .img_style {
      width: 64px;
      height: 82px;
      margin-top: 100px;
      background-color: #cccccc;
    }
  }
  .login_item {
    height: 32px;
    margin: 0 34px;
    border-bottom: 1px solid #dddddd;
    padding: 12px;
    display: flex;
    align-items: center;
    .iconfont {
      font-size: 18px;
    }
    span {
      font-size: 32px;
    }
    input {
      margin-left: 32px;
      width: 160px;
      background: transparent;
      font-size: 14px;
      font-weight: 400;
      flex: 2;
    }
    .show_passw {
      line-height: 32px;
      height: 32px;
      margin-top: 8px;
      flex: 0.5;
      margin-left: 10px;
    }
  }
  .forget_pw {
    height: 82px;
    margin: 0 64px;
    text-align: right;
    span {
      font-size: 12px;
      color: #000;
      padding: 3px 6px;
    }
  }
  .login_button {
    .button_style {
      text-align: center;
      height: 40px;
      line-height: 40px;
      width: 60%;
      margin: 30px auto;
      background-color: #26a2ff;
      color: #fff;
      border-radius: 41px;
    }
    .disable_style {
      background: #cccccc;
    }
  }
  .regist_content {
    padding-bottom: 28px;
    text-align: center;
    .regist_text {
      font-size: 22px;
      color: #000;
      padding: 3px 6px;
    }
  }
  .client {
    color: #000;
    width: 100%;
    text-align: center;
    text-align: center;
    display: flex;
    width: auto;
    justify-content: center;
    font-size: 22px;
    color: #26a2ff;
  }
}
</style>
