import socketio from "socket.io-client";
import router from "../router";

const cache = {};
let messageCache = []; //消息缓存

const fakerSocket = {
  // on(event, fn) {
  //   cache[event] = fn;
  // },
  onevent: () => {},
};

export default {
  install: (app) => {
    let s = fakerSocket;
    app.config.globalProperties.$socket = s;
    app.provide("socket", s);
  },
};

let bool;
export function open(namespace, query, cb) {
  if (bool) {
    return;
  }
  bool = true;
  let socket = socketio(namespace, {
    transports: ["websocket"],
    path: "/chatNodeServices",
    query,
    reconnection: false,
  });
  // for (const event in cache) {
  //   socket.on(event, cache[event]);
  // }
  fakerSocket.on = (...arg) => {
    console.log("on");
    socket.on(...arg);
  };
  fakerSocket.emit = (...arg) => {
    console.log("emit");
    socket.emit(...arg);
  };
  // socket.onevent = (arg) => {
  //   fakerSocket.onevent(arg);
  // };

  let retryLimit = 3;
  let retryTimes = 0;

  socket.on("connect_error", (error) => {
    console.log("connect_error:" + error);
    if (typeof error == "object") {
      if (error.description == "403") {
        messageCache = []; // 退出登录之后清空
        localStorage.removeItem("tokenIM");
        router.push({
          path: "/login",
        });
        socket.close();
        bool = false;
      } else {
        retryTimes++;
        bool = false;
        socket.close();
        if (retryTimes >= retryLimit) {
          localStorage.removeItem("tokenIM");
          router.push({
            path: "/login",
          });
          bool = false;
          retryTimes = 0;
          return;
        } else {
          console.log("重试次数:" + retryTimes);
          setTimeout(() => {
            bool = false;
            socket.connect();
          }, 5000);
        }
      }
    } else {
      retryTimes++;
      bool = false;
      if (retryTimes >= retryLimit) {
        localStorage.removeItem("tokenIM");
        router.push({
          path: "/login",
        });
        socket.close();
        bool = false;
        retryTimes = 0;
        return;
      } else {
        console.log("重试次数:" + retryTimes);
        setTimeout(() => {
          bool = false;
          socket.connect();
        }, 5000);
      }
    }
  });
  socket.on("connect", (client) => {
    bool = true;
    console.log(client);
    // client.on("privateTalk", (data) => {
    //   console.log(data);
    // });
  });
  socket.on("connect_timeout", (error) => {
    socket.connect();
  });
  socket.on("error", (error) => {
    socket.connect();
  });
  socket.on("disconnect", (reason) => {
    console.log("disconnect reason：" + reason);
    if (reason === "ping timeout") {
      retryTimes++;
      bool = false;
      socket.close();
      if (retryTimes >= retryLimit) {
        localStorage.removeItem("tokenIM");
        router.push({
          path: "/login",
        });
        retryTimes = 0;
        return;
      } else {
        console.log("重试次数:" + retryTimes);
        setTimeout(() => {
          socket.connect();
        }, 5000);
      }
    } else if (reason === "io server disconnect") {
      messageCache = []; // 退出登录之后清空
      localStorage.removeItem("tokenIM");
      socket.close();
      router.push({
        path: "/login",
      });
    } else if (reason === "transport error" || reason === "transport close") {
      retryTimes++;
      bool = false;
      socket.close();
      if (retryTimes >= retryLimit) {
        localStorage.removeItem("tokenIM");
        router.push({
          path: "/login",
        });
        retryTimes = 0;
        return;
      } else {
        console.log("重试次数:" + retryTimes);
        setTimeout(() => {
          socket.connect();
        }, 5000);
      }
    } else {
      bool = false;
      socket.close();
      localStorage.removeItem("tokenIM");
      router.push({
        path: "/login",
      });
    }
  });
  socket.on("reconnect_error", (error) => {
    socket.connect();
  });
  socket.on("reconnect_failed", () => {
    socket.connect();
  });
  fakerSocket.close = () => {
    messageCache = [];
    socket.close();
    bool = false;
  };
  fakerSocket.connect = () => {
    bool = false;
    socket.close();
    socket.connect();
  };
  fakerSocket.socket = socket;
  cb && cb();
}
