import request from '@/utils/request';

// 获取销售提报列表数据接口
export async function querySalesOrder(params) {
  return request('/getSalesOrder', {
    method: 'POST',
    body: params,
  });
}

// 添加商品，选择商品接口
export async function queryByCarModel(params) {
  return request('/app/materialList/loadByCarModel', {
    method: 'POST',
    body: params,
  });
}