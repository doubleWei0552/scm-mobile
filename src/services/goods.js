import request from '@/utils/request';


// 获取商品分类接口
export async function getTypeList(params) {
  return request('/app/materialCategory/load', {
    method: 'POST',
    body: params,
  });
}

// 获取商品接口
export async function getGoodsList(params) {
  return request('/app/materialList/load', {
    method: 'POST',
    body: params,
  });
}

// 确认下单
export async function confirmOrder(params) {
  return request('/app/insert/orderRequirement', {
    method: 'POST',
    body: params,
  });
}

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryNotices() {
  return request('/api/notices');
}