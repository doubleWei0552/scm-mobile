import request from '@/utils/request';

// 获取销售提报列表数据接口
export async function querySalesOrder(params) {
  return request('/getSalesOrder', {
    method: 'POST',
    body: params,
  });
}

// 添加商品，选择商品接口
export async function queryMaterialList(params) {
  return request('/app/materialList/loadByCarModel', {
    method: 'POST',
    body: params,
  });
}


// 最后提交订单的接口
export async function queryOrdersSubmit(params) {
  return request('/ordersSubmit', {
    method: 'POST',
    body: params,
  });
}

// 订单详情页提交订单的接口
export async function queryOrdersUpdate(params) {
  return request('/ordersUpdate', {
    method: 'POST',
    body: params,
  });
}
