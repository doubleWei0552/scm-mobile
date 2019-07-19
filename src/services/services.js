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

// /app/work/queryWorkTasksInfo
export async function queryWorkTasks(params) {
  return request('/app/work/queryWorkTasksInfo', {
    method: 'POST',
    body: params,
  });
}

