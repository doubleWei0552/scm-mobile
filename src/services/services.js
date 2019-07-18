import request from '@/utils/request';

// 查询联系人
export async function queryCustomer(params) {
  return request('/queryCustomerContact/load', {
    method: 'POST',
    body: params,
  });
}

export async function serviceAdd(params) {
  return request('/saveWorkTasks', {
    method: 'POST',
    body: params,
  });
}

