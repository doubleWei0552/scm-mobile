/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import fetch from 'dva/fetch';
import router from 'umi/router';
import hash from 'hash.js';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response = {} } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;

  notification.error({
    message: `请求错误 ${status}: ${url}`,
    description: errortext,
  });
};

/**
 * 配置request请求时的默认参数
 */
// const REQUEST_SERVER = window.ENV.server;
// console.log(REQUEST_SERVER)

// const apiUrl = 'http://192.168.1.118:9099'; // 成杰
// const apiUrl = 'http://192.168.4.56:9099'; // 成杰
// const apiUrl = 'http://192.168.60.201:8083/rs-pc-web';
// const apiUrl = 'http://192.168.1.118:9099';  //test
const apiUrl = 'http://crm.addchina.com:8080';
// const apiUrl = 'http://192.168.4.128:9099'; // 俊峰
// const apiUrl = 'http://192.168.4.139:9099'  // 维华
// const apiUrl = 'http://192.168.60.205:10050'; // 临时服务器
// const apiUrl = 'http://192.168.4.126:9099'; // 冰清
// const apiUrl = 'http://192.168.4.138:9099' // 佳丽
// const apiUrl = 'http://192.168.4.130:9099' // 立中
// const apiUrl = 'http://220.189.216.106:8880' // 永昆
export default function request(url, options) {
  const defaultOptions = {
    // credentials: 'include',
    // mode: "no-cors",
  };
  const newOptions = { ...defaultOptions, ...options };
  const sessionId = localStorage.getItem('sessionId');

  if (newOptions.method === 'POST' || newOptions.method === 'GET') {
    newOptions.headers = {
      Accept: 'application/json',

      'Content-Type': 'application/json;charset=UTF-8',

      sessionId,
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  } else {
    newOptions.headers = {
      Accept: 'application/json',

      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Request-Headers': 'content-type',

      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }
  return fetch(apiUrl + url, newOptions)
    .then(checkStatus)
    .then(response =>
      // console.log('请求成功返回的值:',response)
      response.json()
    )
    .catch(e => {
      console.log(e);
    });
}

const checkStatus = response => {

  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  router.push('/welcome')
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};
