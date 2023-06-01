import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import {
  getSiteInfo,
  getUserInfo,
  findNotice,
  getPublicKey,
  getFriendPage,
  getApplyCount,
  getImgDomain,
} from "../service/getData";

export default createStore({
  state: {
    site: {}, //站点信息
    token: "",
    searchInfo: {},
    platformType: "",
    isOnce: false,
    imgServer: "",
    chatImgServer: "",
    showMessageBox: false,
    messageBox: "",
    mute: false, //是否静音
    computershow: true, //是否电脑登录
    infor: {}, //联系人详情
    contactList: [], //联系人列表
    contactListRemark: [],
    userInfo: {}, //用户信息
    groupInfo: {}, //群信息
    firendwarn: false, //提示红色按钮
    systemwarn: false,
    groupwarn: false, //提示红色按钮
    consumerthing: false, //登录弹窗显隐
    allgroup: [], //所有群聊的人
    groupFriends: [], //分组的成员
    splash: true, //开启页
    groupNotice: [""], //群公告
    groupUserList: [], //群组成员列表
    groupList: [], //群组列表
    isCurGroupAdmin: "", //是否是当前群的管理员
    isCurGroupMaster: "", //是否是当前群的群主
    // verRandom: md5(`${Math.random()}`),
    enableSite: "",
    bgNum: "",
    applyNum: "",
    isOnlyAdmin: "",
    isShow: null,
    quickConfig: "0",
    fun: {
      //娱乐
      isOpen: null,
      funUrl: "",
    },
    straff: {
      //客服
      isOpen: null,
      straffUrl: "",
    },
    showFun: false,
    funSrc: "",
    imStatus: "close",
    firstTimeFlag1: false,
    firstTimeFlag2: false,
    friendPageNum: 1,
    isAllow: false, //是否允许从群内添加好友
    curItem: {},
  },
  mutations: {
    setSite(state, site) {
      state.site = site;
      //setStore('site', site);
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    saveImgServer(state, imgServer) {
      state.imgServer = imgServer;
    },
    setToken(state, token) {
      state.token = token;
    },
    saveUserInfo(state, info) {
      state.infor = info;
    },
  },
  actions: {
    setUser({ commit }, data) {
      commit("setUserInfo", data);
    },
    //获取用户信息和站点信息
    async initSite({ commit }) {
      let res = await getSiteInfo();
      commit("setSite", res.data.site);
      commit("saveImgServer", res.data.imgServer);
      return res;
    },
    setToken({ commit }, data) {
      commit("setToken", data);
    },
    saveUserInfo({ commit }, data) {
      commit("saveUserInfo", data);
    },
  },
  modules: {},
  plugins: [createPersistedState()],
});
