import request from '@/utils/request';


// 获取商品分类接口
export async function getTypeList(params) {
  return request('/app/materialCategory/load', {
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

// 商品分类接口
export async function goodsClassify(params) {
  return request('/app/materialCategoryProperty/load', {
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

// 获取商品接口
export async function getGoodsList(params) {
  return request('/app/materialList/load', {
    method: 'POST',
    body: params,
  });
}

// 选择页商品所有品牌接口
export async function queryAllcarBrand() {
  return request('/app/queryAllcarBrand', {
    method: 'POST',
    body: {},
  });
}

// 选择页商品品牌对应的车型接口
export async function querycarManufacturer(params) {
  return request('/app/querycarManufacturerByBrandId', {
    method: 'POST',
    body: params,
  });
}

// 选择页具体车型对应的年份、安装位置数据接口
export async function querycarModelsByModel(params) {
  return request('/app/querycarModelsByModel', {
    method: 'POST',
    body: params,
  });
}

// 选择页具体车型对应的汽车数据接口
export async function querycarMaterialList(params) {
  return request('/app/materialList/loadByCarModel', {
    method: 'POST',
    body: params,
  });
}