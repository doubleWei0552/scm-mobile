import request from '@/utils/request';


// 登陆接口
export async function queryLogoParameter() {
  return request('/app/work/queryLogoParameter', {
    method: 'POST',
    body: {},
  });
}

// 登陆接口
export async function queryRSLogin(params) {
  return request('/rs/login', {
    method: 'POST',
    body: params,
  });
}

// 登出接口
export async function queryRSLogOut(params) {
  return request('/rs/ajax/logout', {
    method: 'POST',
  });
}

// 获取用户信息接口
export async function getUserInfo(params) {
  return request('/wechat/oauth', {
    method: 'POST',
    body: params,
  });
}

// 个人中心页面查询当前用户接口
export async function queryCurrent(params) {
  return request('/app/user/load', {
    method: 'POST',
    body: params,
  });
}

export async function queryConfig(params) {
  return request('/wechat/signatureInfo', {
    method: 'POST',
    body: params,
  });
}

export async function query() {
  return request('/api/users');
}

export async function queryNotices() {
  return request('/api/notices');
}


