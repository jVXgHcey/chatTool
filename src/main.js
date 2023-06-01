import { createApp } from "vue";
import App from "./App.vue";
import { Divider, Popup, Overlay, Loading, Dialog, ContactCard, Form, AddressEdit, AddressList, Field, CellGroup, Cell, SwipeCell, Icon, Stepper, Card, Checkbox, CheckboxGroup, Button, Swipe, SwipeItem, PullRefresh, List, Tab, Tabs, SubmitBar, Toast, Skeleton, ActionSheet } from "vant";

import "./iconfont/iconfont.css";
import store from "./store";
import router from "./router";
import "lib-flexible/flexible";
import "vant/lib/index.css"; // 全局引入样式
import globleComponents from "@/components";
import socketIo from "./service/socketIo";

const app = createApp(App); // 创建实例

app.use(Divider).use(Popup).use(Overlay).use(Loading).use(Dialog).use(Toast).use(ContactCard).use(Form).use(AddressEdit).use(AddressList).use(Field).use(CellGroup).use(Cell).use(SwipeCell).use(Icon).use(Stepper).use(Card).use(Button).use(Swipe).use(SwipeItem).use(PullRefresh).use(List).use(Tab).use(Tabs).use(SubmitBar).use(Checkbox).use(CheckboxGroup).use(Skeleton).use(ActionSheet);

app.use(router);
app.use(store);
app.use(globleComponents);
app.use(socketIo);
app.mount("#app");
