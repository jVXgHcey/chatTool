import axios from "axios";
import router from "@/router";
import store from "@/store";
import { getToken, formatDate, deepClone } from "@/mUtils/utils";
import md5 from "js-md5";
import { Toast } from "vant";
import qs from "qs";

const apiSecret = "N34-M88-!dC4~Y/np1#aKs>0aQ@10!a8";

/**
 * 基础配置
 */
let HOST = "/api/";
if (process.env.NODE_ENV === "production" && process.env.APIHOST) {
  HOST = process.env.APIHOST;
}
export const URL = HOST; //域名
export const Axios = axios.create({
  baseURL: URL,
  timeout: 60000, // 请求超时时间
  responseType: "json",
});

// request 拦截器
Axios.interceptors.request.use(
  (config) => {
    // 统一配置请求头
    if (getToken()) {
      config.headers["token"] = getToken();
    }

    const param = config.method === "get" ? config.params : config.data;
    //console.log(param);
    md5Params(param, config.headers);
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
/**
 * 添加响应拦截器
 */
Axios.interceptors.response.use(
  (response) => {
    if (response.data.code == "10000") {
      return response;
    } else if (response.data.code == "10140") {
      localStorage.removeItem("tokenIM");
      router.push({
        path: "/login",
      });
      localStorage.removeItem("vuex");
      localStorage.removeItem("toekenIM");
    } else if (response.data.code == "40101") {
      Toast(response.data.message);
      return Promise.resolve(response);
    } else {
      Toast(response.data.message);
      return Promise.reject(response);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function httpGet(url, params) {
  return new Promise((resolve, reject) => {
    Axios.get(url, {
      params: params,
    })
      .then((res) => {
        if (res) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

/**
 *  提交JSON格式的网络请求
 */
export function httpJSON(url, data = {}, config = {}) {
  config = {
    headers: { "Content-Type": "application/json;charset=utf-8" },
    transformRequest: [
      function (data) {
        data = qs.stringify(data);
        return data;
      },
    ],
  };
  return new Promise((resolve, reject) => {
    Axios.post(url, data).then((response) => {
      resolve(response.data);
    });
  });
}

/**
 *  提交表单形式的网络请求
 */
export function httpPost(url, data = {}, config = {}) {
  config = {
    headers: { "Content-Type": "application/json;charset=utf-8" },
  };

  return new Promise((resolve, reject) => {
    Axios.post(url, data)
      .then((response) => {
        if (response) {
          resolve(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

/**
 *  文件上传
 */
export function upLoadFile(url, data, config = {}) {
  return new Promise((resolve, reject) => {
    Axios.post(url, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

// 处理参数,加上时间戳,去掉undefined值,防止出现签名校验失败问题
function md5Params(params, headers) {
  let param = deepClone(params);
  param = param instanceof Object ? param : {};
  const date = new Date();
  for (const key in param) {
    if (param[key] === null) {
      delete param[key];
    } else if (param[key] === undefined) {
      param[key] = "";
    } else if (typeof param[key] == "object") {
      param[key] = JSON.stringify(param[key]);
    }
  }

  date.setHours((date.getUTCHours() + 8) % 24);
  const timesamp = formatDate(date, "yyyy-MM-dd hh:mm:ss");
  const fparam = Object.assign(
    {
      timesamp,
      ...(getToken() ? { token: getToken() } : {}),
    },
    param
  );
  let arr = Object.keys(fparam);
  let str = "";
  arr.push("apiSecret");
  arr = arr.sort();
  //console.log(arr);
  arr.forEach((item) => {
    str += item === "apiSecret" ? item + apiSecret : item + fparam[item];
  });
  //console.log(str);
  const sign = md5(str).toUpperCase();

  if (headers) {
    headers.timesamp = timesamp;
    headers.sign = sign;
  }
  return headers;
}
