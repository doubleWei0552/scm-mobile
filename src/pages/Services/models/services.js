import { queryWorkTasks } from '@/services/services';
import { Toast } from 'antd-mobile';
import router from 'umi/router';



export default {
  namespace: 'services',

  state: {

  },

  effects: {


    *queryWorkTasks({ payload, callback }, { call }) {
      const customerId = localStorage.getItem('customerId') * 1
      let params = {
        customerId,
        pageCount: 9999,
        pageIndex: 1
      }
      const result = yield call(queryWorkTasks, params);

      if (result.status === 'success') {
        callback && callback(result)
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
