import request from '@/utils/request';

// 任务查看接口
export async function getTaskDetail(params) {
    return request('/queryDetail/load', {
      method: 'POST',
      body: params,
    });
}

// 任务查看提交接口
export async function getUpdataDetail(params) {
  return request('/updataDetail', {
    method: 'POST',
    body: params,
  });
}

// 任务查看删除接口
export async function getdeledetById(params) {
  return request('/deledetById', {
    method: 'POST',
    body: params,
  });
}

// 任务签到签到接口
export async function updataWorkTasks(params) {
  return request('/updataWorkTasks', {
    method: 'POST',
    body: params,
  });
}

// 任务审核接口
export async function updataStatus(params) {
  return request('/updataStatus', {
    method: 'POST',
    body: params,
  });
}