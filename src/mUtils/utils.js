let TOKEN = null;
let SITEID = null;
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStore = (name) => {
  if (!name) return;
  let value = window.localStorage.getItem(name);
  if (value) {
    try {
      if (
        typeof JSON.parse(value) === "object" ||
        typeof JSON.parse(value) === "boolean"
      ) {
        value = JSON.parse(value);
      }
    } catch (e) {}
  }
  return value;
};

/**
 * 删除localStorage
 */
export const removeStore = (name) => {
  if (!name) return;
  window.localStorage.removeItem(name);
};

/**
 * 保存token
 */
export function setToken(token) {
  TOKEN = token;
  localStorage.setItem("tokenIM", token);
}

/**
 * 获取token
 */
export function getToken() {
  return localStorage.getItem("tokenIM") || TOKEN || "";
}

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = "int") => {
  let target;
  // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
  if (attr === "scrollTop") {
    target = element.scrollTop;
  } else if (element.currentStyle) {
    target = element.currentStyle[attr];
  } else {
    target = document.defaultView.getComputedStyle(element, null)[attr];
  }
  //在获取 opactiy 时需要获取小数 parseFloat
  return NumberMode === "float" ? parseFloat(target) : parseInt(target);
};

/**
 * 运动效果
 * @param {HTMLElement} element   运动对象，必选
 * @param {JSON}        target    属性：目标值，必选
 * @param {number}      duration  运动时间，可选
 * @param {string}      mode      运动模式，可选
 * @param {function}    callback  可选，回调函数，链式动画
 */
export const animate = (
  element,
  target,
  duration = 400,
  mode = "ease-out",
  callback
) => {
  clearInterval(element.timer);

  //判断不同参数的情况
  if (duration instanceof Function) {
    callback = duration;
    duration = 400;
  } else if (duration instanceof String) {
    mode = duration;
    duration = 400;
  }

  //判断不同参数的情况
  if (mode instanceof Function) {
    callback = mode;
    mode = "ease-out";
  }

  //获取dom样式
  const attrStyle = (attr) => {
    if (attr === "opacity") {
      return Math.round(getStyle(element, attr, "float") * 100);
    } else {
      return getStyle(element, attr);
    }
  };
  //根字体大小，需要从此将 rem 改成 px 进行运算
  const rootSize = parseFloat(document.documentElement.style.fontSize);

  const unit = {};
  const initState = {};

  //获取目标属性单位和初始样式值
  Object.keys(target).forEach((attr) => {
    if (/[^\d^.]+/gi.test(target[attr])) {
      unit[attr] = target[attr].match(/[^\d^.]+/gi)[0] || "px";
    } else {
      unit[attr] = "px";
    }
    initState[attr] = attrStyle(attr);
  });

  //去掉传入的后缀单位
  Object.keys(target).forEach((attr) => {
    if (unit[attr] === "rem") {
      target[attr] = Math.ceil(parseInt(target[attr]) * rootSize);
    } else {
      target[attr] = parseInt(target[attr]);
    }
  });

  let flag = true; //假设所有运动到达终点
  const remberSpeed = {}; //记录上一个速度值,在ease-in模式下需要用到
  element.timer = setInterval(() => {
    Object.keys(target).forEach((attr) => {
      let iSpeed = 0; //步长
      let status = false; //是否仍需运动
      let iCurrent = attrStyle(attr) || 0; //当前元素属性址
      let speedBase = 0; //目标点需要减去的基础值，三种运动状态的值都不同
      let intervalTime; //将目标值分为多少步执行，数值越大，步长越小，运动时间越长
      switch (mode) {
        case "ease-out":
          speedBase = iCurrent;
          intervalTime = (duration * 5) / 400;
          break;
        case "linear":
          speedBase = initState[attr];
          intervalTime = (duration * 20) / 400;
          break;
        case "ease-in":
          let oldspeed = remberSpeed[attr] || 0;
          iSpeed = oldspeed + (target[attr] - initState[attr]) / duration;
          remberSpeed[attr] = iSpeed;
          break;
        default:
          speedBase = iCurrent;
          intervalTime = (duration * 5) / 400;
      }
      if (mode !== "ease-in") {
        iSpeed = (target[attr] - speedBase) / intervalTime;
        iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
      }
      //判断是否达步长之内的误差距离，如果到达说明到达目标点
      switch (mode) {
        case "ease-out":
          status = iCurrent !== target[attr];
          break;
        case "linear":
          status =
            Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) >
            Math.abs(iSpeed);
          break;
        case "ease-in":
          status =
            Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) >
            Math.abs(iSpeed);
          break;
        default:
          status = iCurrent !== target[attr];
      }

      if (status) {
        flag = false;
        //opacity 和 scrollTop 需要特殊处理
        if (attr === "opacity") {
          element.style.filter = "alpha(opacity:" + (iCurrent + iSpeed) + ")";
          element.style.opacity = (iCurrent + iSpeed) / 100;
        } else if (attr === "scrollTop") {
          element.scrollTop = iCurrent + iSpeed;
        } else {
          element.style[attr] = iCurrent + iSpeed + "px";
        }
      } else {
        flag = true;
      }

      if (flag) {
        clearInterval(element.timer);
        if (callback) {
          callback();
        }
      }
    });
  }, 20);
};

