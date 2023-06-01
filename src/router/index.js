import {
  useRoute,
  userRouter,
  createRouter,
  createWebHashHistory,
} from "vue-router";
import NProgress from "nprogress";
import App from "../App.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: App,
      children: [
        { path: "", redirect: "/dialogue" }, //地址为空时跳转
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/login"),
    },
    {
      path: "/dialogue",
      name: "dialogue",
      meta: { needLogin: true },
      component: () => import("@/views/dialogue/dialogue"),
    },
    {
      path: "/singlechat",
      name: "singlechat",
      meta: { needLogin: true },
      component: () => import("@/views/conversation/singlechat"),
    },
    {
      path: "/addressbook",
      name: "addressbook",
      meta: { needLogin: true },
      component: () => import("@/views/addressbook/addressbook"),
    },
  ],
});

router.beforeEach(async (to, from) => {
  NProgress.configure({
    showSpinner: false,
  });
  NProgress.start();

  if (from.meta.keepAlive) {
    from.meta.savedPosition = document.body.scrollTop;
  }
  if (to.matched.some((record) => record.meta.needLogin)) {
    if (localStorage.tokenIM && localStorage.tokenIM !== "undefined") {
      return true;
    } else {
      //清空缓存
      localStorage.removeItem("tokenIM");
      return false;
    }
  } else {
    if (to.path == "/login") {
      if (localStorage.tokenIM) {
        router.push({
          path: "/dialogue",
        });

        NProgress.done();
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
export default router;
