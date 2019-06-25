import { bindWeChat } from '@/services/wechat';
import { Toast } from 'antd-mobile';
import router from 'umi/router';



export default {
  namespace: 'wechat',

  state: {
    menuData: [],
    list: [],
    currentUser: {},
    currentPage: 0,
  },

  effects: {
    // 绑定用户
    *bindWeChat({ payload, callback }, { call, put }) {

      const result = yield call(bindWeChat, payload);
      if (result.status === 'success') {

        callback && callback(result)
      } else {
        Toast.fail(result.message, 1);
        console.log('result', result)
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
