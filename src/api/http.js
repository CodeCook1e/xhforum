/*
 * @Author: your name
 * @Date: 2021-09-17 21:13:06
 * @LastEditTime: 2021-11-09 15:15:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \xh_forum\src\api\index.js
 */
import axios from "axios";
import {
  message
} from "ant-design-vue";
// tokenKey 保存在localtorage中的键名
const tokenKey = "Authorization";
const adminTokenKey = "adminAuthorization"

// setToken 保存 token 到 localStorage 中。
// duration: token 保存多长时间后失效，单位为秒。
// 不设置 duration 表示永久保存。
function setToken(value, duration) {
  let token;
  if (duration == null) {
    token = {
      data: value
    };
  } else {
    let expires = new Date().getTime() + duration * 1000;
    token = {
      data: value,
      expires: expires
    };
  }
  localStorage.setItem(tokenKey, JSON.stringify(token));
}

function adminSetToken(value, duration) {
  let token;
  if (duration == null) {
    token = {
      data: value
    };
  } else {
    let expires = new Date().getTime() + duration * 1000;
    token = {
      data: value,
      expires: expires
    };
  }
  localStorage.setItem(adminTokenKey, JSON.stringify(token))
}

// 从localStorage中读取token，如果不存在则返回''
// 如果保存时设置了失效期限，那么过了期限将返回''，同时会移除保存的数据
function getToken() {
  let data = localStorage.getItem(tokenKey);
  if (data == null) return "";

  let dataObj = JSON.parse(data);
  if (
    dataObj &&
    (!dataObj.expires || dataObj.expires - new Date().getTime() > 0)
  ) {
    return dataObj.data;
  } else {
    if (dataObj && dataObj.data) {
      localStorage.removeItem(tokenKey);
    }
    return "";
  }
}

// 移除 token
function removeToken() {
  localStorage.removeItem(tokenKey);
}

function adminRemoveToken() {
  localStorage.removeItem(adminTokenKey);
}

const customAxios = axios.create();
customAxios.defaults.baseURL = 'http://localhost:3000/api'; // 配置请求的根路径
customAxios.defaults.timeout = 10000; // 请求超时设置为10秒。
customAxios.defaults.headers.post["Content-Type"] =
  "application/json;charset:utf-8";
customAxios.defaults.headers.put["Content-Type"] =
  "application/json;charset:utf-8";

const source = axios.CancelToken.source();
// axios 请求拦截器
customAxios.interceptors.request.use((config) => {
  const token = getToken();
  config.headers[tokenKey] = token;
  config.cancelToken = source.token;
  return config;
});

// axios 响应拦截器
customAxios.interceptors.response.use(
  (res) => {
    return successHandle(res);
  },
  (error) => {
    let response = error.response;
    console.log(error.response);
    // 服务器正常响应，但是返回码不是2xx
    if (response) {
      errorHandle(response.status, response.data);
    }
    return Promise.reject(error);
  }
);

function successHandle(res) {
  let {
    result,
    message,
    code
  } = res.data;
  let newToken = res.headers[tokenKey.toLocaleLowerCase()];
  if (newToken) {
    setToken(newToken);
  }

  // 返回文件。
  if (code == undefined) {
    return Promise.resolve(res);
  }
  if (code == 0) {
    return Promise.resolve(res);
    // return Promise.resolve(result);
  }
  // 返回码为2xx, 但是业务出现了错误。
  else {
    return Promise.reject(message);
  }
}

function errorHandle(status, other) {
  switch (status) {
    case 400:
      message.error(other.errors[0].msg)
      break;
    case 401:
      break;
    case 403:
      break;
    case 404:
      break;
    case 405:
      message.error("请求方法不允许！");
      break;
    case 413:
      break;
    case 502:
      break;
    default:
      message.error(other.errors[0].msg);
  }
}

export default {
  axios: customAxios,
  setToken,
  adminSetToken,
  getToken,
  removeToken,
  adminRemoveToken
};