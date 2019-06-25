// bindWeChat
import request from '@/utils/request';

export async function bindWeChat(params) {
    return request('/wechat/bind', {
        method: 'POST',
        body: params,
    });
}

// export async function bindWeChat(params) {
//     return request('/app/orderRequirement/load', {
//         method: 'POST',
//         body: params,
//     });
// }

