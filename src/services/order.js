import request from '@/utils/request';


// 获取商品分类接口

export async function getOrderDetail(params) {
  return request('/app/orderRequirement/load', {
    method: 'POST',
    body: params,
  });
}

export async function getTypeList(params) {
  return request('/app/materialCategory/load', {
    method: 'POST',
    body: params,
  });
}

//获取订单列表数据的接口
export async function getOrderList(params) {
  return request('/app/orderRequirementList/load', {
    method: 'POST',
    body: params,
  });
}