export const uuid4 = () => {
  let d = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export const isNull = (value) => {
  try {
    return value === null;
  } catch (e) {
    return false;
  }
};

export const isEmptyObject = (obj) => {
  let b = JSON.stringify(obj) == "{}";
  return b;
};

export function getQueryString(name) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}

// 函数节流
export function throttle(fn, delay) {
  let timer = null;
  return function () {
    let args = arguments;
    const context = this;
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      timer = null;
      fn.apply(context, args);
    }, delay);
  };
}

// 函数防抖
export function debounce(fn, delay) {
  let timer = null;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

// 格式化时间
export const formatTime = (date, fmt) => {
  if (typeof date == "string") {
    date = new Date(date.replace(/-/g, "/"));
  } else {
    date = new Date(date);
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }

  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
};

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}

// 格式化时间
export const formatDate = (date, fmt) => {
  if (typeof date == "object") {
    date = new Date(date);
  } else if (typeof date == "string" && date.indexOf("-") != -1) {
    date = new Date(date.replace(/-/g, "/"));
  } else {
    date = new Date(date);
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
};

/**
 * 使用test方法实现模糊查询
 * @param  {Array}  list     进行查询的数组
 * @param  {String} keyWord  查询的关键词
 * @return {Array}           查询的结果
 */
export function fuzzyQuery(list, keyWord) {
  var reg = new RegExp(keyWord);
  var arr = [];
  Object.keys(list).map((key, index, value) => {
    list[key].map((_key, _index, _value) => {
      if (reg.test(_key.friendNickName)) {
        arr.push(list[key][_index]);
      }
    });
  });
  return arr;
}
/*
 *查询数组最后一项的索引
 */
export function fakeFindLastIndex(array, cb, context) {
  for (let i = array.length - 1; i >= 0; i--) {
    const element = array[i];
    if (cb.call(context, element, i, array)) {
      return i;
    }
  }
  return -1;
}

/*
 *browser change
 */
export function visibilitychange(callBack) {
  let visibilityChange = "";
  let state = "";
  if (typeof document.hidden !== "undefined") {
    visibilityChange = "visibilitychange";
    state = "visibilityState";
  } else if (typeof document.mozHidden !== "undefined") {
    visibilityChange = "mozvisibilitychange";
    state = "mozVisibilityState";
  } else if (typeof document.msHidden !== "undefined") {
    visibilityChange = "msvisibilitychange";
    state = "msVisibilityState";
  } else if (typeof document.webkitHidden !== "undefined") {
    visibilityChange = "webkitvisibilitychange";
    state = "webkitVisibilityState";
  }
  function fn() {
    const type = document[state] === "visible";
    if (callBack) {
      callBack(type);
    }
  }
  if (visibilityChange) {
    document.addEventListener(visibilityChange, fn, false);
  }
  return () => {
    document.removeEventListener(visibilityChange, fn, false);
  };
}

//深拷贝
export function deepClone(resource) {
  if (resource instanceof Object) {
    let result;
    if (resource instanceof Array) {
      result = new Array();
    } else if (resource instanceof Function) {
      result = function () {
        return resource.apply(this, arguments);
      };
    } else if (resource instanceof RegExp) {
      result = new RegExp(resource.source, resource.flags);
    } else if (resource instanceof Date) {
      result = new Date(resource);
    } else {
      result = new Object();
    }
    for (let key in resource) {
      if (resource.hasOwnProperty(key)) {
        result[key] = deepClone(resource[key]);
      }
    }
    return result;
  }
  return resource;
}

/**
 * 压缩图片
 */

export function compressImg(file) {
  let r;
  const p = new Promise((resolve) => {
    r = resolve;
  });
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    const base64 = this.result;
    const img = new Image();
    img.onload = function () {
      //默认按照比例压缩
      var ratio = this.width / this.height;

      const originpix = img.width * img.height;
      const num = 300000; // 像素

      const scale = Math.sqrt(Math.floor(originpix / num)) || 1;

      //规定压缩后的大小
      // const originwidth = img.width || 600
      var canvasWidth = Math.floor(img.width / scale);
      var canvasHeight = Math.floor(canvasWidth / ratio);
      //生成canvas
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      //创建节点属性
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      var anw = document.createAttribute("width");
      anw.nodeValue = canvasWidth;
      var anh = document.createAttribute("height");
      anh.nodeValue = canvasHeight;
      canvas.setAttributeNode(anw);
      canvas.setAttributeNode(anh);
      ctx.drawImage(this, 0, 0, canvasWidth, canvasHeight);
      //图像质量,值越小，所绘制出的图像越模糊
      var quality = 1;
      var base64String = canvas.toDataURL("img/jpeg", quality);
      var blob = getBlobByBase64(base64String, file.type);
      r(blob);
    };
    img.src = base64;
  };
  return p;
}

//通过base64获取二进制文件
export function getBlobByBase64(base64String, type) {
  var arr = base64String.split(",");
  // var mine = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const file = new Blob([u8arr], { type });
  return file;
}
