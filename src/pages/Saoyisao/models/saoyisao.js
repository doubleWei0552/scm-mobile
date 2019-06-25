import { queryConfig } from '@/services/user';
import { Toast } from 'antd-mobile';
import router from 'umi/router';



export default {
  namespace: 'saoyisao',

  state: {

  },

  effects: {


    // 获取签名
    *queryConfig({ payload, callback }, { call, put }) {

      const result = yield call(queryConfig, payload);
      console.log('result', result)

      if (result.status === 'success') {
        const { data } = result
        callback && callback(data)
      } else {
        Toast.fail(result.message, 1);
      }
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
