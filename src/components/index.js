import vPage from "./vPage";
import vHeader from "./header/head";
import vFooter from "./footer/foot";

const commomComMap = {
  vPage,
  vHeader,
  vFooter,
};

export default {
  install(Vue) {
    Object.keys(commomComMap).forEach((key) => {
      Vue.component(key, commomComMap[key]);
    });
  },
};
